// import * as vscode from "vscode";

// export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
//   public static readonly viewType = "vscodeSidebar.openview";

//   private _view?: vscode.WebviewView;

//   constructor(private readonly _extensionUri: vscode.Uri) {}

//   resolveWebviewView(
//     webviewView: vscode.WebviewView,
//     context: vscode.WebviewViewResolveContext<unknown>,
//     token: vscode.CancellationToken
//   ): void | Thenable<void> {
//     this._view = webviewView;

//     webviewView.webview.options = {
//       // Allow scripts in the webview
//       enableScripts: true,
//       localResourceRoots: [this._extensionUri],
//     };
//     webviewView.webview.html = this.getHtmlContent(webviewView.webview);
//   }

//   private getHtmlContent(webview: vscode.Webview): string {
//     // Get the local path to main script run in the webview,
//     // then convert it to a uri we can use in the webview.
//     const scriptUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "assets", "main.js")
//     );

//     const styleResetUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "assets", "reset.css")
//     );
//     const styleVSCodeUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "assets", "vscode.css")
//     );

//     // Same for stylesheet
//     const stylesheetUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "assets", "main.css")
//     );

//     // Use a nonce to only allow a specific script to be run.
//     const nonce = getNonce();

//     return `<p>VSWallet</p>`;
//   }
// }

// function getNonce() {
//   let text = "";
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < 32; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }









import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

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