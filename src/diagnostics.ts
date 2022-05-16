/*---------------------------------------------------------WEBNIZER
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

/** To demonstrate code actions associated with Diagnostics problems, this file provides a mock diagnostics entries. */

import * as vscode from "vscode";

/** Code that is used to associate diagnostic entries with code actions. */
export const WEBNIZER_MENTION = "webnizer_mention";

/** String to detect in the text document. */
const WEBNIZER = "webnizer";

/**
 * Analyzes the text document for problems.
 * This demo diagnostic problem provider finds all mentions of 'webnizer'.
 * @param doc text document to analyze
 * @param webnizerDiagnostics diagnostic collection
 */
export function refreshDiagnostics(
  doc: vscode.TextDocument,
  webnizerDiagnostics: vscode.DiagnosticCollection
): void {
  const diagnostics: vscode.Diagnostic[] = [];

  for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
    const lineOfText = doc.lineAt(lineIndex);
    if (lineOfText.text.includes(WEBNIZER)) {
      diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex, 0));
			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex, 1));
			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex, 2));
			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex, 3));
    }
  }

  webnizerDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnostic(
  doc: vscode.TextDocument,
  lineOfText: vscode.TextLine,
  lineIndex: number,
  diagnosticType: number
): vscode.Diagnostic {
  // find where in the line of that the 'webnizer' is mentioned
  const index = lineOfText.text.indexOf(WEBNIZER);

  // create range that represents, where in the document the word is
  const range = new vscode.Range(
    lineIndex,
    index,
    lineIndex,
    index + WEBNIZER.length
  );

  let dtype = vscode.DiagnosticSeverity.Hint;
  switch (diagnosticType) {
    case 0:
      dtype = vscode.DiagnosticSeverity.Hint;
      break;
    case 1:
      dtype = vscode.DiagnosticSeverity.Information;
      break;
    case 2:
      dtype = vscode.DiagnosticSeverity.Warning;
      break;
    case 3:
      dtype = vscode.DiagnosticSeverity.Error;
      break;
    default:
      dtype = vscode.DiagnosticSeverity.Information;
      break;
  }

  const diagnostic = new vscode.Diagnostic(
    range,
    "When you say 'webnizer', do you want to find out more?",
    dtype
  );
  diagnostic.code = WEBNIZER_MENTION;
  return diagnostic;
}

export function subscribeToDocumentChanges(
  context: vscode.ExtensionContext,
  webnizerDiagnostics: vscode.DiagnosticCollection
): void {
  if (vscode.window.activeTextEditor) {
    refreshDiagnostics(
      vscode.window.activeTextEditor.document,
      webnizerDiagnostics
    );
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        refreshDiagnostics(editor.document, webnizerDiagnostics);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      refreshDiagnostics(e.document, webnizerDiagnostics)
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) =>
      webnizerDiagnostics.delete(doc.uri)
    )
  );
}
