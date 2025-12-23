import { writable, get } from 'svelte/store';
import { walletService } from './walletService';

// state interface
interface WalletState {
  address: string | null;
  balance: string;
  balanceUsd: string;
  isConnected: boolean;
  walletId: string | null;
  walletName: string | null;
}

function createWalletStore() {
  const { subscribe, set, update } = writable<WalletState>({
    address: null,
    balance: '0.0',
    balanceUsd: '0.00',
    isConnected: false,
    walletId: null,
    walletName: null
  });

  return {
    subscribe,
    
    async createWallet(name: string): Promise<{ address: string; phrase: string }> {
      try {
        const result = await walletService.walletCreate(name);
        
        update(state => ({
          ...state,
          address: result.address,
          isConnected: true,
          walletName: name
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
    
    async connectWallet(phrase: string, name: string = 'Imported Wallet'): Promise<void> {
      try {
        const address = await walletService.walletConnect(phrase, name);
        
        update(state => ({
          ...state,
          address,
          isConnected: true,
          walletName: name
        }));
        
        setTimeout(() => {
          walletStore.updateBalance();
        }, 0);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    },

    async switchWallet(walletId: string): Promise<void> {
      try {
        await walletService.setActiveWallet(walletId);
        const activeWallet = await walletService.getActiveWallet();
        
        if (activeWallet) {
          update(state => ({
            ...state,
            address: activeWallet.address,
            isConnected: true,
            walletId: activeWallet.id,
            walletName: activeWallet.name
          }));
          
          setTimeout(() => {
            walletStore.updateBalance();
          }, 0);
        }
      } catch (error) {
        console.error('Failed to switch wallet:', error);
        throw error;
      }
    },

    async loadActiveWallet(): Promise<void> {
      try {
        const activeWallet = await walletService.getActiveWallet();
        
        if (activeWallet) {
          update(state => ({
            ...state,
            address: activeWallet.address,
            isConnected: true,
            walletId: activeWallet.id,
            walletName: activeWallet.name
          }));
          
          setTimeout(() => {
            walletStore.updateBalance();
          }, 0);
        }
      } catch (error) {
        console.error('Failed to load active wallet:', error);
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
        isConnected: false,
        walletId: null,
        walletName: null
      });
    }
  };
}

export const walletStore = createWalletStore();