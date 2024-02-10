import * as hooks from "preact/hooks";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import { UnitType } from "types/units.ts";
import { ProvinceCode, ProvinceType, provinces } from "types/provinces.ts";

export default function UnitTypeSelector(props: { setter: hooks.StateUpdater<UnitType | null>, supplyCenter: ProvinceCode }) {


  return (
    <div class="mt-3">
      Select type of the unit that you want to build:
      <div class="flex flex-row flex-wrap gap-2">
        {((provinces[props.supplyCenter].type === ProvinceType.Coast ? ["Army", "Fleet"] : ["Army"]) as UnitType[]).map((unitType) => (
          <button
            class={StateButtonStyle(false, true)}
            onClick={() => props.setter(unitType)}
          >
            {unitType}
          </button>
        ))}
      </div>
    </div>
  );
}
