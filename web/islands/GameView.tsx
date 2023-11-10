import { Head, asset } from "$fresh/runtime.ts";
import { GameProps } from "routes/game/[gameId].tsx";
import WorldMap from "islands/WorldMap.tsx";
import Controls from "islands/Controls.tsx";
import { moves } from "types/moves.ts";
import { useEffect } from "preact/hooks";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";

export default function GameView(props: GameProps) {

  useEffect(() => {
    selectedPlayerGame.value = props.playerGame
    selectedGame.value = props.game
    moves.value = props.moves!
  }, [props])

    return (
      <>
        <Head>
          <title>Diplomacy</title>
          <link rel="stylesheet" href={asset("/style.css")} />
        </Head>
        <div class="grid lg:grid-cols-3 grid-cols-1">
          <div class="col-span-2">
            <WorldMap />
          </div>
          <div>
            <Controls />
          </div>
        </div>
      </>
    );
  }