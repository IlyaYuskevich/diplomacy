import { selectedCountry } from "types/country.ts";
import { gamePosition } from "types/gamePosition.ts";
import { Move, moves, selectedMoveType } from "types/moves.ts";
import { IUnit, selectedUnit } from "types/units.ts";
import { provinces } from "types/provinces.ts";

export default function UnitSelector() {
  
  function selectUnit(unit: IUnit) {
    selectedUnit.value = unit
    selectedMoveType.value = null
  }

  function filterOrigins(units: IUnit[], moves: Move[]) {
    return units.filter(unit => moves.every(x => x.origin != unit.province))
  }

  return (
    <div>
      <h4>Select unit that you want to move:</h4>
      <div class="flex flex-row flex-wrap gap-2">
      {selectedCountry.value && filterOrigins(gamePosition.value.unitPositions[selectedCountry.value], moves.value).map((unit) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" onClick={() => selectUnit(unit)}>
          {provinces[unit.province].name}
        </button>
      )}
      </div>
    </div>
  );
}