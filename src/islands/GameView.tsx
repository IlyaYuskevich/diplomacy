import { GameProps } from "routes/game/[gameId].tsx";
import WorldMap from "islands/WorldMap.tsx";
import Controls from "islands/Controls.tsx";
import { submittedMoves } from "types/moves.ts";
import { useEffect } from "preact/hooks";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { selectedCountry } from "types/country.ts";
import { createClient } from "@supabase";

export default function GameView(props: GameProps) {
  useEffect(() => {
    selectedPlayerGame.value = props.playerGame;
    currentGame.value = props.game;
    selectedCountry.value = props.playerGame.country;
    submittedMoves.value = props.submittedMoves || [];
  }, []);

  useEffect(() => {
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
