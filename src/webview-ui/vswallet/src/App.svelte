<script lang="ts">
  import HomeScreen from './HomeScreen.svelte';
  import NewWalletScreen from './NewWalletScreen.svelte';
  import TransactScreen from './TransactScreen.svelte';
  
  let currentScreen = 'HomeScreen';
  let more = 0;

  function navigate(screen: string) {
    if (screen === 'love') more++;
    currentScreen = screen;
  }
</script>

{#if currentScreen === 'HomeScreen'}
  <HomeScreen onNavigate={navigate} />
{:else if currentScreen === 'NewWalletScreen'}
  <NewWalletScreen onNavigate={navigate} />
{:else if currentScreen === 'TransactScreen'}
<TransactScreen onNavigate={navigate} />
{/if}