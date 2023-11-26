import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "islands/AdjacentProvinceSelector.tsx";
import { submittedMoves, selectedMoveType, SubmittedMoveInsert } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";

export default function SupportTheUnit() {

  const [from, setFrom] = useState<ProvinceCode | null>(null)
  const [to, setTo] = useState<ProvinceCode | null>(null)

  useEffect(() => {
    console.log(to, from)
    if (!from || !to) {
      return
    }
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
      unit_type: selectedUnit.value!.unitType,
      player_game_id: selectedPlayerGame.value!.id,
      game_id: selectedGame.value!.id,
      phase_id: selectedGame.value!.phase_id!.id,
    }
    submittedMoves.value = [...submittedMoves.value, newMove]
    selectedUnit.value = null
    selectedMoveType.value = null
  }, [to, from])

  return (
    <div>
      <p>Select attack on which province you want to support</p>
      <AdjacentProvinceSelector setter={setTo} province={selectedUnit.value!.province} unitType={selectedUnit.value!.unitType}/>
      {to && <p>Select attack from where you want to support</p>}
      {to && <AdjacentProvinceSelector setter={setFrom} province={to}/>}
    </div>
  );
}