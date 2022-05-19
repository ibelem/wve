// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ProgressLocation } from "vscode";
import { subscribeToDocumentChanges, WEBNIZER_MENTION } from "./diagnostics";
import * as fs from "fs";
import * as path from "path";
// import * as hw from 'ag-simple-hello-world-example';

const COMMAND = "code-actions-sample.command";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "webnizer" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("webnizer.ui", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    // hw.printMsg();
    vscode.window.showInformationMessage("Webnizer - Hello!");
  });

  let disposable2 = vscode.commands.registerCommand("webnizer.build", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    const date = new Date();
    const localedate = date.toLocaleTimeString();

    const outputChannel = vscode.window.createOutputChannel(`Webnier`);
    outputChannel.show(true);
    outputChannel.appendLine(`Webnier Building`);
    outputChannel.appendLine(
      `--------------------------------------------------------------------------------------`
    );

    const json  = fs.readFileSync(path.resolve(__dirname, "../resources/webnizerbuildlog.json"), "utf8");
    const obj = JSON.parse(json);
    for(let i of obj) {
     outputChannel.appendLine(`[${i.timestamp}] [${i.type}] [${i.phase}] ${i.msg}`)
      if(i.quickfix) {
        for(let j of i.quickfix) {
          outputChannel.appendLine(`                           [File ${j.file}] [Ln ${j.line}, Col ${j.column}] [Length ${j.length}]`);
          outputChannel.appendLine(`                           [Quickfix] Replace with: ${j.replacewith}`);
        }
      }
    }

    vscode.window.withProgress(
      {
        location: ProgressLocation.Window,
        title: "Webnizer building",
        cancellable: true,
      },
      (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled the long running operation");
        });

        setTimeout(() => {
          progress.report({ increment: 0, message: "0% █ Starting ..." });
          vscode.window.showInformationMessage(
            "Webnizer - Starting to build your project to Wasm"
          );
          progress.report({ increment: 10, message: "10% █ Still going..." });
        }, 1000);

        setTimeout(() => {
          progress.report({ increment: 20, message: "20% ██ Still going..." });
        }, 5000);

        setTimeout(() => {
          progress.report({
            increment: 50,
            message: "50% █████ Still going even more...",
          });
        }, 15000);

        setTimeout(() => {
          progress.report({
            increment: 80,
            message: "80% █████████ Almost there...",
          });
        }, 20000);

        setTimeout(() => {
          progress.report({
            increment: 100,
            message: "100% ███████████ Build completed.",
          });
        }, 22000);

        const p = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
            vscode.window.showInformationMessage("Webnizer - Build completed.");
          }, 22000);
        });

        return p;
      }
    );
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("cpp", new Webnizer(), {
      providedCodeActionKinds: Webnizer.providedCodeActionKinds,
    })
  );

  const webnizerDiagnostics =
    vscode.languages.createDiagnosticCollection("webnizer");
  context.subscriptions.push(webnizerDiagnostics);

  subscribeToDocumentChanges(context, webnizerDiagnostics);

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("cpp", new WebnizerInfo(), {
      providedCodeActionKinds: WebnizerInfo.providedCodeActionKinds,
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND, () =>
      vscode.env.openExternal(
        vscode.Uri.parse(
          "https://github.com/intel-innersource/applications.development.web.webnizer"
        )
      )
    )
  );

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * Provides code actions for converting :) to a smiley webnizer.
 */
export class Webnizer implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    if (!this.isAtStartOfSmiley(document, range)) {
      return;
    }

    const replaceWithFix = this.createFix(document, range, "web.webnizer");

    const replaceWithParentFix = this.createFix(
      document,
      range,
      "development.web.webnizer"
    );
    // Marking a single fix as `preferred` means that users can apply it with a
    // single keyboard shortcut using the `Auto Fix` command.

    const replaceWithNamespaceFix = this.createFix(
      document,
      range,
      "applications.development.web.webnizer"
    );
    replaceWithParentFix.isPreferred = true;

    const commandAction = this.createCommand();

    return [
      replaceWithFix,
      replaceWithParentFix,
      replaceWithNamespaceFix,
      commandAction,
    ];
  }

  private isAtStartOfSmiley(
    document: vscode.TextDocument,
    range: vscode.Range
  ) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return (
      line.text[start.character] === ":" &&
      line.text[start.character + 1] === ")"
    );
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    webnizer: string
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      `Convert to ${webnizer}`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.start.translate(0, 2)),
      webnizer
    );
    return fix;
  }

  private createCommand(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Learn more...",
      vscode.CodeActionKind.Empty
    );
    action.command = {
      command: COMMAND,
      title: "Learn more about webnizer",
      tooltip: "This will open the webnizer github page.",
    };
    return action;
  }
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class WebnizerInfo implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    // for each diagnostic entry that has the matching `code`, create a code action command
    return context.diagnostics
      .filter((diagnostic) => diagnostic.code === WEBNIZER_MENTION)
      .map((diagnostic) => this.createCommandCodeAction(diagnostic));
  }

  private createCommandCodeAction(
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Learn more...",
      vscode.CodeActionKind.QuickFix
    );
    action.command = {
      command: COMMAND,
      title: "Learn more about webnizer",
      tooltip: "This will open the webnizer github page.",
    };
    action.diagnostics = [diagnostic];
    action.isPreferred = true;
    return action;
  }
}
