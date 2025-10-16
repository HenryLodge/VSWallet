<!-- <script lang="ts">
	export let onNavigate: (screen: string) => void;
  let EthAmount = 0.0;
</script>

<h1>{EthAmount} ETH</h1>
<button on:click={() => onNavigate("NewWalletScreen")}>NWS</button>
<button on:click={() => onNavigate("TransactScreen")}>TRAS</button>

<style>
  h1 {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    text-align: top;
    width: 100%;
  }
</style> -->

<script lang="ts">
  export let onNavigate: (screen: string) => void;
  // to get by cmc api
  let WalletETHAmount = 0.0;
  let WalletUSDAmount = 0.0;
  let PortfolioDeltaPercent = 0;

  const PosProfitColor = "#22c55e"
  const NegProfitColor = "#ef4444"
  const PosProfitColorBack = "#22ad5e"
  const NegProfitColorBack = "#cd4444"

  const circumference = 220;
  $: dashOffset = circumference - (circumference * Math.min(PortfolioDeltaPercent, 100) / 100);
</script>

<main>
  <button class="menu-button" title="menu-button-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 6.5h15M4.5 12h15m-15 5.5h15"/>
    </svg>
  </button>
  <div class="wallet-info-container">
    <svg viewBox="0 0 160 90" class="progress-svg">
      <!-- Red background arc -->
      <path
        class="background-arc"
        d="M 10 80 A 70 70 0 0 1 150 80"
        fill="none"
        stroke={PosProfitColorBack}
        stroke-width="2"
        stroke-linecap="round"
      />
      
      <!-- Green progress arc -->
      <path
        class="progress-arc"
        d="M 10 80 A 70 70 0 0 1 150 80"
        fill="none"
        stroke={PosProfitColor}
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        style="transition: stroke-dashoffset 0.3s ease;"
      />
      
      <text x="80" y="65" class="wallet-eth-amount">
        {WalletETHAmount} ETH
      </text>
      <text x="80" y="80" class="wallet-usd-amount">
        {WalletUSDAmount} USD
      </text>
    </svg>
  </div>

  <button on:click={() => onNavigate("NewWalletScreen")}>NWS</button>
  <button on:click={() => onNavigate("TransactSendScreen")}>SEND</button>
  <button on:click={() => onNavigate("TransactRecieveScreen")}>RECIEVE</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 20px;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--vscode-sideBar-background);
  }

  .menu-button {
    padding: 0%;
    border-radius: 10%;
    background-color: var(--vscode-sideBar-background);
  }

  .wallet-info-container {
    width: 90%;
    max-width: 280px;
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
    font-weight: 500;
    fill: var(--vscode-foreground);
    text-anchor: middle;
    letter-spacing: 0.5px;
  }

  .wallet-usd-amount {
    font-size: 10px;
    font-weight: 500;
    fill: var(--vscode-foreground);
    text-anchor: middle;
    letter-spacing: 0.5px;
  }
</style>