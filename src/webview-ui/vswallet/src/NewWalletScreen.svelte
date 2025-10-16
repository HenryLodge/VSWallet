<script lang="ts">
	export let onNavigate: (screen: string) => void;
  
  let walletName = "";
  let seedWords = [{ name: 'word1' }, { name: 'word2' }, { name: 'word3' }, { name: 'word4' }];
</script>

<!-- create new wallet ui steps:
  enter name, press button for next step
  tell user about only showing seed once, press button to proceed
  show seed, press button to proceed to wallet -->

<main>
  <div class="create-wallet-name">
    <p class="wallet-name-text">Wallet Name</p>
    <input class="wallet-name-box" bind:value={walletName}/>
    <button class="wallet-name-button">Continue</button>
  </div>

  <div class="show-seed-warning">
    <h2 class="show-seed-warning-text">warning here</h2>
    <button class="show-seed-warning-button">I understand</button>
  </div>

  <div class="show-seed-phrase">
    <h2 class="show-seed-phrase-header">{walletName} Wallet Seed:</h2>
    {#each seedWords as word}
      <p class="grid-item">{word.name}</p>
    {/each}
    <button class="seed-copy-button" title="seed-copy-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.829 12.861c.171-.413.171-.938.171-1.986s0-1.573-.171-1.986a2.25 2.25 0 0 0-1.218-1.218c-.413-.171-.938-.171-1.986-.171H11.1c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C7.5 9.209 7.5 9.839 7.5 11.1v6.525c0 1.048 0 1.573.171 1.986c.229.551.667.99 1.218 1.218c.413.171.938.171 1.986.171s1.573 0 1.986-.171m7.968-7.968a2.25 2.25 0 0 1-1.218 1.218c-.413.171-.938.171-1.986.171s-1.573 0-1.986.171a2.25 2.25 0 0 0-1.218 1.218c-.171.413-.171.938-.171 1.986s0 1.573-.171 1.986a2.25 2.25 0 0 1-1.218 1.218m7.968-7.968a11.68 11.68 0 0 1-7.75 7.9l-.218.068M16.5 7.5v-.9c0-1.26 0-1.89-.245-2.371a2.25 2.25 0 0 0-.983-.984C14.79 3 14.16 3 12.9 3H6.6c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C3 4.709 3 5.339 3 6.6v6.3c0 1.26 0 1.89.245 2.371c.216.424.56.768.984.984c.48.245 1.111.245 2.372.245H7.5"/>
      </svg>
    </button>
    <button class="continue-to-wallet">Continue</button>
  </div>


  <p>New Wallet Screen</p>
  <button on:click={() => onNavigate("HomeScreen")}>Home</button>
</main>

<style>
  .create-wallet-name {
    align-items: top;
  }
</style>