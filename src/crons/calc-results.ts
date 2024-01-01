import { Cron } from "croner";
import { Game, PhaseType, Turn } from "types/game.ts";
import { superSupa } from "lib/supabase.ts";
import add from "date-fns/add/index.ts";
import formatISO from "date-fns/formatISO/index.js";
import intervalToDuration from "date-fns/intervalToDuration/index.ts";
import isPast from "date-fns/isPast/index.ts";
import parseISO from "date-fns/parseISO/index.js";
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
export const logger = new Logger();

const cronJobs: Cron[] = [];
export function addFinishPhaseJob(game: Game) {
  if (!game.phase?.ends_at) {
    return;
  }
  const job = new Cron(game.phase.ends_at, { name: game.phase.id }, () => {
    initNextPhase(game);
  });
  logger.info(job);
  if (isPast(parseISO(game.phase.ends_at, {}))) {
    job.trigger();
  }
  cronJobs.push(job);
}

export async function initAllPhaseJobs() {
  /* In case pod restarted: fetches actve games (with retries), then set up jobs that do post-phases processing */
  const queryActiveGames = superSupa.from("games").select("*, phase(*)")
    .eq(
      "status",
      "ACTIVE",
    );
  try {
    const activeGames = await retryAsync(async () => {
      const resp = await queryActiveGames;
      if (resp.error) {
        throw new Error(resp.error.message);
      }
      return resp.data;
    }, { delay: 10e3, maxTry: 20 });
    activeGames.forEach((game) => addFinishPhaseJob(game));
  } catch (err) {
    if (isTooManyTries(err)) {
      logger.error(`Too many retries on start fresh service`);
    } else {
      logger.error(err);
    }
  }
}

function initNextPhase(game: Game) {
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
        await fetchAndProcessResults(game);
        await insertAndUpdatePhase(game, nextPhase, nextTurn, nextYear)
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
) {
  if (!game.phase) return;
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

  if (!submittedMoves) return;
  if (!playerGames) return;
  const validatedMoves1 = individualMoveValidator(submittedMoves);
  const validatedMoves2 = moveInPositionValidator(
    game.game_position,
    playerGames,
  )(validatedMoves1);
  const validatedMoves3 = movePhaseValidator(game.phase!.phase)(validatedMoves2);
  const validatedMoves4 = addAutoMoves(game, playerGames)(validatedMoves3);

  const insertValidatedMoves = superSupa.from("moves").insert(
    validatedMoves4.filter(mv => mv.status == "VALID")
  ).select(); 
  const resp = await insertValidatedMoves;
  if (resp.error) {
    logger.error(resp.error.message);
  }
  const validatedMoves = resp.data
  console.log('!!!', validatedMoves);

  if (!validatedMoves) return;
  const [resultMoves, { game_position }] = phaseResolver(
    validatedMoves,
    game,
    playerGames,
  );
  const insertResolvedMoves = superSupa.from("moves").upsert(
    resultMoves
  );
  const respResolved = await insertResolvedMoves;
  if (respResolved.error) {
    logger.error(respResolved.error.message);
  }
  const updateGameQuery = superSupa.from("games").update(
    {game_position}
  ).eq("id", game.id);
  await updateGameQuery;
}

async function insertAndUpdatePhase(
  game: Game,
  nextPhase: PhaseType,
  nextTurn: Turn,
  nextYear: number,
) {
  const nextPhaseDuration = intervalToDuration(
    { start: 0, end: calcNextPhaseDuration(game, nextPhase) * 1e3 },
  );

  const createPhaseQuery = superSupa.from("phases").insert({
    game: game.id,
    phase: nextPhase,
    turn: nextTurn,
    year: nextYear,
    ends_at: calcEndsAt(nextPhaseDuration),
  }).select().single();
  const res = await createPhaseQuery;
  const updateGameQuery = superSupa.from("games").update({
    phase: res.data?.id,
  }).eq(
    "id",
    game.id,
  ).select("*, phase(*)").single();
  const updatedGame = await updateGameQuery;
  addFinishPhaseJob(updatedGame.data!);
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
