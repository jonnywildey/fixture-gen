import { InterfacePropertyNode, IValueGenerator } from "../interfaces";
import ts from "typescript";

export type IFixtureObject = any;

export const generateFixture = ({
  interfaceNode,
  valueGenerator,
  typeChecker
}: {
  interfaceNode: InterfacePropertyNode;
  valueGenerator: IValueGenerator;
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
  valueGenerator,
}: {
  node: ts.PropertySignature;
  name: string;
  kind: ts.SyntaxKind;
  typeChecker: ts.TypeChecker;
  valueGenerator: IValueGenerator;
}): IFixtureObject => {
  try {
    // Check whether property contains explicit sub properties
    const hasMembers =
      node.type &&
      (node.type as any).members &&
      (node.type as any).members.length > 0;

    if (hasMembers) {
      return generateFixture({
        interfaceNode: (node as any).type,
        valueGenerator,
        typeChecker,
      });
    }

    // Check for string[] array definitions
    // TODO - work out how to combine with other array
    if (kind === ts.SyntaxKind.ArrayType) {
      const randomArrayLength = valueGenerator.generateArrayLength();
      const elementKind = (node.type as any).elementType.kind;
      const elementType = (node.type as any).elementType;
      const elementNode = typeChecker.getTypeFromTypeNode(elementType);
      const array = new Array(randomArrayLength).fill("");
      // Basic type, can skip recursion
      if ((elementNode as any).intrinsicName) {
        return array.map(() =>
          valueGenerator.generatePrimitive({
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
      const allTypes = unionTypes.map((unionType) =>
        generateNodeValue({
          kind: unionType.kind,
          name,
          node: unionType,
          typeChecker,
          valueGenerator,
        })
      );
      return valueGenerator.selectFromArray(allTypes);
    }

    // Is a reference to some other type
    if (kind === ts.SyntaxKind.TypeReference) {
      const type = typeChecker.getTypeAtLocation(node);
      const typeDeclaration =
        type.symbol && type.symbol.declarations && type.symbol.declarations[0];

      const nodeType = node.type as any;

      // Check for Array<string>
      if (nodeType && nodeType.typeName && nodeType.typeName.text === "Array") {
        const randomArrayLength = valueGenerator.generateArrayLength();
        const elementType = typeChecker.getTypeAtLocation(
          nodeType.typeArguments[0]
        );
        const elementKind = nodeType.typeArguments[0].kind;
        const array = new Array(randomArrayLength).fill("");
        // Basic type, can skip recursion
        if ((elementType as any).intrinsicName) {
          return array.map(() =>
            valueGenerator.generatePrimitive({ name, kind: elementKind })
          );
        }
        const elementNode = elementType.aliasSymbol!.declarations[0];
        return array.map(() =>
          generateNodeValue({
            valueGenerator,
            node: elementNode as any,
            name,
            kind: elementKind,
            typeChecker,
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
        enumMembers.forEach((_value, key) =>
          enumKeys.push(`${enumName}.${key}`)
        );
        return valueGenerator.selectFromArray(enumKeys);
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
          valueGenerator,
        });
      }
    }

    // property is a primitive type
    return valueGenerator.generatePrimitive({ name, kind });
  } catch (err) {
    console.log(`Error generating fixture for name ${name} kind ${kind}`)
    console.error(err);
    // return something
    return "";
  }
};
