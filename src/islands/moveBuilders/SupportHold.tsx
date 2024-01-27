import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import { submittedMoves, selectedMoveType, SubmittedMoveInsert } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";

export default function SupportTheUnit() {

  const [to, setTo] = useState<ProvinceCode | null>(null)

  useEffect(() => {
    if (!to) {
      return
    }
    const newMove: SubmittedMoveInsert = {
      type: "SUPPORT",
      origin: selectedUnit.value!.province,
      to: to,
      from: to,
      unit_type: selectedUnit.value!.unitType,
      player_game: selectedPlayerGame.value!.id,
      game: currentGame.value!.id,
      phase: currentGame.value!.phase!.id,
      player: selectedPlayerGame.value!.player,
    }
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }, [to])

  return (
    <div>
      <p>Select province where hold will be supported</p>
      <AdjacentProvinceSelector state={to} setter={setTo} province={selectedUnit.value!.province} unitType={selectedUnit.value!.unitType}/>
    </div>
  );
}