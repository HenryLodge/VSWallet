<script lang="ts">
  import HomeScreen from './HomeScreen.svelte';
  import NewWalletScreen from './NewWalletScreen.svelte';
  import TransactRecieveScreen from './TransactRecieveScreen.svelte';
  import TransactSendScreen from './TransactSendScreen.svelte';
  
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
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background-color: var(--vscode-sideBar-background);
    color: var(--vscode-sideBar-foreground);
  }
</style>