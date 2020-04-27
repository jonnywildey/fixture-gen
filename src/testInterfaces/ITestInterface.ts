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
  i: IColor;
  j: IBox;
  k: ISphere;
  l: IBox[];
  // tslint:disable-next-line: array-type
  m: Array<ISphere>;
  n: IBoxHolder;
  o: string | null;
  p: string | undefined;
  q: null;
  r: InlineColor
}

export type InlineColor = "GREEN" | "BLUE" | "INDIGO";

export interface IBox {
  color: IColor;
  height: number;
  width: number;
}

export interface IBoxHolder {
  box: IBox;
}

export type ISphere = {
  color: IColor;
  radius: number;
};

export enum IColor {
  RED = "RED",
  ORANGE = "ORANGE",
  GREEN = "GREEN",
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
