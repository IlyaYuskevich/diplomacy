import * as hooks from "preact/hooks";
import AdjacentProvinceSelector from "islands/AdjacentProvinceSelector.tsx";
import { Move, moves, selectedMoveType } from "types/moves.ts";
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
    const newMove: Move = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
      unit_type: selectedUnit.value!.unitType,
      phase: selectedGame.value!.phase,
      year: selectedGame.value!.year,
      player_game_id: selectedPlayerGame.value!.id,
      deleted_at: null,
      status: "SUBMITTED",
      game_id: selectedGame.value!.id
    }
    moves.value = [...moves.value, newMove]
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