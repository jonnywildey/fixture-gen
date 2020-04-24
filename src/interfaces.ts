import ts from "typescript";

export type InterfaceishNode =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration;

export type InterfacePropertyNode =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration
  | ts.PropertySignature;

export type ValueGenerator = (params: {
  node: any;
  typeChecker: ts.TypeChecker;
}) => any;
