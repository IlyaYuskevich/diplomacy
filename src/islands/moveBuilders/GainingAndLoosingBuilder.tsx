import {
  getBuildsDisbandsBalance,
  getGainingLosingNumber,
} from "utils/validators.ts";
import { currentGame } from "types/game.ts";
import { currentCountry } from "types/playerGames.ts";
import { MoveInsert, submittedMoves } from "types/moves.ts";
import { computed } from "@preact/signals";
import UnitSelector from "islands/moveBuilders/UnitSelector.tsx";
import SupplyCentersSelector from "islands/moveBuilders/SupplyCentersSelector.tsx";

export default function GainingAndLoosingBuilder() {
  const gainingLoosingNumber = computed(() =>
    getGainingLosingNumber(
      currentGame.value!.game_position,
      currentCountry.value!,
    ) - getBuildsDisbandsBalance(submittedMoves.value as MoveInsert[])
  );

  const gainingOrLoosingBuilder = computed(() => {
    if (gainingLoosingNumber.value > 0) {
      return (
        <div>
          You need to build {gainingLoosingNumber.value} units
          <SupplyCentersSelector state={submittedMoves.value.map(x => x.to)}/>
        </div>
      );
    }
    if (gainingLoosingNumber.value > 0) {
      return (
        <div>
          You need to disband {gainingLoosingNumber.value} units
          <UnitSelector state={submittedMoves.value.map(x => x.origin!)}/>
        </div>
      );
    }
  });
  return (
    <>
      {gainingOrLoosingBuilder}
    </>
  );
}
