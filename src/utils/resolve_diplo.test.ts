import { assert, assertEquals, assertArrayIncludes } from "assert";
import { Move, MoveType } from "types/moves.ts";
import { phaseResolver } from "utils/resolve.ts";
import { Game, GamePhase } from "types/game.ts";
import { PlayerGame } from "types/playerGames.ts";
import { ProvinceCode, ProvinceType, provinces } from "types/provinces.ts";
import { Unit, UnitType } from "types/units.ts";
import { Country } from "types/country.ts";
import formatISO from "date-fns/formatISO/index.js";
import add from "date-fns/add/index.ts";

export function createGame(phase: GamePhase = 'Diplomatic'): Game {
  const gameId = crypto.randomUUID();
  return {
    id: gameId,
    started_at: formatISO(new Date(), {}),
    game_type: "MULTI",
    phase: {
      id: crypto.randomUUID(),
      year: 1901,
      phase,
      turn: "SPRING",
      game: gameId,
      previous_phase: null,
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
  } as Game;
}

export function findOrCreatePlayerGame(
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

export function generateMove(
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
    created_at: formatISO(new Date(), {}),
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
  provinces[origin].type != ProvinceType.Sea ? game.game_position.domains[country] = [
    ...game.game_position.domains[country],
    origin,
  ] : null;
  game.game_position.unitPositions[country] = [
    ...game.game_position.unitPositions[country],
    { province: origin, unitType } as Unit,
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
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assert(!game_position.domains.RUSSIA.includes("Sil"));
  assert(!game_position.domains.GERMANY.includes("Sil"));
  assertArrayIncludes(game_position.standoffs || [], [
    "Sil",
  ]);
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["War"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Ber"],
  );
});

Deno.test("standoff: when unit is ordered to go in two-coast province", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Bot",
    "StPS",
    null,
    "Fleet",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "StP",
    "StP",
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
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertArrayIncludes(game_position.standoffs || [], [
    "StPS",
  ]);
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Bot", "StP"],
  );
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
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertArrayIncludes(game_position.standoffs || [], [
    "Ber",
    "Pru",
  ]);
  assertArrayIncludes(game_position.domains.RUSSIA, [
    "Pru",
  ]);

  assertArrayIncludes(game_position.domains.GERMANY, [
    "Ber",
    "Kie",
  ]);

  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Pru"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Ber"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Kie"],
  );
});

Deno.test("units trying to exchange provinces remain in origins", () => {
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
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertArrayIncludes(game_position.domains.RUSSIA, [
    "Pru",
  ]);
  assertArrayIncludes(game_position.domains.GERMANY, [
    "Ber",
  ]);
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Pru"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Ber"],
  );
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
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["Hol"],
  );
  assertArrayIncludes(
    game_position.unitPositions.ENGLAND.map((u) => u.province),
    ["Bel"],
  );
  assertArrayIncludes(
    game_position.unitPositions.ENGLAND.map((u) => u.province),
    ["Nth"],
  );
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
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["Gas", "Bur"],
  );
  assertArrayIncludes(game_position.dislodged!.GERMANY.map(dslg => dslg.province), ["Bur"])
});

Deno.test("simple support two coasts", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Mid",
    "SpaN",
    null,
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Gas",
    "Spa",
    "Mid",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Spa",
    "Spa",
    null,
    "Army",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["Gas", "SpaN"],
  );
  assertArrayIncludes(game_position.dislodged!.ITALY.map(dslg => dslg.province), ["Spa"])
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
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(game_position.standoffs!, ["Tyn"]);
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["GoL", "Wes"],
  );
  assertArrayIncludes(
    game_position.unitPositions.ITALY.map((u) => u.province),
    ["Rom", "Nap"],
  );
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
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(game_position.standoffs!, ["Tyn"])
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["GoL", "Wes"],
  );
  assertArrayIncludes(
    game_position.unitPositions.ITALY.map((u) => u.province),
    ["Rom", "Tyn"],
  );
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
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.AUSTRIA.map((u) => u.province),
    ["Tyr", "Mun"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Ber"],
  );
  assertArrayIncludes(
    game_position.dislodged!.GERMANY.map(dslg => dslg.province),
    ["Mun"],
  );
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["War", "Pru"],
  );
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
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(
    game_position.dislodged!.TURKEY.map(dslg => dslg.province),
    ["Bul"],
  );
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Rum", "Ser", "Bul"],
  );
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
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[4].status, "SUCCEED");
  assertEquals(resultMoves[5].status, "SUCCEED");
  assertArrayIncludes(
    game_position.dislodged!.TURKEY.map(dslg => dslg.province),
    ["Bul"],
  );
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Rum", "Ser", "Bul", "Gre"],
  );
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

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "FAILED");
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Boh", "War"],
  );
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Pru", "Sil"],
  );
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

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertArrayIncludes(
    game_position.unitPositions.GERMANY.map((u) => u.province),
    ["Sil", "War"],
  );
  assertArrayIncludes(
    game_position.dislodged!.RUSSIA.map(dslg => dslg.province),
    ["War"],
  );
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

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[4].status, "FAILED");
  assertArrayIncludes(
    game_position.dislodged!.GERMANY.map(dslg => dslg.province),
    ["Sil"],
  );
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Bal", "Sil", "War"],
  );
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

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "FAILED");
  assertEquals(resultMoves[4].status, "SUCCEED");
  assertEquals(resultMoves[5].status, "SUCCEED");
  assertArrayIncludes(
    game_position.dislodged!.GERMANY.map(dslg => dslg.province),
    ["Mun"],
  );
  assertArrayIncludes(
    game_position.unitPositions.RUSSIA.map((u) => u.province),
    ["Pru", "Sil", "Mun", "Tyr"],
  );
});

Deno.test("Convoying army across one water province.", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "CONVOY",
    "Lon",
    "Nwy",
    null,
    "Army",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "Nth",
    "Nwy",
    "Lon",
    "Fleet",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.ENGLAND.map((u) => u.province),
    ["Nwy", "Nth"],
  );
});

Deno.test("Convoying army across one water province (Spain).", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "CONVOY",
    "Spa",
    "Tus",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "GoL",
    "Tus",
    "Spa",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["Tus", "GoL"],
  );
});


Deno.test("Convoying army across several water provinces.", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "CONVOY",
    "Lon",
    "Tun",
    null,
    "Army",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "Eng",
    "Tun",
    "Lon",
    "Fleet",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "Mid",
    "Tun",
    "Lon",
    "Fleet",
    "ENGLAND",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "Wes",
    "Tun",
    "Lon",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.ENGLAND.map((u) => u.province),
    ["Tun", "Mid", "Eng"],
  );
});

Deno.test("Cutting convoy.", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "CONVOY",
    "Spa",
    "Nap",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "GoL",
    "Nap",
    "Spa",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "CONVOY",
    "Tyn",
    "Nap",
    "Spa",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Ion",
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
    "Tun",
    "Tyn",
    "Ion",
    "Fleet",
    "ITALY",
    moves,
    playerGames,
    game,
  );

  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertEquals(resultMoves[3].status, "SUCCEED");
  assertArrayIncludes(
    game_position.unitPositions.FRANCE.map((u) => u.province),
    ["Spa", "GoL"],
  );
  assertArrayIncludes(
    game_position.unitPositions.ITALY.map((u) => u.province),
    ["Tyn", "Tun"],
  );
  assertArrayIncludes(
    game_position.dislodged!.FRANCE.map(dslg => dslg.province),
    ["Tyn"],
  );
});

Deno.test("Self dislodgement is not possible", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Par",
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
    "Mar",
    "Bur",
    "Par",
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
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "SUCCEED");
});

Deno.test("Self dislodgement is not possible-2", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Par",
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
    "Ruh",
    "Bur",
    "Par",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Bur",
    "Mar",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Mar",
    "Bur",
    null,
    "Army",
    "ITALY",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "FAILED");
  assertEquals(resultMoves[1].status, "SUCCEED");
  assertEquals(resultMoves[2].status, "FAILED");
  assertEquals(resultMoves[3].status, "FAILED");
});

Deno.test(
  "Self-dislodgement is not possible even when supporting foreign attack",
  { ignore: true },
  () => {
    const game = createGame();
    const moves: Move[] = [];
    const playerGames: PlayerGame[] = [];
    generateMove(
      "MOVE",
      "Ruh",
      "Bur",
      null,
      "Army",
      "GERMANY",
      moves,
      playerGames,
      game,
    );
    generateMove(
      "HOLD",
      "Mun",
      "Mun",
      null,
      "Army",
      "GERMANY",
      moves,
      playerGames,
      game,
    );
    generateMove(
      "SUPPORT",
      "Par",
      "Bur",
      "Ruh",
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
      "Army",
      "FRANCE",
      moves,
      playerGames,
      game,
    );
    const [resultMoves, { game_position }] = phaseResolver(
      moves,
      game,
      playerGames,
    );
    assertEquals(resultMoves[0].status, "FAILED");
    assertEquals(resultMoves[1].status, "SUCCEED");
    assertEquals(resultMoves[2].status, "SUCCEED");
    assertEquals(resultMoves[3].status, "SUCCEED");
  },
);

Deno.test("Foreign support of self-standoff", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "MOVE",
    "Ser",
    "Bud",
    null,
    "Army",
    "AUSTRIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Vie",
    "Bud",
    null,
    "Army",
    "AUSTRIA",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Gal",
    "Bud",
    "Ser",
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  const [resultMoves, { game_position }] = phaseResolver(
    moves,
    game,
    playerGames,
  );
  assertEquals(resultMoves[0].status, "SUCCEED");
  assertEquals(resultMoves[1].status, "FAILED");
  assertEquals(resultMoves[2].status, "SUCCEED");
});
