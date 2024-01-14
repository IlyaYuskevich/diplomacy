import * as hooks from "preact/hooks";
import { UnitType } from "types/units.ts";
import {
  armyBorders,
  fleetBorders,
  ProvinceCode,
  provinces,
} from "types/provinces.ts";
import { computed } from "@preact/signals";
import { selectedMoveType, submittedMoves } from "types/moves.ts";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";

export default function AdjacentProvinceSelector(
  props: {
    province: ProvinceCode;
    setter: hooks.StateUpdater<ProvinceCode | null>;
    state: ProvinceCode | null,
    unitType?: UnitType;
  },
) {
  function getMoves(
    province: ProvinceCode,
    unitType?: UnitType,
  ): ProvinceCode[] {
    if (unitType == "Fleet") {
      return fleetBorders[province] || [];
    } else if (unitType == "Army") {
      return armyBorders[province] || [];
    } 
    return [...armyBorders[province] || [], ...fleetBorders[province] || []]
  }

  const buttonStyle = computed(() => (key: ProvinceCode) => StateButtonStyle(key === props.state, !props.state))

  const alreadyMovesToProvinces = computed(() => submittedMoves.value.filter(mv => mv.type == "MOVE" && selectedMoveType.value == "MOVE").map(mv => mv.to))

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {props.province &&
          getMoves(props.province, props.unitType).filter(prov => !alreadyMovesToProvinces.value.includes(prov)).map((key: ProvinceCode) => (
            <button
              class={buttonStyle.value(key)}
              onClick={() => props.setter(key)}
            >
              {provinces[key].name}
            </button>
          ))}
      </div>
    </div>
  );
}
