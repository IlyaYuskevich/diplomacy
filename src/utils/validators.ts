import { Move, SubmittedMove } from "types/moves.ts";
import {
  armyBorders,
  fleetBorders,
  ProvinceCode,
  provinces,
  ProvinceType,
} from "types/provinces.ts";
import { GamePosition, SUPPLY_CENTERS } from "types/gamePosition.ts";
import { Game, GamePhase } from "types/game.ts";
import { getCountry, PlayerGame } from "types/playerGames.ts";

const ruleAdjacency = (move: Move) => {
  /* Checking that provinces have common border */
  if (move.type == "CONVOY") return move;
  if (move.type == "HOLD") return move; // in defend origin == to
  const isBordering = (province1: ProvinceCode, province2: ProvinceCode) =>
    fleetBorders[province1]?.some((prv) => prv == province2) ||
    armyBorders[province1]?.some((prv) => prv == province2);

  if (move.origin && move.to) {
    if (!isBordering(move.origin, move.to)) move.status = "INVALID";
  }

  if (move.from && move.to) {
    if (!isBordering(move.from, move.to)) move.status = "INVALID";
  }

  return move;
};

const ruleUnitTypeDestination = (move: Move) => {
  /* Armies cannot go to sea, fleets cannot go to land */
  if (provinces[move.to].type == ProvinceType.Sea && move.unit_type == "Army") {
    move.status = "INVALID";
  }
  if (
    provinces[move.to].type == ProvinceType.Land && move.unit_type == "Fleet"
  ) move.status = "INVALID";
  return move;
};

const ruleArmyConvoyedFromCoastToCoast = (move: Move) => {
  /* Army convoyed from Coast to Coast */
  if (move.type != "CONVOY" || move.unit_type != "Army") return move;
  if (!move.origin) return move;
  if (
    provinces[move.to].type !== ProvinceType.Coast ||
    provinces[move.origin].type !== ProvinceType.Coast
  ) move.status = "INVALID";
  return move;
};

const ruleBuildinSuppCenters = (move: Move) => {
  /* Build is possible only in supply centers, fleets should be built in the coast */
  if (move.type !== "BUILD") return move;
  const supplyCenters = Object.keys(SUPPLY_CENTERS);
  if (!supplyCenters.some((x) => x === move.origin)) move.status = "INVALID";
  if (
    provinces[move.to].type === ProvinceType.Land &&
    move.unit_type === "Fleet"
  ) move.status = "INVALID";
  return move;
};

const ruleDefendOnlySelfOrigin = (move: Move) => {
  /* Reject defend moves if where to not equals origin */
  if (move.type !== "HOLD") return move;
  if (move.to !== move.origin) move.status = "INVALID";
  return move;
};

const ruleOneMovePerUnit = (prevOrigins: ProvinceCode[], move: Move) => {
  /* Unit can do only one move */
  if (move.type == "BUILD") return prevOrigins;
  if (prevOrigins.includes(move.origin!)) move.status = "INVALID";
  else if (move.status !== "INVALID") {
    const origins = [...prevOrigins, move.origin!];
    return origins;
  }
  return prevOrigins;
};

const ruleSelfUnitShouldExist =
  (gamePosition: GamePosition, playerGames: PlayerGame[]) =>
  (move: Move) => {
    const country = getCountry(move.player_game, playerGames);
    if (move.type == "BUILD") return move;
    if (!country) return move;
    if (
      !gamePosition.unitPositions[country].map((unit) => unit.province)
        .includes(move.origin!)
    ) move.status = "INVALID";
    return move;
  };

const ruleBuildOnlyInDomesticSupplyCenters =
  (playerGames: PlayerGame[]) => (move: Move) => {
    const country = getCountry(move.player_game, playerGames);
    if (move.type !== "BUILD") return move;
    if (!country) return move;
    if (SUPPLY_CENTERS[move.to] !== country) move.status = "INVALID";
    return move;
  };

const rulePhase = (phase: GamePhase) => (move: Move) => {
  switch (phase) {
    case "Diplomatic":
      if (!["MOVE", "SUPPORT", "CONVOY", "HOLD"].includes(move.type)) {
        move.status = "INVALID";
      }
      break;
    case "Retreat and Disbanding":
      if (!["RETREAT"].includes(move.type)) move.status = "INVALID";
      break;
    case "Gaining and Losing":
      if (!["BUILD", "DESTROY"].includes(move.type)) move.status = "INVALID";
      break;
  }
  return move;
};

export const individualMoveValidator = (
  submittedMoves: SubmittedMove[],
): Move[] => {
  /* Validates submitted moves (to prevent players' cheating by submitting moves directly to supabase). */
  const moveMapper = (smove: SubmittedMove) => {
    const move = smove as Move;
    move.status = "VALID";
    return move;
  };

  return submittedMoves
    .map(moveMapper)
    .map(ruleAdjacency)
    .map(ruleUnitTypeDestination)
    .map(ruleArmyConvoyedFromCoastToCoast)
    .map(ruleDefendOnlySelfOrigin)
    .map(ruleBuildinSuppCenters);
};

export const moveInPositionValidator =
  (gamePosition: GamePosition, playerGames: PlayerGame[]) =>
  (
    moves: Move[],
  ) => {
    moves
      .map(ruleSelfUnitShouldExist(gamePosition, playerGames))
      .map(ruleBuildOnlyInDomesticSupplyCenters(playerGames))
      .reduceRight(ruleOneMovePerUnit, []);
    return moves;
  };

export const movePhaseValidator = (
  phase: GamePhase,
) =>
(moves: Move[]) => {
  return moves.map(rulePhase(phase));
};

const insertUnmovedUnits = (
  game: Game,
  pg: PlayerGame,
  moves: Move[],
) => {
  game.game_position.unitPositions[pg.country!].filter((unit) =>
    !moves.map((mv) => mv.origin).includes(unit.province)
  )
    .forEach((unit) =>
      moves.push({
        type: "HOLD",
        to: unit.province,
        from: null,
        origin: unit.province,
        unit_type: unit.unitType,
        player_game: pg.id,
        game: game.id,
        status: "VALID",
        player: pg.player,
        phase: game.phase!.id,
      } as Move)
    );
};

export const addAutoMoves = (
  game: Game,
  playerGames: PlayerGame[],
) =>
(moves: Move[]) => {
  if (game.phase!.phase != "Diplomatic") return moves
  playerGames.forEach((pg) => insertUnmovedUnits(game, pg, moves));
  return moves;
};
