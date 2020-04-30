import ts from "typescript";

import { generateFixture } from "./generateFixture";
import { textValueGeneratorBuilder } from "./valueGenerators/textValueGenerator";
import { IChance } from "./valueGenerators/chanceTypes";
import { findInterface } from "./findInterface";

export interface IGetTextValueFixtureParams {
  filename: string;
  interfaceName: string;
  chance?: IChance;
}

/* Get export interface identifiers */
export const getTextValueFixture = ({
  filename,
  interfaceName,
  chance,
}: IGetTextValueFixtureParams) => {
  const textValueGenerator = textValueGeneratorBuilder(chance);

  const program = ts.createProgram({
    rootNames: [filename],
    options: {},
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();

  const interfaceNode = findInterface({ filename, sourceFile, interfaceName });
  const interfaceType = typeChecker.getTypeAtLocation(interfaceNode);

  const fixture = generateFixture({
    interfaceType,
    typeChecker,
    valueGenerator: textValueGenerator,
  });
  const fixtureFilename = textValueGenerator.generateFilename(interfaceName);
  const fixtureFile = textValueGenerator.generateFileString({
    value: fixture,
    interfaceName,
  });

  return { fixtureFilename, fixtureFile, fixture };
};
