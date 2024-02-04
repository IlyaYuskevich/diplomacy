import { assertArrayIncludes } from "assert";
import { GamePosition } from "types/gamePosition.ts";
import { findAllConvoys } from "utils/rules-convoys.ts";

Deno.test("Return all possible convoys", () => {
  const position: GamePosition = {
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
      AUSTRIA: [],
      ENGLAND: [
        { province: "Wes", unitType: "Fleet" },
        { province: "Nth", unitType: "Fleet" },
        { province: "Nrg", unitType: "Fleet" },
        { province: "Lon", unitType: "Army" },
      ],
      FRANCE: [
        { province: "Tyr", unitType: "Fleet" },
        { province: "Mar", unitType: "Fleet" },
        { province: "Spa", unitType: "Army" },
        { province: "Mid", unitType: "Fleet" },
      ],
      GERMANY: [],
      ITALY: [],
      RUSSIA: [],
      TURKEY: [],
    },
  };

  const res = [
    { chain: ["Lon", "Nth", "Bel"] },
    { chain: ["Lon", "Nth", "Edi"] },
    { chain: ["Lon", "Nth", "Yor"] },
    { chain: ["Lon", "Nth", "Hol"] },
    { chain: ["Lon", "Nth", "Den"] },
    { chain: ["Lon", "Nth", "Nwy"] },
    { chain: ["Lon", "Nth", "Nrg", "Edi"] },
    { chain: ["Lon", "Nth", "Nrg", "Cly"] },
    { chain: ["Lon", "Nth", "Nrg", "Nwy"] },
    { chain: ["Spa", "Wes", "NAf"] },
    { chain: ["Spa", "Wes", "Tun"] },
    { chain: ["Spa", "Wes", "Mid", "Bre"] },
    { chain: ["Spa", "Wes", "Mid", "Gas"] },
    { chain: ["Spa", "Wes", "Mid", "Por"] },
    { chain: ["Spa", "Wes", "Mid", "NAf"] },
    { chain: ["Spa", "Mid", "Bre"] },
    { chain: ["Spa", "Mid", "Gas"] },
    { chain: ["Spa", "Mid", "Por"] },
    { chain: ["Spa", "Mid", "NAf"] },
    { chain: ["Spa", "Mid", "Wes", "NAf"] },
    { chain: ["Spa", "Mid", "Wes", "Tun"] },
  ];

  assertArrayIncludes(
    res.map((x) => x.chain.join("")),
    findAllConvoys(position).map((x) => x.chain.join("")),
  );
});
