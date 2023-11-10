import * as hooks from "preact/hooks";
import AdjacentProvinceSelector from "islands/AdjacentProvinceSelector.tsx";
import { Move, moves, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";

export default function ConvoyTheUnit() {

  const [from, setFrom] = hooks.useState<string | null>(null)
  const [to, setTo] = hooks.useState<string | null>(null)

  hooks.useEffect(() => {
    if (!from || !to) {
      return
    }
    const newMove: Move = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
      unitType: selectedUnit.value!.unitType,
      phase: selectedPlayerGame.value!.game.phase,
      year: selectedPlayerGame.value!.game.year,
      playerGame: selectedPlayerGame.value!
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