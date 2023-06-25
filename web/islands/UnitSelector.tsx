import { selectedCountry } from "../types/country.ts";
import { gamePosition } from "../types/gamePosition.ts";
import { IUnit, selectedUnit } from "../types/units.ts";
import * as hooks from "preact/hooks";

export default function UnitSelector() {
  
  function selectUnit(unit: IUnit) {
    selectedUnit.value = unit
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