import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import WorldMap from "islands/WorldMap.tsx";
import { Handlers } from "$fresh/server.ts";
import { IUnitLocation } from "types/units.ts";
import { IGamePosition } from "types/gamePosition.ts";
import Controls from "islands/Controls.tsx";
import { IProvince } from "types/provinces.ts";
import { IPlayerGame } from "types/playerGames.ts";
import { ServerState } from "../../middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult, Enums } from "lib/database.types.ts";
import PlayerGames from "islands/PlayerGames.tsx";

export type FetchedProps = {
  playerGame: IPlayerGame;
  // unitLocationsMap: Record<string, IUnitLocation>;
  // gamePosition: IGamePosition;
  // provinces: { [key: string]: IProvince };
  // state: ServerState;
};

export const handler: Handlers<FetchedProps, ServerState> = {
  async GET(_, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }
    const game_id = ctx.params.gameId;
    const player_id = ctx.state.user!.id;
    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query = supa.rpc('insert_player_game', {pid: player_id, gid: game_id});
    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      return ctx.render();
    }
    const playerGame = resp.data;
  

    // const playerGame = await playerGameResp.json();

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
    return ctx.render({playerGame})
  },
};

export default function GamePage({ data }: PageProps<FetchedProps>) {

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
          <Controls {...data} />
        </div>
      </div>
    </>
  );
}
