// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProgressLocation } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "webnizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('webnizer.ui', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Webnizer - Hello!');
	});

	let disposable2 = vscode.commands.registerCommand('webnizer.build', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Webnizer - Starting to build your project to Wasm');
		vscode.window.showWarningMessage('Webnizer - Warning');
		vscode.window.showErrorMessage('Webnizer - Error');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);

	const outputChannel = vscode.window.createOutputChannel(`Webnier`);
	outputChannel.appendLine('Webnizer Build Log');
	outputChannel.show(true);

	setTimeout(() => {
			outputChannel.appendLine('Test1');
			outputChannel.appendLine('Test2');
			outputChannel.appendLine('Test3');
	}, 5000);

	vscode.window.withProgress({
		location: ProgressLocation.Notification,
		title: "I am long running!",
		cancellable: true
	}, (progress, token) => {
		token.onCancellationRequested(() => {
			console.log("User canceled the long running operation");
		});

		progress.report({ increment: 0 });

		setTimeout(() => {
			progress.report({ increment: 10, message: "I am long running! - still going..." });
		}, 1000);

		setTimeout(() => {
			progress.report({ increment: 40, message: "I am long running! - still going even more..." });
		}, 2000);

		setTimeout(() => {
			progress.report({ increment: 50, message: "I am long running! - almost there..." });
		}, 3000);

		const p = new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 5000);
		});

		return p;
	});

}

// this method is called when your extension is deactivated
export function deactivate() {}
