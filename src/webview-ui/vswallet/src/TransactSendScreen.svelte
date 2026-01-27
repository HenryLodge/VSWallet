<script lang="ts">
  import { walletService } from './walletService';
  export let onNavigate: (screen: string) => void;
  
  let recipientAddress = '';
  let amount = '';
  let currency = 'ETH';
  let note = '';
  let showCurrencyDropdown = false;
  let showConfirmModal = false;
  
  // Mock data - to be populated by backend
  let estimatedFeeETH = 0.000;
  let estimatedFeeUSD = 0.00;
  
  function toggleCurrency() {
    showCurrencyDropdown = !showCurrencyDropdown;
  }
  
  function selectCurrency(newCurrency: string) {
    currency = newCurrency;
    showCurrencyDropdown = false;
  }
  
  function handleSend() {
    if (!recipientAddress.trim()) {
      alert('Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    showConfirmModal = true;
  }
  
  async function confirmSend() {
    try {
      showConfirmModal = false;
      
      console.log('Sending transaction...');
      
      const txHash = await walletService.transactionSend(recipientAddress, amount);
      
      console.log('Transaction sent! Hash:', txHash);
      
      // Show success message
      alert(`Transaction sent successfully!\nTx Hash: ${txHash}`);
      
      // Navigate back to home
      onNavigate("HomeScreen");
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed: ' + (error as Error).message);
    }
  }
  
  function cancelSend() {
    showConfirmModal = false;
  }
</script>

<main class:blurred={showConfirmModal}>
  <div class="back-button-container">
    <button class="back-button" on:click={() => onNavigate("HomeScreen")} title="Back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l6 6m-6-6l6-6"/>
      </svg>
    </button>
  </div>

  <h1 class="page-title">Send Ethereum</h1>

  <div class="form-container">
    <div class="input-group">
      <label class="input-label" for="input-label">Recipient Address</label>
      <input 
        type="text" 
        class="text-input"
        bind:value={recipientAddress}
        placeholder="0x"
      />
    </div>

    <div class="input-group">
      <label class="input-label" for="input-label">Amount</label>
      <div class="amount-input-container">
        <input 
          type="text" 
          class="amount-input" 
          bind:value={amount}
          placeholder="0.0"
        />
        <div class="currency-selector">
          <button class="currency-button" on:click={toggleCurrency}>
            {currency}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" fill-rule="evenodd" d="M4.293 7.793a1 1 0 0 1 1.414 0L12 14.086l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 15.5a2 2 0 0 1-2.828 0L4.293 9.207a1 1 0 0 1 0-1.414" clip-rule="evenodd"/>
            </svg>
          </button>
          
          {#if showCurrencyDropdown}
            <div class="currency-dropdown">
              <button class="currency-option" on:click={() => selectCurrency('ETH')}>SEP</button>
              <button class="currency-option" on:click={() => selectCurrency('USD')}>USD</button>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="input-group">
      <label class="input-label" for="inpur-label">Note (Optional)</label>
      <input 
        type="text" 
        class="text-input" 
        bind:value={note}
        placeholder="Add a note..."
      />
    </div>

    <div class="fee-estimate">
      <div class="fee-row">
        <span class="fee-label">Estimated Fee</span>
        <div class="fee-values">
          <span class="fee-eth">{estimatedFeeETH.toFixed(4)} SEP</span>
          <span class="fee-usd">${estimatedFeeUSD.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <button class="send-button" on:click={handleSend}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
      Send Transaction
    </button>
  </div>
</main>

{#if showConfirmModal}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Confirm Transaction</h2>
      
      <div class="modal-body">
        <p class="confirmation-text">
          Confirm the transaction of <strong>{0} {currency}</strong> to:
        </p>
        <p class="address-text">{recipientAddress || 'No address provided'}</p>
        <p class="warning-text">This transaction is non-reversible</p>
      </div>
      
      <div class="modal-actions">
        <button class="cancel-button" on:click={cancelSend}>Cancel</button>
        <button class="confirm-button" on:click={confirmSend}>Send</button>
      </div>
    </div>
  </div>
{/if}

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
    transition: filter 0.3s ease;
  }

  main.blurred {
    filter: blur(4px);
    opacity: 0.6;
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
    align-items: left;
    justify-content: left;
    opacity: 75%;
    transition: opacity 0.2s;
    outline: 0;
  }

  .back-button:hover {
    outline: 0;
    opacity: 100%;
  }

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin-top: 60px;
    margin-bottom: 24px;
    letter-spacing: -0.5px;
    text-align: center;
  }

  .form-container {
    width: 85%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .text-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: 13px;
    font-weight: 400;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .text-input:focus {
    border-color: var(--vscode-focusBorder);
    background-color: var(--vscode-input-background);
  }

  .text-input::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }

  .amount-input-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .amount-input {
    width: 100%;
    padding: 12px 14px;
    padding-right: 90px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: 13px;
    font-weight: 400;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .amount-input:focus {
    border-color: var(--vscode-focusBorder);
    background-color: var(--vscode-input-background);
  }

  .amount-input::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }

  .currency-selector {
    position: absolute;
    right: 4px;
  }

  .currency-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--vscode-button-foreground);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    outline: 0;
  }

  .currency-button:hover {
    background-color: rgba(255, 255, 255, 0.12);
    outline: 0;
  }

  .currency-button svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s;
  }

  .currency-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background-color: var(--vscode-dropdown-background);
    border: 1px solid var(--vscode-dropdown-border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    min-width: 80px;
    animation: slideDown 0.2s ease;
    z-index: 10;
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

  .currency-option {
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: none;
    color: var(--vscode-dropdown-foreground);
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .currency-option:hover {
    background-color: var(--vscode-list-hoverBackground);
    outline: 0;
  }

  .fee-estimate {
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    padding: 14px;
  }

  .fee-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fee-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
    letter-spacing: 0.3px;
  }

  .fee-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .fee-eth {
    font-size: 14px;
    font-weight: 600;
    color: var(--vscode-foreground);
    letter-spacing: -0.3px;
  }

  .fee-usd {
    font-size: 11px;
    font-weight: 400;
    color: var(--vscode-descriptionForeground);
  }

  .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    margin-top: 6px;
    margin-bottom: 32px;
    border: none;
    border-radius: 10px;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.2px;
    outline: 0;
  }

  .send-button:hover {
    background-color: var(--vscode-button-hoverBackground);
    transform: translateY(-2px);
    outline: 0;
  }

  .send-button:active {
    transform: translateY(0);
  }

  .send-button svg {
    transition: transform 0.2s;
  }

  .send-button:hover svg {
    transform: translateY(-1px);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-panel-border);
    border-radius: 12px;
    padding: 20px;
    width: 75%;
    max-width: 280px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin: 0 0 16px 0;
    text-align: center;
    letter-spacing: -0.3px;
  }

  .modal-body {
    margin-bottom: 20px;
  }

  .confirmation-text {
    font-size: 13px;
    color: var(--vscode-foreground);
    margin: 0 0 10px 0;
    line-height: 1.5;
    text-align: center;
  }

  .confirmation-text strong {
    color: var(--vscode-textLink-foreground);
    font-weight: 600;
  }

  .address-text {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    background-color: var(--vscode-input-background);
    padding: 8px 10px;
    border-radius: 6px;
    margin: 0 0 12px 0;
    word-break: break-all;
    font-family: monospace;
    text-align: center;
  }

  .warning-text {
    font-size: 12px;
    color: var(--vscode-errorForeground);
    margin: 0;
    text-align: center;
    font-weight: 500;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .cancel-button,
  .confirm-button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    outline: 0;
  }

  .cancel-button {
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
  }

  .cancel-button:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
    outline: 0;
  }

  .confirm-button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  .confirm-button:hover {
    background-color: var(--vscode-button-hoverBackground);
    outline: 0;
  }
</style>