<script lang="ts">
	export let onNavigate: (screen: string) => void;
</script>

<!-- Send ETH ui steps:
  input eth addr
  input amount in eth or usd, one text box, dropdown of eth/usd option to the right
  note (optional) input
  estimated fees div
  send transact button, shows preview
  preview has all send info with send button, button actually send
-->

<main>
  <h1 class="page-title">Send Ethereum</h1>
  <div class="send-eth-form">
    <p class="wallet-address-input-text">Address</p>
    <input class="wallet-address-input"/>

    <button class="eth-amount-input-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd" d="M4.293 7.793a1 1 0 0 1 1.414 0L12 14.086l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 15.5a2 2 0 0 1-2.828 0L4.293 9.207a1 1 0 0 1 0-1.414" clip-rule="evenodd"/>
      </svg>
      ETH
    </button>
    <input class="eth-amount-input"/>

    <p class="note-input-text">Note (optional)</p>
    <input class="note-input"/>
  </div>

  <div class="eth-fee-estimate">
    <p class="fee-amount-text">Estimated fees: </p>
    <p class="fee-amount-eth">*fee here* ETH</p>
    <p class="fee-amount-usd">*fee here* USD</p>
  </div>

  <div class="send-eth">
    <button  class="send-eth-button">Send</button>
  </div>

  <button on:click={() => onNavigate("HomeScreen")}>Home</button>
</main>


<style>
  /*  */
</style>