import Chance from "chance";
import { IValueGenerator, FileStringGenerator } from "../interfaces";
import ts from "typescript";

export type IChance = InstanceType<typeof Chance>;

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
    if (matcheslastName(name)) {
      return chance.first();
    }
    if (matchesName(name)) {
      return chance.first();
    }
    if (matchesLine(name)) {
      return chance.street();
    }
    if (matchesPostcode(name)) {
      return chance.postcode();
    }
    if (matchesCity(name)) {
      return chance.city();
    }
    if (matchesCountry(name)) {
      return chance.country();
    }
    if (matchesPhone(name)) {
      return chance.phone();
    }
    if (matchesEmail(name)) {
      return chance.email();
    }
    return `${chance.word()} ${chance.word()}`;
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
  return chance.guid();
};

const generateFileString: FileStringGenerator = ({
  fixture,
  interfaceName
}) => {
  const fixtureString = JSON.stringify(fixture, undefined, 2);
  return `export const ${interfaceName}Fixture = ${fixtureString};`
}

const chanceReplacer = (chance: IChance): IValueGenerator => ({
  generatePrimitive: params => generatePrimitive({ chance, ...params }),
  generateArrayLength: () => chance.integer({ min: 1, max: 3 }),
  selectFromArray: (array) => chance.pickone(array),
  generateFilename: (interfaceName) => `${interfaceName}.fixture.ts`,
  generateFileString
});

export const textValueGeneratorBuilder = (chance?: IChance) => {
  return chanceReplacer(chance ? chance : new Chance());
};
