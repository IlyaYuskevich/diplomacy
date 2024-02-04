import { signal } from "@preact/signals";
import { ProvinceCode, isSea, isCoast } from "types/provinces.ts";
import { Enums } from "lib/database.types.ts";
  
export type UnitType = Enums<"UnitType">

export type Unit = {
  province: ProvinceCode
  unitType: UnitType
}

export const isFleet = (unit: Unit) => unit.unitType === "Fleet";
export const isFleetInSea = (unit: Unit) => isFleet(unit) && isSea(unit.province);

export const isArmy = (unit: Unit) => unit.unitType === "Army";
export const isArmyInCoast = (unit: Unit) => isArmy(unit) && isCoast(unit.province)
export const selectedUnit = signal<Unit | null>(null)