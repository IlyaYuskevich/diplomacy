import { assert, assertFalse } from "assert";
import {
  isHoldingProvince,
  isSupporting,
  MoveIntention,
} from "types/intentions-utils.ts";
import { createGame, generateMove } from "utils/test-utils.ts";
import { Move } from "types/moves.ts";
import { PlayerGame } from "types/playerGames.ts";

Deno.test("isHoldingProvince: simple hold", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "HOLD",
    "Ber",
    "Ber",
    null,
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  assert(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Ber"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Mun"),
  );
});

Deno.test("isHoldingProvince: two-coast", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "HOLD",
    "SpaN",
    "SpaN",
    null,
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Spa",
    "Spa",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  assert(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Spa"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Bur"),
  );
  assert(
    isHoldingProvince({ move: moves.at(1)!, score: 0 } as MoveIntention, "Spa"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(1)!, score: 0 } as MoveIntention, "Bur"),
  );
});

Deno.test("isHolding: SUPPORT move (support moves can receive support, so they also holding province)", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "SUPPORT",
    "SpaN",
    "Gas",
    "Par",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Ber",
    "Sil",
    "War",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "SpaS",
    "Mar",
    "Mar",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  assert(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Spa"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(0)!, score: 0 } as MoveIntention, "Bur"),
  );
  assert(
    isHoldingProvince({ move: moves.at(1)!, score: 0 } as MoveIntention, "Ber"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(1)!, score: 0 } as MoveIntention, "Sil"),
  );
  assert(
    isHoldingProvince({ move: moves.at(2)!, score: 0 } as MoveIntention, "Spa"),
  );
  assertFalse(
    isHoldingProvince({ move: moves.at(2)!, score: 0 } as MoveIntention, "Mar"),
  );
});

Deno.test("isSupporting: simple support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "SUPPORT",
    "Ber",
    "Sil",
    "Mun",
    "Army",
    "GERMANY",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "MOVE",
    "Mun",
    "Sil",
    null,
    "Army",
    "RUSSIA",
    moves,
    playerGames,
    game,
  );
  assert(
    isSupporting(
      { move: moves.at(0)!, score: 0 } as MoveIntention,
      { move: moves.at(1)!, score: 0 } as MoveIntention,
    ),
  );
});

Deno.test("isSupporting: hold supprt", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "SUPPORT",
    "SpaS",
    "Mar",
    "Mar",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "HOLD",
    "Mar",
    "Mar",
    null,
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  assert(
    isSupporting(
      { move: moves.at(0)!, score: 0 } as MoveIntention,
      { move: moves.at(1)!, score: 0 } as MoveIntention,
    ),
  );
});

Deno.test("isSupporting: support of support", () => {
  const game = createGame();
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  generateMove(
    "SUPPORT",
    "SpaS",
    "Mar",
    "Mar",
    "Fleet",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  generateMove(
    "SUPPORT",
    "Mar",
    "Spa",
    "Spa",
    "Army",
    "FRANCE",
    moves,
    playerGames,
    game,
  );
  assert(
    isSupporting(
      { move: moves.at(0)!, score: 0 } as MoveIntention,
      { move: moves.at(1)!, score: 0 } as MoveIntention,
    ),
  );
  assert(
    isSupporting(
      { move: moves.at(1)!, score: 0 } as MoveIntention,
      { move: moves.at(0)!, score: 0 } as MoveIntention,
    ),
  );
});
