import { selectedCountry } from "../types/country.ts";
import { gamePosition } from "../types/gamePosition.ts";
import { selectedMoveType } from "../types/moves.ts";
import { provincesMap } from "../types/provinces.ts";
import { IUnit, selectedUnit } from "../types/units.ts";

export default function UnitSelector() {
  
  function selectUnit(unit: IUnit) {
    selectedUnit.value = unit
    selectedMoveType.value = null
  }

  return (
    <div>
      <h4>Select unit that you want to move:</h4>
      <div class="flex flex-row space-x-4">
      {selectedCountry.value && gamePosition.value.unitPositions[selectedCountry.value].map((unit) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" onClick={() => selectUnit(unit)}>
          {provincesMap.value![unit.province].name}
        </button>
      )}
      </div>
    </div>
  );
}