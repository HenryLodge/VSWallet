import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { walletService } from "./ethers/walletService";

export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscodeSidebar.openview";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "out", "webview")
      ],
    };
    
    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        let response;
        
        switch (message.command) {
          case 'walletCreate':
            response = await walletService.walletCreate();
            break;
          
          case 'walletConnect':
            response = await walletService.walletConnect(message.data.phrase);
            break;
          
          case 'getWalletBalance':
            await walletService.initializeProvider();
            response = await walletService.getWalletBalance(message.data.address);
            break;
          
          case 'transactionSend':
            response = await walletService.transactionSend(message.data.to, message.data.amount);
            break;
          
          case 'walletTransactHistory':
            response = await walletService.walletTransactHistory(message.data.address);
            break;
          
          case 'estimateGasFee':
            response = await walletService.estimateGasFee(message.data.to, message.data.amount);
            break;
          
          case 'getCurrETHPrice':
            await walletService.initializeProvider();
            response = await walletService.getCurrETHPrice();
            break;
          
          default:
            throw new Error(`Unknown command: ${message.command}`);
        }

        // Send response back to webview
        webviewView.webview.postMessage({
          command: message.command,
          data: response
        });
      } catch (error: any) {
        // Send error back to webview
        webviewView.webview.postMessage({
          command: message.command,
          error: error.message
        });
      }
    });
  }

  private getHtmlContent(webview: vscode.Webview): string {
    // Path to the built Svelte app
    const webviewPath = vscode.Uri.joinPath(
      this._extensionUri,
      "out",
      "webview"
    );

    // Read the built index.html
    const indexPath = path.join(webviewPath.fsPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf8");

    // Replace asset paths to use webview URIs
    html = html.replace(
      /(href|src)="\/assets\//g,
      (match, attr) => {
        return `${attr}="${webview.asWebviewUri(
          vscode.Uri.joinPath(webviewPath, "assets")
        )}/`;
      }
    );

    // Replace the base href if present
    html = html.replace(
      /<base href="\/"\s*\/?>/g,
      ""
    );

    // Add CSP meta tag if not present
    const nonce = getNonce();
    if (!html.includes('<meta http-equiv="Content-Security-Policy"')) {
      const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:;">`;
      html = html.replace('<head>', `<head>\n    ${csp}`);
    }

    // Add nonce to script tags
    html = html.replace(
      /<script/g,
      `<script nonce="${nonce}"`
    );

    return html;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}