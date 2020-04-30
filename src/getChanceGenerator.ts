import ts from "typescript";

import { generateFixture } from "./generateFixture";
import { chanceValueGeneratorBuilder } from "./valueGenerators/chanceGenerator";
import { findInterface } from "./findInterface";

export interface IGetChanceFixtureParams {
  filename: string;
  interfaceName: string;
}

/* Get export interface identifiers */
export const getChanceFixture = ({
  filename,
  interfaceName,
}: IGetChanceFixtureParams) => {
  const chanceValueGenerator = chanceValueGeneratorBuilder();

  // TODO - surely we can use the actual tsserver program?
  const program = ts.createProgram({
    rootNames: [filename],
    options: {},
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();

  const interfaceNode = findInterface({ filename, sourceFile, interfaceName });
  const interfaceType = typeChecker.getTypeAtLocation(interfaceNode);

  // Get Fixture
  const fixture = generateFixture({
    interfaceType,
    typeChecker,
    valueGenerator: chanceValueGenerator,
  });
  const fixtureFilename = chanceValueGenerator.generateFilename(interfaceName);
  const fixtureFile = chanceValueGenerator.generateFileString({
    value: fixture,
    interfaceName,
  });

  return { fixtureFilename, fixtureFile, fixture };
};
