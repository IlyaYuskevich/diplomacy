import { GameProps } from "routes/game/[gameId].tsx";
import WorldMap from "islands/WorldMap.tsx";
import Controls from "islands/Controls.tsx";
import { submittedMoves } from "types/moves.ts";
import { useEffect } from "preact/hooks";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";
import { selectedCountry } from "types/country.ts";

export default function GameView(props: GameProps) {
  useEffect(() => {
    selectedPlayerGame.value = props.playerGame;
    selectedGame.value = props.game;
    selectedCountry.value = props.playerGame.country;
    submittedMoves.value = props.moves || [];
  }, []);

  return (
    <>

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
