<script lang="ts">
  import { walletStore } from './walletStore';
  import { onMount } from 'svelte';
  import { walletService } from './walletService';
  export let onNavigate: (screen: string) => void;


  let WalletETHAmount = 0.0;
  let WalletUSDAmount = 0.0;
  $: WalletETHAmount = parseFloat($walletStore.balance);
  $: WalletUSDAmount = parseFloat($walletStore.balanceUsd);
  
  onMount(() => {
    walletStore.loadActiveWallet();
    // Update balance when component mounts
    if ($walletStore.isConnected && $walletStore.address) {
      walletStore.updateBalance();
      updatePriceChange();
    }
    
    // Set up interval to update balance periodically
    const interval = setInterval(() => {
      if ($walletStore.isConnected && $walletStore.address) {
        walletStore.updateBalance();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  });

  let PortfolioDeltaPercent = 25;
  let selectedTimePeriod = "1D";
  let menuOpen = false;

  async function fetchETHPriceChange(period: string = '1D'): Promise<number> {
    try {
      // Map period to days
      const daysMap: { [key: string]: number } = {
        '1D': 1,
        '7D': 7,
        '1M': 30,
        '1Y': 365,
        'ALL': 365 * 5 // Use 5 years for "ALL"
      };
      
      const days = daysMap[period] || 1;
      
      // Call backend instead of direct API call
      const change = await walletService.getETHPriceChange(days);
      return change;
    } catch (error) {
      console.error('Error fetching price change:', error);
      return 0;
    }
  }

  async function updatePriceChange() {
    isLoadingPriceChange = true;
    ethPriceChange = await fetchETHPriceChange(selectedTimePeriod);
    isLoadingPriceChange = false;
    console.log(ethPriceChange);
  }

  let ethPriceChange = 0;
  let isLoadingPriceChange = true;

  // Calculate the arc progress based on price change
  // Map price change from -100% to +100% to arc percentage 0% to 100%
  $: {
    // Map price change to arc percentage
    // We'll use a range where ±10% price change fills the full arc
    const maxChange = 20; // Adjust this to change sensitivity
    
    // Clamp price change to prevent going beyond arc limits
    const clampedChange = Math.max(-maxChange, Math.min(maxChange, ethPriceChange));
    
    // Map -maxChange to +maxChange range to 0% to 100% arc range
    // -10% = 0% arc (left), 0% = 50% arc (middle), +10% = 100% arc (right)
    PortfolioDeltaPercent = ((clampedChange + maxChange) / (maxChange * 2)) * 100;
  }

  // Also update the arc color based on positive/negative
  $: arcColor = ethPriceChange >= 0 ? PosProfitColor : NegProfitColor;
  $: arcColorBack = ethPriceChange >= 0 ? PosProfitColorBack : NegProfitColorBack;
  const circumference = 220;
  $: dashOffset = circumference - (circumference * Math.min(PortfolioDeltaPercent, 100) / 100);

  const PosProfitColor = "#22c55e"
  const NegProfitColor = "#ef4444"
  const PosProfitColorBack = "#22ad5e"
  const NegProfitColorBack = "#cd4444"


  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function handleMenuAction(action: string) {
    menuOpen = false;
    console.log('Menu action:', action);
  }

  function selectTimePeriod(period: string) {
    selectedTimePeriod = period;
    console.log('Time period selected:', period);
    updatePriceChange();
  }

  function toFixedNoRounding(num: number, decimals: number): string {
    const factor = Math.pow(10, decimals);
    return (Math.floor(num * factor) / factor).toFixed(decimals);
  }
</script>

<main>
  <div class="menu-container">
    <button class="menu-button" on:click={toggleMenu} title="Menu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 6.5h15M4.5 12h15m-15 5.5h15"/>
      </svg>
    </button>

    {#if menuOpen}
      <div class="menu-dropdown">
        <button class="menu-item" on:click={() => onNavigate("NewWalletScreen")}>
          New Wallet
        </button>
        <button class="menu-item" on:click={() => onNavigate("ConnectWalletScreen")}>
          Connect Existing Wallet
        </button>
        <button class="menu-item" on:click={() => onNavigate("TransactHistoryScreen")}>
          Transaction History
        </button>
        <button class="menu-item" on:click={() => onNavigate("ChangeWalletScreen")}>
          Change Wallet
        </button>
      </div>
    {/if}
  </div>

  <div class="wallet-info-container">
    <div class="time-period-bar">
      <button class="period-button" 
        class:active={selectedTimePeriod === '1D'}
        on:click={() => selectTimePeriod('1D')}>
        1D
      </button>
      <button class="period-button" 
        class:active={selectedTimePeriod === '7D'}
        on:click={() => selectTimePeriod('7D')}>
        7D
      </button>
      <button class="period-button" 
        class:active={selectedTimePeriod === '1M'}
        on:click={() => selectTimePeriod('1M')}>
        1M
      </button>
      <button class="period-button" 
        class:active={selectedTimePeriod === '1Y'}
        on:click={() => selectTimePeriod('1Y')}
      >
        1Y
      </button>
      <button class="period-button" 
        class:active={selectedTimePeriod === 'ALL'}
        on:click={() => selectTimePeriod('ALL')}>
        ALL
      </button>
    </div>

    <svg viewBox="0 0 160 90" class="progress-svg">
      <path
        class="background-arc"
        d="M 10 80 A 70 70 0 0 1 150 80"
        fill="none"
        stroke={arcColorBack}
        stroke-width="2"
        stroke-linecap="round"
      />
      
      <path
        class="progress-arc"
        d="M 10 80 A 70 70 0 0 1 150 80"
        fill="none"
        stroke={arcColor}
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        style="transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;"
      />

      <text x="80" y="70" class="wallet-eth-amount">
        {toFixedNoRounding(WalletETHAmount, 4)} ETH
      </text>
      <text x="80" y="85" class="wallet-usd-amount">
        ${WalletUSDAmount.toFixed(2)} USD
      </text>
    </svg>
  </div>

  <div class="action-buttons">
    <button class="action-button send" on:click={() => onNavigate("TransactSendScreen")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
      Send
    </button>
    <button class="action-button receive" on:click={() => onNavigate("TransactRecieveScreen")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
      Receive
    </button>
  </div>
</main>

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    margin: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--vscode-sideBar-background);
  }

  .menu-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .menu-button {
    margin: 0;
    border: none;
    border-radius: 7%;
    background-color: var(--vscode-sideBar-background);
    color: var(--vscode-button-foreground);
    cursor: pointer;
    display: flex;
    align-items: left;
    justify-content: left;
    transition: opacity 0.2s;
    outline: 0;
    opacity: 75%;
  }

  .menu-button:hover {
    outline: 0;
    opacity: 100%;
  }

  .menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background-color: var(--vscode-dropdown-background);
    border: 1px solid var(--vscode-dropdown-border);
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 170px;
    overflow: hidden;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .menu-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    color: var(--vscode-dropdown-foreground);
    text-align: left;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background-color: var(--vscode-list-hoverBackground);
    outline: 0;
  }

  .wallet-info-container {
    width: 90%;
    max-width: 280px;
    margin-top: 60px;
    margin-bottom: 30px;
  }

  .time-period-bar {
    display:inline-flex;
    justify-content: space-between;
    gap: 0;
    margin-bottom: 20px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 4px 4px;
  }

  .period-button {
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    font-size: 10px;
  }

  .period-button:hover {
    color: rgba(255, 255, 255, 0.8);
    outline: 0;
  }

  .period-button.active {
    background-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.95);
    outline: 0;
  }

  .progress-svg {
    width: 100%;
    height: auto;
  }

  .background-arc {
    opacity: 0.25;
  }

  .progress-arc {
    transform-origin: center;
  }

  .wallet-eth-amount {
    font-size: 18px;
    font-weight: 600;
    fill: var(--vscode-foreground);
    text-anchor: middle;
    letter-spacing: 0.5px;
  }

  .wallet-usd-amount {
    font-size: 12px;
    font-weight: 400;
    fill: var(--vscode-descriptionForeground);
    text-anchor: middle;
    letter-spacing: 0.3px;
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    margin-top: 20px;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    width: 90px;
    flex-shrink: 0;
  }

  .action-button:hover {
    background-color: var(--vscode-button-hoverBackground);
    transform: translateY(-2px);
    outline: 0;
  }

  .action-button:active {
    transform: translateY(0);
  }

  .action-button svg {
    transition: transform 0.2s;
    width: 18px;
    height: 18px;
  }

  .action-button.send:hover svg {
    transform: translateY(-2px);
    outline: 0;
  }

  .action-button.receive:hover svg {
    transform: translateY(-2px);
    outline: 0;
  }
</style>