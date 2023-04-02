import { Head } from "$fresh/runtime.ts";
import PossibleMoves from "../islands/PossibleMoves.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diplomacy</title>
      </Head>
      <div>
        <img
          src="/map.svg"
          width="1000"
          height="1000"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <PossibleMoves origin="Ber"/>
      </div>
    </>
  );
}
