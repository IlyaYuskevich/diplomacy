import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../types/units.ts";
import { IGamePosition } from "../types/gamePosition.ts";
import Controls from "../islands/Controls.tsx";
import { IGame } from "../types/games.ts";
import { IProvince } from "../types/provinces.ts";

export type FetchedProps = {
  game: IGame;
  unitLocationsMap: Record<string, IUnitLocation>;
  gamePosition: IGamePosition;
  provinces: { [key: string]: IProvince };
};

const BACKEND_URL = Deno.env.get("BACKEND_URL");

export const handler: Handlers<FetchedProps | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const gameResp = await fetch(`${BACKEND_URL}/games/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (gameResp.status === 404) {
      return ctx.render(null);
    }

    const game = await gameResp.json();

    const respUnitLocations = await fetch(
      `${BACKEND_URL}/units-loc-map/${gameId}`,
    );
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const unitLocationsMap: Record<string, IUnitLocation> =
      await respUnitLocations.json();

    const respCurrentPosition = await fetch(
      `${BACKEND_URL}/current-position/${gameId}`,
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

    return ctx.render({ game, unitLocationsMap, gamePosition, provinces });
  },
};

export default function GamePage({ data }: PageProps<FetchedProps>) {
  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="container columns-2 gap-8">
        <div class="w-full">
          <WorldMap />
        </div>
        <div class="w-full">
          <Controls {...data} />
        </div>
      </div>
    </>
  );
}
