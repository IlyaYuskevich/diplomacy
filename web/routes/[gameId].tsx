import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "../utils/units.ts";
import { IMove } from "../utils/moves.ts";


export const handler: Handlers<{ unitLocations: Record<string, IUnitLocation>, moves: IMove[] } | null> = {
  async GET(_, ctx) {
    const { gameId } = ctx.params;
    const respUnitLocations = await fetch(`http://localhost:8000/units-loc-map/${gameId}`);
    if (respUnitLocations.status === 404) {
      return ctx.render(null);
    }
    const reader = respUnitLocations.body!.pipeThrough(new TextDecoderStream()).getReader();
    const resp = await reader.read();
    const unitLocations: Record<string, IUnitLocation> = resp.value && JSON.parse(resp.value);

    const respMoves = await fetch(`http://localhost:8000/moves?gameId=${gameId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(respMoves)
    if (respMoves.status === 404) {
      return ctx.render(null);
    }
    const moves: IMove[] = await respMoves.json();
    console.log({ unitLocations: unitLocations, moves: moves })
    return ctx.render({ unitLocations: unitLocations, moves: moves });
  },
};

type Props = { unitLocations: Record<string, IUnitLocation>, moves: IMove[] }

export default function GamePage({ data }: PageProps<Props>) {
  console.log(data)

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
