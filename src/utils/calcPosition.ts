import mimeDbV1520 from "https://deno.land/std@0.208.0/media_types/vendor/mime-db.v1.52.0.ts";
import { GamePosition } from "types/gamePosition.ts";
import { Move } from "types/moves.ts";
import { ProvinceCode } from "types/provinces.ts";

type MoveIntention = {
  id: string;
  to: ProvinceCode;
  origin: ProvinceCode;
  score: number;
};
export function findSucced(moves: Move[]) {
  const intentions = moves.filter((mv) =>
    !["SUPPORT", "DESTROY"].includes(mv.type)
  )
    .filter((mv) => mv.type == "CONVOY" && mv.unit_type == "Fleet")
    .map((mv) => ({
      id: mv.id,
      to: mv.to,
      origin: mv.origin,
      score: 1,
    } as MoveIntention));
  moves
    .map((mv) => cutSupports(mv, intentions))
    .map((mv) => verifyConvoy(mv, moves))
    .forEach((move) => calcScores(move, intentions));
}

function cutSupports(move: Move, intentions: MoveIntention[]) {
  if (
    !(move.type == "SUPPORT" ||
      (move.type == "CONVOY" && move.unit_type == "Fleet"))
  ) return move;
  if (intentions.some((int) => int.to == move.origin)) move.status = "FAILED";
  return move;
}

function verifyConvoy(move: Move, moves: Move[]) {
  if (!(move.type == "CONVOY" && move.unit_type == "Army" && move.from)) return move;
  const convMoves = moves.filter((mv) =>
    mv.unit_type == "Fleet" && mv.type == "CONVOY" && mv.status != "FAILED"
  );

  const findNextChainEl = (from: ProvinceCode, k: number) => { // builds recursive chain of convoys while not reach destination (move.to)
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
  findNextChainEl(move.from, k)

  return move;
}

function calcScores(move: Move, intentions: MoveIntention[]) {
  switch (move.type) {
    case "MOVE":
      intentions.filter((int) => int.to == move.to).forEach((int) =>
        int.score -= 1
      );
      break;
    case "DEFEND":
      intentions.filter((int) => int.to == move.to).forEach((int) =>
        int.score -= 1
      );
      break;
    case "SUPPORT":
      if (move.status == "FAILED") break;
      intentions.filter((int) =>
        (int.to == move.to) && (int.origin == move.from)
      ).forEach((int) => int.score += 1);
      break;
    case "CONVOY":
      if (move.status == "SUCCEED" && move.unit_type == "Army") {
        intentions.filter((int) => int.to == move.to).forEach((int) =>
          int.score -= 1
        );
      }
  }
}

export function calcNextPosition(gamePosition: GamePosition, moves: Move[]) {
}
