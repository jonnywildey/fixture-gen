import { writeFileSync } from "fs";
import * as ts from "typescript";

function getTypeProperties(node: ts.Node) {
  const propertyArray: ts.PropertyAssignment[] = [];
  ts.forEachChild(node, cn => {
    if (cn.kind === ts.SyntaxKind.TypeLiteral) {
      return propertyArray.push(...getInterfaceProperties(cn));
    }
  });
  return propertyArray;
}

function getArrayLiterals(node: ts.Node) {
  const literalArray: ts.Expression[] = [];
  ts.forEachChild(node, cn => {
    if (cn.kind === ts.SyntaxKind.ArrayType) {
      return literalArray.push(...getArrayInterfaceProperties(cn));
    }
  });
  return literalArray;
}

function getArrayInterfaceProperties(node: ts.Node) {
  const literalArray: ts.Expression[] = [];
  ts.forEachChild(node, cn => {
    const lit = getArrayLiteral(cn);
    if (lit) {
      literalArray.push(lit);
    }
  });
  return literalArray;
}

function getArrayLiteral(node: ts.Node) {
  const type = node.kind;
  switch (type) {
    case ts.SyntaxKind.NumberKeyword:
      return ts.createNumericLiteral("5");
    case ts.SyntaxKind.BooleanKeyword:
      return ts.createLiteral(true);
    case ts.SyntaxKind.TypeLiteral:
      return ts.createObjectLiteral(getTypeProperties(node));
    // case ts.SyntaxKind.ArrayType:
    //   return ts.createArrayLiteral([ts.createObjectLiteral(getArrayLiterals(node))])
    case ts.SyntaxKind.StringKeyword:
    default:
      return ts.createStringLiteral("b");
  }
}

function getInterfaceProperties(node: ts.Node) {
  const propertyArray: ts.PropertyAssignment[] = [];
  ts.forEachChild(node, cn => {
    const prop = getInterfacePropertyAssignment(cn);
    if (prop) {
      propertyArray.push(prop);
    }
  });
  return propertyArray;
}

function getInterfacePropertyAssignment(node: ts.Node) {
  if (node.kind !== ts.SyntaxKind.PropertySignature) {
    return undefined;
  }
  const name = (node as any).name;
  const type = (node as any).type.kind;
  switch (type) {
    case ts.SyntaxKind.NumberKeyword:
      return ts.createPropertyAssignment(name, ts.createNumericLiteral("5"));
    case ts.SyntaxKind.BooleanKeyword:
      return ts.createPropertyAssignment(name, ts.createLiteral(true));
    case ts.SyntaxKind.TypeLiteral:
      return ts.createPropertyAssignment(
        name,
        ts.createObjectLiteral(getTypeProperties(node))
      );
    case ts.SyntaxKind.ArrayType:
      return ts.createPropertyAssignment(
        name,
        ts.createArrayLiteral(getArrayLiterals(node))
      );
    case ts.SyntaxKind.StringKeyword:
    default:
      return ts.createPropertyAssignment(name, ts.createStringLiteral("b"));
  }
}

function generateFixture(node: ts.Node) {
  const name = (node as any).name;
  const fixtureName = ts.createIdentifier(`fixture${name.text}`);

  if (node.kind !== ts.SyntaxKind.InterfaceDeclaration) {
    throw new Error("Not interface");
  }

  const object = ts.createObjectLiteral(getInterfaceProperties(node), true);

  const variable = ts.createVariableDeclaration(
    fixtureName,
    (node as any).name,
    object
  );
  return ts.createVariableDeclarationList([variable], ts.NodeFlags.Const);
}

const sourceFile = ts.createSourceFile(
  "ITestInterface",
  `
interface ITestInterface {
  a: string;
  b: number;
  c: boolean;
  d: {
    e: number;
    f: string;
  };
  g: number[];
}
`,
  ts.ScriptTarget.Latest
);

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
});
const result = printer.printNode(
  ts.EmitHint.Unspecified,
  generateFixture(sourceFile.statements[0]),
  sourceFile
);

writeFileSync(`${__dirname}/../build/test.ts`, result);

console.log(result);
