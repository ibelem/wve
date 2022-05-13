// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProgressLocation } from 'vscode';
// import * as hw from 'ag-simple-hello-world-example';



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

		// hw.printMsg();
		vscode.window.showInformationMessage('Webnizer - Hello!');
		
	});

	let disposable2 = vscode.commands.registerCommand('webnizer.build', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const date = new Date();
		const localedate = date.toLocaleTimeString();

		const outputChannel = vscode.window.createOutputChannel(`Webnier`);
		outputChannel.show(true);


		outputChannel.appendLine(`[${localedate}][Auto convert][info] Configure is ready, starting auto conversion...`);
		outputChannel.appendLine(`[${localedate}][Auto convert][info] Fixing issues based on recipes...`);
		outputChannel.appendLine(`[${localedate}][Build][info] Building...`);
		outputChannel.appendLine(`[${localedate}][Build][info] Test URL https://www.wpe.com/ "hello" ...`);

		setTimeout(() => {
			outputChannel.appendLine(`[${localedate}][Build][warn] Build Warning ...`);
			vscode.window.showWarningMessage('Webnizer - Build Warning');
		}, 5000);

		setTimeout(() => {
			outputChannel.appendLine(`[${localedate}][Analyze][info] Analyzing the build errors...`);
		}, 8000);

		setTimeout(() => {
			outputChannel.appendLine(`[${localedate}][Analyze][error] Unable to analyze...`);
			vscode.window.showErrorMessage('Webnizer - Build Error');
		}, 15000);

		setTimeout(() => {
			outputChannel.appendLine(`[${localedate}][Build][info] Sucessful, build completed...`);
		}, 22000);


		vscode.window.withProgress({
			location: ProgressLocation.Window,
			title: "Webnizer building",
			cancellable: true
		}, (progress, token) => {
			token.onCancellationRequested(() => {
				console.log("User canceled the long running operation");
			});
		
			setTimeout(() => {
				progress.report({ increment: 0, message: "0% █ Starting ..." });
				vscode.window.showInformationMessage('Webnizer - Starting to build your project to Wasm');
				progress.report({ increment: 10, message: "10% █ Still going..." });
			}, 1000);
		
			setTimeout(() => {
				progress.report({ increment: 20, message: "20% ██ Still going..." });
			}, 5000);
		
			setTimeout(() => {
				progress.report({ increment: 50, message: "50% █████ Still going even more..." });
			}, 15000);
		
			setTimeout(() => {
				progress.report({ increment: 80, message: "80% █████████ Almost there..." });
			}, 20000);
		
			setTimeout(() => {
				progress.report({ increment: 100, message: "100% ███████████ Build completed." });
			}, 22000);
		
			const p = new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
						vscode.window.showInformationMessage('Webnizer - Build completed.')
				}, 22000);
			});
		
			return p;
		});
	
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);

}

// this method is called when your extension is deactivated
export function deactivate() {}
