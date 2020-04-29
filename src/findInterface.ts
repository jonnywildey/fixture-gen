import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

export const findInterface = ({
  sourceFile,
  filename,
  interfaceLine
}: {
  sourceFile: ts.SourceFile;
  filename: string;
  interfaceLine: string;
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
  const interfaceNameTokens = interfaceLine.split(" ");
  const interfaceNode = interfaces.find((i) =>
    interfaceNameTokens.includes(i.name.text)
  );
  if (!interfaceNode) {
    throw new Error(`Could not find interface ${interfaceLine} in ${filename}`);
  }
  return interfaceNode;
};
