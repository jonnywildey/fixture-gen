import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

import { generateFixture } from "./generateFixture";
import { textValueGeneratorBuilder } from "./valueGenerators/textValueGenerator";

import * as vscode from "vscode";

const textValueGenerator = textValueGeneratorBuilder();

export interface IGetTextValueFixtureParams {
  filename: string;
  interfaceLine: string;
}

/* Get export interface identifiers */
export const getTextValueFixture = ({
  filename,
  interfaceLine,
}: IGetTextValueFixtureParams) => {
  // TODO - surely we can use the actual tsserver program?
  const program = ts.createProgram({
    rootNames: [filename],
    options: {}
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();
  // filter for interface-like nodes
  const interfaces: InterfaceishNode[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      interfaces.push(node);
    }
  });
  // find selected interface
  const interfaceNameTokens = interfaceLine.split(" ");
  const interfaceNode = interfaces.find(i =>
    interfaceNameTokens.includes(i.name.text)
  );
  if (!interfaceNode) {
    throw new Error(`Could not find interface ${interfaceLine} in ${filename}`);
  }
  // Get Fixture
  const fixture = generateFixture({
    interfaceNode,
    typeChecker,
    valueGenerator: textValueGenerator
  });
  const fixtureFilename = textValueGenerator.generateFilename(interfaceNode.name.text);
  const fixtureFile = textValueGenerator.generateFileString({
    fixture,
    interfaceName: interfaceNode.name.text
  });

  return { fixtureFilename, fixtureFile };
};
