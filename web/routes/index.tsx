import { Head, asset } from "$fresh/runtime.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";
import WorldMap from "../islands/WorldMap.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div>
        <WorldMap/>
        <PossibleMoves origin="Ber"/>
      </div>
    </>
  );
}
