import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { IPlayerGame } from "../types/playerGames.ts";
import PlayerGames from "../islands/PlayerGames.tsx";

const BACKEND_URL = Deno.env.get("BACKEND_URL");

export const handler: Handlers<IPlayerGame[] | null> = {
  async GET(_, ctx) {
    const resp = await fetch(`${BACKEND_URL}/player-games`,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const playerGames: IPlayerGame[] = await resp.json();
    return ctx.render(playerGames);
  },
};

export default function Home({ data }: PageProps<IPlayerGame[]>) {
  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="container">
        <PlayerGames playerGames={data} />
      </div>
    </>
  );
}
