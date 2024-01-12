import { Unit, UnitType } from "types/units.ts";
import { Country, COUNTRY_ARRAY } from "types/country.ts";
import { ProvinceCode, armyBorders, fleetBorders } from "types/provinces.ts";
import { Tables } from "lib/database.types.ts";

export type Dislodgement = { province: ProvinceCode, dislodgedFrom: ProvinceCode }
export type GamePosition = {
  domains: { [K in NonNullable<Country>]: ProvinceCode[] };
  unitPositions: { [K in NonNullable<Country>]: Unit[] };
  dislodged?: { [K in NonNullable<Country>]: Dislodgement[]};
  built?: { [K in NonNullable<Country>]: Unit[]},
  disbanded?: { [K in NonNullable<Country>]: Unit[]},
  standoffs?: ProvinceCode[];
};

export type Phase = Tables<"phases">

export const START_POSITION: GamePosition = {
  domains: {
    AUSTRIA: ["Boh", "Bud", "Gal", "Tri", "Tyr", "Vie"],
    ENGLAND: ["Cly", "Edi", "Lvp", "Lon", "Wal", "Yor"],
    FRANCE: ["Bre", "Bur", "Gas", "Mar", "Par", "Pic"],
    GERMANY: ["Ber", "Kie", "Mun", "Pru", "Ruh", "Sil"],
    ITALY: ["Apu", "Nap", "Pie", "Rom", "Tus", "Ven"],
    RUSSIA: ["Lvn", "Mos", "Sev", "StP", "Ukr", "War"],
    TURKEY: ["Ank", "Arm", "Con", "Smy", "Syr"],
  },
  unitPositions: {
    AUSTRIA: [
      { province: "Vie", unitType: "Army" },
      { province: "Bud", unitType: "Army" },
      { province: "Tri", unitType: "Fleet" },
    ],
    ENGLAND: [
      { province: "Lon", unitType: "Fleet" },
      { province: "Edi", unitType: "Fleet" },
      { province: "Lvp", unitType: "Army" },
    ],
    FRANCE: [
      { province: "Par", unitType: "Army" },
      { province: "Mar", unitType: "Army" },
      { province: "Bre", unitType: "Fleet" },
    ],
    GERMANY: [
      { province: "Ber", unitType: "Army" },
      { province: "Mun", unitType: "Army" },
      { province: "Kie", unitType: "Fleet" },
    ],
    ITALY: [
      { province: "Rom", unitType: "Army" },
      { province: "Ven", unitType: "Army" },
      { province: "Nap", unitType: "Fleet" },
    ],
    RUSSIA: [
      { province: "Mos", unitType: "Army" },
      { province: "Sev", unitType: "Army" },
      { province: "War", unitType: "Army" },
      { province: "StPS", unitType: "Fleet" },
    ],
    TURKEY: [
      { province: "Ank", unitType: "Fleet" },
      { province: "Con", unitType: "Army" },
      { province: "Smy", unitType: "Army" },
    ],
  },
};

export const SUPPLY_CENTERS: Partial<Record<ProvinceCode, Country>> = {
  Bre: "FRANCE",
  Par: "FRANCE",
  Mar: "FRANCE",
  Kie: "GERMANY",
  Ber: "GERMANY",
  Mun: "GERMANY",
  Lon: "ENGLAND",
  Lvp: "ENGLAND",
  Edi: "ENGLAND",
  Mos: "RUSSIA",
  StPS: "RUSSIA",
  Sev: "RUSSIA",
  War: "RUSSIA",
  Ank: "TURKEY",
  Con: "TURKEY",
  Smy: "TURKEY",
  Bud: "AUSTRIA",
  Vie: "AUSTRIA",
  Tri: "AUSTRIA",
  Ven: "ITALY",
  Rom: "ITALY",
  Nap: "ITALY",
  Rum: null,
  Bul: null,
  Ser: null,
  Por: null,
  Spa: null,
  Swe: null,
  Nwy: null,
  Den: null,
  Hol: null,
  Bel: null,
  Tun: null,
  Gre: null,
}

export const isOccupied = (gamePosition: GamePosition) => (province: ProvinceCode) => {
  /* Finds out if the province is already occupied. */
  return COUNTRY_ARRAY.some(country => gamePosition.unitPositions[country].some(unit => unit.province == province));
}

export const retreatOptions = (dislodge: Dislodgement, unitType: UnitType, gamePosition: GamePosition) => {
  const borders = unitType == "Army"
  ? armyBorders[dislodge.province]
  : fleetBorders[dislodge.province];
  return borders!
    .filter((province) => province != dislodge.dislodgedFrom)
    .filter((province) => !isOccupied(gamePosition)(province))
    .filter((province) => !gamePosition.standoffs?.includes(province));
}