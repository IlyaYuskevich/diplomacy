import { signal } from "@preact/signals";

export interface IUnitLocation {
    X: number
    Y: number
  }
  
  export enum UnitType {
    A = "Army",
    F = "Fleet"
  }
  
  export interface IUnit {
    province: string
    type: UnitType
    country: string
  }

export const units = signal<IUnit[]>([{province: "Ion", type: UnitType.F, country: "Germany" }]);