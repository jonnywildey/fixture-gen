import Chance from "chance";
import { getTextValueFixture } from "../getTextValueFixture";

describe("getTextValueFixture Tests", () => {
  it("Returns correct values for ITestInterface", () => {
    const chance = Chance(6);

    const fixture = getTextValueFixture({
      filename:
        "/Users/jonny/trussle/fixture-gen/src/testInterfaces/ITestInterface.ts",
      interfaceLine: "ITestInterface",
      chance,
    });
    expect(fixture.fixture).toEqual({
      a: `"ketbeun sim"`,
      b: 17,
      c: true,
      d: {
        e: 31,
        f: `"zopefos aliituco"`,
      },
      g: [7, 40, 18],
      h: [`"nincu he"`, `"numarsor ijukizes"`, `"wunu wecmas"`],
      i: "IColor.GREEN",
      j: {
        color: "IColor.GREEN",
        height: 25,
        width: 14,
      },
      k: {
        color: "IColor.ORANGE",
        radius: 9,
      },
      l: [
        {
          color: "IColor.ORANGE",
          height: 41,
          width: 17,
        },
      ],
      m: [
        {
          color: "IColor.GREEN",
          radius: 12,
        },
        {
          color: "IColor.RED",
          radius: 20,
        },
      ],
      n: {
        box: {
          color: "IColor.RED",
          height: 28,
          width: 43,
        },
      },
      o: `"rulvuv ti"`,
      p: `"os romnoci"`,
      q: null,
      r: `"GREEN"`,
      s: `"HOT_WATER"`,
      t: 5,
    });
  });

  it("Returns correct values for IExtendTestInterface, including extended properties", () => {
    const chance = Chance(6);

    const fixture = getTextValueFixture({
      filename:
        "/Users/jonny/trussle/fixture-gen/src/testInterfaces/ITestInterface.ts",
      interfaceLine: "IExtendTestInterface",
      chance,
    });
    expect(fixture.fixture).toEqual({
      a: '"tuzo hidwuw"',
      b: 41,
      c: true,
      d: {
        e: 21,
        f: '"ativoaj wimdazme"',
      },
      g: [42],
      h: ['"retzir ovehekzes"', '"wunu wecmas"', '"pemfikos me"'],
      i: "IColor.ORANGE",
      j: {
        color: "IColor.GREEN",
        height: 28,
        width: 31,
      },
      k: {
        color: "IColor.ORANGE",
        radius: 45,
      },
      l: [
        {
          color: "IColor.GREEN",
          height: 34,
          width: 42,
        },
        {
          color: "IColor.GREEN",
          height: 9,
          width: 24,
        },
      ],
      m: [
        {
          color: "IColor.ORANGE",
          radius: 24,
        },
        {
          color: "IColor.RED",
          radius: 20,
        },
      ],
      n: {
        box: {
          color: "IColor.GREEN",
          height: 37,
          width: 50,
        },
      },
      o: '"vidwema bik"',
      p: '"rardep ufa"',
      q: null,
      r: '"BLUE"',
      s: '"COFFEE"',
      t: 5,
      z: '"ketbeun sim"',
    });
  });
});
