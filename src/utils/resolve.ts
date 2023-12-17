import { Move, MoveType } from "types/moves.ts";
import { ProvinceCode } from "types/provinces.ts";
import { PlayerGame } from "types/playerGames.ts";
import { Game } from "types/game.ts";
import { Country } from "types/country.ts";

type MoveIntention = {
  id: string;
  to: ProvinceCode;
  origin: ProvinceCode;
  type: MoveType;
  score: number;
};

function createIntentions(moves: Move[]) {
  /* Creates intentions for moves the outcome of which is depending on resolution of conflicts. */
  return moves.filter((mv) => ["MOVE", "HOLD", "CONVOY"].includes(mv.type))
    .filter((mv) => mv.type == "CONVOY" && mv.unit_type == "Fleet")
    .map((mv) => ({
      id: mv.id,
      to: mv.to,
      origin: mv.origin,
      type: mv.type,
      score: 1 + 0.5 * Number(mv.type == "HOLD"),
    } as MoveIntention));
}
function cutSupports(move: Move, intentions: MoveIntention[]) {
  /* Cuts support or convoy whenever origin province being under attack. */
  if (
    !(move.type == "SUPPORT" ||
      (move.type == "CONVOY" && move.unit_type == "Fleet"))
  ) return move;
  if (intentions.some((int) => int.to == move.origin)) move.status = "FAILED";
  return move;
}

function verifyConvoy(move: Move, moves: Move[]) {
  /* Verify success of convoy if chain of convoys was build and not cut. */
  if (!(move.type == "CONVOY" && move.unit_type == "Army" && move.from)) {
    return move;
  }
  const convMoves = moves.filter((mv) =>
    mv.unit_type == "Fleet" && mv.type == "CONVOY" && mv.status != "FAILED"
  );

  const findNextChainEl = (from: ProvinceCode, k: number) => { // builds recursive chain of convoys while not reached destination (move.to)
    if (from == move.to) {
      move.status == "SUCCEED";
    }
    k += 1;
    if (k > 30) return;
    convMoves.filter((mv) => mv.from == from).forEach((mv) =>
      findNextChainEl(mv.to, k)
    );
  };
  let k = 0; // prevents infinite recursions
  findNextChainEl(move.from, k);

  return move;
}

function calcScores(move: Move, intentions: MoveIntention[]) {
  /* Conflict resolution depends on scores calculated by this function */
  if (move.type == "SUPPORT" && move.status != "FAILED") {
    const supportedIntention = intentions.find((int) =>
      int.origin == move.from && int.to == move.to
    );
    if (supportedIntention) supportedIntention.score += 1;
  }
  return move;
}

function succedIntention(
  id: string,
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
) {
  const move = moves.find((x) => x.id = id)!;
  move.status = "SUCCEED";
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

function failedIntention(
  id: string,
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
) {
  const move = moves.find((x) => x.id = id)!;
  move.status = "FAILED";
  const country = playerGames.find((pg) => pg.id == move.player_game)!.country!;
  // if (move.type !== "HOLD") {
  //   game.game_position.dislodged[country].push(move.to);
  // }
}

function resolveConflicts(
  group: MoveIntention[],
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
) {
  if (group[0].score == group[1].score) { // if standoff took place
    group.forEach((intention) =>
      failedIntention(intention.id, moves, game, playerGames)
    );
  } else {
    group.forEach((intention, i) =>
      i == 0
        ? succedIntention(intention.id, moves, game, playerGames)
        : failedIntention(intention.id, moves, game, playerGames)
    );
  }
}

export function calcNextPosition(
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
): [Move[], Game] {
  const intentions = createIntentions(moves);
  const resultMoves = moves
    .map((mv) => cutSupports(mv, intentions))
    .map((mv) => verifyConvoy(mv, moves))
    .map((move) => calcScores(move, intentions));
  intentions.forEach(i1 => intentions.forEach(i2 => {
    if (i1.origin == i2.to && i2.origin == i1.to && i1.score == i2.score) {
      failedIntention(i1.id, moves, game, playerGames);
      failedIntention(i2.id, moves, game, playerGames);
    }
  })) // intention is failed if armies try to exchange positions
  const grouped = Object.groupBy(intentions, ({ to }) => to);
  const sortedGroups = Object.keys(grouped).map((province) =>
    grouped[province as ProvinceCode].sort((a, b) => a.score - b.score)
  );
  sortedGroups.forEach((group) =>
    resolveConflicts(group, resultMoves, game, playerGames)
  );
  return [resultMoves, game];
}
