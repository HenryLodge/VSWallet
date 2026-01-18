# VSWallet

A lightweight, self-custodial Ethereum wallet extension for Visual Studio Code.

## Overview

VSWallet brings Ethereum wallet functionality directly into your development environment.  
Manage crypto assets, send transactions, and track your portfolio without leaving VS Code.

## Features

- **Secure Wallet Management** - Create new wallets or import existing ones using seed phrases
- **Send & Receive ETH** - Transaction sending with customizable notes and gas estimation
- **Real-time Price Tracking** - Live ETH/USD conversion with percentage change indicators
- **Transaction History** - View all VSWallet transactions with detailed information
- **Multi-Wallet Support** - Switch between multiple wallets seamlessly
- **Testnet Support** - Sepolia testnet integration for safe testing
- **Native VS Code UI** - Seamless integration with VS Code's sidebar

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vswallet.git
cd vswallet
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run compile
```

4. Open the project in VS Code and press `F5` to launch in development mode

### From VSIX

Download the `.vsix` file from releases and install:
```bash
code --install-extension vswallet-x.x.x.vsix
```

## Usage

### Creating a New Wallet

1. Open VSWallet from the VS Code sidebar
2. Click the menu button in the top-left
3. Select "New Wallet"
4. Save your seed phrase and private key securely

### Importing an Existing Wallet

1. Open VSWallet sidebar
2. Click menu and select "Connect Existing Wallet"
3. Enter your 12 or 24-word seed phrase
4. Your wallet will be imported

### Sending Transactions

1. Click "Send" on the home screen
2. Enter recipient address
3. Enter amount in ETH
4. Add optional note
5. Review gas fees and confirm

### Managing Contacts

1. Access contacts from the menu
2. Add contacts with name, address, and optional notes
3. Select contacts when sending for quick address input

## Architecture

### Tech Stack

- Frontend: Svelte + TypeScript
- Backend: VS Code Extension API
- Blockchain: Ethers.js v6
- Storage: VS Code SecretStorage API (encrypted)
- Network: Ethereum & Sepolia Testnet

### Project Structure
```
vswallet/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── sidebar.ts             # Sidebar provider
│   └── ethers/
│       └── walletService.ts   # Blockchain interaction
├── webview/
│   ├── App.svelte
│   ├── HomeScreen.svelte
│   ├── TransactSendScreen.svelte
│   ├── TransactHistory.svelte
│   ├── ContactsScreen.svelte
│   ├── walletService.ts
│   └── walletStore.ts
└── package.json
```

## Security

### Security Features

- Encrypted storage using VS Code's SecretStorage API
- Local-only data - no external servers
- Direct blockchain interaction via RPC
- Transaction confirmation required before sending

### Best Practices

1. Never share your seed phrase
2. Backup your seed phrase securely offline
3. Use testnet (Sepolia) for development and testing
4. Verify recipient addresses before sending
5. Keep VS Code updated

## Development

### Prerequisites

- Node.js v16+
- VS Code v1.75+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Build Svelte webview
npm run build:webview
```

### Debugging

1. Press `F5` in VS Code to launch Extension Development Host
2. Open VSWallet sidebar in the new window
3. Use Developer Tools to debug webview
4. Backend logs appear in Debug Console

## Roadmap

### Current (v1.0.0)

- Wallet creation and import
- Send/Receive ETH
- Transaction history
- Contacts management
- Sepolia testnet support
- Price tracking with percentage change

### Planned

- Ethereum Mainnet support
- ERC-20 token support
- Multi-chain support (Polygon, BSC, Arbitrum)
- Hardware wallet integration
- Transaction export (CSV)
- NFT viewing
- DApp browser integration
- Advanced gas controls

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/feature-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.