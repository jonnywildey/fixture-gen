import { InterfacePropertyNode, ValueGenerator } from "./interfaces";
import ts = require("typescript");

export type IFixtureObject = any;

export const generateFixture = ({
  interfaceNode,
  valueGenerator,
  typeChecker
}: {
  interfaceNode: InterfacePropertyNode;
  valueGenerator: ValueGenerator;
  typeChecker: ts.TypeChecker;
}): IFixtureObject => {
  const fixtureObject: IFixtureObject = {};
  ts.forEachChild(interfaceNode,node => {
    if (!ts.isPropertySignature(node)) {
      return;
    }
    const name = (node.name as any).text;
    const kind: ts.SyntaxKind = (node.type as any).kind;

    fixtureObject[name] = generateNodeValue({
      name,
      kind,
      node,
      typeChecker,
      valueGenerator
    });
  });
  return fixtureObject;
};

const generateNodeValue = ({
  node,
  name,
  kind,
  typeChecker,
  valueGenerator
}: {
  node: ts.PropertySignature;
  name: string;
  kind: ts.SyntaxKind;
  typeChecker: ts.TypeChecker;
  valueGenerator: ValueGenerator;
}): IFixtureObject => {

  // Check whether property contains explicit sub properties
  const hasMembers =
    node.type &&
    (node.type as any).members &&
    (node.type as any).members.length > 0;

  if (hasMembers) {
    return generateFixture({
      interfaceNode: (node as any).type,
      valueGenerator,
      typeChecker
    });
  }

  // Check for string[] array definitions
  // TODO - work out how to combine with other array
  if (kind === ts.SyntaxKind.ArrayType) {
    const randomArrayLength = 3; // TODO - randomize
    const elementKind = (node.type as any).elementType.kind;
    const elementType = (node.type as any).elementType;
    const elementNode = typeChecker.getTypeFromTypeNode(elementType);
    const array = new Array(randomArrayLength).fill("");
    // Basic type, can skip recursion
    if ((elementNode as any).intrinsicName) {
      return array.map(() =>
        valueGenerator({
          name,
          kind: elementKind,
        })
      );
    }
    return array.map(() =>
      generateNodeValue({
        valueGenerator,
        node: elementType,
        kind: elementKind,
        name,
        typeChecker,
      })
    );
  }

  // Check for Union Types
  if (kind === ts.SyntaxKind.UnionType) {
    const unionTypes: any[] = (node as any).type.types;
    const allTypes = unionTypes.map( (unionType) => generateNodeValue({
      kind: unionType.kind,
      name,
      node: unionType,
      typeChecker,
      valueGenerator
    }) )
    // TODO - randomize
    return allTypes[0];
  }


  // Is a reference to some other type
  if (kind === ts.SyntaxKind.TypeReference) {

    const type = typeChecker.getTypeAtLocation(node);
    const typeDeclaration =
      type.symbol.declarations && type.symbol.declarations[0];

    const nodeType = node.type as any;

    // Check for Array<string>
    if (nodeType && nodeType.typeName && nodeType.typeName.text  === "Array") {
      const randomArrayLength = 3; // TODO - randomize
      const elementType = typeChecker.getTypeAtLocation(
        nodeType.typeArguments[0]
      );
      const elementKind = nodeType.typeArguments[0].kind;
      const array = new Array(randomArrayLength).fill("");
      // Basic type, can skip recursion
      if ((elementType as any).intrinsicName) {
        return array.map(() => valueGenerator({ name, kind: elementKind }));
      }
      const elementNode = elementType.aliasSymbol!.declarations[0];
      return array.map(() =>
        generateNodeValue({
          valueGenerator,
          node: elementNode as any,
          name,
          kind: elementKind,
          typeChecker
        })
      );
    }

    // Check for Enums
    if (
      typeDeclaration &&
      typeDeclaration.kind === ts.SyntaxKind.EnumDeclaration
    ) {
      const enumMembers = type.symbol.exports!;
      const enumName = type.symbol.name;
      const enumKeys: any[] = [];
      // TODO - kind of faking the symbol
      enumMembers.forEach((_value, key) => enumKeys.push(`${enumName}.${key}`));
      // TODO - randomize
      return enumKeys[0];
      // return chance.pickone(enumKeys);
    }
    // Check for other interfaces / types
    if (
      (typeDeclaration &&
        typeDeclaration.kind === ts.SyntaxKind.InterfaceDeclaration) ||
      typeDeclaration.kind === ts.SyntaxKind.TypeLiteral
    ) {
      const interfaceNode = type.symbol.declarations[0] as any;
      return generateFixture({
        interfaceNode,
        typeChecker,
        valueGenerator
      });
    }
    console.log(
      `could not find generator for type in node ${node}`
    );
    return "?";
  }

  // property is a basic type
  return valueGenerator({ name, kind });
};
