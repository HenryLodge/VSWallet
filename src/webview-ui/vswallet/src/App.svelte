<script lang="ts">
  import HomeScreen from './HomeScreen.svelte';
  import NewWalletScreen from './NewWalletScreen.svelte';
  import TransactRecieveScreen from './TransactRecieveScreen.svelte';
  import TransactSendScreen from './TransactSendScreen.svelte';
  import ChangeWalletScreen from './ChangeWalletScreen.svelte';
  import TransactHistory from './TransactHistory.svelte';
  import ConnectWalletScreen from './ConnectWalletScreen.svelte';

  let currentScreen = 'HomeScreen';
  function navigate(screen: string) {
    currentScreen = screen;
  }
</script>

{#if currentScreen === 'HomeScreen'}
  <HomeScreen onNavigate={navigate} />
{:else if currentScreen === 'NewWalletScreen'}
  <NewWalletScreen onNavigate={navigate} />
{:else if currentScreen === 'TransactRecieveScreen'}
  <TransactRecieveScreen onNavigate={navigate} />
{:else if currentScreen === 'TransactSendScreen'}
  <TransactSendScreen onNavigate={navigate} />
{:else if currentScreen === 'ChangeWalletScreen'}
  <ChangeWalletScreen onNavigate={navigate} />
{:else if currentScreen === 'TransactHistoryScreen'}
  <TransactHistory onNavigate={navigate} />
{:else if currentScreen === 'ConnectWalletScreen'}
  <ConnectWalletScreen onNavigate={navigate} />
{/if}

<style>
  :global(body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    min-width: 300px;
    max-width: 500px;
    background-color: var(--vscode-sideBar-background);
    color: var(--vscode-sideBar-foreground);
  }
  
  :global(html) {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  :global(#app) {
    margin: 0 !important;
    padding: 0 !important;
  }
</style>