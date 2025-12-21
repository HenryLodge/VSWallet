// Message-based wallet service for webview
// This communicates with the extension backend

declare const vscode: {
  postMessage(message: any): void;
};

type MessageResponse = {
  command: string;
  data?: any;
  error?: string;
};

export class WalletService {
  private messageCallbacks: Map<string, (response: any) => void> = new Map();

  constructor() {
    // Listen for messages from extension
    window.addEventListener('message', (event: any) => {
      const message = event.data;
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
      
      this.messageCallbacks.set(command, (response: MessageResponse) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });

      vscode.postMessage({
        command,
        messageId,
        data
      });
    });
  }

  async walletCreate(): Promise<{address: string; phrase: string; privKey: string}> {
    return this.sendMessage('walletCreate');
  }

  async walletConnect(phrase: string): Promise<string> {
    return this.sendMessage('walletConnect', { phrase });
  }

  async getWalletBalance(address: string): Promise<string> {
    return this.sendMessage('getWalletBalance', { address });
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