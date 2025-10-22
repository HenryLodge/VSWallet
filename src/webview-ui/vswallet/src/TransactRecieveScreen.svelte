<script lang="ts">
  export let onNavigate: (screen: string) => void;
  
  let walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  let copied = false;
  
  function copyAddress() {
    navigator.clipboard.writeText(walletAddress);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<main>
  <div class="back-button-container">
    <button class="back-button" on:click={() => onNavigate("HomeScreen")} title="Back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l6 6m-6-6l6-6"/>
      </svg>
    </button>
  </div>

  <h1 class="page-title">Receive Ethereum</h1>

  <div class="form-container">
    <div class="qr-container">
      <div class="qr-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <path d="M5 5h3v3H5z"/>
          <path d="M16 5h3v3h-3z"/>
          <path d="M5 16h3v3H5z"/>
          <path d="M16 16h3v3h-3z"/>
        </svg>
      </div>
      <p class="qr-label">Scan QR Code</p>
    </div>

    <div class="address-section">
      <label class="input-label">Your Wallet Address</label>
      <div class="address-container">
        <div class="address-text">{walletAddress}</div>
        <button class="copy-button" on:click={copyAddress} title="Copy Address">
          {#if copied}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.829 12.861c.171-.413.171-.938.171-1.986s0-1.573-.171-1.986a2.25 2.25 0 0 0-1.218-1.218c-.413-.171-.938-.171-1.986-.171H11.1c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C7.5 9.209 7.5 9.839 7.5 11.1v6.525c0 1.048 0 1.573.171 1.986c.229.551.667.99 1.218 1.218c.413.171.938.171 1.986.171s1.573 0 1.986-.171m7.968-7.968a2.25 2.25 0 0 1-1.218 1.218c-.413.171-.938.171-1.986.171s-1.573 0-1.986.171a2.25 2.25 0 0 0-1.218 1.218c-.171.413-.171.938-.171 1.986s0 1.573-.171 1.986a2.25 2.25 0 0 1-1.218 1.218m7.968-7.968a11.68 11.68 0 0 1-7.75 7.9l-.218.068M16.5 7.5v-.9c0-1.26 0-1.89-.245-2.371a2.25 2.25 0 0 0-.983-.984C14.79 3 14.16 3 12.9 3H6.6c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984C3 4.709 3 5.339 3 6.6v6.3c0 1.26 0 1.89.245 2.371c.216.424.56.768.984.984c.48.245 1.111.245 2.372.245H7.5"/>
            </svg>
          {/if}
        </button>
      </div>
      {#if copied}
        <p class="copy-feedback">Address copied to clipboard!</p>
      {/if}
    </div>

    <div class="info-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <p class="info-text">Only send Ethereum (ETH) to this address. Sending other tokens may result in permanent loss.</p>
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
    overflow-y: auto;
    box-sizing: border-box;
    background-color: var(--vscode-sideBar-background);
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
    margin-top: 50px;
    margin-bottom: 24px;
    letter-spacing: -0.5px;
    text-align: center;
  }

  .form-container {
    width: 85%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 32px;
  }

  .qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
  }

  .qr-placeholder {
    width: 200px;
    height: 200px;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  }

  .qr-placeholder svg {
    color: var(--vscode-descriptionForeground);
    opacity: 0.6;
  }

  .qr-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
    letter-spacing: 0.3px;
  }

  .address-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .address-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    padding-right: 50px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 8px;
    background-color: var(--vscode-input-background);
    box-sizing: border-box;
  }

  .address-text {
    flex: 1;
    font-size: 12px;
    font-weight: 400;
    color: var(--vscode-input-foreground);
    word-break: break-all;
    font-family: 'Courier New', monospace;
    letter-spacing: -0.3px;
  }

  .copy-button {
    position: absolute;
    right: 8px;
    padding: 8px;
    border: none;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--vscode-button-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    outline: 0;
  }

  .copy-button:hover {
    background-color: rgba(255, 255, 255, 0.12);
    outline: 0;
  }

  .copy-feedback {
  font-size: 11px;
  font-weight: 500;
  color: #22c55e;
  margin-top: 4px;
  animation: fadeInSlide 0.4s ease;
  }

  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
</style>