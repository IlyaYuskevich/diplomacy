import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import { GameProps } from "routes/game/[gameId].tsx";
import { createClient } from "@supabase";
import { useEffect, useState } from "preact/hooks";
import { selectedPlayerGame } from "types/playerGames.ts";
import { Game, selectedGame } from "types/game.ts";

export default function GamePreparationView(props: GameProps) {
  const [playersCount, setPlayersCount] = useState<number>(
    props.playerGamesCount,
  );

  useEffect(() => {
    selectedPlayerGame.value = props.playerGame;
    selectedGame.value = props.game;
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
        if (v.new?.game_id == selectedGame.value!.id) {
          console.log(v);
          setPlayersCount((prevState) => prevState += 1);
        }
      })
      .subscribe();
      const gameUpdateChannel = supa
      .channel("games_update")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "games",
      }, (v) => {
        const newValue = v.new as Game;
        console.warn(v);
        if (v.old?.id == selectedGame.value!.id && newValue.status == "ACTIVE") {
          location.reload()
        }
      })
      .subscribe();
    return () => supa.removeChannel(pgInsertChannel);
  }, []);

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("/style.css")} />
      </Head>
      <div>
        <div class="text-xl">
          Players are joining.{" "}
          <button class="bg-primary p-1 rounded border-primary text-white text-white hover:bg-primaryStrong" onClick={copyToClipboard}>Click here</button>{" "}
          to copy the link and share it with friends to invite them to this game.
        </div>
        <div class="my-3">Number of players: {playersCount}</div>
      </div>
    </>
  );
}
