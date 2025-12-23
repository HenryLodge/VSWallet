// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './sidebar';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('vswallet.welcomeMessage', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Welcome to VSWallet, the only noncustodial Ethereum wallet integrated into VSCode');
		})
	);

	
	// ALL WELCOME PAGE CODE

	// ALL SIDEBAR CODE
	const provider = new CustomSidebarViewProvider(context.extensionUri, context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			CustomSidebarViewProvider.viewType,
		  provider
		)
	);

	// Command has been defined in the package.json file
	// Provide the implementation of the command with registerCommand
	// CommandId parameter must match the command field in package.json
	let openWebView = vscode.commands.registerCommand('vscodeSidebar.openview', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
	});

	context.subscriptions.push(openWebView);
}

// This method is called when your extension is deactivated
export function deactivate() {}