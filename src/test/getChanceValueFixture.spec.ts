import { getChanceFixture } from "../getChanceGenerator";
import path from "path";

describe("getChanceFixture Tests", () => {
  const testInterfaceAbsolutePath = path.join(
    __dirname,
    "../",
    "testInterfaces",
    "ITestInterface.ts"
  );

  it("Returns correct values for ITestInterface", () => {
    const fixture = getChanceFixture({
      filename: testInterfaceAbsolutePath,
      interfaceName: "ITestInterface",
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
      i: "chance.pickone(Object.keys(IColor))",
      j: {
        color: "chance.pickone(Object.keys(IColor))",
        height: "chance.integer({ min: 0, max: 50 })",
        width: "chance.integer({ min: 0, max: 50 })",
      },
      k: {
        color: "chance.pickone(Object.keys(IColor))",
        radius: "chance.integer({ min: 0, max: 50 })",
      },
      l: [
        {
          color: "chance.pickone(Object.keys(IColor))",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })",
        },
      ],
      m: [
        {
          color: "chance.pickone(Object.keys(IColor))",
          radius: "chance.integer({ min: 0, max: 50 })",
        },
      ],
      n: {
        box: {
          color: "chance.pickone(Object.keys(IColor))",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })",
        },
      },
      o: "chance.pickone([chance.string(), null])",
      p: "chance.pickone([chance.string(), undefined])",
      q: null,
      r: 'chance.pickone(["GREEN", "BLUE", "INDIGO"])',
      s: 'chance.pickone(["TEA", "COFFEE", "HOT_WATER"])',
      t: `chance.pickone([5, "BLUE", {
  color: chance.pickone(Object.keys(IColor)),
  height: chance.integer({ min: 0, max: 50 }),
  width: chance.integer({ min: 0, max: 50 })
}])`,
    });
  });

  it("Returns correct values for IExtendTestInterface, including extended properties", () => {
    const fixture = getChanceFixture({
      filename: testInterfaceAbsolutePath,
      interfaceName: "IExtendTestInterface",
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
      i: "chance.pickone(Object.keys(IColor))",
      j: {
        color: "chance.pickone(Object.keys(IColor))",
        height: "chance.integer({ min: 0, max: 50 })",
        width: "chance.integer({ min: 0, max: 50 })",
      },
      k: {
        color: "chance.pickone(Object.keys(IColor))",
        radius: "chance.integer({ min: 0, max: 50 })",
      },
      l: [
        {
          color: "chance.pickone(Object.keys(IColor))",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })",
        },
      ],
      m: [
        {
          color: "chance.pickone(Object.keys(IColor))",
          radius: "chance.integer({ min: 0, max: 50 })",
        },
      ],
      n: {
        box: {
          color: "chance.pickone(Object.keys(IColor))",
          height: "chance.integer({ min: 0, max: 50 })",
          width: "chance.integer({ min: 0, max: 50 })",
        },
      },
      o: "chance.pickone([chance.string(), null])",
      p: "chance.pickone([chance.string(), undefined])",
      q: null,
      r: 'chance.pickone(["GREEN", "BLUE", "INDIGO"])',
      s: 'chance.pickone(["TEA", "COFFEE", "HOT_WATER"])',
      t: `chance.pickone([5, "BLUE", {
  color: chance.pickone(Object.keys(IColor)),
  height: chance.integer({ min: 0, max: 50 }),
  width: chance.integer({ min: 0, max: 50 })
}])`,
      z: "chance.string()",
    });
  });

  it("Returns correct values for IStringProperties", () => {
    const fixture = getChanceFixture({
      filename: testInterfaceAbsolutePath,
      interfaceName: "IStringProperties",
    });
    expect(fixture.fixture).toEqual({
      city: "chance.city()",
      country: "chance.country()",
      createdOn: "chanceDate(chance)",
      email: "chance.email()",
      firstName: "chance.first()",
      id: "chance.guid()",
      lastName: "chance.first()",
      line1: "chance.street()",
      line2: "chance.street()",
      phone: "chance.phone()",
      postcode: "chance.postcode()",
    });
  });
});
