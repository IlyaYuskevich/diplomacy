import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { IPlayerGame } from "types/playerGames.ts";
import PlayerGames from "islands/PlayerGames.tsx";
import { Layout } from "components/Layout.tsx";
import { ServerState } from "lib/auth-middleware.ts";

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
    const playerGames: IPlayerGame[] = await resp.json();
    return ctx.render({playerGames: playerGames, state: ctx.state as ServerState});
  },
};

export default function Home(
  { data }: PageProps<Props>,
) {
  return (
    <Layout state={data.state}>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      {data && (
        <div class="container">
          <PlayerGames playerGames={data.playerGames} />
        </div>
      )}
      {/* {!auth.value ? <SignInForm /> : <a href="/api/sign-out">Sign Out</a>} */}
    </Layout>
  );
}
