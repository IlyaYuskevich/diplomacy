import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation, selectedUnit } from "../types/units.ts";
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

export const handler: Handlers<FetchedProps | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const gameResp = await fetch(`http://localhost:8000/games/${gameId}`, {
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
      `http://localhost:8000/units-loc-map/${gameId}`,
    );
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const unitLocationsMap: Record<string, IUnitLocation> =
      await respUnitLocations.json();

    const respCurrentPosition = await fetch(
      `http://localhost:8000/current-position/${gameId}`,
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

    const respProvinces = await fetch(`http://localhost:8000/get-provinces`, {
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
        <WorldMap />
        <Controls {...data} />
      </div>
    </>
  );
}
