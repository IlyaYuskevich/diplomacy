import { Game, PhaseType, Turn } from "types/game.ts";
import { superSupa } from "lib/supabase.ts";
import add from "date-fns/add/index.ts";
import formatISO from "date-fns/formatISO/index.js";
import intervalToDuration from "date-fns/intervalToDuration/index.ts";
import { Duration } from "date-fns/types.ts";
import { retryAsync } from "https://deno.land/x/retry@v2.0.0/retry/retry.ts";
import { isTooManyTries } from "https://deno.land/x/retry@v2.0.0/retry/tooManyTries.ts";
import Logger from "https://deno.land/x/logger@v1.1.3/logger.ts";
import {
  addAutoMoves,
  individualMoveValidator,
  moveInPositionValidator,
  movePhaseValidator,
} from "utils/validators.ts";
import { phaseResolver } from "utils/resolve.ts";
import { winnerCountry } from "utils/calcPosition.ts";
import { GamePosition } from "types/gamePosition.ts";
import { PhaseIsOverMessage } from "./types.ts";
import { fetchGame } from "utils/queries.ts";
import { enqueuePhaseEnd } from "./publishers.ts";
export const logger = new Logger();

export async function initNextPhase(phaseIsOverMessage: PhaseIsOverMessage) {
  console.log('init next phase', phaseIsOverMessage)
  const resp = await fetchGame(superSupa, phaseIsOverMessage.gameId);
  if (resp.error) logger.error(resp.error);
  const game = resp.data as Game;
  console.log('game', game)
  if (game.status == "FINISHED") return;
  let nextPhase: PhaseType;
  let nextYear: number = game.phase!.year;
  let nextTurn = game.phase!.turn;
  switch (game.phase!.phase) {
    case "Diplomatic":
      nextPhase = "Retreat and Disbanding";
      break;
    case "Retreat and Disbanding":
      if (game.phase!.turn == "SPRING") {
        nextTurn = "FALL";
        nextPhase = "Diplomatic";
      } else {
        nextPhase = "Gaining and Losing";
      }
      break;
    case "Gaining and Losing":
      nextTurn = "SPRING";
      nextYear += 1;
      nextPhase = "Diplomatic";
      break;
  }
  try {
    retryAsync(
      async () => {
        const game_position = await fetchAndProcessResults(game);
        if (!game_position) return;
        await insertAndUpdatePhase(
          game,
          nextPhase,
          nextTurn,
          nextYear,
          game_position,
        );
      },
      { delay: 10e3, maxTry: 20 },
    );
  } catch (err) {
    console.log(err);
    if (isTooManyTries(err)) {
      logger.error(`Too many retries game-id=${game.id} ${err}`);
    } else {
      logger.error(err);
    }
  }
}

async function fetchAndProcessResults(
  game: Game,
): Promise<GamePosition | null> {
  if (!game.phase) return Promise.resolve(null);
  const submittedMovesQuery = superSupa.from("submitted_moves").select().eq(
    "phase",
    game.phase.id,
  );
  const submittedMoves = (await submittedMovesQuery).data;
  const playerGamesQuery = superSupa.from("player_games").select().eq(
    "game",
    game.id,
  );
  const playerGames = (await playerGamesQuery).data;

  if (!submittedMoves) return Promise.resolve(null);
  if (!playerGames) return Promise.resolve(null);
  const validatedMoves1 = individualMoveValidator(submittedMoves);
  const validatedMoves2 = moveInPositionValidator(
    game.phase!.game_position,
    playerGames,
  )(validatedMoves1);
  const validatedMoves3 = movePhaseValidator(game.phase!.phase)(
    validatedMoves2,
  );
  const validatedMoves4 = addAutoMoves(game, playerGames)(validatedMoves3);

  const insertValidatedMoves = superSupa.from("moves").insert(
    validatedMoves4.filter((mv) => mv.status == "VALID"),
  ).select();
  const resp = await insertValidatedMoves;
  if (resp.error) {
    logger.error(resp.error.message);
  }
  const validatedMoves = resp.data;

  if (!validatedMoves) return Promise.resolve(null);
  const [resultMoves, game_position] = phaseResolver(
    validatedMoves,
    game.phase,
    playerGames,
  );
  if (winnerCountry(game.phase.game_position)) { // defines if there's winner
    game.status = "FINISHED";
  }
  const insertResolvedMoves = superSupa.from("moves").upsert(
    resultMoves,
  );
  const respResolved = await insertResolvedMoves;
  if (respResolved.error) {
    logger.error(respResolved.error.message);
  }
  const updateGameQuery = superSupa.from("games").update(
    { game_position, status: game.status },
  ).eq("id", game.id);
  await updateGameQuery;
  return Promise.resolve(game.phase.game_position);
}

export async function insertAndUpdatePhase(
  game: Game,
  nextPhase: PhaseType,
  nextTurn: Turn,
  nextYear: number,
  gamePosition: GamePosition,
) {
  const durationInSecs = calcNextPhaseDuration(game, nextPhase);
  const nextPhaseDuration = intervalToDuration(
    { start: 0, end: durationInSecs * 1e3 },
  );

  const createPhaseQuery = superSupa.from("phases").insert({
    game: game.id,
    phase: nextPhase,
    turn: nextTurn,
    year: nextYear,
    previous_phase: game.phase?.id,
    ends_at: calcEndsAt(nextPhaseDuration),
    game_position: gamePosition,
  }).select().single();
  const res = await createPhaseQuery;
  const updateGameQuery = superSupa.from("games").update({
    phase: res.data?.id,
  }).eq(
    "id",
    game.id,
  ).select("*, phase(*)").single();
  await updateGameQuery;
  await enqueuePhaseEnd(game.id, res.data!.id, durationInSecs);
  return true;
}

function calcEndsAt(duration: Duration) {
  return formatISO(add(new Date(), duration), {});
}

function calcNextPhaseDuration(
  game: Game,
  nextPhase: "Diplomatic" | "Retreat and Disbanding" | "Gaining and Losing",
) {
  switch (nextPhase) {
    case "Gaining and Losing":
      return game.gaining_and_loosing_phase_duration;
    case "Retreat and Disbanding":
      return game.retreat_and_disbanding_phase_duration;
    case "Diplomatic":
      if (game.phase?.turn == "FALL") {
        return game.turn_duration - game.retreat_and_disbanding_phase_duration;
      } else {
        return game.turn_duration - game.retreat_and_disbanding_phase_duration -
          game.gaining_and_loosing_phase_duration;
      }
  }
}
