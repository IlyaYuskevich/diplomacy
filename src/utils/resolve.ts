import { Move } from "types/moves.ts";
import { ProvinceCode } from "types/provinces.ts";
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

const cutSupports =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Cuts support or convoy whenever origin province being under attack. */
    if (
      isActiveMove(intention)
    ) return intention;
    if (
      intentions.some((int) =>
        int.move.to == intention.move.origin &&
        intention.move.to != int.move.origin // support cannot be cut from province where support is directed
      )
    ) {
      intention.cut = true;
    }
    return intention;
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
      i.move.unit_type == "Fleet" && i.move.type == "CONVOY" &&
      !i.cut
    );

    const findNextChainEl = (current: ProvinceCode, k: number) => { // builds recursive chain of convoys while not reached destination (move.to)
      if (current == intention.move.to) {
        intention.bounced = false; // convoy succed
      }
      k += 1;
      if (k > 30) return;
      convIntentions.filter((i) => i.move.from == current).forEach(
        (i) => findNextChainEl(i.move.to, k),
      );
    };
    let k = 0; // prevents infinite recursions
    intention.bounced = true; // assume convoy failed
    findNextChainEl(intention.move.origin!, k);

    return intention;
  };

const calcScores =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Adds 1 to intention score if move was successfuly supported */
    intentions.filter((i) =>
      intention.move.type == "SUPPORT" && !intention.cut &&
      i.move.origin == intention.move.from &&
      i.move.to == intention.move.to
    ).forEach((i) => {
      i.score += 1;
      i.move.status = "SUCCEED";
    });
    return intention;
  };

const resolveProvinceSwitch =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Checks if there're intentions that try to trade two provinces with equal strength. */
    if (intention.move.type !== "MOVE") return intention;
    intentions.forEach((i) => {
      if (
        intention.move.origin == i.move.to &&
        i.move.origin == intention.move.to &&
        intention.move.id != i.move.id
      ) {
        if (i.score > intention.score) { // if weaker, the unit is dislodged and move is bounced
          intention.dislodged = true;
          intention.dislodgedFrom = i.move.origin;
          intention.bounced = true;
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
  if (group.length == 1) return intention;
  const isFirst = group[0].move.id == intention.move.id;
  const isStandoff = group[0].score == group[1].score;
  if (!isFirst || isStandoff) {
    intention.bounced = true;
  }
  if (!isFirst && !isStandoff && intention.move.type == "HOLD") { // dislodge unit with HOLD order
    intention.dislodged = true;
  }
  if (occupant && intention.score > 1) {
    occupant.dislodged = true;
    occupant.dislodgedFrom = intention.move.from;
  }
  return intention;
};

const resolveContestedRegions =
  (intentions: MoveIntention[]) => (intention: MoveIntention) => {
    /* Create a group for each contested region and determines if it's occupied. */
    if (!isActiveMove(intention)) return intention;
    const group = intentions
      .filter((i) => isActiveMove(i))
      .filter((i) => (i.move.to == intention.move.to)) // select active moves targeting the same province
      .filter((i) => !(i.dislodged && i.dislodgedFrom == i.move.to)); // dislodged units have no effect on provinces that disloded it

    const occupant = intentions.find((i) =>
      (i.bounced && i.move.origin == intention.move.to) ||
      (!isActiveMove(i) && i.move.origin == intention.move.to)
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
  let prevBounced = intentions.map((i) => i.bounced);

  intentions
    .map(cutSupports(intentions))
    .map(verifyConvoy(intentions))
    .map(calcScores(intentions))
    .map(resolveProvinceSwitch(intentions))
    .map(resolveContestedRegions(intentions));

  while (intentions.some((i, index) => i.bounced !== prevBounced[index])) { // resolve chained bounces
    prevBounced = intentions.map((i) => i.bounced);
    intentions.map(resolveContestedRegions(intentions));
    console.log("loop!");
  }

  console.log("!!!", intentions);

  const resultMoves = intentions.map(markFailedMoves(moves));

  console.log("@", resultMoves);
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
