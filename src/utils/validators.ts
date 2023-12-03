import { MoveInsert, SubmittedMove } from "types/moves.ts";
import {
  armyBorders,
  fleetBorders,
  ProvinceCode,
  provinces,
  ProvinceType,
} from "types/provinces.ts";
import { GamePosition, SUPPLY_CENTERS } from "types/gamePosition.ts";
import { Country } from "types/country.ts";
import { GamePhase } from "types/game.ts";

const ruleAdjacency = (move: MoveInsert) => {
  /* Checking that provinces have common border */
  if (move.type == "CONVOY" && move.unit_type == "Army") return move; // army convoy to not adjacent provinces is allowed
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

const ruleUnitTypeDestination = (move: MoveInsert) => {
  /* Armies cannot go to sea, fleets cannot go to land */
  if (!move.to) return move;
  if (provinces[move.to].type == ProvinceType.Sea && move.unit_type == "Army") {
    move.status = "INVALID";
  }
  if (
    provinces[move.to].type == ProvinceType.Land && move.unit_type == "Fleet"
  ) move.status = "INVALID";
  return move;
};

const ruleArmyConvoyedFromCoastToCoast = (move: MoveInsert) => {
  /* Army convoyed from Coast to Coast */
  if (move.type !== "CONVOY" || move.unit_type !== "Army") return move;
  if (!move.to) return move;
  if (
    provinces[move.to].type !== ProvinceType.Coast ||
    provinces[move.origin].type !== ProvinceType.Coast
  ) move.status = "INVALID";
  return move;
};

const ruleBuildinSuppCenters = (move: MoveInsert) => {
  /* Build is possible only in supply centers, fleets should be built in the coast */
  if (move.type !== "BUILD") return move;
  const supplyCenters = Object.keys(SUPPLY_CENTERS);
  if (!supplyCenters.some((x) => x === move.origin)) move.status = "INVALID";
  if (
    provinces[move.origin].type === ProvinceType.Land &&
    move.unit_type === "Fleet"
  ) move.status = "INVALID";
  return move;
};

const ruleOneMovePerUnit = (prevOrigins: ProvinceCode[], move: MoveInsert) => {
  /* Unit can do only one move */
  if (prevOrigins.includes(move.origin)) move.status = "INVALID";
  else if (move.status !== "INVALID") {
    const origins = [...prevOrigins, move.origin];
    return origins;
  }
  return prevOrigins;
};

const ruleSelfUnitShouldExist =
  (gamePosition: GamePosition, country: NonNullable<Country>) =>
  (move: MoveInsert) => {
    if (
      !gamePosition.unitPositions[country].map((unit) => unit.province)
        .includes(move.origin)
    ) move.status = "INVALID";
    return move;
  };

const ruleBuildOnlyInDomesticSupplyCenters =
  (country: NonNullable<Country>) => (move: MoveInsert) => {
    if (move.type !== "BUILD") return move;
    if (SUPPLY_CENTERS[move.origin] !== country) move.status = "INVALID";
    return move;
  };

const rulePhase = (phase: GamePhase) => (move: MoveInsert) => {
  switch (phase) {
    case "Diplomatic":
      if (!["MOVE", "SUPPORT", "CONVOY", "DEFEND"].includes(move.type)) {
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

export function individualMoveValidator(
  submittedMoves: SubmittedMove[],
): MoveInsert[] {
  /* Validates submitted moves (to prevent players' cheating by submitting moves directly to supabase). */
  const moveMapper = (smove: SubmittedMove) => {
    const move = smove as MoveInsert;
    move.status = "VALID";
    return move;
  };

  const moves = submittedMoves
    .map(moveMapper)
    .map(ruleAdjacency)
    .map(ruleUnitTypeDestination)
    .map(ruleArmyConvoyedFromCoastToCoast)
    .map(ruleBuildinSuppCenters);
  return moves;
}

export function moveInPositionValidator(
  moves: MoveInsert[],
  gamePosition: GamePosition,
  playerCountry: NonNullable<Country>,
) {
  moves
    .map(ruleSelfUnitShouldExist(gamePosition, playerCountry))
    .map(ruleBuildOnlyInDomesticSupplyCenters(playerCountry))
    .reduceRight(ruleOneMovePerUnit, []);
  return moves;
}

export function movePhaseValidator(
  moves: MoveInsert[],
  phase: GamePhase,
) {
  moves.map(rulePhase(phase));
  return moves;
}
