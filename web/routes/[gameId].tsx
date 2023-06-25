import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../types/units.ts";
import { IMove } from "../types/moves.ts";


export const handler: Handlers<{ unitLocations: Record<string, IUnitLocation>, moves: IMove[] } | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const respUnitLocations = await fetch(`http://localhost:8000/units-loc-map/${gameId}`);
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const unitLocations = await respUnitLocations.json();
    const respMoves = await fetch(`http://localhost:8000/moves?gameId=${gameId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (respMoves.status === 404) {
      return ctx.render(null);
    }
    const moves: IMove[] = await respMoves.json();
    return ctx.render({ unitLocations: unitLocations, moves: moves });
  },
};

type Props = { unitLocations: Record<string, IUnitLocation>, moves: IMove[] }

export default function GamePage({ data }: PageProps<Props>) {

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div>
        <WorldMap unitLocations={data.unitLocations} />
        <PossibleMoves />
      </div>
    </>
  );
}
