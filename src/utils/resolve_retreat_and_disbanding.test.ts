import { assert, assertEquals } from "assert";
import { Move } from "types/moves.ts";
import { phaseResolver } from "utils/resolve.ts";
import { PlayerGame } from "types/playerGames.ts";
import { createGame, generateMove } from "utils/test-utils.ts";


Deno.test("French province Bre is occupied by England", () => {
  const game = createGame("Retreat and Disbanding");
  game.phase!.game_position = {
    domains: {
      AUSTRIA: [],
      ENGLAND: ["Cly", "Edi", "Lvp", "Lon", "Wal", "Yor"],
      FRANCE: ["Bre", "Bur", "Gas", "Mar", "Par", "Pic"],
      GERMANY: [],
      ITALY: [],
      RUSSIA: [],
      TURKEY: [],
    },
    unitPositions: {
      AUSTRIA: [
      ],
      ENGLAND: [
        { province: "Lon", unitType: "Fleet" },
        { province: "Edi", unitType: "Fleet" },
        { province: "Lvp", unitType: "Army" },
        { province: "Bre", unitType: "Fleet" },
      ],
      FRANCE: [
        { province: "Par", unitType: "Army" },
        { province: "Mar", unitType: "Army" },
      ],
      GERMANY: [
      ],
      ITALY: [
      ],
      RUSSIA: [
      ],
      TURKEY: [
      ],
    },
  };
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];

  const [_, game_position ] = phaseResolver(
    moves,
    game.phase!,
    playerGames,
  );
  assert(!game_position.domains.FRANCE.includes("Bre"));
  assert(game_position.domains.ENGLAND.includes("Bre"));
});


Deno.test("Two units trying to retreat in the same province are disbanded", () => {
  const game = createGame("Retreat and Disbanding");
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "RETREAT",
    "Ber",
    "Sil",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );

  generateMove(
    "RETREAT",
    "War",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, game_position ] = phaseResolver(
    moves,
    game.phase!,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assert(game_position.disbanded?.RUSSIA.at(0)?.province == "Sil");
  assert(game_position.disbanded?.GERMANY.at(0)?.province == "Sil");
});

Deno.test("If there's no retreat options -- disband", () => {
  const game = createGame("Retreat and Disbanding");
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  game.phase!.game_position = {
    domains: {
      AUSTRIA: [],
      ENGLAND: [],
      FRANCE: ["Bre", "Bur", "Gas", "Mar", "Par", "Pic", "Tus", "Ven"],
      GERMANY: [],
      ITALY: ["Rom", "Nap"],
      RUSSIA: [],
      TURKEY: ["Apu"],
    },
    unitPositions: {
      AUSTRIA: [
      ],
      ENGLAND: [
      ],
      FRANCE: [
        { province: "Rom", unitType: "Army" },
        { province: "Ven", unitType: "Army" },
        { province: "Tyn", unitType: "Fleet" },
      ],
      GERMANY: [
      ],
      ITALY: [
        { province: "Rom", unitType: "Army" },
        { province: "Nap", unitType: "Fleet" },
      ],
      RUSSIA: [
      ],
      TURKEY: [
        { province: "Apu", unitType: "Fleet" },
      ],
    },
    dislodged: {
      AUSTRIA: [],
      ENGLAND: [],
      FRANCE: [],
      GERMANY: [],
      ITALY: [{dislodgedFrom: "Tus", province: "Rom"}],
      RUSSIA: [],
      TURKEY: [],
    }
  };


  const [_, game_position ] = phaseResolver(
    moves,
    game.phase!,
    playerGames,
  );
  assert(game_position.disbanded?.ITALY.at(0)?.province == "Rom");
  assert(!game_position.unitPositions?.ITALY.map(x => x.province).includes("Rom"));
  assert(game_position.domains.FRANCE.includes("Rom"));
});

