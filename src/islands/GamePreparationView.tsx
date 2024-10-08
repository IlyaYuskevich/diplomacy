import { GameProps } from "routes/game/[gameId].tsx";
import { createClient } from "@supabase";
import { useEffect, useState } from "preact/hooks";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame, Game } from "types/game.ts";

export default function GamePreparationView(props: GameProps) {
  const [playersCount, setPlayersCount] = useState<number>(
    props.playerGamesCount,
  );

  useEffect(() => {
    selectedPlayerGame.value = props.playerGame;
    currentGame.value = props.game;
  }, [props]);

  useEffect(() => {
    const supa = createClient(
      props.supaMetadata.url,
      props.supaMetadata.apiKey,
    );
    void supa.auth.setSession({
      access_token: props.supaMetadata.accessToken,
      refresh_token: props.supaMetadata.refreshToken,
    });
    const pgInsertChannel = supa
      .channel("player_games_insert")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "player_games",
      }, (v) => {
        if (v.new?.game == currentGame.value!.id) {
          setPlayersCount((prevState) => prevState += 1);
          // if (playersCount == 7) location.reload();
        }
      })
      .subscribe((status, err) => console.log(status, err));

    const gameUpdateChannel = supa
      .channel("games_update")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "games",
      }, (v) => {
        const newValue = v.new as Game;
        if (newValue.id == currentGame.value!.id && newValue.status == "ACTIVE") {
          location.reload();
        }
      })
      .subscribe((status, err) => console.log(status, err));
    return () => {
      supa.removeChannel(pgInsertChannel);
      supa.removeChannel(gameUpdateChannel);
    };
  }, []);

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <div>
        <div class="text-xl">
          Players are joining.{" "}
          <button
            class="bg-slate-600 p-1 rounded border-slate-600 text-white text-white hover:bg-slate-900"
            onClick={copyToClipboard}
          >
            Click here
          </button>{" "}
          to copy the link and share it with friends to invite them to this
          game.
        </div>
        <div class="my-3">Number of players: {playersCount}</div>
      </div>
    </>
  );
}
