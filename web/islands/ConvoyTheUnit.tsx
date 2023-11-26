import * as hooks from "preact/hooks";
import AdjacentProvinceSelector from "islands/AdjacentProvinceSelector.tsx";
import { SubmittedMoveInsert, submittedMoves, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";

export default function ConvoyTheUnit() {

  const [from, setFrom] = hooks.useState<ProvinceCode | null>(null)
  const [to, setTo] = hooks.useState<ProvinceCode | null>(null)

  hooks.useEffect(() => {
    if (!from || !to) {
      return
    }
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
      unit_type: selectedUnit.value!.unitType,
      phase: selectedGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      game: selectedGame.value!.id,
    }
    submittedMoves.value = [...submittedMoves.value, newMove]
    selectedCountry.value = null
    selectedUnit.value = null
    selectedMoveType.value = null
  }, [to, from])

  return (
    <div>
      <p>Select from which province you want to convoy the army</p>
      <AdjacentProvinceSelector setter={setFrom} province={selectedUnit.value!.province} unitType={selectedUnit.value!.unitType}/>
      {from && <p>Select to which province you want to convoy the army</p>}
      {from && <AdjacentProvinceSelector setter={setTo} province={selectedUnit.value!.province}/>}
    </div>
  );
}