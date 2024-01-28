import formatISO from "date-fns/formatISO/index.js";
import add from "date-fns/add/index.ts";
import { Game, GamePhase } from "types/game.ts";
import { PlayerGame } from "types/playerGames.ts";
import { Country } from "types/country.ts";
import { Move, MoveType } from "types/moves.ts";
import { ProvinceCode, provinces, ProvinceType } from "types/provinces.ts";
import { Unit, UnitType } from "types/units.ts";

export function createGame(phase: GamePhase = "Diplomatic"): Game {
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
    turn_duration: 60,
    retreat_and_disbanding_phase_duration: 15,
    gaining_and_loosing_phase_duration: 15,
    created_by: crypto.randomUUID(),
    number_of_players: 7,
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
  provinces[origin].type != ProvinceType.Sea
    ? game.phase!.game_position.domains[country] = [
      ...game.phase!.game_position.domains[country],
      origin,
    ]
    : null;
  game.phase!.game_position.unitPositions[country] = [
    ...game.phase!.game_position.unitPositions[country],
    { province: origin, unitType } as Unit,
  ];
  moves.push(move);
}
