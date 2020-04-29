import Chance from "chance";
import { getChanceFixture } from "../getChanceGenerator";

describe("getChanceFixture Tests", () => {
  it("Returns correct values for ITestInterface", () => {
    const chance = Chance(6);

    const fixture = getChanceFixture({
      filename:
        "/Users/jonny/trussle/fixture-gen/src/testInterfaces/ITestInterface.ts",
      interfaceLine: "ITestInterface",
      chance
    });
    expect(fixture.fixture).toEqual({
      a: "chance.string()",
      b: "chance.integer({ min: 0, max: 50 })",
      c: "chance.bool()",
      d: {
        e: "chance.integer({ min: 0, max: 50 })",
        f: "chance.string()",
      },
      g: ["chance.integer({ min: 0, max: 50 })"],
      h: ["chance.string()"],
      i: "IColor.GREEN",
      j: {
        color: "IColor.GREEN",
        height: "chance.integer({ min: 0, max: 50 })",
        width: "chance.integer({ min: 0, max: 50 })",
      },
      k: {
        color: "IColor.RED",
        radius: "chance.integer({ min: 0, max: 50 })",
      },
      l: [
        {
          color: "IColor.RED",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })"
        }
      ],
      m: [
        {
          color: "IColor.GREEN",
          radius: "chance.integer({ min: 0, max: 50 })"
        }
      ],
      n: {
        box: {
          color: "IColor.RED",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })",
        },
      },
      o: "chance.string()",
      p: "chance.string()",
      q: null,
      r: '"GREEN"',
      s: '"HOT_WATER"',
      t: '"BLUE"'
    });
  });
});
