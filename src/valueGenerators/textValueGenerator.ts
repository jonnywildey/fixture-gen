import Chance from "chance";
import {
  IValueGenerator,
  FileStringGenerator,
  LiteralGenerator,
  ArrayGenerator,
  EnumGenerator,
  PrimitiveGenerator
} from "../IValueGenerator";
import ts from "typescript";
import { printObject } from "./printObject";
import { AddChanceToFunction, IChance } from "./chanceTypes";

const wrapQuotes = (str: string) => `"${str}"`;

const matchesId = (name: string) => {
  return name.includes("Id") || name === "id";
};
const matcheslastName = (name: string) => {
  return name.includes("lastName");
};
const matchesName = (name: string) => {
  return name.toLowerCase().includes("name");
};
const matchesLine = (name: string) => {
  return name.toLowerCase().includes("line");
};
const matchesPostcode = (name: string) => {
  return name.toLowerCase().includes("postcode");
};
const matchesCity = (name: string) => {
  return name.toLowerCase().includes("city");
};
const matchesCountry = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return lowerCaseName.includes("country") || lowerCaseName.includes("nation");
};
const matchesPhone = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return (
    lowerCaseName.includes("phone") ||
    lowerCaseName.includes("mobile") ||
    lowerCaseName.includes("landline")
  );
};
const matchesEmail = (name: string) => {
  return name.toLowerCase().includes("email");
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

const generatePrimitive: AddChanceToFunction<PrimitiveGenerator> = ({
  kind,
  name,
  chance
}) => {
  if (kind === ts.SyntaxKind.StringKeyword) {
    if (matchesId(name)) {
      return wrapQuotes(chance.guid());
    }
    if (matchesDate(name)) {
      return wrapQuotes(
        (chance.date({
          max: new Date(2524608000000), // Latest year is 2050
          min: new Date(-631152000000) // Earliest year is 1950
        }) as Date).toISOString()
      );
    }
    if (matcheslastName(name)) {
      return wrapQuotes(chance.first());
    }
    if (matchesName(name)) {
      return wrapQuotes(chance.first());
    }
    if (matchesLine(name)) {
      return wrapQuotes(chance.street());
    }
    if (matchesPostcode(name)) {
      return wrapQuotes(chance.postcode());
    }
    if (matchesCity(name)) {
      return wrapQuotes(chance.city());
    }
    if (matchesCountry(name)) {
      return wrapQuotes(chance.country());
    }
    if (matchesPhone(name)) {
      return wrapQuotes(chance.phone());
    }
    if (matchesEmail(name)) {
      return wrapQuotes(chance.email());
    }
    return wrapQuotes(`${chance.word()} ${chance.word()}`);
  }
  if (kind === ts.SyntaxKind.NumberKeyword) {
    return chance.integer({ min: 0, max: 50 });
  }

  if (kind === ts.SyntaxKind.BooleanKeyword) {
    return chance.bool();
  }

  if (kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (kind === ts.SyntaxKind.UndefinedKeyword) {
    return undefined;
  }

  console.log(`Could not match kind ${kind}`);
  return wrapQuotes(chance.guid());
};

const generateFileString: FileStringGenerator = ({
  value: fixture,
  interfaceName
}) => {
  const fixtureString = printObject(fixture);
  return `export const ${interfaceName}Fixture = ${fixtureString};`;
};

const generateLiteral: LiteralGenerator = ({ kind, text }) => {
  if (kind === ts.SyntaxKind.StringLiteral) {
    return wrapQuotes(text);
  }
  if (kind === ts.SyntaxKind.NumericLiteral) {
    return Number(text);
  }
  return text;
};

const generateArray: AddChanceToFunction<ArrayGenerator> = ({
  generateNode,
  chance
}) => {
  const randomArrayLength = chance.integer({ min: 1, max: 3 });
  const array = new Array(randomArrayLength).fill("");
  return array.map(() => generateNode());
};

const generateEnum: AddChanceToFunction<EnumGenerator> = ({
  enumMembers,
  enumName,
  chance
}) => {
  const enumKeys: any[] = [];
  // TODO - kind of faking the symbol
  enumMembers.forEach((_value, key) => enumKeys.push(`${enumName}.${key}`));
  return chance.pickone(enumKeys);
};

const chanceReplacer = (chance: IChance): IValueGenerator => ({
  generatePrimitive: params => generatePrimitive({ chance, ...params }),
  generateFilename: interfaceName => `${interfaceName}.fixture.ts`,
  generateArray: params => generateArray({ chance, ...params }),
  generateUnion: values => chance.pickone(values),
  generateEnum: params => generateEnum({ chance, ...params }),
  generateFileString,
  generateLiteral
});

export const textValueGeneratorBuilder = (chance?: IChance) => {
  return chanceReplacer(chance ? chance : new Chance());
};
