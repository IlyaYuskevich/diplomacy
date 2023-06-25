import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../types/units.ts";
import { IGamePosition } from "../types/gamePosition.ts";


export const handler: Handlers<{ unitLocationsMap: Record<string, IUnitLocation>, gamePosition: IGamePosition } | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const respUnitLocations = await fetch(`http://localhost:8000/units-loc-map/${gameId}`);
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const unitLocationsMap: Record<string, IUnitLocation> = await respUnitLocations.json();

    const respCurrentPosition = await fetch(`http://localhost:8000/current-position/${gameId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (respCurrentPosition.status === 404) {
      return ctx.render(null);
    }
    const gamePosition = await respCurrentPosition.json();
    
    return ctx.render({ unitLocationsMap, gamePosition });
  },
};

type Props = { unitLocationsMap: Record<string, IUnitLocation>, gamePosition: IGamePosition }

export default function GamePage({ data }: PageProps<Props>) {

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div>
        <WorldMap {...data} />
        <PossibleMoves />
      </div>
    </>
  );
}
