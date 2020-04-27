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
      a: "`${chance.word()} ${chance.word()}`",
      b: "chance.integer({ min: 0, max: 50 })",
      c: "chance.bool()",
      d: {
        e: "chance.integer({ min: 0, max: 50 })",
        f: "`${chance.word()} ${chance.word()}`"
      },
      g: [
        "chance.integer({ min: 0, max: 50 })",
        "chance.integer({ min: 0, max: 50 })",
        "chance.integer({ min: 0, max: 50 })"
      ],
      h: [
        "`${chance.word()} ${chance.word()}`",
        "`${chance.word()} ${chance.word()}`",
        "`${chance.word()} ${chance.word()}`"
      ],
      i: "IColor.RED",
      j: {
        color: "IColor.RED",
        height: "chance.integer({ min: 0, max: 50 })",
        width: "chance.integer({ min: 0, max: 50 })"
      },
      k: {
        color: "IColor.GREEN",
        radius: "chance.integer({ min: 0, max: 50 })"
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
          color: "IColor.RED",
          radius: "chance.integer({ min: 0, max: 50 })"
        },
        {
          color: "IColor.GREEN",
          radius: "chance.integer({ min: 0, max: 50 })"
        }
      ],
      n: {
        box: {
          color: "IColor.ORANGE",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })"
        }
      },
      o: "`${chance.word()} ${chance.word()}`",
      p: undefined,
      q: null,
      r: '"BLUE"',
      s: '"COFFEE"',
      t: '"BLUE"',
    });
  });
});
