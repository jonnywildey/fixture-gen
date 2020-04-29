import Chance from "chance";
import {
  IValueGenerator,
  FileStringGenerator,
  LiteralGenerator,
  ArrayGenerator,
} from "../interfaces";
import ts from "typescript";
import { printObject } from "./printObject";

export type IChance = InstanceType<typeof Chance>;

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

const generatePrimitive = ({
  kind,
  name,
  chance
}: {
  kind: ts.SyntaxKind;
  name: string;
  chance: IChance;
}) => {
  if (kind === ts.SyntaxKind.StringKeyword) {
    if (matchesId(name)) {
      return `chance.guid()`;
    }
    if (matchesDate(name)) {
      return `chance.date({ max: new Date('2090-01-01'), min: new Date('1950-01-01')}) as Date).toISOString()`;
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
  fixture,
  interfaceName,
}) => {
  const fixtureString = printObject(fixture);
  const pretext = `import Chance from "chance";
import { ${interfaceName} } from './${interfaceName}'
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

const generateArray: ArrayGenerator = ({
  generateNode,
}) => {
  const nodeValue = generateNode();
  return [nodeValue];
};

const chanceReplacer = (chance: IChance): IValueGenerator => ({
  generatePrimitive: (params) => generatePrimitive({ chance, ...params }),
  generateArray,
  selectFromArray:array => chance.pickone(array),
  generateFilename:interfaceName => `${interfaceName}.fixture.ts`,
  generateFileString,
  generateLiteral,
});

export const chanceValueGeneratorBuilder = (chance?: IChance) => {
  return chanceReplacer(chance ? chance : new Chance());
};
