import { MoveInsert, SubmittedMove } from "types/moves.ts";
import {
  armyBorders,
  fleetBorders,
  ProvinceCode,
  provinces,
  ProvinceType,
} from "types/provinces.ts";
import {
  GamePosition,
  isOccupied,
  SUPPLY_CENTERS,
} from "types/gamePosition.ts";
import { Game, GamePhase } from "types/game.ts";
import { getCountry, PlayerGame } from "types/playerGames.ts";
import { Unit } from "types/units.ts";
import { Country } from "types/country.ts";

const ruleAdjacency = (move: MoveInsert) => {
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

const ruleUnitTypeDestination = (move: MoveInsert) => {
  /* Armies cannot go to sea, fleets cannot go to land */
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
  if (move.type != "CONVOY" || move.unit_type != "Army") return move;
  if (!move.origin) return move;
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
    provinces[move.to].type === ProvinceType.Land &&
    move.unit_type === "Fleet"
  ) move.status = "INVALID";
  return move;
};

const ruleDefendOnlySelfOrigin = (move: MoveInsert) => {
  /* Reject defend moves if where to not equals origin */
  if (move.type !== "HOLD") return move;
  if (move.to !== move.origin) move.status = "INVALID";
  return move;
};

const ruleOneMovePerUnit = (prevOrigins: ProvinceCode[], move: MoveInsert) => {
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
  (move: MoveInsert) => {
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
  (playerGames: PlayerGame[]) => (move: MoveInsert) => {
    const country = getCountry(move.player_game, playerGames);
    if (move.type !== "BUILD") return move;
    if (!country) return move;
    if (SUPPLY_CENTERS[move.to] !== country) move.status = "INVALID";
    return move;
  };

const rulePhase = (phase: GamePhase) => (move: MoveInsert) => {
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
): MoveInsert[] => {
  /* Validates submitted moves (to prevent players' cheating by submitting moves directly to supabase). */
  const moveMapper = (smove: SubmittedMove) => {
    const move = smove as MoveInsert;
    move.status = "VALID";
    delete move.id;
    delete move.created_at;
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
    moves: MoveInsert[],
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
(moves: MoveInsert[]) => {
  return moves.map(rulePhase(phase));
};

const autoInsertUnmovedUnits = (
  game: Game,
  pg: PlayerGame,
  moves: MoveInsert[],
) => {
  /* Automatically orders unmoved units to hold the position. */
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
      } as MoveInsert)
    );
};

const isUnit = (item: Unit | undefined): item is Unit => {
  return !!item;
};

const pickRandomN = <T>(arr: Array<T>, len: number) => {
  /* Random sample of N elements */
  const shuffled = arr.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, len);
};

const retreatTo = (
  unit: Unit,
  gamePosition: GamePosition,
  dislodgedFrom: ProvinceCode,
) => {
  const borders = unit.unitType == "Army"
    ? armyBorders[unit.province]
    : fleetBorders[unit.province];
  const options = borders!
    .filter((province) => province != dislodgedFrom)
    .filter((province) => !isOccupied(gamePosition)(province))
    .filter((province) => !gamePosition.standoffs?.includes(province));
  return pickRandomN(options, 1).at(0);
};

const autoInsertRetreatMoves = (
  game: Game,
  pg: PlayerGame,
  moves: MoveInsert[],
) => {
  /* Orders dislodged units that were not moved to retreat to random province.  */
  if (!game.game_position.dislodged) return moves;
  game.game_position.dislodged[pg.country!]
    .filter((dislodge) =>
      !moves.map((mv) => mv.origin).includes(dislodge.province)
    )
    .forEach((dislodge) => {
      const unit = game.game_position.unitPositions[pg.country!].find((unit) =>
        unit.province == dislodge.province
      );
      if (!isUnit(unit)) return;
      moves.push({
        type: "RETREAT",
        to: retreatTo(unit, game.game_position, dislodge.dislodgedFrom),
        from: null,
        origin: unit.province,
        unit_type: unit.unitType,
        player_game: pg.id,
        game: game.id,
        status: "VALID",
        player: pg.player,
        phase: game.phase!.id,
      } as MoveInsert);
    });
};

const getGainingLosingNumber = (
  game: Game,
  pg: PlayerGame,
) => {
  const numOfSupplyCenters = game.game_position.domains[pg.country!]
    .map(
      (province) => Number(Object.keys(SUPPLY_CENTERS).includes(province)),
    ).reduce((acc, curr) => acc + curr, 0);

  const numOfUnits = game.game_position.unitPositions[pg.country!].length;
  return numOfSupplyCenters - numOfUnits;
};

export const buildOrigins = (
  country: NonNullable<Country>,
  gamePosition: GamePosition,
) => {
  /* Returns non-occupied provinces where build is possible */
  return gamePosition.domains[country]
    .filter((province) => SUPPLY_CENTERS[province] == country)
    .filter((province) => !isOccupied(gamePosition)(province));
};

const autoInsertBuildOrDisband = (
  game: Game,
  pg: PlayerGame,
  moves: MoveInsert[],
) => {
  /* If player did not make gaining & loosing moves (the number of supply centers not equal to number of units) -- chose automatically which units to build or disband.  */

  const gainingLosingNumber = getGainingLosingNumber(game, pg) -
    moves
      .map((move) => Number(move.type == "BUILD"))
      .reduce((acc, val) => acc + val, 0) +
    moves.map((move) => Number(move.type == "DISBAND")).reduce(
      (acc, val) => acc + val,
      0,
    );

  if (gainingLosingNumber > 0) {
    pickRandomN(buildOrigins(pg.country!, game.game_position), Math.abs(gainingLosingNumber))
    .forEach((province) =>
      moves.push({
        type: "BUILD",
        to: province,
        from: null,
        origin: null,
        unit_type: "Army",
        player_game: pg.id,
        game: game.id,
        status: "VALID",
        player: pg.player,
        phase: game.phase!.id,
      } as MoveInsert)
    );
  }
  if (gainingLosingNumber < 0) {
    pickRandomN(game.game_position.unitPositions[pg.country!], Math.abs(gainingLosingNumber))
    .forEach((unit) =>
      moves.push({
        type: "DISBAND",
        to: unit.province,
        from: null,
        origin: unit.province,
        unit_type: unit.unitType,
        player_game: pg.id,
        game: game.id,
        status: "VALID",
        player: pg.player,
        phase: game.phase!.id,
      } as MoveInsert)
    );
  }

};

export const addAutoMoves = (
  game: Game,
  playerGames: PlayerGame[],
) =>
(moves: MoveInsert[]) => {
  switch (game.phase!.phase) {
    case "Diplomatic":
      playerGames.forEach((pg) =>
        autoInsertUnmovedUnits(
          game,
          pg,
          moves.filter((mv) => mv.player_game == pg.id),
        )
      );
      break;
    case "Retreat and Disbanding":
      playerGames.forEach((pg) =>
        autoInsertRetreatMoves(
          game,
          pg,
          moves.filter((mv) => mv.player_game == pg.id),
        )
      );
      break;
    case "Gaining and Losing":
      playerGames.forEach((pg) =>
        autoInsertBuildOrDisband(
          game,
          pg,
          moves.filter((mv) => mv.player_game == pg.id),
        )
      );
      break;
  }
  return moves;
};
