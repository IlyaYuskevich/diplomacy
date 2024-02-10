import { Move, SubmittedMoveInsert } from "types/moves.ts";
import { getCountry, playerGames } from "types/playerGames.ts";
import {
  drawHoldIcon,
  drawLink,
} from "features/worldMap/utils/worldMapUtils.ts";
import * as hooks from "preact/hooks";

export function drawMoves(
  arrowDrawer: hooks.MutableRef<any>,
  moves: SubmittedMoveInsert[] | Move[],
) {
  arrowDrawer.current?.clear();
  moves.filter((mv) => mv.type !== "HOLD").forEach((val) => {
    const country = getCountry(val.player_game, playerGames.value);
    country && drawLink(
      arrowDrawer.current,
      val.origin!,
      val.to,
      val.from,
      val.type!,
      country,
      (val as Move)?.status == "FAILED",
    );
  });
  moves.filter((mv) => mv.type === "HOLD").forEach((mv) => {
    const country = getCountry(mv.player_game, playerGames.value);
    drawHoldIcon(
      arrowDrawer.current,
      mv.origin!,
      country!,
    );
  });
}
