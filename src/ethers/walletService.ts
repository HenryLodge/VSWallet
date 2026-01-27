// wallet functions
import { ethers } from 'ethers';

export class WalletService {
  // VARS
  private provider: ethers.Provider | null = null;
  private wallet : ethers.HDNodeWallet | ethers.Wallet | null = null;
  private SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';

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
  async getTransactionData(txHash: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) {
      await this.initializeProvider();
    }
    return await this.provider!.getTransactionReceipt(txHash);
  }

  // estimate gas fee amount
  async estimateGasFee(to: string, amount: string): Promise<{ eth: string; usd: string }> {
    if (!this.wallet || !this.provider) {
      throw new Error("Wallet not init");
    }

    const feeData = await this.provider.getFeeData();
    const gasPrice = feeData.maxFeePerGas;
    let gasLimit: bigint;
    if (!gasPrice) {
      throw new Error("Unable to fetch gas price");
    }

    try {
      gasLimit = await this.provider.estimateGas({
        to,
        value: ethers.parseEther(amount),
        from: this.wallet.address
      });
    } catch (error) {
      gasLimit = 21000n;
    }

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
  async getCurrETHPrice(): Promise<number> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    const CHAINLINK_ETH_USD_SEPOLIA = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const ABI = [
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { name: "roundId", type: "uint80" },
          { name: "answer", type: "int256" },
          { name: "startedAt", type: "uint256" },
          { name: "updatedAt", type: "uint256" },
          { name: "answeredInRound", type: "uint80" }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];

    const priceFeed = new ethers.Contract(
      CHAINLINK_ETH_USD_SEPOLIA,
      ABI,
      this.provider
    );

    const roundData = await priceFeed.latestRoundData();
    const price = Number(roundData.answer) / 1e8;
    return price;
  }

  private storedPrices: { [key: string]: { price: number; timestamp: number } } = {};

  async getETHPriceChange(days: number): Promise<number> {
    const periodKey = `price_${days}d`;
    const now = Date.now();
    const stored = this.storedPrices[periodKey];
    
    // If we have a stored value and it's less than 30 seconds old, return the calculated change
    if (stored && (now - stored.timestamp) < 30000) {
      const currentPrice = await this.getCurrETHPrice();
      const change = ((currentPrice - stored.price) / stored.price) * 100;
      console.log(`Using cached baseline from ${Math.floor((now - stored.timestamp) / 1000)}s ago`);
      return change;
    }
    
    // Get current price for new baseline
    const currentPrice = await this.getCurrETHPrice();
    const periodMs = days * 24 * 60 * 60 * 1000;
    
    // If no stored value or the period has elapsed, save new baseline
    if (!stored || (now - stored.timestamp) >= periodMs) {
      this.storedPrices[periodKey] = {
        price: currentPrice,
        timestamp: now
      };
      console.log(`Saved new price baseline: $${currentPrice.toFixed(2)}`);
      return 0; // No change yet for new baseline
    }
    
    // Calculate change from stored baseline
    const change = ((currentPrice - stored.price) / stored.price) * 100;
    return change;
  }
}

export const walletService = new WalletService();