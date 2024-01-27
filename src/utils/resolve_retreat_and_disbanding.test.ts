import { assert, assertEquals } from "assert";
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
      turn: "FALL",
      game: gameId,
      previous_phase: null,
      starts_at: formatISO(new Date(), {}),
      ends_at: formatISO(add(new Date(), { hours: 1 }), {}),
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
    },
    status: "ACTIVE",
    game_position: {},
    turn_duration: 60,
    retreat_and_disbanding_phase_duration: 15,
    gaining_and_loosing_phase_duration: 15,
    created_by: crypto.randomUUID(),
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
  provinces[origin].type != ProvinceType.Sea ? game.phase!.game_position.domains[country] = [
    ...game.phase!.game_position.domains[country],
    origin,
  ] : null;
  game.phase!.game_position.unitPositions[country] = [
    ...game.phase!.game_position.unitPositions[country],
    { province: origin, unitType } as Unit,
  ];
  moves.push(move);
}

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

