import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

/* Get export interface identifiers */
export const getInterfaceIdentifiers = (filename: string) => {
  const program = ts.createProgram({
    rootNames: [filename],
    options: {}
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();

  const interfaces: InterfaceishNode[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      interfaces.push(node);
    }
  });

  return {
    interfaces,
    typeChecker
  };
};
