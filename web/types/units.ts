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
  unitType: UnitType
}

export const selectedUnit = signal<IUnit | null>(null)
export const unitLocationsMap = signal<Record<string, IUnitLocation> | null>(null)