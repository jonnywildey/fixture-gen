"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { dirname, join } from "path";
import { getTextValueFixture } from "./getTextValueFixture";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      "typescript",
      new TsFixtureGenerator(),
      {
        providedCodeActionKinds: TsFixtureGenerator.providedCodeActionKinds
      }
    )
  );

  const fixtureDiagnostics = vscode.languages.createDiagnosticCollection(
    "ts-fixture-generator"
  );
  context.subscriptions.push(fixtureDiagnostics);
}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class TsFixtureGenerator implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const line = document.lineAt(range.start.line).text;

    if (line.includes("interface")) {
      const fix = new vscode.CodeAction(
        `Generate Fixture`,
        vscode.CodeActionKind.RefactorExtract
      );
      fix.edit = new vscode.WorkspaceEdit();
      try {
        // Get Fixture
        const { fixtureFile, fixtureFilename } = getTextValueFixture({
          filename: document.uri.path,
          interfaceLine: line
        });
        // Create New File
        const newPath = join(dirname(document.uri.path), fixtureFilename);
        const newUri = document.uri.with({ path: newPath });
        fix.edit.createFile(newUri, {
          ignoreIfExists: true
        });
        fix.edit.insert(newUri, new vscode.Position(0, 0), fixtureFile);
      } catch (error) {
        console.error(error);
      }
      return [fix];
    }

    return [];
  }
}

// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
//   console.log("fixture-gen extension activated!");

//   const provider1 = vscode.languages.registerCodeActionsProvider("typescript", {
//     provideCodeActions: async (
//       document: vscode.TextDocument,
//       range: vscode.Range | vscode.Selection,
//       context: vscode.CodeActionContext,
//       token: vscode.CancellationToken
//     ) => {
//    const diagnostic: vscode.Diagnostic = context.diagnostics[0];
//       return [
//         {
//           title: "Test 1",
//           command: "Run",
//           arguments: [document, diagnostic.range, diagnostic.message]
//         }
//       ];
//     },
//   });

//   context.subscriptions.push(provider1);
// }

// // this method is called when your extension is deactivated
// export function deactivate() {}
