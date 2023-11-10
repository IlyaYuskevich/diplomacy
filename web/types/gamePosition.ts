import { signal } from "@preact/signals";
import { IUnit } from "types/units.ts";
import { Country } from "types/country.ts";

export type GamePosition = {
  domains: { [K in Country]: string[] };
  unitPositions: { [K in Country]: IUnit[] };
}

export const gamePosition = signal<GamePosition>({
  domains: {
    AUSTRIA: [],
    ENGLAND: [],
    FRANCE: [],
    GERMANY: [],
    ITALY: [],
    RUSSIA: [],
    TURKEY: [],
  },
  unitPositions: {
    AUSTRIA: [],
    ENGLAND: [],
    FRANCE: [],
    GERMANY: [],
    ITALY: [],
    RUSSIA: [],
    TURKEY: [],
  },
});
