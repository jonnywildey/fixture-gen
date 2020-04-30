import Chance from "chance";
import { IValue } from "../IValueGenerator";

export type IChance = InstanceType<typeof Chance>;

export type FirstParam<T> = T extends (params: infer U) => any ? U : any;
export type AddChanceToFunction<T> = (
  params: FirstParam<T> & { chance: IChance }
) => IValue;
