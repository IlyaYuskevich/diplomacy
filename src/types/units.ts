import { signal } from "@preact/signals";
import { ProvinceCode } from "types/provinces.ts";
import { Enums } from "lib/database.types.ts";
  
export type UnitType = Enums<"UnitType">

export type Unit = {
  province: ProvinceCode
  unitType: UnitType
}

export const selectedUnit = signal<Unit | null>(null)