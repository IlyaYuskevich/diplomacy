import { Handlers, PageProps } from "$fresh/server.ts";
import { IPlayerGame } from "types/playerGames.ts";
import PlayerGames from "islands/PlayerGames.tsx";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";

type Props = { playerGames: IPlayerGame[]; state: ServerState };

export const handler: Handlers<Props, ServerState> = {
  async GET(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }

    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query = supa.from("player_games").select().eq(
      "player_id",
      ctx.state.user!.id,
    );
    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      return ctx.render();
    }
    const playerGames = resp.data;
    return ctx.render({
      playerGames: playerGames,
      state: ctx.state as ServerState,
    });
  },
};

export default function MyGames(
  { data }: PageProps<Props>,
) {
  return (
    <>
      {data && (
        <div class="container">
          <PlayerGames
            playerGames={data.playerGames}
            userId={data.state.user!.id}
            supaMetadata={data.state.supaMetadata!}
          />
        </div>
      )}
    </>
  );
}
