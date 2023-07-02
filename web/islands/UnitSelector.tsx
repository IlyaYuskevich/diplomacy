import { selectedCountry } from "../types/country.ts";
import { gamePosition } from "../types/gamePosition.ts";
import { selectedMove } from "../types/moves.ts";
import { IUnit, selectedUnit } from "../types/units.ts";

export default function UnitSelector() {
  
  function selectUnit(unit: IUnit) {
    selectedUnit.value = unit
    selectedMove.value = null
  }

  return (
    <div>
      <h4>Select unit that you want to move:</h4>
      {selectedCountry.value && gamePosition.value.unitPositions[selectedCountry.value].map((unit) =>
        <button onClick={() => selectUnit(unit)}>
          {unit.province}
        </button>
      )}
    </div>
  );
}