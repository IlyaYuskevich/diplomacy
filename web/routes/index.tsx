import { Head, asset } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation, UnitType, units } from "../utils/units.ts";
import { useEffect } from "preact/hooks";


export const handler: Handlers<Record<string, IUnitLocation> | null> = {
  async GET(_, ctx) {
    const resp = await fetch(`http://localhost:8000/units-loc-map`);
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const unitLocations: Record<string, IUnitLocation> = await resp.json();
    return ctx.render(unitLocations);
  },
};

export default function Home({ data }: PageProps<Record<string, IUnitLocation>>) {

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div>
        <WorldMap unitLocations={data} />
        <PossibleMoves />
      </div>
    </>
  );
}
