import { selectedCountry } from "types/country.ts";
import { gamePosition } from "types/gamePosition.ts";
import { submittedMoves, selectedMoveType, SubmittedMoveInsert } from "types/moves.ts";
import { selectedUnit, Unit } from "types/units.ts";
import { provinces } from "types/provinces.ts";
import { useEffect, useState } from "preact/hooks";

export default function UnitSelector() {
  function selectUnit(unit: Unit) {
    selectedUnit.value = unit;
    selectedMoveType.value = null;
  }

  function filterOrigins(units: Unit[], moves: SubmittedMoveInsert[]) {
    return units.filter((unit) =>
      moves.every((x) => x.origin != unit.province)
    );
  }

  const [unitsToSelect, setUniteToSelect] = useState<Unit[]>([]);

  useEffect(() => {
    selectedCountry.value &&
      setUniteToSelect(
        filterOrigins(
          gamePosition.value.unitPositions[selectedCountry.value],
          submittedMoves.value,
        ),
      );
  }, [selectedCountry.value, submittedMoves.value, gamePosition.value]);

  return (
    <div>
      {unitsToSelect.length != 0 && <h4>Select unit that you want to move:</h4>}
      <div class="flex flex-row flex-wrap gap-2">
        {unitsToSelect.map((unit) => (
          <button
            class="bg-primary hover:bg-primaryLight px-4 py-2 rounded-md text-white"
            onClick={() => selectUnit(unit)}
          >
            {provinces[unit.province].name}
          </button>
        ))}
      </div>
    </div>
  );
}
