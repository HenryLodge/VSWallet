import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { walletService } from "./ethers/walletService";

interface StoredWallet {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

interface StoredTransaction {
  hash: string;
  to: string;
  from: string;
  value: string;
  time: number;
  status: 'pending' | 'confirmed' | 'failed';
  gas?: string;
  note?: string;
}

export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscodeSidebar.openview";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri, private readonly _context: vscode.ExtensionContext) {}

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
            const walletName = message.data?.name || 'My Wallet';
            await this.addWallet(walletName, response.address, response.phrase, true);
            console.log('Wallet created and stored');
            break;
          
          case 'walletConnect':
            response = await walletService.walletConnect(message.data.phrase);
            const importedWalletName = message.data?.name || 'Imported Wallet';
            await this.addWallet(importedWalletName, response, message.data.phrase, true);
            break;

          case 'getWallets':
            response = await this.getWallets();
            console.log('Sending wallets to webview:', response);
            break;

          case 'setActiveWallet':
            await this.setActiveWallet(message.data.walletId);
            response = { success: true };
            break;
          
          case 'getActiveWallet':
            response = await this.getActiveWallet();
            break;
          
          case 'getWalletBalance':
            await walletService.initializeProvider();
            response = await walletService.getWalletBalance(message.data.address);
            break;
          
          case 'transactionSend':
            const activeWallet = await this.getActiveWallet();
            if (!activeWallet) {
              throw new Error('No active wallet');
            }
            const seed = await this._context.secrets.get(`wallet_seed_${activeWallet.id}`);
            if (!seed) {
              throw new Error('Wallet seed not found');
            }
            await walletService.walletConnect(seed);
            
            const txHash = await walletService.transactionSend(message.data.to, message.data.amount);
            console.log("here: " + parseFloat(message.data.amount) * 1e18);

            const transaction: StoredTransaction = {
              hash: txHash,
              from: activeWallet.address,
              to: message.data.to,
              value: (parseFloat(message.data.amount) * 1e18).toString(),
              time: Date.now(),
              status: 'pending',
              note: message.data.note
            };
            
            await this.saveTransaction(activeWallet.id, transaction);
            
            this.monitorTransaction(activeWallet.id, txHash);
            
            response = txHash;
            break;
          
          case 'estimateGasFee':
            response = await walletService.estimateGasFee(message.data.to, message.data.amount);
            break;
          
          case 'getCurrETHPrice':
            await walletService.initializeProvider();
            response = await walletService.getCurrETHPrice();
            break;
          
          case 'getTransactionHistory':
            const wallet = await this.getActiveWallet();
            if (!wallet) {
              throw new Error('No active wallet');
            }
            response = await this.getTransactions(wallet.id);
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

  private async addWallet(name: string, address: string, seedPhrase: string, setAsActive: boolean = false): Promise<void> {
    const wallets = await this.getWallets();
    console.log('Current wallets before adding:', wallets.length);
    const walletId = `wallet_${Date.now()}`;
    
    if (setAsActive) {
      wallets.forEach(w => w.isActive = false);
    }
    
    const newWallet: StoredWallet = {
      id: walletId,
      name: name,
      address: address,
      isActive: setAsActive
    };
    
    wallets.push(newWallet);
    await this._context.globalState.update('wallets', wallets);
    await this._context.secrets.store(`wallet_seed_${walletId}`, seedPhrase);
    console.log('Wallet added, total wallets now:', wallets.length);
    console.log('New wallet:', newWallet);
  }

  private async getWallets(): Promise<StoredWallet[]> {
    return this._context.globalState.get<StoredWallet[]>('wallets', []);
  }

  private async setActiveWallet(walletId: string): Promise<void> {
    const wallets = await this.getWallets();
    wallets.forEach(w => w.isActive = false);
    
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      wallet.isActive = true;
      await this._context.globalState.update('wallets', wallets);
      
      const seed = await this._context.secrets.get(`wallet_seed_${walletId}`);
      if (seed) {
        await walletService.walletConnect(seed);
      }
    }
  }

  private async getActiveWallet(): Promise<StoredWallet | null> {
    const wallets = await this.getWallets();
    return wallets.find(w => w.isActive) || null;
  }

  private async saveTransaction(walletId: string, transaction: StoredTransaction): Promise<void> {
    const key = `wallet_transactions_${walletId}`;
    const existingTransactions = await this.getTransactions(walletId);
    console.log(transaction.value);
    // Add new transaction at the beginning (most recent first)
    existingTransactions.unshift(transaction);
    
    // Store in global state (persists across sessions)
    await this._context.globalState.update(key, existingTransactions);
  }

  // Get all transactions for a wallet
  private async getTransactions(walletId: string): Promise<StoredTransaction[]> {
    const key = `wallet_transactions_${walletId}`;
    const transactions = this._context.globalState.get<StoredTransaction[]>(key);
    return transactions || [];
  }

  // Update transaction status (e.g., from pending to confirmed)
  private async updateTransactionStatus(
    walletId: string, 
    txHash: string, 
    status: 'confirmed' | 'failed',
    gasUsed?: string
  ): Promise<void> {
    const transactions = await this.getTransactions(walletId);
    const txIndex = transactions.findIndex(tx => tx.hash === txHash);
    
    if (txIndex !== -1) {
      transactions[txIndex].status = status;
      if (gasUsed) {
        transactions[txIndex].gas = gasUsed;
      }
      
      const key = `wallet_transactions_${walletId}`;
      await this._context.globalState.update(key, transactions);
    }
  }

  private async monitorTransaction(walletId: string, txHash: string): Promise<void> {
    try {
      await walletService.initializeProvider();
      
      const maxAttempts = 60;
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        try {
          const receipt = await walletService.getTransactionData(txHash);
          
          if (receipt) {
            const status = receipt.status === 1 ? 'confirmed' : 'failed';
            const gasUsed = receipt.gasUsed.toString();
            
            await this.updateTransactionStatus(walletId, txHash, status, gasUsed);
            break;
          }
        } catch (error) {
          console.log('Transaction not yet mined, retrying...');
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }
    } catch (error) {
      console.error('Error monitoring transaction:', error);
    }
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
      // const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:; connect-src ${webview.cspSource};">`;
      const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:; connect-src ${webview.cspSource};">`;
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