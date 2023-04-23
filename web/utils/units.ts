import { signal } from "@preact/signals";

export interface IUnitLocation {
    X: number
    Y: number
  }
  
export enum UnitType {
  Army = "A",
  Fleet = "F"
}

export interface IUnit {
  province: string
  type: UnitType
  country: string
}

export const units = signal<IUnit[]>([{province: "Ber", type: UnitType.Army, country: "Germany" }]);