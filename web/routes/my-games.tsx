import { Handlers, PageProps } from "$fresh/server.ts";
import { IPlayerGame } from "types/playerGames.ts";
import PlayerGames from "islands/PlayerGames.tsx";
import { Layout } from "components/Layout.tsx";
import { ServerState } from "../middlewares/auth-middleware.ts";

const BACKEND_URL = Deno.env.get("BACKEND_URL");
type Props = { playerGames: IPlayerGame[], state: ServerState }

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const resp = await fetch(`${BACKEND_URL}/player-games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(resp)
    const playerGames: IPlayerGame[] = await resp.json();
    return ctx.render({playerGames: playerGames, state: ctx.state as ServerState});
  },
};

export default function MyGames(
  { data }: PageProps<Props>,
) {
  return (
    <Layout state={data.state}>
      {data && (
        <div class="container">
          <PlayerGames playerGames={data.playerGames} />
        </div>
      )}
    </Layout>
  );
}
