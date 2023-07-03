import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import { IMove, moves, selectedMoveType } from "../types/moves.ts";
import { UnitType, selectedUnit } from "../types/units.ts";
import { selectedCountry } from "../types/country.ts";

export default function ConvoyTheUnit() {

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
      playerGames: {
              country: selectedCountry.value!
      }
  }
    moves.value = [...moves.value, newMove]
    selectedCountry.value = null
  }, [destination])

  return (
    <div>
      <AdjacentProvinceSelector setter={setDestination} province={selectedUnit.value!.province} unitType={UnitType.Fleet}/>
    </div>
  );
}