import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import { IMove, moves, selectedMoveType } from "../types/moves.ts";
import { selectedUnit } from "../types/units.ts";
import { selectedCountry } from "../types/country.ts";

export default function SupportTheUnit() {

  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  useEffect(() => {
    if (!from || !to) {
      return
    }
    const newMove: IMove = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
      unitType: selectedUnit.value!.unitType,
      playerGames: {
              country: selectedCountry.value!
      }
  }
    moves.value = [...moves.value, newMove]
    selectedCountry.value = null
  }, [to, from])

  return (
    <div>
      <p>Select attack on which province you want to support</p>
      <AdjacentProvinceSelector setter={setTo} province={selectedUnit.value!.province} unitType={selectedUnit.value!.unitType}/>
      {to && <p>Select attack from where want to support</p>}
      {to && <AdjacentProvinceSelector setter={setFrom} province={to}/>}
    </div>
  );
}