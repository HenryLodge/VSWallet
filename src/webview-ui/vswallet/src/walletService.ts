// Message-based wallet service for webview
// This communicates with the extension backend
interface VsCodeApi {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

type MessageResponse = {
  command: string;
  data?: any;
  error?: string;
};

export class WalletService {
  private vscode: VsCodeApi;
  private messageCallbacks: Map<string, (response: any) => void> = new Map();

  constructor() {
    try {
      this.vscode = acquireVsCodeApi();
    } catch (error) {
      console.error('Failed to acquire VS Code API:', error);
      throw new Error('Cannot initialize wallet service: VS Code API not available');
    }
    
    window.addEventListener('message', (event) => {
      const message = event.data;
      console.log('Received message from extension:', message);
      
      const callback = this.messageCallbacks.get(message.command);
      if (callback) {
        callback(message);
        this.messageCallbacks.delete(message.command);
      }
    });
  }

  private async sendMessage(command: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = `${command}-${Date.now()}`;
      console.log('Sending message to extension:', { command, messageId, data });
      
      this.messageCallbacks.set(command, (response: MessageResponse) => {
        console.log('Received response for', command, response);
        
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });

      try {
        this.vscode.postMessage({ command, messageId, data });
      } catch (error) {
        console.error('Failed to post message:', error);
        this.messageCallbacks.delete(command);
        reject(error);
      }

      setTimeout(() => {
        if (this.messageCallbacks.has(command)) {
          this.messageCallbacks.delete(command);
          reject(new Error(`Timeout waiting for ${command}`));
        }
      }, 30000);
    });
  }

  async walletCreate(name?: string): Promise<{address: string; phrase: string; privKey: string}> {
    return this.sendMessage('walletCreate', { name });
  }

  async walletConnect(phrase: string, name?: string): Promise<string> {
    return this.sendMessage('walletConnect', { phrase, name });
  }

  async getWalletBalance(address: string): Promise<string> {
    return this.sendMessage('getWalletBalance', { address });
  }

  async getWallets(): Promise<any[]> {
    return this.sendMessage('getWallets');
  }

  async setActiveWallet(walletId: string): Promise<void> {
    return this.sendMessage('setActiveWallet', { walletId });
  }

  async getActiveWallet(): Promise<any> {
    return this.sendMessage('getActiveWallet');
  }

  async transactionSend(to: string, amount: string): Promise<string> {
    return this.sendMessage('transactionSend', { to, amount });
  }

  async walletTransactHistory(address: string): Promise<any[]> {
    return this.sendMessage('walletTransactHistory', { address });
  }

  async estimateGasFee(to: string, amount: string): Promise<{ eth: string; usd: string }> {
    return this.sendMessage('estimateGasFee', { to, amount });
  }

  async getCurrETHPrice(): Promise<number> {
    return this.sendMessage('getCurrETHPrice');
  }
}

export const walletService = new WalletService();