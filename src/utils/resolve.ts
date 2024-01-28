import { Move } from "types/moves.ts";
import {
  isConvoyFromPossible,
  isConvoyToPossible,
  ProvinceCode,
} from "types/provinces.ts";
import { PlayerGame } from "types/playerGames.ts";
import { Phase } from "types/game.ts";
import {
  createIntentions,
  isActiveMove,
  isAttacking,
  isConvoying,
  isDisrupted,
  isHoldingProvince,
  isSupporting,
  isTargetingSameProvince,
  isTradingProvinceAttempt,
  MoveIntention,
} from "../types/intentions-utils.ts";

import { calcNextPositionDiplomatic, calcNextPositionDisbandAndRetreat, calcNextPositionGainingAndLosing } from "utils/calcPosition.ts";
import { GamePosition } from "types/gamePosition.ts";

const findOccupant = (
  provinceCode: ProvinceCode,
  intentions: MoveIntention[],
) => {
  // occupant is the unit that either holding province or coming back to it in result of bouncing
  return intentions.find((i) =>
    (i.bounced && i.move.origin == provinceCode) ||
    (!isActiveMove(i) && i.move.origin == provinceCode) ||
    (isHoldingProvince(i, provinceCode))
  );
};

const cutSupports =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Cuts support whenever origin province being under attack. */
    if (
      intention.move.type != "SUPPORT"
    ) return intention;
    if (
      intentions.some((i) =>
        isAttacking(i, intention) &&
        intention.move.to != i.move.origin && // support cannot be cut from province where support is directed
        isActiveMove(i)
      )
    ) {
      intention.cut = true;
    }
    return intention;
  };

const dislodgeUnit = (occupant: MoveIntention, attacker: MoveIntention) => {
  /* Dislodges unit or bounce if dislodged belongs to self. */
  if (attacker.move.player_game == occupant.move.player_game) {
    attacker.bounced = true;
    return;
  }
  occupant.dislodged = true;
  !isActiveMove(occupant) ? occupant.cut = true : null; // cut support or convoy
  occupant.dislodgedFrom = attacker.move.origin;
};

const verifyConvoy =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Verify success of convoy if chain of convoys was build and not cut. */
    if (
      !(intention.move.type == "CONVOY" && intention.move.unit_type == "Army")
    ) {
      return intention;
    }
    const convIntentions = intentions.filter((i) =>
      !i.dislodged && isConvoying(i, intention)
    );

    const findNextChainEl = (
      current: ProvinceCode,
      prev: ProvinceCode | null,
      k: number,
    ) => { // builds recursive chain of convoys while not reached destination (move.to)
      if (isConvoyToPossible(current, intention.move.to)) {
        intention.bounced = false; // convoy succed
        return;
      }
      k += 1;
      if (k > 30) return;
      convIntentions.filter((i) => i.move.origin != prev).filter((i) =>
        isConvoyFromPossible(current, i.move.origin!)
      ).forEach(
        (i) => findNextChainEl(i.move.origin!, current, k),
      );
    };
    let k = 0; // prevents infinite recursions
    intention.bounced = true; // assume convoy failed
    findNextChainEl(intention.move.origin!, null, k);

    return intention;
  };

const calcScores =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Adds 1 to intention score if move was successfuly supported */
    intentions.filter((i) =>
      !intention.cut &&
      isSupporting(intention, i)
    ).forEach((i) => {
      i.score += 1;
    });
    return intention;
  };

const resolveProvinceSwitch =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Checks if there're intentions that try to trade two provinces with equal strength. */
    if (intention.move.type !== "MOVE") return intention;
    intentions.forEach((i) => {
      if (
        isTradingProvinceAttempt(i, intention)
      ) {
        if (i.score > intention.score) { // if weaker, the unit is dislodged and move is bounced
          dislodgeUnit(intention, i);
        }
        if (i.score == intention.score) intention.bounced = true; // if strength are equal bounced
      }
    });
    return intention;
  };

const resolveConflicts = (group: MoveIntention[], occupant?: MoveIntention) =>
(
  intention: MoveIntention,
) => {
  /* Determines winner in contested regions. */
  if (occupant && intention.score == 1) {
    intention.bounced = true;
    intention.standoffIn = intention.move.to;
  }
  if (occupant && intention.score > 1) {
    dislodgeUnit(occupant, intention);
  }

  if (group.length == 1) return intention;
  const isFirst = group[0].move.id == intention.move.id;
  const isEqaulForces = group[0].score == group[1].score;
  if ((!isFirst || isEqaulForces) && intention.move.type != "HOLD") {
    intention.bounced = true;
    intention.standoffIn = intention.move.to;
  }
  if (!isFirst && !isEqaulForces && intention.move.type == "HOLD") { // dislodge unit with HOLD order
    dislodgeUnit(intention, group[0]);
  }

  return intention;
};

const resolveContestedRegions =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Create a group for each contested region and determines if it's occupied. */
    if (!isActiveMove(intention)) return intention;
    const group = intentions
      // .filter((i) => isActiveMove(i))
      .filter((i) =>
        isTargetingSameProvince(i, intention)
      ) // select moves attacking or holding province
      .filter((i) => !(i.dislodged && i.dislodgedFrom == i.move.to)); // dislodged units have no effect on provinces that disloded it

    const occupant = findOccupant(
      intention.move.to,
      intentions.filter((i) => i.move.type != "HOLD"),
    );

    const sortedGroup = group.sort((a, b) => b.score - a.score);
    return resolveConflicts(sortedGroup, occupant)(intention);
  };

function diplomaticPhaseResolver(
  moves: Move[],
  game_position: GamePosition,
  playerGames: PlayerGame[],
): [Move[], GamePosition] {
  const intentions = createIntentions(moves);
  let prevDisrupted = intentions.map(isDisrupted);


  intentions
    .map(cutSupports(intentions))
    .map(verifyConvoy(intentions))
    .map(calcScores(intentions))
    .map(resolveProvinceSwitch(intentions))
    .map(resolveContestedRegions(intentions));  


  while (
    intentions.some((i, index) => isDisrupted(i) !== prevDisrupted[index])
  ) { // resolve chained bounces
    prevDisrupted = intentions.map(isDisrupted);
    intentions.forEach((i) => i.score = i.move.type == "HOLD" ? 1.5 : 1);
    intentions
      .map(calcScores(intentions))
      .map(verifyConvoy(intentions))
      .map(resolveContestedRegions(intentions));
  }

  return calcNextPositionDiplomatic(intentions, moves, game_position, playerGames);
}

export function phaseResolver(
  moves: Move[],
  phase: Phase,
  playerGames: PlayerGame[],
): [Move[], GamePosition] {
  switch (phase?.phase) {
    case "Diplomatic":
      delete phase!.game_position.built;
      delete phase!.game_position.disbanded;
      delete phase!.game_position.standoffs;
      delete phase!.game_position.dislodged;
      return diplomaticPhaseResolver(moves, phase.game_position, playerGames);
    case "Retreat and Disbanding":
      return calcNextPositionDisbandAndRetreat(moves, phase.game_position, playerGames, phase.turn);
    case "Gaining and Losing":
      return calcNextPositionGainingAndLosing(moves, phase.game_position, playerGames);
  }
  return [moves, phase.game_position];
}
