import { writable, get } from 'svelte/store';
import { walletService } from './walletService';

// state interface
interface WalletState {
  address: string | null;
  balance: string;
  balanceUsd: string;
  isConnected: boolean;
}

function createWalletStore() {
  const { subscribe, set, update } = writable<WalletState>({
    address: null,
    balance: '0.0',
    balanceUsd: '0.00',
    isConnected: false
  });

  return {
    subscribe,
    
    async createWallet(name: string): Promise<{ address: string; phrase: string }> {
      try {
        const result = await walletService.walletCreate();
        
        update(state => ({
          ...state,
          address: result.address,
          isConnected: true
        }));
        
        setTimeout(() => {
          walletStore.updateBalance();
        }, 0);
        
        return result;
      } catch (error) {
        console.error('Failed to create wallet:', error);
        throw error;
      }
    },
    
    async connectWallet(phrase: string): Promise<void> {
      try {
        const address = await walletService.walletConnect(phrase);
        
        update(state => ({
          ...state,
          address,
          isConnected: true
        }));
        
        setTimeout(() => {
          walletStore.updateBalance();
        }, 0);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    },
    
    async updateBalance(): Promise<void> {
      try {
        const state = get(walletStore);
        
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
      } catch (error) {
        console.error('Failed to update balance:', error);
      }
    },
    
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