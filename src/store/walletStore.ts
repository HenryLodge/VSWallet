import { writable } from 'svelte/store';
import { walletService } from '../ethers/walletService';

// state interface
interface WalletState {
  address: string | null;
  balance: string;
  balanceUsd: string;
  isConnected: boolean;
}

function createWalletStore() {
  // init
  const { subscribe, set, update } = writable<WalletState>({
    address: null,
    balance: '0.0',
    balanceUsd: '0.00',
    isConnected: false
  });

  return {
    subscribe,
    
    // create new wallet and update store state
    async createWallet(name: string): Promise<{ address: string; phrase: string }> {
      const result = await walletService.walletCreate();
      
      update(state => ({
        ...state,
        address: result.address,
        isConnected: true
      }));
      
      await this.updateBalance();
      return result;
    },
    
    // connect wallet and update store state
    async connectWallet(phrase: string): Promise<void> {
      const address = await walletService.walletConnect(phrase);
      
      update(state => ({
        ...state,
        address,
        isConnected: true
      }));
      
      await this.updateBalance();
    },
    
    // get wallet balance and update store state
    async updateBalance(): Promise<void> {
      const state = await new Promise<WalletState>(resolve => {
        const unsubscribe = subscribe(s => {
          unsubscribe();
          resolve(s);
        });
      });
      
      if (state.address) {
        const balance = await walletService.getWalletBalance(state.address);
        const ethPrice = await walletService.getCurrETHPrice();
        const balanceUsd = (parseFloat(balance) * ethPrice).toFixed(2);
        
        update(s => ({
          ...s,
          balance,
          balanceUsd
        }));
      }
    },
    
    // disconnect and reset store state
    disconnect() {
      set({
        address: null,
        balance: '0.0',
        balanceUsd: '0.00',
        isConnected: false
      });
    }
  };
}

export const walletStore = createWalletStore();