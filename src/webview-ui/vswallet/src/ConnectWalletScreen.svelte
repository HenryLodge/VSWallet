<script lang="ts">
	import { walletStore } from './walletStore';
  
  export let onNavigate: (screen: string) => void;
  
  let walletName = "";
  let seed = "";
  
  async function handleRestore() {
    if (!walletName.trim() || !seed.trim()) return;
    
    try {
      await walletStore.connectWallet(seed);
      onNavigate("HomeScreen");
    } catch (error) {
      console.error('Failed to restore wallet:', error);
      // Show error to user
    }
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

  <div class="step-content">
      <h1 class="page-title">Connect Your Wallet</h1>
      
      <div class="form-container">
        <div class="input-group">
          <label class="input-label" for="input-label">Wallet Name</label>
          <input 
            type="text" 
            class="text-input"
            bind:value={walletName}
            placeholder="My Ethereum Wallet"
          />
          <p class="input-hint">Choose a name to identify your wallet</p>

          <label class="input-label" for="seed-phrase" style="margin-top: 16px;">Seed Phrase</label>
          <textarea 
            id="seed-phrase"
            class="seedtext-input"
            bind:value={seed}
            placeholder="Enter your seed phrase"
            rows="6">
          </textarea>
        </div>

        <button 
          class="primary-button"
          on:click={handleRestore}
          disabled={!walletName.trim() || !seed.trim()}
        >
          Restore
        </button>
      </div>
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

  .step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    background-color: var(--vscode-sideBar-background);
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

  .form-container {
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
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
    padding: 12px 50px;
    border: 1px solid var(--vscode-input-background);
    border-radius: 8px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .text-input:focus {
    border-color: var(--vscode-focusBorder);
  }

  .text-input::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }

  .input-hint {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    margin: 0;
    margin-top: 2px;
  }

  .primary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
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

  .primary-button:hover:not(:disabled) {
    background-color: var(--vscode-button-hoverBackground);
    transform: translateY(-2px);
    outline: 0;
  }

  .primary-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .primary-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .seedtext-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--vscode-input-background);
    border-radius: 8px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: 13px;
    font-weight: 400;
    font-family: inherit;
    line-height: 1.6;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
    resize: none;
    min-height: 120px;
  }

  .seedtext-input:focus {
    border-color: var(--vscode-focusBorder);
  }

  .seedtext-input::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }
</style>