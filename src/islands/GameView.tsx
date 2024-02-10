import { GameProps } from "routes/game/[gameId].tsx";
import WorldMap from "islands/WorldMap.tsx";
import Controls from "features/moveBuilder/islands/Controls.tsx";
import { submittedMoves } from "types/moves.ts";
import * as hooks from "preact/hooks";
import { playerGames, selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { selectedCountry } from "types/country.ts";
import { createClient } from "@supabase";
import { previousMoves } from "types/moves.ts";
import PreviousMovesRenderer from "features/moveBuilder/islands/PreviousMovesRenderer.tsx";
import { winnerCountry } from "../features/resolver/utils/calcPosition.ts";

export default function GameView(props: GameProps) {
  const [prevMoveView, setPrevMoveView] = hooks.useState(false);
  hooks.useEffect(() => {
    selectedPlayerGame.value = props.playerGame;
    currentGame.value = props.game;
    selectedCountry.value = props.playerGame.country;
    submittedMoves.value = props.submittedMoves || [];
    previousMoves.value = props.previousMoves;
    playerGames.value = props.playerGames;
  }, []);

  hooks.useEffect(() => {
    const supa = createClient(
      props.supaMetadata.url,
      props.supaMetadata.apiKey,
    );
    void supa.auth.setSession({
      access_token: props.supaMetadata.accessToken,
      refresh_token: props.supaMetadata.refreshToken,
    });

    const gameUpdateChannel = supa
      .channel("games_update")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "games",
      }, (v) => {
        location.reload();
      })
      .subscribe((status, err) => console.log(status, err));
    return () => {
      supa.removeChannel(gameUpdateChannel);
    };
  }, []);

  return (
    <>
      <div class="grid lg:grid-cols-3 grid-cols-1 items-start">
        <div class="col-span-2 mb-auto">
          <WorldMap prevModeView={prevMoveView} />
          <button
            class={(prevMoveView
              ? "bg-slate-600 text-white "
              : "text-slate-800 ") +
              "border-slate-800 rounded border-2 hover:bg-slate-400 my-1 p-2 ml-10"}
            onClick={() => setPrevMoveView((v) => !v)}
          >
            {prevMoveView ? "Current phase" : "Previous phase"}
          </button>
        </div>
        {currentGame.value?.status == "FINISHED"
          ? <div class="text-3xl">The game is over. The winner is {winnerCountry(props.game.phase!.game_position)}</div>
          : (
            <div class="h-full">
              {prevMoveView ? <PreviousMovesRenderer /> : <Controls />}
            </div>
          )}
      </div>
    </>
  );
}
