import { generateFixture } from "./generateFixture";
import { getInterfaceIdentifiers } from "./getInterfaceIdentifiers";
import { textValueGeneratorBuilder } from "./valueGenerators/textValueGenerator";

const filename = "/Users/jonny/trussle/fixture-gen/src/IComplexTestInterface.ts";
const interfaceName = "ITestInterface";

const textValueGenerator = textValueGeneratorBuilder();

const { interfaces, typeChecker } = getInterfaceIdentifiers(filename);


const fixture = generateFixture({
  interfaceNode: interfaces[0],
  typeChecker,
  valueGenerator: textValueGenerator,
});

console.log(JSON.stringify(fixture, undefined, 2));
