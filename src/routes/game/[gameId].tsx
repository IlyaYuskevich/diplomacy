import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { PlayerGame } from "types/playerGames.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient, superSupa } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { Game } from "types/game.ts";
import GameView from "islands/GameView.tsx";
import { Move, SubmittedMove, } from "types/moves.ts";
import { ISupaSettings } from "types/supaSettings.ts";
import GamePreparationView from "islands/GamePreparationView.tsx";
import { fetchGame, fetchPlayerGame, fetchPlayerGames, fetchPreviousMoves, fetchSubmittedMoves, startGame } from "utils/queries.ts";

export type GameProps = {
  playerGame: PlayerGame;
  game: Game;
  previousMoves: Move[];
  submittedMoves?: SubmittedMove[];
  playerGames: PlayerGame[];
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

    const resp1 = await fetchPlayerGame(supa, player_id, game_id);
    if (resp1.error) {
      return ctx.render();
    }

    const playerGame = resp1.data;

    const resp2 = await fetchGame(supa, game_id);
    if (resp2.error) {
      return ctx.render();
    }
    const game = resp2.data;

    const resp5 = await fetchPlayerGames(supa, game_id);
    if (resp5.error) {
      return ctx.render();
    }
    const playerGames = resp5.data;

    const playerGamesCount = playerGames.length;

    let submittedMoves: SubmittedMove[] = [];
    let previousMoves: Move[] = [];

    if (game.status != "FORMING") {
      const resp3 = await fetchSubmittedMoves(supa, game.phase.id);
      if (resp3.error) {
        return ctx.render();
      }
      submittedMoves = resp3.data;
      const resp4 = await fetchPreviousMoves(supa, game.phase.previous_phase);
      previousMoves = resp4?.data || [];
    } else if (game.status == "FORMING" && playerGamesCount == game.number_of_players) {
      try {
        await startGame(game);
      } catch {
        ctx.render();
      }
    }

    const supaMetadata = ctx.state.supaMetadata;


    return ctx.render({
      playerGame,
      game,
      playerGames,
      playerGamesCount,
      supaMetadata,
      submittedMoves,
      previousMoves
    });
  },
};

export default function GamePage(props: PageProps<GameProps>) {
  return (
    <>
      {props.data?.game.status == "FORMING"
        ? <GamePreparationView {...props.data} />
        : <GameView {...props.data} />}
    </>
  );
}
