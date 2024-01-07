import { assertEquals } from "assert";
import { Move, MoveType, SubmittedMove } from "types/moves.ts";
import {
  individualMoveValidator,
  moveInPositionValidator,
} from "utils/validators.ts";
import { GamePosition } from "types/gamePosition.ts";
import { PlayerGame } from "types/playerGames.ts";
import formatISO from "date-fns/formatISO/index.js";
import { ProvinceCode } from "types/provinces.ts";
import { UnitType } from "types/units.ts";
import { Country } from "types/country.ts";
import { Game } from "types/game.ts";
import { createGame, findOrCreatePlayerGame, generateMove } from "utils/resolve.test.ts";

function generateSubmittedMove(
  moveType: MoveType,
  origin: ProvinceCode,
  to: ProvinceCode,
  from: ProvinceCode | null,
  unitType: UnitType,
  country: NonNullable<Country>,
  submittedMoves: SubmittedMove[],
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
  } as SubmittedMove;
  submittedMoves.push(move);
}

Deno.test("assert valid moves receive status VALID", () => {
  const validMoves: SubmittedMove[] = [];
  const playerGames: PlayerGame[] = [];
  const game = createGame();
  generateSubmittedMove("MOVE", "Ber", "Kie", null, "Army", "GERMANY", validMoves, playerGames, game);
  generateSubmittedMove("SUPPORT", "Mun", "Tyr", "Ven", "Army", "GERMANY", validMoves, playerGames, game);
  generateSubmittedMove("HOLD", "Kie", "Kie", null, "Fleet", "GERMANY", validMoves, playerGames, game);
  generateSubmittedMove("CONVOY", "Lon", "Spa", null, "Army", "ENGLAND", validMoves, playerGames, game);
  generateSubmittedMove("CONVOY", "StP", "Lon", null, "Fleet", "RUSSIA", validMoves, playerGames, game);
  const movesToSubmit = individualMoveValidator(validMoves);
  movesToSubmit.forEach((move) => assertEquals(move.status, "VALID", JSON.stringify(move)));
});

Deno.test("assert invalid moves receive status INVALID", () => {
  const invalidMoves: SubmittedMove[] = [];
  const playerGames: PlayerGame[] = [];
  const game = createGame();
  generateSubmittedMove("MOVE", "Ber", "Boh", null, "Army", "GERMANY", invalidMoves, playerGames, game);  // provinces are not adjacent
  generateSubmittedMove("MOVE", "Ber", "Bal", null, "Army", "GERMANY", invalidMoves, playerGames, game);  // army cannot move to sea
  generateSubmittedMove("MOVE", "Ber", "Sil", null, "Fleet", "GERMANY", invalidMoves, playerGames, game);  // fleet cannot move to land
  generateSubmittedMove("CONVOY", "NAf", "Mos", null, "Army", "ENGLAND", invalidMoves, playerGames, game);  // convoy cannot end up in land
  const invalidMovesToSubmit = individualMoveValidator(invalidMoves);
  invalidMovesToSubmit.forEach((move) => assertEquals(move.status, "INVALID", JSON.stringify(move)));

  invalidMovesToSubmit.forEach((move) =>
    assertEquals(
      move.status,
      "INVALID",
      `Move ${JSON.stringify(move)} shall be invalid`,
    )
  );
});

Deno.test("assert validity of moves with respect to previous position", () => {
  const validMoves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  const game = createGame();
  generateMove("MOVE", "Ber", "Kie", null, "Army", "GERMANY", validMoves, playerGames, game);
  generateMove("SUPPORT", "Mun", "Tyr", "Ven", "Army", "GERMANY", validMoves, playerGames, game);
  generateMove("HOLD", "Kie", "Kie", null, "Fleet", "GERMANY", validMoves, playerGames, game);
  generateMove("CONVOY", "Lon", "Spa", null, "Army", "ENGLAND", validMoves, playerGames, game);
  generateMove("CONVOY", "StP", "Lon", null, "Fleet", "RUSSIA", validMoves, playerGames, game);
  const movesToSubmit = moveInPositionValidator(game.game_position, playerGames)(
    validMoves,
  );
  movesToSubmit.forEach((move) => assertEquals(move.status, "VALID", JSON.stringify(move)));

  movesToSubmit.forEach((move) => assertEquals(move.status, "VALID", move.id));
});

Deno.test("test invalid moves with respect to a game position", () => {
  const moves: Move[] = [];
  const playerGames: PlayerGame[] = [];
  const game = createGame();
  generateMove("MOVE", "Ber", "Kie", null, "Army", "GERMANY", moves, playerGames, game);
  generateMove("SUPPORT", "Boh", "Tyr", "Ven", "Army", "GERMANY", moves, playerGames, game);
  generateMove("MOVE", "Ber", "Mun", null, "Army", "GERMANY", moves, playerGames, game);
  generateMove("MOVE", "Par", "Bur", null, "Army", "GERMANY", moves, playerGames, game);
  generateMove("BUILD", "Hol", "Hol", null, "Army", "ENGLAND", moves, playerGames, game);
  generateMove("BUILD", "Wal", "Wal", null, "Army", "ENGLAND", moves, playerGames, game);
  generateMove("BUILD", "Lvp", "Lvp", null, "Fleet", "ENGLAND", moves, playerGames, game);
  generateMove("BUILD", "Lon", "Lon", null, "Fleet", "ENGLAND", moves, playerGames, game);
  generateMove("BUILD", "Edi", "Edi", null, "Fleet", "ENGLAND", moves, playerGames, game);
  generateMove("BUILD", "Mos", "Mos", null, "Fleet", "RUSSIA", moves, playerGames, game);

  
  const gamePosition: GamePosition = {
    domains: {
      AUSTRIA: ["Boh", "Bud", "Gal", "Tri", "Tyr", "Vie"],
      ENGLAND: ["Cly", "Edi", "Lvp", "Lon", "Wal", "Yor", "Nwy"],
      FRANCE: ["Bre", "Bur", "Gas", "Mar", "Par", "Pic"],
      GERMANY: ["Ber", "Kie", "Mun", "Pru", "Ruh", "Sil"],
      ITALY: ["Apu", "Nap", "Pie", "Rom", "Tus", "Ven"],
      RUSSIA: ["Lvn", "Mos", "Sev", "StP", "Ukr", "War"],
      TURKEY: ["Ank", "Arm", "Con", "Smy", "Syr"],
    },
    unitPositions: {
      AUSTRIA: [
        { province: "Vie", unitType: "Army" },
        { province: "Bud", unitType: "Army" },
        { province: "Tri", unitType: "Fleet" },
      ],
      ENGLAND: [
        { province: "Nwy", unitType: "Fleet" },
        { province: "Nth", unitType: "Fleet" },
        { province: "Lvp", unitType: "Army" },
      ],
      FRANCE: [
        { province: "Par", unitType: "Army" },
        { province: "Mar", unitType: "Army" },
        { province: "Bre", unitType: "Fleet" },
      ],
      GERMANY: [
        { province: "Ber", unitType: "Army" },
        { province: "Mun", unitType: "Army" },
        { province: "Kie", unitType: "Fleet" },
      ],
      ITALY: [
        { province: "Rom", unitType: "Army" },
        { province: "Ven", unitType: "Army" },
        { province: "Nap", unitType: "Fleet" },
      ],
      RUSSIA: [
        { province: "Sev", unitType: "Army" },
        { province: "War", unitType: "Army" },
        { province: "StPS", unitType: "Fleet" },
      ],
      TURKEY: [
        { province: "Ank", unitType: "Fleet" },
        { province: "Con", unitType: "Army" },
        { province: "Smy", unitType: "Army" },
      ],
    },
  };
  const movesToSubmit = moveInPositionValidator(
    gamePosition,
    playerGames,
  )(moves);
  assertEquals(movesToSubmit[0].status, "INVALID"); // overriden by third move
  assertEquals(movesToSubmit[1].status, "INVALID"); // unit doesn't exist
  assertEquals(movesToSubmit[2].status, "VALID");
  assertEquals(movesToSubmit[3].status, "INVALID"); // attempt to move foreign unit
  assertEquals(movesToSubmit[4].status, "INVALID"); // attempt to build not in domestic supply centers
  assertEquals(movesToSubmit[5].status, "INVALID"); // attempt to build not in supply center
  assertEquals(movesToSubmit[6].status, "INVALID"); // attempt to build in occupied supply center
  assertEquals(movesToSubmit[7].status, "INVALID"); // attempt to build over supply center limit
  assertEquals(movesToSubmit[8].status, "VALID"); 
  assertEquals(movesToSubmit[9].status, "INVALID"); // attempt to build a fleet inland
});
