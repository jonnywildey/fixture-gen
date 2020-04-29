import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

export const findInterface = ({
  sourceFile,
  filename,
  interfaceName,
}: {
  sourceFile: ts.SourceFile;
  filename: string;
  interfaceName: string;
}) => {
  // filter for interface-like nodes
  const interfaces: InterfaceishNode[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      interfaces.push(node);
    }
  });
  if (interfaces.length === 0) {
    throw new Error(`No interfaces found in ${filename}`);
  }
  // find selected interface
  const interfaceNode = interfaces.find((i) => i.name.text === interfaceName);
  if (!interfaceNode) {
    throw new Error(`Could not find interface ${interfaceName} in ${filename}`);
  }
  return interfaceNode;
};
