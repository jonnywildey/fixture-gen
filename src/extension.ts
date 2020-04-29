"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { dirname, join } from "path";
import { getTextValueFixture } from "./getTextValueFixture";
import { getChanceFixture  } from "./getChanceGenerator";

const TEXT_VALUE_COMMAND = "ts-fixture-generator.generate-text-value-fixture";
const CHANCE_VALUE_COMMAND = "ts-fixture-generator.generate-chance-fixture";

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

  context.subscriptions.push(
    vscode.commands.registerCommand(
      TEXT_VALUE_COMMAND,
      (document: vscode.TextDocument, line: string) => {
        const edit = new vscode.WorkspaceEdit();
        // Get Fixture
        const { fixtureFile, fixtureFilename } = getTextValueFixture({
          filename: document.uri.path,
          interfaceLine: line
        });
        // Create New File
        const newPath = join(dirname(document.uri.path), fixtureFilename);
        const newUri = document.uri.with({ path: newPath });
        edit.createFile(newUri, {
          ignoreIfExists: true
        });
        edit.insert(newUri, new vscode.Position(0, 0), fixtureFile);
        vscode.workspace.applyEdit(edit);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      CHANCE_VALUE_COMMAND,
      (document: vscode.TextDocument, line: string) => {
        const edit = new vscode.WorkspaceEdit();
        // Get Fixture
        const { fixtureFile, fixtureFilename } = getChanceFixture({
          filename: document.uri.path,
          interfaceLine: line
        });
        // Create New File
        const newPath = join(dirname(document.uri.path), fixtureFilename);
        const newUri = document.uri.with({ path: newPath });
        edit.createFile(newUri, {
          ignoreIfExists: true
        });
        edit.insert(newUri, new vscode.Position(0, 0), fixtureFile);
        vscode.workspace.applyEdit(edit);
      }
    )
  );
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

    if (line.includes("interface") || line.includes("type")) {

      const chanceAction = new vscode.CodeAction(
        `Generate Chance Fixture`,
        vscode.CodeActionKind.RefactorExtract
      );
      chanceAction.command = {
        arguments: [document, line],
        command: CHANCE_VALUE_COMMAND,
        title: `Generate Chance Fixture`,
        tooltip:
          "This will create a fixture generator of the interface using chance.js",
      };

      const fixtureAction = new vscode.CodeAction(
        `Generate Fixture`,
        vscode.CodeActionKind.RefactorExtract
      );
      fixtureAction.command = {
        arguments: [document, line],
        command: TEXT_VALUE_COMMAND,
        title: `Generate Fixture`,
        tooltip:
          "This will create a fixture of the interface or type with random values",
      };


      return [fixtureAction, chanceAction];
    }

    return [];
  }
}
