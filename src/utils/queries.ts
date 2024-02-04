import { authSupabaseClient, superSupa } from "lib/supabase.ts";
import { insertAndUpdatePhase } from "../queues/calc-results.ts";
import { START_POSITION } from "types/gamePosition.ts";
import { DbResult } from "lib/database.types.ts";
import { Game } from "types/game.ts";

export async function fetchPlayerGame(
    supa: Awaited<ReturnType<typeof authSupabaseClient>>,
    pid: string,
    gid: string,
  ) {
    const query = supa.rpc("insert_player_game", {
      pid,
      gid,
    });
    const resp: DbResult<typeof query> = await query;
    return resp;
  }
  
  export async function fetchGame(
    supa: Awaited<ReturnType<typeof authSupabaseClient>>,
    gid: string,
  ) {
    const query = supa.from("games").select("*, phase(*)")
      .eq(
        "id",
        gid,
      ).single();
    const resp: DbResult<typeof query> = await query;
    return resp;
  }
  
  export async function fetchPlayerGames(
    supa: Awaited<ReturnType<typeof authSupabaseClient>>,
    gid: string,
  ) {
    const query = supa.from("player_games").select("*")
      .eq(
        "game",
        gid,
      );
    const resp: DbResult<typeof query> = await query;
    return resp;
  }
  
  export async function fetchSubmittedMoves(
    supa: Awaited<ReturnType<typeof authSupabaseClient>>,
    phaseId: string,
  ) {
    const query = supa.from("submitted_moves").select("*").eq(
      "phase",
      phaseId,
    );
    const resp: DbResult<typeof query> = await query;
    return resp;
  }
  
  export async function fetchPreviousMoves(
    supa: Awaited<ReturnType<typeof authSupabaseClient>>,
    phaseId: string | null,
  ) {
    if (!phaseId) return null
    const query = supa.from("moves").select("*").eq(
      "phase",
      phaseId,
    );
    const resp: DbResult<typeof query> = await query;
    return resp;
  }
  
  export async function startGame(game: Game) {
    await superSupa.rpc("assign_countries", { gid: game.id });
  
    const phase = await insertAndUpdatePhase(game, 'Diplomatic', 'SPRING', 1901, START_POSITION);
    game.status = "ACTIVE";
    game.phase = phase;
  }