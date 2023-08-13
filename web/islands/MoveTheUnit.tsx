import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import { IMove, moves, selectedMoveType } from "../types/moves.ts";
import { selectedUnit } from "../types/units.ts";
import { selectedCountry } from "../types/country.ts";
import { selectedPlayerGame } from "../types/playerGames.ts";

export default function MoveTheUnit() {

  const [destination, setDestination] = useState<string | null>(null)

  useEffect(() => {
    if (!destination) {
      return
    }
    const newMove: IMove = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: destination,
      unitType: selectedUnit.value!.unitType,
      phase: selectedPlayerGame.value!.game.phase,
      year: selectedPlayerGame.value!.game.year,
      playerGame: selectedPlayerGame.value!,
  }
    moves.value = [...moves.value, newMove]
    console.log(moves.value)
    selectedCountry.value = null
    selectedUnit.value = null
    selectedMoveType.value = null
  }, [destination])

  return (
    <div>
      <p>Select destination province:</p>
      <AdjacentProvinceSelector setter={setDestination} province={selectedUnit.value!.province} unitType={selectedUnit.value!.unitType}/>
    </div>
  );
}