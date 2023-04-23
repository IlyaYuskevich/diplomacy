import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { IPlayerGame } from "../utils/playerGames.ts";
import PlayerGames from "../islands/PlayerGames.tsx";


export const handler: Handlers<IPlayerGame[] | null> = {
  async GET(_, ctx) {
    const resp = await fetch(`http://localhost:8000/player-games`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId: 'd6433abc-96e5-4cc4-9120-d042358bf4ba' })
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
      <div>
        {data}
        <PlayerGames playerGames={data} />
      </div>
    </>
  );
}
