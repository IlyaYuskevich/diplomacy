import { Country } from "types/country.ts";
import { ProvinceCode, UNIT_LOC_MAP } from "types/provinces.ts";
import { UnitPositionsType } from "features/worldMap/types/UnitPositionsType.ts";
import { Unit } from "types/units.ts";

export function mapUnitPositions(
    country: NonNullable<Country>,
    unitPositions: { [K in NonNullable<Country>]: Unit[] },
    dislodged: { province: ProvinceCode; country: Country }[],
  ): UnitPositionsType[] {
    return unitPositions[country].map((unit) => {
      const isDislodged = dislodged.some((x) =>
        x.province == unit.province && x.country == country
      );
      return {
        ...unit,
        x: UNIT_LOC_MAP[unit.province].X,
        y: UNIT_LOC_MAP[unit.province].Y,
        country: country,
        isDislodged,
      };
    });
  }