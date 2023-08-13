import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../types/units.ts";
import { IGamePosition } from "../types/gamePosition.ts";
import Controls from "../islands/Controls.tsx";
import { IGame } from "../types/games.ts";
import { IProvince } from "../types/provinces.ts";
import { IPlayerGame } from "../types/playerGames.ts";

export type FetchedProps = {
  playerGame: IPlayerGame;
  unitLocationsMap: Record<string, IUnitLocation>;
  gamePosition: IGamePosition;
  provinces: { [key: string]: IProvince };
};

const BACKEND_URL = Deno.env.get("BACKEND_URL");

export const handler: Handlers<FetchedProps | null> = {
  async GET(_, ctx) {
    const { playerGameId } = ctx.params;
    const playerGameResp = await fetch(`${BACKEND_URL}/player-games/${playerGameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (playerGameResp.status === 404) {
      return ctx.render(null);
    }

    const playerGame = await playerGameResp.json();

    const respUnitLocations = await fetch(
      `${BACKEND_URL}/units-loc-map/${playerGame.game.id}`,
    );
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const unitLocationsMap: Record<string, IUnitLocation> =
      await respUnitLocations.json();

    const respCurrentPosition = await fetch(
      `${BACKEND_URL}/current-position/${playerGame.game.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (respCurrentPosition.status === 404) {
      return ctx.render(null);
    }
    const gamePosition = await respCurrentPosition.json();

    const respProvinces = await fetch(`${BACKEND_URL}/get-provinces`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (respProvinces.status === 404) {
      return ctx.render(null);
    }
    const provinces: Record<string, IProvince> = await respProvinces.json();

    return ctx.render({ playerGame, unitLocationsMap, gamePosition, provinces });
  },
};

export default function GamePage({ data }: PageProps<FetchedProps>) {

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="grid lg:grid-cols-3 grid-cols-1">
        <div class="col-span-2">
          <WorldMap />
        </div>
        <div>
          <Controls {...data} />
        </div>
      </div>
    </>
  );
}