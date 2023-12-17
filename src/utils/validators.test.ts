import { assertEquals } from "assert";
import { MoveInsert, SubmittedMove } from "types/moves.ts";
import {
  individualMoveValidator,
  moveInPositionValidator,
} from "utils/validators.ts";
import { GamePosition } from "types/gamePosition.ts";

Deno.test("assert valid moves receive status VALID", () => {
  const validMoves: SubmittedMove[] = [{
    created_at: "2023-12-03T15:19:05.411808+00:00",
    type: "MOVE",
    to: "Kie",
    from: null,
    origin: "Ber",
    unit_type: "Army",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "SUPPORT",
    to: "Tyr",
    from: "Ven",
    origin: "Mun",
    unit_type: "Army",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "16e72381-452f-4b70-a1e3-7e1d0c39d24c",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "HOLD",
    to: "Kie",
    from: null,
    origin: "Kie",
    unit_type: "Fleet",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }];
  const movesToSubmit = individualMoveValidator(validMoves);
  movesToSubmit.forEach((move) => assertEquals(move.status, "VALID", move.id));
});

Deno.test("assert invalid moves receive status INVALID", () => {
  const provincesAreNotAdjacent: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "MOVE",
    "to": "Boh",
    "from": null,
    "origin": "Ber",
    "unit_type": "Army",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const armyCannotGoSea: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "MOVE",
    "to": "Bal",
    "from": null,
    "origin": "Ber",
    "unit_type": "Army",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const fleetCannotGoLand: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "MOVE",
    "to": "Sil",
    "from": null,
    "origin": "Ber",
    "unit_type": "Fleet",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const convoyCannotHappenToLand: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "CONVOY",
    "to": "Mos",
    "from": null,
    "origin": "NAf",
    "unit_type": "Army",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const buildIsOnlyInSupplyCenter: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "BUILD",
    "to": "Gas",
    "from": null,
    "origin": null,
    "unit_type": "Army",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const buildFleetsOnlyInCoastialSupplyCenters: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "BUILD",
    "to": "Vie",
    "from": null,
    "origin": null,
    "unit_type": "Fleet",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const buildFleetsOnlyInTwoCoastSupplyCenters: SubmittedMove = {
    "created_at": "2023-12-03T15:19:05.411808+00:00",
    "type": "BUILD",
    "to": "StP",
    "from": null,
    "origin": null,
    "unit_type": "Fleet",
    "player_game": "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    "game": "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    "player": "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    "phase": "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    "id": "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  };
  const movesToSubmit = individualMoveValidator([
    provincesAreNotAdjacent,
    armyCannotGoSea,
    fleetCannotGoLand,
    convoyCannotHappenToLand,
    buildIsOnlyInSupplyCenter,
    buildFleetsOnlyInCoastialSupplyCenters,
    buildFleetsOnlyInTwoCoastSupplyCenters,
    buildFleetsOnlyInTwoCoastSupplyCenters,
  ]);
  movesToSubmit.forEach((move) =>
    assertEquals(
      move.status,
      "INVALID",
      `Move ${JSON.stringify(move)} shall be invalid`,
    )
  );
});

Deno.test("assert validity of moves with respect to previous position", () => {
  const gamePosition: GamePosition = {
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
  const validMoves: MoveInsert[] = [{
    created_at: "2023-12-03T15:19:05.411808+00:00",
    type: "MOVE",
    to: "Kie",
    from: null,
    origin: "Ber",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "SUPPORT",
    to: "Tyr",
    from: "Ven",
    origin: "Mun",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "16e72381-452f-4b70-a1e3-7e1d0c39d24c",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "HOLD",
    to: "Kie",
    from: null,
    origin: "Kie",
    unit_type: "Fleet",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }];
  const movesToSubmit = moveInPositionValidator(
    validMoves,
    gamePosition,
    "GERMANY",
  )
  movesToSubmit.forEach((move) => assertEquals(move.status, "VALID", move.id));
});

Deno.test("test invalid moves in a context", () => {
  const gamePosition: GamePosition = {
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
  const validMoves: MoveInsert[] = [{
    created_at: "2023-12-03T15:19:05.411808+00:00",
    type: "MOVE",
    to: "Kie",
    from: null,
    origin: "Ber",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "SUPPORT",
    to: "Tyr",
    from: "Ven",
    origin: "Boh",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "16e72381-452f-4b70-a1e3-7e1d0c39d24c",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "HOLD",
    to: "Ber",
    from: null,
    origin: "Ber",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "MOVE",
    to: "Bur",
    from: null,
    origin: "Par",
    unit_type: "Army",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "BUILD",
    to: "Hol",
    from: null,
    origin: null,
    unit_type: "Fleet",
    status: "VALID",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }];
  const movesToSubmit = moveInPositionValidator(
    validMoves,
    gamePosition,
    "GERMANY",
  );
  assertEquals(movesToSubmit[0].status, "INVALID"); // overriden by third move
  assertEquals(movesToSubmit[1].status, "INVALID"); // unit doesn't exist
  assertEquals(movesToSubmit[2].status, "VALID");
  assertEquals(movesToSubmit[3].status, "INVALID"); // attempt to move foreign unit
  assertEquals(movesToSubmit[4].status, "INVALID"); // attempt to build not in domestic supply centers
});
