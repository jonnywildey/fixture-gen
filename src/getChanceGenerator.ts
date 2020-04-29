import ts from "typescript";

import { InterfaceishNode } from "./interfaces";

import { generateFixture } from "./generateFixture";
import { chanceValueGeneratorBuilder } from "./valueGenerators/chanceGenerator";

export interface IGetChanceFixtureParams {
  filename: string;
  interfaceLine: string;
}

/* Get export interface identifiers */
export const getChanceFixture = ({
  filename,
  interfaceLine,
}: IGetChanceFixtureParams) => {
  const chanceValueGenerator = chanceValueGeneratorBuilder();

  // TODO - surely we can use the actual tsserver program?
  const program = ts.createProgram({
    rootNames: [filename],
    options: {},
  });
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();
  // filter for interface-like nodes
  const interfaces: InterfaceishNode[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      interfaces.push(node);
    }
  });
  if (interfaces.length === 0) {
    throw new Error(`No interfaces found in ${filename}`);
  }
  // find selected interface
  const interfaceNameTokens = interfaceLine.split(" ");
  const interfaceNode = interfaces.find((i) =>
    interfaceNameTokens.includes(i.name.text)
  );
  if (!interfaceNode) {
    throw new Error(`Could not find interface ${interfaceLine} in ${filename}`);
  }
  // Get Fixture
  const fixture = generateFixture({
    interfaceNode,
    typeChecker,
    valueGenerator: chanceValueGenerator,
  });
  const fixtureFilename = chanceValueGenerator.generateFilename(
    interfaceNode.name.text
  );
  const fixtureFile = chanceValueGenerator.generateFileString({
    value: fixture,
    interfaceName: interfaceNode.name.text,
  });

  return { fixtureFilename, fixtureFile, fixture };
};
