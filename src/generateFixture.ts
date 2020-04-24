import { getInterfaceIdentifiers } from "./getInterfaceIdentifiers";
import { InterfacePropertyNode, ValueGenerator } from "./interfaces";
import { textValueGeneratorBuilder } from "./textValueGenerator";
import ts = require("typescript");

export const generateFixture = ({
  interfaceNode,
  valueGenerator,
  typeChecker,
}: {
  interfaceNode: InterfacePropertyNode;
  valueGenerator: ValueGenerator;
  typeChecker: ts.TypeChecker;
}) => {
  const fixtureObject: any = {};
  ts.forEachChild(interfaceNode, (node) => {
    if (ts.isPropertySignature(node)) {
      const name = (node.name as any).text;

      const hasMembers =
        node.type &&
        (node.type as any).members &&
        (node.type as any).members.length > 0;

      if (hasMembers) {
        fixtureObject[name] = generateFixture({
          interfaceNode: (node as any).type,
          valueGenerator,
          typeChecker,
        });
      } else {
        fixtureObject[name] = valueGenerator({ node, typeChecker });
      }
    }
  });
  return fixtureObject;
};
