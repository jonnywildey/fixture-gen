import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

import { generateFixture } from "./generateFixture";
import { textValueGeneratorBuilder } from "./valueGenerators/textValueGenerator";

const textValueGenerator = textValueGeneratorBuilder();

/* Get export interface identifiers */
export const getTextFixture = (filename: string) => {
  const program = ts.createProgram({
    rootNames: [filename],
    options: {},
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();

  const interfaces: InterfaceishNode[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      interfaces.push(node);
    }
  });

  const fixture = generateFixture({
    interfaceNode: interfaces[0],
    typeChecker,
    valueGenerator: textValueGenerator,
  });

  return fixture;
};
