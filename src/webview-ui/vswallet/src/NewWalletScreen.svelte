<script lang="ts">
  import { walletStore } from './walletStore';
  export let onNavigate: (screen: string) => void;
  
  let currentStep = 1;
  let walletName = "";
  let seedWords: string[] = [];
  let copied = false;
  
  async function continueFromName() {
    if (walletName.trim()) {
      currentStep = 2;
    }
  }
  
  async function acknowledgeWarning() {
    try {
      // Create wallet using the service
      const result = await walletStore.createWallet(walletName);
      seedWords = result.phrase.split(' ');
      currentStep = 3;
    } catch (error) {
      console.error('Failed to create wallet:', error);
      // Show error to user
    }
  }
  
  function copySeedPhrase() {
    navigator.clipboard.writeText(seedWords.join(' '));
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
  
  function completeSetup() {
    console.log('Wallet created:', walletName);
    onNavigate("HomeScreen");
  }
  
  function goBack() {
    if (currentStep > 1) {
      currentStep--;
    } else {
      onNavigate("HomeScreen");
    }
  }
</script>

<main>
  <div class="back-button-container">
    <button class="back-button" on:click={goBack} title="Back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l6 6m-6-6l6-6"/>
      </svg>
    </button>
  </div>

  <div class="progress-indicator">
    <div class="progress-dot" class:active={currentStep >= 1}></div>
    <div class="progress-line" class:active={currentStep >= 2}></div>
    <div class="progress-dot" class:active={currentStep >= 2}></div>
    <div class="progress-line" class:active={currentStep >= 3}></div>
    <div class="progress-dot" class:active={currentStep >= 3}></div>
  </div>

  {#if currentStep === 1}
    <div class="step-content">
      <h1 class="page-title">Create New Wallet</h1>
      
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
        </div>

        <button 
          class="primary-button" 
          on:click={continueFromName}
          disabled={!walletName.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  {/if}

  {#if currentStep === 2}
    <div class="step-content">
      <h1 class="page-title">Security Warning</h1>
      
      <div class="form-container">
        <div class="warning-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          
          <h2 class="warning-title">Your Seed Phrase</h2>
          
          <div class="warning-content">
            <p class="warning-text">On the next screen, you'll see your 12-word seed phrase.</p>
            
            <div class="warning-points">
              <div class="warning-point">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Write it down and store it in a safe place</span>
              </div>
              
              <div class="warning-point">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Never share it with anyone</span>
              </div>
              
              <div class="warning-point">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>You'll only see this once</span>
              </div>
              
              <div class="warning-point">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>If lost, your wallet cannot be recovered</span>
              </div>
            </div>
          </div>
        </div>

        <button class="primary-button" on:click={acknowledgeWarning}>
          I Understand
        </button>
      </div>
    </div>
  {/if}

  {#if currentStep === 3}
    <div class="step-content">
      <h1 class="page-title">Your Seed Phrase</h1>
      
      <div class="form-container">
        <div class="seed-section">
          <div class="seed-grid">
            {#each seedWords as word, index}
              <div class="seed-word">
                <span class="seed-number">{index + 1}</span>
                <span class="seed-text">{word}</span>
              </div>
            {/each}
          </div>

          <button class="copy-button-full" on:click={copySeedPhrase}>
            {#if copied}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Copied to Clipboard
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.829 12.861c.171-.413.171-.938.171-1.986s0-1.573-.171-1.986a2.25 2.25 0 0 0-1.218-1.218c-.413-.171-.938-.171-1.986-.171H11.1c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C7.5 9.209 7.5 9.839 7.5 11.1v6.525c0 1.048 0 1.573.171 1.986c.229.551.667.99 1.218 1.218c.413.171.938.171 1.986.171s1.573 0 1.986-.171m7.968-7.968a2.25 2.25 0 0 1-1.218 1.218c-.413.171-.938.171-1.986.171s-1.573 0-1.986.171a2.25 2.25 0 0 0-1.218 1.218c-.171.413-.171.938-.171 1.986s0 1.573-.171 1.986a2.25 2.25 0 0 1-1.218 1.218m7.968-7.968a11.68 11.68 0 0 1-7.75 7.9l-.218.068M16.5 7.5v-.9c0-1.26 0-1.89-.245-2.371a2.25 2.25 0 0 0-.983-.984C14.79 3 14.16 3 12.9 3H6.6c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C3 4.709 3 5.339 3 6.6v6.3c0 1.26 0 1.89.245 2.371c.216.424.56.768.984.984c.48.245 1.111.245 2.372.245H7.5"/>
              </svg>
              Copy Seed Phrase
            {/if}
          </button>
        </div>

        <div class="info-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p class="info-text">Make sure to write down your seed phrase and store it securely. You will need it to recover your wallet.</p>
        </div>

        <button class="primary-button" on:click={completeSetup}>
          Continue to Wallet
        </button>
      </div>
    </div>
  {/if}
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
    overflow-y: auto;
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

  .progress-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
  }

  .progress-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .progress-dot.active {
    background-color: var(--vscode-button-background);
    transform: scale(1.3);
  }

  .progress-line {
    width: 30px;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .progress-line.active {
    background-color: var(--vscode-button-background);
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

  .warning-card {
    background-color: var(--vscode-input-background);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .warning-card svg:first-child {
    color: #ef4444;
  }

  .warning-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin: 0;
    letter-spacing: -0.3px;
  }

  .warning-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .warning-text {
    font-size: 13px;
    color: var(--vscode-descriptionForeground);
    text-align: center;
    margin: 0;
    line-height: 1.5;
  }

  .warning-points {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .warning-point {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: var(--vscode-foreground);
    line-height: 1.5;
    text-align: left;
  }

  .warning-point svg {
    flex-shrink: 0;
    color: #ef4444;
    margin-top: 2px;
  }

  .seed-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .seed-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    padding: 12px;
  }

  .seed-word {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
  }

  .seed-number {
    font-size: 10px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
    min-width: 16px;
  }

  .seed-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--vscode-foreground);
    font-family: 'Courier New', monospace;
  }

  .copy-button-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--vscode-foreground);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    outline: 0;
  }

  .copy-button-full:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: var(--vscode-focusBorder);
    outline: 0;
  }

  .info-box {
    display: flex;
    gap: 12px;
    padding: 14px;
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 8px;
    align-items: flex-start;
  }

  .info-box svg {
    flex-shrink: 0;
    color: rgba(59, 130, 246, 0.8);
    margin-top: 2px;
  }

  .info-text {
    font-size: 11px;
    font-weight: 400;
    color: var(--vscode-descriptionForeground);
    line-height: 1.5;
    margin: 0;
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
</style>