import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import {
  selectedMoveType,
  submittedMoves,
  SubmittedMoveInsert,
} from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";

export default function MoveTheUnit() {
  const [destination, setDestination] = useState<ProvinceCode | null>(null);

  useEffect(() => {
    if (!destination) {
      return;
    }
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: destination,
      unit_type: selectedUnit.value!.unitType,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      game: currentGame.value!.id,
      phase: currentGame.value!.phase!.id,
      player: selectedPlayerGame.value!.player,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }, [destination]);

  return (
    <div>
      <p>Select destination province:</p>
      <AdjacentProvinceSelector
        setter={setDestination}
        state={destination}
        province={selectedUnit.value!.province}
        unitType={selectedUnit.value!.unitType}
      />
    </div>
  );
}
