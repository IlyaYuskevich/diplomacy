import { signal } from "@preact/signals";
import { IUnit } from "./units.ts";
import { Country } from "./country.ts";

export interface IGamePosition {
  domains: { [K in Country]: string[] };
  unitPositions: { [K in Country]: IUnit[] };
}

export const gamePosition = signal<IGamePosition>({
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
