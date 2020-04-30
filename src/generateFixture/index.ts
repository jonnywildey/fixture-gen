import { InterfacePropertyNode, InterfaceishNode } from "../interfaces";
import { IValueGenerator } from "../IValueGenerator";
import ts from "typescript";

export type IFixtureObject = any;

export const generateFixture = ({
  interfaceType,
  valueGenerator,
  typeChecker,
}: {
  interfaceType: ts.Type;
  valueGenerator: IValueGenerator;
  typeChecker: ts.TypeChecker;
}): IFixtureObject => {
  const fixtureObject: IFixtureObject = {};

  const properties = interfaceType.getProperties();

  properties.forEach((nodeProperty) => {
    const name = nodeProperty.name;
    const node = nodeProperty.valueDeclaration || nodeProperty.declarations[0];
    if (!ts.isPropertySignature(node)) {
      return;
    }
    fixtureObject[name] = generateNodeValue({
      name,
      kind: node.type!.kind,
      node,
      typeChecker,
      valueGenerator,
    });
  });
  return fixtureObject;
};

export const generateObject = ({
  interfaceNode,
  valueGenerator,
  typeChecker,
}: {
  interfaceNode: InterfaceishNode;
  valueGenerator: IValueGenerator;
  typeChecker: ts.TypeChecker;
}): IFixtureObject => {
  const fixtureObject: IFixtureObject = {};

  ts.forEachChild(interfaceNode, (node) => {
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
      valueGenerator,
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
      return generateObject({
        interfaceNode: (node as any).type,
        valueGenerator,
        typeChecker,
      });
    }

    // Check for type[] array definitions
    if (kind === ts.SyntaxKind.ArrayType) {
      const elementKind = (node.type as any).elementType.kind;
      const elementType = (node.type as any).elementType;

      const generateNode = () =>
        generateNodeValue({
          valueGenerator,
          node: elementType,
          name,
          kind: elementKind,
          typeChecker,
        });

      return valueGenerator.generateArray({
        generateNode,
        name,
        kind,
      });
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
      return valueGenerator.generateUnion(allTypes);
    }

    // Check for literal
    if (kind === ts.SyntaxKind.LiteralType) {
      return valueGenerator.generateLiteral({
        kind: (node as any).literal.kind,
        text: (node as any).literal.text,
      });
    }

    // Is a reference to some other type
    if (kind === ts.SyntaxKind.TypeReference) {
      const type = typeChecker.getTypeAtLocation(node);
      const typeDeclaration =
        type.symbol && type.symbol.declarations && type.symbol.declarations[0];

      const nodeType = node.type as any;

      // Check for Array<string>
      if (nodeType && nodeType.typeName && nodeType.typeName.text === "Array") {
        const elementType = typeChecker.getTypeAtLocation(
          nodeType.typeArguments[0]
        );
        const elementKind = nodeType.typeArguments[0].kind;
        // node is either aliased (non primitive) or in typeArguments (primitive)
        const elementNode = elementType?.aliasSymbol?.declarations[0]
          ? elementType.aliasSymbol.declarations[0]
          : nodeType;

        const generateNode = () =>
          generateNodeValue({
            valueGenerator,
            node: elementNode,
            name,
            kind: elementKind,
            typeChecker,
          });

        return valueGenerator.generateArray({
          generateNode,
          name,
          kind,
        });
      }

      // Check for Enums
      if (
        typeDeclaration &&
        typeDeclaration.kind === ts.SyntaxKind.EnumDeclaration
      ) {
        const enumMembers = type.symbol.exports!;
        const enumName = type.symbol.name;

        return valueGenerator.generateEnum({
          enumName,
          enumMembers,
        });
      }
      // Check for other interfaces / types
      if (
        (typeDeclaration &&
          typeDeclaration.kind === ts.SyntaxKind.InterfaceDeclaration) ||
        (typeDeclaration && typeDeclaration.kind === ts.SyntaxKind.TypeLiteral)
      ) {
        const interfaceNode = type.symbol.declarations[0] as any;
        return generateObject({
          interfaceNode,
          typeChecker,
          valueGenerator,
        });
      }

      // Maybe type only has aliasSymbol?
      const typeAliasDeclaration =
        type.aliasSymbol &&
        type.aliasSymbol.declarations &&
        type.aliasSymbol.declarations[0];
      if (
        typeAliasDeclaration &&
        typeAliasDeclaration.kind === ts.SyntaxKind.TypeAliasDeclaration
      ) {
        const types: any[] = (type.aliasSymbol!.declarations[0] as any).type
          .types;
        const values = types.map((t) =>
          generateNodeValue({
            kind: t.kind,
            name,
            node: t,
            typeChecker,
            valueGenerator,
          })
        );

        return valueGenerator.generateUnion(values);
      }
    }

    // property is a primitive type
    return valueGenerator.generatePrimitive({ name, kind });
  } catch (err) {
    console.log(`Error generating fixture for name ${name} kind ${kind}`);
    console.error(err);
    // return something
    return "";
  }
};
