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
  kind,
  name,
}) => {
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
