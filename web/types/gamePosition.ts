import { signal } from "@preact/signals";
import { Unit } from "types/units.ts";
import { Country } from "types/country.ts";
import { ProvinceCode } from "types/provinces.ts";

export type GamePosition = {
  domains: { [K in NonNullable<Country>]: ProvinceCode[] };
  unitPositions: { [K in NonNullable<Country>]: Unit[] };
};

const START_POSITION: GamePosition = {
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

export const gamePosition = signal<GamePosition>(START_POSITION);
