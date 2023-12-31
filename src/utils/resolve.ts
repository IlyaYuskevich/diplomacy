import { Move } from "types/moves.ts";
import { ProvinceCode, fleetBorders } from "types/provinces.ts";
import { PlayerGame } from "types/playerGames.ts";
import { Game } from "types/game.ts";
import { Country } from "types/country.ts";

type MoveIntention = { // wrapper around move representing it the process of conflict resolution according to Diplomacy rules
  move: Move;
  score: number; // score given to unit to resolve particular case
  bounced: boolean; // when unit's movement was blocked, it stays in the original province and acts as unit ordererd to HOLD
  dislodged: boolean; // when unit pushed out from the original province; unit can be bounced and dislodged at the same time
  dislodgedFrom: ProvinceCode | null; // province code that caused dislodgement
  cut: boolean; // support is cut when supporting unit province is under attack
  resolved: boolean; // final state, resolver won't change intention state. if all intentions are resolved, the resolver stops iterating
};

function createIntentions(moves: Move[]) {
  /* Creates intentions that are iterated over. */
  return moves
    .map((mv) => ({
      move: mv,
      score: 1 + 0.5 * Number(mv.type == "HOLD"),
    } as MoveIntention));
}

const isActiveMove = (intention: MoveIntention) => {
  return ["MOVE", "HOLD"].includes(intention.move.type) ||
    (intention.move.type == "CONVOY" && intention.move.unit_type == "Army");
};

const isTargetingSameProvince = (
  intention1: MoveIntention,
  intention2: MoveIntention,
) => {
  /* Verifies that provided intentions target same province. */
  return intention1.move.to == intention2.move.to;
};

const isTradingProvinceAttempt = (
  intention1: MoveIntention,
  intention2: MoveIntention,
) => {
  /* Verify if provided moves try to occupy each other's origin province. */
  return intention1.move.origin == intention2.move.to &&
    intention2.move.origin == intention1.move.to &&
    intention1.move.id != intention2.move.id;
};

const isSupporting = (support: MoveIntention, supported: MoveIntention) => {
  /* Verify that argument supports second argument. */
  return support.move.type == "SUPPORT" &&
    support.move.from == supported.move.origin &&
    support.move.to == supported.move.to;
};

const isConvoying = (convoyer: MoveIntention, convoyee: MoveIntention) => {
  /* Verify atomic convoy order. */
  return convoyer.move.type == "CONVOY" && convoyer.move.unit_type == "Fleet" &&
    convoyer.move.from == convoyee.move.origin &&
    convoyer.move.to == convoyee.move.to;
};

const isAttacking = (attacker: MoveIntention, defender: MoveIntention) => {
  /* Verify that first argument tries to attack (move or support) province occupied by second argument. */
  return attacker.move.to == defender.move.origin &&
    attacker.move.id != defender.move.id;
};

const isHoldingProvince = (
  intention: MoveIntention,
  province: ProvinceCode,
) => {
  return intention.move.type == "HOLD" && intention.move.origin == province;
};

const isDisrupted = (intention: MoveIntention) => {
  return intention.cut || intention.bounced || intention.dislodged || false;
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
    return
  }
  occupant.dislodged = true;
  !isActiveMove(occupant) ? occupant.cut = true : null; // cut support or convoy
  occupant.dislodgedFrom = attacker.move.origin;
}

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

    const findNextChainEl = (current: ProvinceCode, prev: ProvinceCode | null, k: number) => { // builds recursive chain of convoys while not reached destination (move.to)
      if (fleetBorders[current]!.includes(intention.move.to)) {
        intention.bounced = false; // convoy succed
        return
      }
      k += 1;
      if (k > 30) return;
      convIntentions.filter(i => i.move.origin != prev).filter((i) => fleetBorders[current]!.includes(i.move.origin!)).forEach(
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
  }
  if (occupant && intention.score > 1) {
    dislodgeUnit(occupant, intention);
  }

  if (group.length == 1) return intention;
  const isFirst = group[0].move.id == intention.move.id;
  const isStandoff = group[0].score == group[1].score;
  if ((!isFirst || isStandoff) && intention.move.type != "HOLD") {
    intention.bounced = true;
  }
  if (!isFirst && !isStandoff && intention.move.type == "HOLD") { // dislodge unit with HOLD order
    dislodgeUnit(intention, group[0]);
  }

  return intention;
};

const resolveContestedRegions =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Create a group for each contested region and determines if it's occupied. */
    if (!isActiveMove(intention)) return intention;
    const group = intentions
      .filter((i) => isActiveMove(i))
      .filter((i) =>
        isTargetingSameProvince(i, intention) ||
        isHoldingProvince(i, intention.move.to)
      ) // select moves attacking or holding province
      .filter((i) => !(i.dislodged && i.dislodgedFrom == i.move.to)); // dislodged units have no effect on provinces that disloded it

    const occupant = intentions.find((i) =>
      (i.bounced && isAttacking(intention, i)) ||
      (!isActiveMove(i) && isAttacking(intention, i))
    );

    const sortedGroup = group.sort((a, b) => b.score - a.score);
    return resolveConflicts(sortedGroup, occupant)(intention);
  };

const markFailedMoves = (moves: Move[]) => (intention: MoveIntention) => {
  const move = moves.find((mv) => mv.id == intention.move.id)!;
  move.status = (intention.dislodged || intention.bounced || intention.cut)
    ? "FAILED"
    : "SUCCEED";
  return move;
};

export function phaseResolver(
  moves: Move[],
  game: Game,
): [Move[], Game] {
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
    // console.log("loop!");
  }

  console.log("!!!", intentions);

  const resultMoves = intentions.map(markFailedMoves(moves));

  // console.log("@", resultMoves);
  return [resultMoves, game];
}

function calcNextPosition(move: Move, game: Game, playerGames: PlayerGame[]) {
  const country = playerGames.find((pg) => pg.id == move.player_game)!.country!;
  if (move.type !== "HOLD") {
    game.game_position.unitPositions[country].find((x) =>
      x.province == move.origin
    )!.province = move.to;
    Object.keys(game.game_position.domains).forEach((country) => {
      const domains =
        game.game_position.domains[country as NonNullable<Country>];
      const index = domains.indexOf(move.to);
      domains.splice(index, 1);
    });
    game.game_position.domains[country].push(move.to);
  }
}
