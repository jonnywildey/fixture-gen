export interface ITestInterface {
  a: string;
  b: number;
  c: boolean;
  d: {
    e: number;
    f: string;
  };
  g: number[];
  // tslint:disable-next-line: array-type
  h: Array<string>;
  i: ITestEnum;
}

export enum ITestEnum {
  RED = "RED",
  ORANGE = "ORANGE",
  GREEN = "GREEN"
}

// tslint:disable-next-line: interface-over-type-literal
export type ITestType = {
  a: string;
  b: number;
  c: boolean;
  d: {
    e: number;
    f: string;
  };
};

export interface IExtendTestInterface extends ITestInterface {
  z: string;
}
