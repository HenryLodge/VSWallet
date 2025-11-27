// wallet functions
import { ADDRGETNETWORKPARAMS } from 'dns';
import { ethers } from 'ethers';

export class WalletService {
  // RPC (SEP/ETH)         | DONE
  // wallet create         |
  // wallet import         |
  // wallet balence        |
  // wallet send/recieve   |
  // wallet transact hist  |
  // estimate gas fee      |
  // get price of ETH      |



    // VARS
    private provider: ethers.Provider | null = null;
    private wallet : ethers.HDNodeWallet | ethers.Wallet | null = null;
    private SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';
    private ETH_RPC = '';

    async initializeProvider() {
      // either Sepolia or Ethereum
      // only doing SEP rn for testing
      this.provider = new ethers.JsonRpcProvider(this.SEPOLIA_RPC);
    }

    // create new wallet
    // return addr,seed,pkey to user, do not store
    async walletCreate(): Promise<{address: string; phrase: string; privKey: string}> {
      const wallet = ethers.Wallet.createRandom();
      this.wallet = wallet;

      return {
        address: wallet.address,
        phrase: wallet.mnemonic!.phrase,
        privKey: wallet.privateKey
      };
    }

    // connect existing wallet from seed phrase
    async walletConnect(phrase: string): Promise<string> {
      this.wallet = ethers.Wallet.fromPhrase(phrase);
      if (this.provider) {
        this.wallet = this.wallet.connect(this.provider);
      }
      return this.wallet.address;
    }

    // get balance of curr wallet
    async getWalletBalance(address: string): Promise<string> {
      if (!this.provider) {
        await this.initializeProvider();
      } 
      const bal = await this.provider!.getBalance(address);
      return ethers.formatEther(bal);
    }

    // transaction send
    // need privKey from user ??
    async transactionSend(to: string, amount: string): Promise<string> {
      if (!this.wallet || !this.provider) {
        throw new Error("Wallet not init");
      }

      const tx = await this.wallet.sendTransaction({to, value: ethers.parseEther(amount)});
      await tx.wait();
      return tx.hash;
    }

    // get wallet transact history
    async walletTransactHistory(address: string): Promise<any> {
      // use etherscan api
      return [];
    }

    // estimate gas fee amount
    async estimateGasFee(to: string, amount: string): Promise<{ eth: string; usd: string }> {
      if (!this.wallet || !this.provider) {
        throw new Error("Wallet not init");
      }

      const feeData = await this.provider.getFeeData();
  
      const gasPrice = feeData.maxFeePerGas;
      
      if (!gasPrice) {
        throw new Error("Unable to fetch gas price");
      }

      const gasLimit = await this.provider.estimateGas({
        to,
        value: ethers.parseEther(amount),
        from: this.wallet.address
      });

      const gasFee = gasPrice * gasLimit;
      const gasFeeEth = ethers.formatEther(gasFee);
      const ethPriceUsd = await this.getCurrETHPrice();
      const gasFeeUsd = (parseFloat(gasFeeEth) * ethPriceUsd).toFixed(2);

      return {
        eth: gasFeeEth,
        usd: gasFeeUsd
      };
    }

    // get curr ETH price
    // use api
    async getCurrETHPrice(): Promise<number> {
      return 0;
    }
}

export const walletService = new WalletService();