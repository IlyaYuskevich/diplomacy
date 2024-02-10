import { Country } from "types/country.ts";
import { UnitType } from "types/units.ts";

export type UnitPositionsType = {
    x: number;
    y: number;
    country: NonNullable<Country>;
    province: string;
    unitType: UnitType;
    isDislodged: boolean;
  };