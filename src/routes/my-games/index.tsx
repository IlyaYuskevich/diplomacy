import { Handlers, PageProps } from "$fresh/server.ts";
import { PlayerGame } from "types/playerGames.ts";
import PlayerGames from "islands/PlayerGames.tsx";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";

type Props = { playerGames: PlayerGame[]; state: ServerState };

export const handler: Handlers<Props, ServerState> = {
  async GET(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }

    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query = supa.from("player_games").select().eq(
      "player",
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
  props: PageProps<Props>,
) {
  return (
    <>
      {props.data && (
        <div class="container">
          <PlayerGames
            playerGames={props.data.playerGames}
            userId={props.data.state.user!.id}
          />
        </div>
      )}
    </>
  );
}
