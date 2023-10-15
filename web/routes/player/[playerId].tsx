import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { IPlayerGame } from "types/playerGames.ts";
import PlayerGames from "islands/PlayerGames.tsx";
import { Layout } from "components/Layout.tsx";

const BACKEND_URL = Deno.env.get("BACKEND_URL");
const IDP_URL = Deno.env.get("IDP_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY");

export const handler: Handlers<IPlayerGame[]> = {
  async GET(req, ctx) {
    const resp = await fetch(`${BACKEND_URL}/player-games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const playerGames: IPlayerGame[] = await resp.json();
    return ctx.render(playerGames);
  },
};

export default function Home(
  { data }: PageProps<{ playerGames: IPlayerGame[] }>,
) {
  const isAllowed = false;
  return (
    <Layout isAllowed>
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
