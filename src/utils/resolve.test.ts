import { assertEquals } from "assert";
import { Move, MoveType } from "types/moves.ts";
import { phaseResolver } from "utils/resolve.ts";
import { Game } from "types/game.ts";
import { PlayerGame } from "types/playerGames.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.208.0/assert/assert_array_includes.ts";
import { ProvinceCode } from "types/provinces.ts";
import { Unit, UnitType } from "types/units.ts";
import { Country } from "types/country.ts";
import formatISO from "date-fns/formatISO/index.js";
import add from "date-fns/add/index.ts";

function createGame(): Game {
  const gameId = crypto.randomUUID();
  return {
    id: gameId,
    started_at: formatISO(new Date(), {}),
    game_type: "MULTI",
    phase: {
      id: crypto.randomUUID(),
      year: 1901,
      phase: "Diplomatic",
      turn: "SPRING",
      game: gameId,
      starts_at: formatISO(new Date(), {}),
      ends_at: formatISO(add(new Date(), { hours: 1 }), {}),
    },
    status: "ACTIVE",
    game_position: {
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
    },
    turn_duration: 60,
    retreat_and_disbanding_phase_duration: 15,
    gaining_and_loosing_phase_duration: 15,
  };
}

function findOrCreatePlayerGame(
  playerGames: PlayerGame[],
  game: Game,
  country: Country,
) {
  const foundPlayerGame = playerGames.find((pg) => pg.country == country);
  if (foundPlayerGame) {
    return foundPlayerGame;
  } else {
    const newPlayerGame = {
      id: crypto.randomUUID(),
      country: country,
      game: game.id,
      created_at: formatISO(new Date(), {}),
      player: crypto.randomUUID(),
    };
    playerGames.push(newPlayerGame);
    return newPlayerGame;
  }
}

function generateMove(
  moveType: MoveType,
  origin: ProvinceCode,
  to: ProvinceCode,
  from: ProvinceCode | null,
  unitType: UnitType,
  country: NonNullable<Country>,
  moves: Move[],
  playerGames: PlayerGame[],
  game: Game,
) {
  const playerGame = findOrCreatePlayerGame(playerGames, game, country);
  const id = crypto.randomUUID();
  const move = {
    id,
    created_at: "2023-12-03T15:19:05.411808+00:00",
    type: moveType,
    origin: origin,
    to: to,
    from: from,
    unit_type: unitType,
    player_game: playerGame!.id,
    game: game.id,
    player: playerGame!.player,
    phase: game.phase!.id,
    status: "VALID",
  } as Move;
  game.game_position.domains[country] = [
    ...game.game_position.domains[country],
    origin,
  ];
  game.game_position.unitPositions[country] = [
    ...game.game_position.unitPositions[country],
    { province: from, unitType } as Unit,
  ];
  moves.push(move);
}

Deno.test("standoff: units have equal strength", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
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
    "MOVE",
    "War",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertArrayIncludes(game_position.domains.RUSSIA, [
    "War",
  ]);
  assertArrayIncludes(game_position.domains.GERMANY, [
    "Ber",
  ]);
});

Deno.test("Chain standoff: One unit not moving can stop a unit or series of units from moving", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Kie",
    "Ber",
    null,
    "Fleet",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Ber",
    "Pru",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Pru",
    "Pru",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  // assertArrayIncludes(game_position.domains.RUSSIA, [
  //   "War",
  // ]);
  // assertArrayIncludes(game_position.domains.GERMANY, [
  //   "Ber",
  //   "Kie",
  // ]);
});

Deno.test("units trying to occupy the same province remain in origins", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Ber",
    "Pru",
    null,
    "Fleet",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Pru",
    "Ber",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertArrayIncludes(game_position.domains.RUSSIA, [
    "Pru",
  ]);
  assertArrayIncludes(game_position.domains.GERMANY, [
    "Ber",
  ]);
});

Deno.test("three or more units can rotate provinces", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Hol",
    "Bel",
    null,
    "Army",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Bel",
    "Nth",
    null,
    "Fleet",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Nth",
    "Hol",
    null,
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertArrayIncludes(game_position.domains.ENGLAND, [
    "Hol",
  ]);
  assertArrayIncludes(game_position.domains.ENGLAND, [
    "Bel",
  ]);
});

Deno.test("simple support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Mar",
    "Bur",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Gas",
    "Bur",
    "Mar",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Bur",
    "Bur",
    null,
    "Fleet",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertArrayIncludes(game_position.domains.FRANCE, [
    "Gas",
    "Mar",
  ]);
  assertArrayIncludes(game_position.domains.GERMANY, [
    "Bur",
  ]);
});

Deno.test("standoff while support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "GoL",
    "Tyn",
    null,
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Wes",
    "Tyn",
    "GoL",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Nap",
    "Tyn",
    null,
    "Fleet",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Rom",
    "Tyn",
    "Nap",
    "Fleet",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
});

Deno.test("standoff while support with defence", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "GoL",
    "Tyn",
    null,
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Wes",
    "Tyn",
    "GoL",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Tyn",
    "Tyn",
    null,
    "Fleet",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Rom",
    "Tyn",
    "Tyn",
    "Fleet",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
});

Deno.test("dislodged unit can cause standoff in other province than origin", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Boh",
    "Mun",
    null,
    "Army",
    "AUSTRIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Tyr",
    "Mun",
    "Boh",
    "Army",
    "AUSTRIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Mun",
    "Sil",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Ber",
    "Sil",
    "Mun",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "War",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Pru",
    "Sil",
    "War",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
});

Deno.test("dislodged while exchange provinces by two units: dislodged must retreat", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Bul",
    "Rum",
    null,
    "Army",
    "TURKEY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Rum",
    "Bul",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Ser",
    "Bul",
    "Rum",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Sev",
    "Rum",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
});

Deno.test("dislodged while exchange provinces by two units: dislodged must retreat-2", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Bul",
    "Rum",
    null,
    "Army",
    "TURKEY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Bla",
    "Rum",
    "Bul",
    "Fleet",
    "TURKEY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Rum",
    "Bul",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Gre",
    "Bul",
    "Rum",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Ser",
    "Bul",
    "Rum",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Sev",
    "Rum",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[4].status, "SUCCEED");
  assertEquals(resultMoves[5].status, "SUCCEED");
});

Deno.test("Cutting support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Pru",
    "War",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Sil",
    "War",
    "Pru",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "War",
    "War",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Boh",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );

  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "FAILED");
});

Deno.test("Cutting support from where support was given", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Pru",
    "War",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Sil",
    "War",
    "Pru",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "War",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );

  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
});

Deno.test("Cutting support from where support was given by dislodge", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Pru",
    "War",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Sil",
    "War",
    "Pru",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "War",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );

  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
});

Deno.test("Cutting support from where support was given by dislodge", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Ber",
    "Pru",
    null,
    "Fleet",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Sil",
    "Pru",
    "Ber",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Pru",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "War",
    "Sil",
    "Pru",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Bal",
    "Pru",
    null,
    "Fleet",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );


  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[4].status, "FAILED");
});


Deno.test("Dislodged army can still cut support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "HOLD",
    "Ber",
    "Ber",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Mun",
    "Sil",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Pru",
    "Ber",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Sil",
    "Ber",
    "Pru",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Boh",
    "Mun",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Tyr",
    "Mun",
    "Boh",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );


  const [resultMoves] = phaseResolver(
    moves,
    game,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "FAILED");
  assertEquals(resultMoves[4].status, "SUCCEED");
  assertEquals(resultMoves[5].status, "SUCCEED");
});