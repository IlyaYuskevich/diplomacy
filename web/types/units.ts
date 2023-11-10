import { signal } from "@preact/signals";
import { ProvinceCode } from "types/provinces.ts";
import { Enums } from "lib/database.types.ts";

export interface IUnitLocation {
    X: number
    Y: number
  }
  
export type UnitType = Enums<"UnitType">

export interface IUnit {
  province: ProvinceCode
  unitType: UnitType
}

export const selectedUnit = signal<IUnit | null>(null)
export const unitLocationsMap = signal<Record<string, IUnitLocation> | null>(null)