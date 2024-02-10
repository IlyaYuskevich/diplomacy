import * as hooks from "preact/hooks";
import { UnitType } from "types/units.ts";
import {
  ProvinceCode,
  provinces,
} from "types/provinces.ts";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import { Dislodgement, retreatOptions } from "types/gamePosition.ts";
import { gamePosition } from "types/game.ts";
import { computed } from "@preact/signals";
import { submittedMoves } from "types/moves.ts";

export default function RetreatProvinceSelector(
  props: {
    setter: hooks.StateUpdater<ProvinceCode | null>;
    dislodgement: Dislodgement,
    unitType: UnitType;
  },
) {

  const retreatTo = computed(() => retreatOptions(props.dislodgement, props.unitType, gamePosition.value));

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {retreatTo.value.length == 0 && "There are no options for this unit to retreat, it will be disbanded."}
        {
          retreatTo.value.map((key: ProvinceCode) => (
            <button
              class={StateButtonStyle(false, true)}
              onClick={() => props.setter(key)}
            >
              {provinces[key].name}
            </button>
          ))}
      </div>
    </div>
  );
}
