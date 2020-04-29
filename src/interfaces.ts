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

export type LiteralGenerator = (params: {
  kind: ts.SyntaxKind;
  text: string;
}) => any;

export type FileStringGenerator = (params: {
  fixture: any;
  interfaceName: string;
}) => string;

export type ArrayGenerator = (params: {
  generateNode: () => any;
  name: string;
  kind: ts.SyntaxKind;
}) => any;

export interface IValueGenerator {
  generateArray: ArrayGenerator;
  selectFromArray: <T>(array: Array<T>) => T;
  generateLiteral: LiteralGenerator;
  generatePrimitive: PrimitiveGenerator;
  generateFilename: (interfaceName: string) => string;
  generateFileString: FileStringGenerator;
}
