import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PlayerGame } from "types/playerGames.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { Game } from "types/game.ts";
import GameView from "islands/GameView.tsx";
import { Move } from "types/moves.ts";
import { ISupaSettings } from "types/supaSettings.ts";
import GamePreparationView from "islands/GamePreparationView.tsx";

export type GameProps = {
  playerGame: PlayerGame;
  game: Game;
  moves?: Move[];
  playerGamesCount: number;
  supaMetadata: ISupaSettings;
};

export const handler: Handlers<GameProps, ServerState> = {
  async GET(_, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }
    const game_id = ctx.params.gameId;
    const player_id = ctx.state.user!.id;
    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query1 = supa.rpc("insert_player_game", {
      pid: player_id,
      gid: game_id,
    });
    const resp1: DbResult<typeof query1> = await query1;
    if (resp1.error) {
      return ctx.render();
    }
    const playerGame = resp1.data;

    const query2 = supa.from("games").select("*, player_games(count)").eq(
      "id",
      game_id,
    ).single();
    const resp2: DbResult<typeof query2> = await query2;
    if (resp2.error) {
      return ctx.render();
    }
    const game = resp2.data;

    const playerGamesCount = (game.player_games[0] as any).count;

    const supaMetadata = ctx.state.supaMetadata;

    // const respUnitLocations = await fetch(
    //   `${BACKEND_URL}/units-loc-map/${playerGame.game.id}`,
    // );
    // if (respUnitLocations.status === 404) {
    //   return ctx.render();
    // }
    // const unitLocationsMap: Record<string, IUnitLocation> =
    //   await respUnitLocations.json();

    // const respCurrentPosition = await fetch(
    //   `${BACKEND_URL}/current-position/${playerGame.game.id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   },
    // );
    // if (respCurrentPosition.status === 404) {
    //   return ctx.render();
    // }
    // const gamePosition = await respCurrentPosition.json();

    // const respProvinces = await fetch(`${BACKEND_URL}/get-provinces`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (respProvinces.status === 404) {
    //   return ctx.render();
    // }
    // const provinces: Record<string, IProvince> = await respProvinces.json();

    // return ctx.render({ playerGame, unitLocationsMap, gamePosition, provinces, state: ctx.state as ServerState });
    return ctx.render({ playerGame, game, playerGamesCount, supaMetadata });
  },
};

export default function GamePage({ data }: PageProps<GameProps>) {
  return (
    <>
      {data.game.status == "FORMING" ? <GamePreparationView {...data} /> : <GameView {...data} />}
    </>
  );
}
