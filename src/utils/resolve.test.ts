import { assertEquals } from "assert";
import { Move, MoveInsert, SubmittedMove } from "types/moves.ts";
import { calcNextPosition } from "utils/resolve.ts";
import { Game } from "types/game.ts";
import { PlayerGame } from "types/playerGames.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.208.0/assert/assert_array_includes.ts";

Deno.test("units trying to occupy the same province remain in origins", () => {
  const moves: Move[] = [{
    created_at: "2023-12-03T15:19:05.411808+00:00",
    type: "MOVE",
    origin: "Ber",
    to: "Sil",
    from: null,
    unit_type: "Army",
    player_game: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "2739a8b1-1f4d-4057-896b-5eb44f6c81aa",
    status: "VALID",
  }, {
    created_at: "2023-12-03T18:20:15.186285+00:00",
    type: "MOVE",
    origin: "War",
    to: "Sil",
    from: null,
    unit_type: "Army",
    status: "VALID",
    player_game: "0616e052-45ec-45e5-b151-eacbf14dc277",
    game: "d66a09ef-74bb-44b2-a2b2-c5871a754478",
    player: "2d400f6c-7a50-4387-bdd2-7f422afeeabd",
    phase: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
    id: "1c75a72f-718c-4d29-8aa3-ca656b7cf4ad",
  }];
  const game: Game = {
    id: "b08e1dbd-db4f-4424-84b8-8a5cefc05cf5",
    started_at: "2023-12-04 19:02:28.277553+00",
    game_type: "MULTI",
    phase: {
      id: "d34974d1-c5fd-4212-a486-f9c37bc5fed0",
      year: 1901,
      phase: "Diplomatic",
      turn: "SPRING",
      game: "b08e1dbd-db4f-4424-84b8-8a5cefc05cf5",
      starts_at: "",
      ends_at: "",
    },
    status: "ACTIVE",
    game_position: {
      domains: {
        AUSTRIA: [],
        ENGLAND: [],
        FRANCE: [],
        GERMANY: ["Ber", "Kie", "Mun", "Pru", "Ruh"],
        ITALY: [],
        RUSSIA: ["Lvn", "Mos", "Sev", "StP", "Ukr", "War"],
        TURKEY: [],
      },
      unitPositions: {
        AUSTRIA: [],
        ENGLAND: [],
        FRANCE: [],
        GERMANY: [
          { province: "Ber", unitType: "Army" },
        ],
        ITALY: [],
        RUSSIA: [
          { province: "War", unitType: "Army" },
        ],
        TURKEY: [],
      },
    },
    turn_duration: 60,
    retreat_and_disbanding_phase_duration: 15,
    gaining_and_loosing_phase_duration: 15,
  };
  const playerGames: PlayerGame[] = [{
    id: "0616e052-45ec-45e5-b151-eacbf14dc277",
    country: "RUSSIA",
    game: "b08e1dbd-db4f-4424-84b8-8a5cefc05cf5",
    created_at: "",

    player: "2d400f6c-7a50-4387-bdd2-7f422afeeabd",
  }, {
    id: "f5cf6d8d-51d6-4275-aed2-d0c400fee701",
    country: "GERMANY",
    game: "b08e1dbd-db4f-4424-84b8-8a5cefc05cf5",
    created_at: "",
    player: "6e91afcb-aa82-4d1d-b980-f106dd82bbad",
  }];
  const [resultMoves, { game_position }] = calcNextPosition(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertArrayIncludes(game_position.domains.RUSSIA, [
    "Lvn",
    "Mos",
    "Sev",
    "StP",
    "Ukr",
    "War",
  ]);
  assertArrayIncludes(game_position.domains.GERMANY, [
    "Ber",
    "Kie",
    "Mun",
    "Pru",
    "Ruh",
  ]);
});
