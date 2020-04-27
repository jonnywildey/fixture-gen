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
      a: "ketbeun sim",
      b: 17,
      c: true,
      d: {
        e: 31,
        f: "zopefos aliituco"
      },
      g: [7, 40, 18],
      h: ["nincu he", "numarsor ijukizes", "wunu wecmas"],
      i: "IColor.GREEN",
      j: {
        color: "IColor.GREEN",
        height: 25,
        width: 14
      },
      k: {
        color: "IColor.ORANGE",
        radius: 9
      },
      l: [
        {
          color: "IColor.ORANGE",
          height: 41,
          width: 17
        }
      ],
      m: [
        {
          color: "IColor.GREEN",
          radius: 12
        },
        {
          color: "IColor.RED",
          radius: 20
        }
      ],
      n: {
        box: {
          color: "IColor.RED",
          height: 28,
          width: 43
        }
      },
      o: "rulvuv ti",
      p: "os romnoci",
      q: null,
      r: ""
    });
  });
});
