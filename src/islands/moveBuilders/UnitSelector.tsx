import { submittedMoves, selectedMoveType, SubmittedMoveInsert } from "types/moves.ts";
import { selectedUnit, Unit } from "types/units.ts";
import { ProvinceCode, provinces } from "types/provinces.ts";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import { computed } from "@preact/signals";
import { gamePosition } from "types/game.ts";
import { selectedCountry } from "types/country.ts";

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

  const unitsToSelect = computed(() => filterOrigins(gamePosition.value.unitPositions[selectedCountry.value!], submittedMoves.value))

  return (
    <div>
      {unitsToSelect.value.length != 0 && <h4>Select unit that you want to move:</h4>}
      <div class="flex flex-row flex-wrap gap-2">
        {unitsToSelect.value.map((unit) => (
          <button
            class={StateButtonStyle(selectedUnit.value?.province === unit.province, !selectedUnit.value)}
            onClick={() => selectUnit(unit)}
          >
            {provinces[unit.province].name}
          </button>
        ))}
      </div>
    </div>
  );
}
