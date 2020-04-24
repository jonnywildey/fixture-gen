import ts from "typescript";

export type InterfaceishNode =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration;

export type InterfacePropertyNode =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration
  | ts.PropertySignature;

export type PrimitiveGenerator = (params: {
  kind: ts.SyntaxKind;
  name: string;
}) => any;


export interface IValueGenerator {
  generateArrayLength: () => number;
  selectFromArray: <T>(array: Array<T>) => T;
  generatePrimitive: PrimitiveGenerator;

}
