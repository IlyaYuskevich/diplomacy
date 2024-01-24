import { Move } from "types/moves.ts";
import { SubmittedMoveRenderer } from "islands/moveBuilders/SubmittedMoveRenderer.tsx";
import { previousMoves } from "types/moves.ts";
import { playerGames } from "types/playerGames.ts";

export default function PreviousMovesRenderer() {
  return (
    <div class="bg-slate-600 text-white rounded-lg p-3 text-center text-sm flex flex-wrap flex-col max-h-[75%] overflow-auto h-fit">
      {playerGames.value.map((pg) => (
        <div class="flex flex-col">
          <p>{pg.country}:</p>
          {previousMoves.value.filter((mv) => pg.id == mv.player_game).map((
            move: Move,
          ) => <SubmittedMoveRenderer {...move} />)}
        </div>
      ))}
    </div>
  );
}
