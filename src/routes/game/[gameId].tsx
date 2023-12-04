import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PlayerGame } from "types/playerGames.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient, superSupa } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { Game } from "types/game.ts";
import GameView from "islands/GameView.tsx";
import { SubmittedMove } from "types/moves.ts";
import { ISupaSettings } from "types/supaSettings.ts";
import GamePreparationView from "islands/GamePreparationView.tsx";

export type GameProps = {
  playerGame: PlayerGame;
  game: Game;
  submittedMoves?: SubmittedMove[];
  playerGamesCount: number;
  supaMetadata: ISupaSettings;
};

async function fetchPlayerGame(
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

async function fetchGame(
  supa: Awaited<ReturnType<typeof authSupabaseClient>>,
  gid: string,
) {
  const query = supa.from("games").select("*, player_games(count), phase(*)")
    .eq(
      "id",
      gid,
    ).single();
  const resp: DbResult<typeof query> = await query;
  return resp;
}

async function fetchSubmittedMoves(
  supa: Awaited<ReturnType<typeof authSupabaseClient>>,
  gid: string,
) {
  const query = supa.from("submitted_moves").select("*").eq(
    "game",
    gid,
  );
  const resp: DbResult<typeof query> = await query;
  return resp;
}

export const handler: Handlers<GameProps, ServerState> = {
  async GET(_, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }
    const game_id = ctx.params.gameId;
    const player_id = ctx.state.user!.id;
    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const resp1 = await fetchPlayerGame(supa, player_id, game_id);
    if (resp1.error) {
      return ctx.render();
    }

    const playerGame = resp1.data;

    const resp2 = await fetchGame(supa, game_id);
    if (resp2.error) {
      return ctx.render();
    }
    const game = resp2.data;
    const playerGamesCount = (game.player_games[0] as any).count as number;

    let submittedMoves: SubmittedMove[] = [];

    if (game.status == "FORMING" && playerGamesCount == 7) {
      const resp3 = await superSupa.rpc("assign_countries", { gid: game_id });
      console.log(resp3)

      if (resp3.error) {
        return ctx.render();
      }
      game.status = "ACTIVE";
    }

    if (game.status != "FORMING") {
      const resp3 = await fetchSubmittedMoves(supa, game_id);
      if (resp3.error) {
        return ctx.render();
      }

      submittedMoves = resp3.data;
    }

    const supaMetadata = ctx.state.supaMetadata;

    return ctx.render({
      playerGame,
      game,
      playerGamesCount,
      supaMetadata,
      submittedMoves,
    });
  },
};

export default function GamePage(props: PageProps<GameProps>) {
  return (
    <>
      {props.data.game.status == "FORMING"
        ? <GamePreparationView {...props.data} />
        : <GameView {...props.data} />}
    </>
  );
}
