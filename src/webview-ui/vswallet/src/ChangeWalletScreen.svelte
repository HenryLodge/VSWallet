<script lang="ts">
	export let onNavigate: (screen: string) => void;
	
	type Wallet = {
		id: number;
		name: string;
		address: string;
		balance: string;
		currency: string;
		usdValue: string;
		isActive: boolean;
	};
	
	let wallets: Wallet[] = [];
	
	function formatAddress(address: string): string {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}
	
	function selectWallet(walletId: number) {
		console.log('Selected wallet:', walletId);
	}
</script>

<main>
  <div class="back-button-container">
    <button class="back-button"  on:click={() => onNavigate("HomeScreen")} title="Back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l6 6m-6-6l6-6"/>
      </svg>
    </button>
  </div>

  <div class="wallet-container">
    <h1 class="page-title">Change Active Wallet</h1>

    {#if wallets.length === 0}
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 7V5a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"></path>
        </svg>
        <p class="empty-text">No wallets available</p>
        <button class="create-wallet-button" on:click={() => onNavigate("NewWalletScreen")}>
          Create Wallet
        </button>
      </div>
    {:else}
      <div class="wallets-list">
        {#each wallets as wallet}
          <div class="wallet-card" on:click={() => selectWallet(wallet.id)} on:keypress={(e) => e.key === 'Enter' && selectWallet(wallet.id)} role="button" tabindex="0">
            <div class="wallet-icon" class:active={wallet.isActive}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 7V5a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"></path>
              </svg>
            </div>

            <div class="wallet-details">
              <div class="wallet-header">
                <span class="wallet-name">{wallet.name}</span>
                <span class="wallet-balance">
                  {wallet.balance} {wallet.currency}
                </span>
              </div>

              <div class="wallet-info">
                <span class="wallet-address">{formatAddress(wallet.address)}</span>
                <span class="wallet-usd">{wallet.usdValue}</span>
              </div>

              {#if wallet.isActive}
                <div class="wallet-footer">
                  <span class="active-badge">Active</span>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
    margin: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--vscode-sideBar-background);
  }

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin-top: 24px;
    margin-bottom: 24px;
    letter-spacing: -0.5px;
    text-align: center;
    width: 100%;
    max-width: 460px;
  }

  .back-button-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .back-button {
    margin: 0;
    border: none;
    border-radius: 7%;
    background-color: var(--vscode-sideBar-background);
    color: var(--vscode-button-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 75%;
    transition: opacity 0.2s;
    outline: 0;
  }

  .back-button:hover {
    outline: 0;
    opacity: 100%;
  }

  .wallet-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    background-color: var(--vscode-sideBar-background);
    max-width: 460px;
    padding: 0 20px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
  }

  .empty-state svg {
    color: var(--vscode-descriptionForeground);
    opacity: 0.5;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin: 0;
  }

  .create-wallet-button {
    margin-top: 16px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    color: var(--vscode-button-foreground);
    background-color: var(--vscode-button-background);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    outline: 0;
  }

  .create-wallet-button:hover {
    background-color: var(--vscode-button-hoverBackground);
  }

  .create-wallet-button:active {
    transform: scale(0.98);
  }

  .wallets-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    padding-bottom: 20px;
  }

  .wallet-card {
    display: flex;
    gap: 14px;
    padding: 16px;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 12px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .wallet-card:hover {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: var(--vscode-focusBorder);
  }

  .wallet-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(96, 165, 250, 0.15);
    color: #60a5fa;
  }

  .wallet-icon.active {
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .wallet-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wallet-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--vscode-foreground);
  }

  .wallet-balance {
    font-size: 14px;
    font-weight: 600;
    font-family: 'Courier New', monospace;
    color: var(--vscode-foreground);
  }

  .wallet-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wallet-address {
    font-size: 12px;
    font-family: 'Courier New', monospace;
    color: var(--vscode-descriptionForeground);
  }

  .wallet-usd {
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
  }

  .wallet-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 2px;
  }

  .active-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }
</style>