import { useEffect, useState } from "preact/hooks";
import AdjacentProvinceSelector from "islands/AdjacentProvinceSelector.tsx";
import { Move, moves, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";

export default function MoveTheUnit() {

  const [destination, setDestination] = useState<ProvinceCode | null>(null)

  useEffect(() => {
    if (!destination) {
      return
    }
    const newMove: Move = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: destination,
      unit_type: selectedUnit.value!.unitType,
      phase: selectedGame.value!.phase,
      year: selectedGame.value!.year,
      player_game_id: selectedPlayerGame.value!.id,
      created_at: null,
      deleted_at: null,
      from: null,
      id: "",
      player_id: "",
      status: "SUBMITTED"
    }
    moves.value = [...moves.value, newMove]
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