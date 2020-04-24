import Chance from "chance";
import { ValueGenerator } from "./interfaces";
import ts, { SyntaxKind } from "typescript";

export type IChance = InstanceType<typeof Chance>;

const matchesId = (name: string) => {
  return name.includes("Id");
};

const matchesDate = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return (
    lowerCaseName.includes("date") ||
    lowerCaseName.includes("time") ||
    name.includes("On") ||
    name.includes("At")
  );
};

const elementReplacer = ({
  kind,
  name,
  chance,
}: {
  kind: ts.SyntaxKind;
  name: string;
  chance: IChance;
}) => {
  if (kind === ts.SyntaxKind.StringKeyword) {
    if (matchesId(name)) {
      return chance.guid();
    }
    if (matchesDate(name)) {
      return (chance.date({
        max: new Date(2524608000000), // Latest year is 2050
        min: new Date(-631152000000), // Earliest year is 1950
      }) as Date).toISOString();
    }
    return chance.word();
  }
  if (kind === ts.SyntaxKind.NumberKeyword) {
    return chance.integer({ min: 0, max: 50 });
  }

  if (kind === ts.SyntaxKind.BooleanKeyword) {
    return chance.bool();
  }

  console.log(`Could not match kind ${kind}`);
  return chance.guid();
};

const chanceReplacer = (chance: IChance): ValueGenerator => ({
  node,
  typeChecker,
}) => {
  if (!node.type) {
    return;
  }
  const kind: ts.SyntaxKind = node.type.kind;
  const name: string = node.name.text;

  if (kind === ts.SyntaxKind.ArrayType) {
    const randomArrayLength = chance.integer({ min: 1, max: 3 });
    const elementKind = node.type.elementType.kind;
    const array = new Array(randomArrayLength).fill("");
    return array.map(() =>
      elementReplacer({
        chance,
        kind: elementKind,
        name,
      })
    );
  }

  if (kind === ts.SyntaxKind.TypeReference) {
    const typeName = node.type.typeName && node.type.typeName.text;
    if (typeName === "Array") {
      const randomArrayLength = chance.integer({ min: 1, max: 3 });
      const elementKind = node.type.typeArguments[0].kind;
      const array = new Array(randomArrayLength).fill("");
      return array.map(() =>
        elementReplacer({
          chance,
          kind: elementKind,
          name,
        })
      );
    }
    const type = typeChecker.getTypeAtLocation(node);
    const typeDeclaration =
      type.symbol.declarations && type.symbol.declarations[0];
    if (
      typeDeclaration &&
      typeDeclaration.kind === ts.SyntaxKind.EnumDeclaration
    ) {
      const enumMembers = type.symbol.exports!;
      const enumKeys: any[] = [];
      enumMembers.forEach((_value, key) => enumKeys.push(key));
      return chance.pickone(enumKeys);
    }
    return "?";
  }

  return elementReplacer({
    kind,
    name,
    chance,
  });
};

export const textValueGeneratorBuilder = (seed?: number) => {
  const chance = seed ? new Chance(seed) : new Chance();

  return chanceReplacer(chance);
};
