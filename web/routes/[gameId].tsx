import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../utils/units.ts";
import { IMove } from "../utils/moves.ts";


export const handler: Handlers<{ unitLocation: Record<string, IUnitLocation>, moves: IMove[] } | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const respUnitLocations = await fetch(`http://localhost:8000/units-loc-map/${gameId}`);
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const respMoves = await fetch(`http://localhost:8000/api/moves`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId })
    });
    if (respMoves.status === 404) {
      return ctx.render(null);
    }
    const unitLocations: Record<string, IUnitLocation> = await respUnitLocations.json();
    const moves: IMove[] = await respMoves.json();
    console.log(moves)
    return ctx.render({ unitLocation: unitLocations, moves: moves });
  },
};

type Props = { unitLocation: Record<string, IUnitLocation>, moves: IMove[] }

export default function Home({ data }: PageProps<Props>) {

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div>
        <WorldMap unitLocations={data.unitLocation} />
        <PossibleMoves />
      </div>
    </>
  );
}
