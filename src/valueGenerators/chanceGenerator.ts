import {
  IValueGenerator,
  FileStringGenerator,
  LiteralGenerator,
  ArrayGenerator,
  PrimitiveGenerator,
  UnionGenerator,
  EnumGenerator
} from "../IValueGenerator";
import ts from "typescript";
import { printObject } from "./printObject";
import {
  matchesCity,
  matchesCountry,
  matchesDate,
  matchesEmail,
  matchesId,
  matchesLine,
  matchesName,
  matchesPhone,
  matchesPostcode,
  matcheslastName
} from "./matchers";

const wrapQuotes = (str: string) => `"${str}"`;

const generatePrimitive: PrimitiveGenerator = ({ kind, name }) => {
  if (kind === ts.SyntaxKind.StringKeyword) {
    if (matchesId(name)) {
      return `chance.guid()`;
    }
    if (matchesDate(name)) {
      return `chanceDate(chance)`;
    }
    if (matcheslastName(name)) {
      return `chance.first()`;
    }
    if (matchesName(name)) {
      return `chance.first()`;
    }
    if (matchesLine(name)) {
      return `chance.street()`;
    }
    if (matchesPostcode(name)) {
      return `chance.postcode()`;
    }
    if (matchesCity(name)) {
      return `chance.city()`;
    }
    if (matchesCountry(name)) {
      return `chance.country()`;
    }
    if (matchesPhone(name)) {
      return `chance.phone()`;
    }
    if (matchesEmail(name)) {
      return `chance.email()`;
    }
    return `chance.string()`;
  }
  if (kind === ts.SyntaxKind.NumberKeyword) {
    return `chance.integer({ min: 0, max: 50 })`;
  }

  if (kind === ts.SyntaxKind.BooleanKeyword) {
    return `chance.bool()`;
  }

  if (kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (kind === ts.SyntaxKind.UndefinedKeyword) {
    return undefined;
  }

  console.log(`Could not match kind ${kind}`);
  return `chance.guid()`;
};

const generateFileString: FileStringGenerator = ({
  value: fixture,
  interfaceName
}) => {
  const fixtureString = printObject(fixture);
  const pretext = `import Chance from "chance";

const chanceDate = (chance) => (chance.date({ max: new Date('2090-01-01'), min: new Date('1950-01-01')}) as Date).toISOString();

export const ${interfaceName}FixtureGenerator = (overrides: Partial<${interfaceName}>, chance?: InstanceType<typeof Chance>) => `;
  return `${pretext}(${fixtureString});`;
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

const generateArray: ArrayGenerator = ({ generateNode }) => {
  const nodeValue = generateNode();
  return [nodeValue];
};

const generateUnion: UnionGenerator = (values) => {
  return `chance.pickone([${values.map((v) => printObject(v)).join(", ")}])`;
};

const generateEnum: EnumGenerator = ({ enumName }) => {
  return `chance.pickone(Object.keys(${enumName}))`;
};

const chanceReplacer: IValueGenerator = {
  generatePrimitive,
  generateArray,
  generateEnum,
  generateFilename: (interfaceName) => `${interfaceName}.fixture.ts`,
  generateFileString,
  generateUnion,
  generateLiteral
};

export const chanceValueGeneratorBuilder = () => chanceReplacer;
