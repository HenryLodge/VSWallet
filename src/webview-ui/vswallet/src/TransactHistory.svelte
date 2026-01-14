<script lang="ts">
  import { onMount } from 'svelte';
  import { walletService } from './walletService';
  import { walletStore } from './walletStore';
	export let onNavigate: (screen: string) => void;
	
	type Transaction = {
		id: number;
    type: 'sent' | 'received';
    address: string;
    amount: string;
    currency: string;
    usdValue: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'failed';
    hash: string;
    note?: string;
	};
	
	let transactions: Transaction[] = [];
	
	function formatAddress(address: string): string {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

  <div class="transactions-container">
    <h1 class="page-title">Transaction History</h1>

    {#if transactions.length === 0}
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        <p class="empty-text">No transactions yet</p>
        <p class="empty-subtext">Your transaction history will appear here</p>
      </div>
    {:else}
      <div class="transactions-list">
        {#each transactions as transaction}
          <div class="transaction-card">
            <div class="transaction-icon" class:sent={transaction.type === 'sent'} class:received={transaction.type === 'received'}>
              {#if transaction.type === 'sent'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              {/if}
            </div>

            <div class="transaction-details">
              <div class="transaction-header">
                <span class="transaction-type">{transaction.type === 'sent' ? 'Sent' : 'Received'}</span>
                <span class="transaction-amount" class:negative={transaction.type === 'sent'} class:positive={transaction.type === 'received'}>
                  {transaction.type === 'sent' ? '-' : '+'}{transaction.amount} {transaction.currency}
                </span>
              </div>

              <div class="transaction-info">
                <span class="transaction-address">{formatAddress(transaction.address)}</span>
                <span class="transaction-usd">{transaction.usdValue}</span>
              </div>

              <div class="transaction-footer">
                <span class="transaction-date">{transaction.date} at {transaction.time}</span>
                <span class="transaction-status" class:confirmed={transaction.status === 'confirmed'} class:pending={transaction.status === 'pending'}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
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

  .transactions-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    background-color: var(--vscode-sideBar-background);
    max-width: 460px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
  }

  .empty-state svg {
    color: var(--vscode-descriptionForeground);
    opacity: 0.5;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-foreground);
    margin: 0;
  }

  .empty-subtext {
    font-size: 13px;
    color: var(--vscode-descriptionForeground);
    margin: 0;
  }

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    padding-bottom: 20px;
  }

  .transaction-card {
    display: flex;
    gap: 14px;
    padding: 16px;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 12px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .transaction-card:hover {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: var(--vscode-focusBorder);
  }

  .transaction-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .transaction-icon.sent {
    background-color: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .transaction-icon.received {
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .transaction-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .transaction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .transaction-type {
    font-size: 14px;
    font-weight: 600;
    color: var(--vscode-foreground);
  }

  .transaction-amount {
    font-size: 14px;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .transaction-amount.negative {
    color: #ef4444;
  }

  .transaction-amount.positive {
    color: #22c55e;
  }

  .transaction-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .transaction-address {
    font-size: 12px;
    font-family: 'Courier New', monospace;
    color: var(--vscode-descriptionForeground);
  }

  .transaction-usd {
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
  }

  .transaction-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;
  }

  .transaction-date {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
  }

  .transaction-status {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .transaction-status.confirmed {
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .transaction-status.pending {
    background-color: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }
</style>