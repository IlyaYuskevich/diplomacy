import * as hooks from "preact/hooks";
import { UnitType } from "types/units.ts";
import {
  armyBorders,
  fleetBorders,
  ProvinceCode,
  provinces,
} from "types/provinces.ts";

export default function AdjacentProvinceSelector(
  props: {
    province: ProvinceCode;
    setter: hooks.StateUpdater<ProvinceCode | null>;
    unitType?: UnitType;
  },
) {
  console.log(props)
  function getMoves(
    province: ProvinceCode,
    unitType?: UnitType,
  ): ProvinceCode[] {
    console.log(province, unitType)
    if (unitType == "Fleet") {
      return fleetBorders[province] || [];
    } else if (unitType == "Army") {
      return armyBorders[province] || [];
    } 
    return [...armyBorders[province] || [], ...fleetBorders[province] || []]
  }

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {props.province &&
          getMoves(props.province, props.unitType).map((key: ProvinceCode) => (
            <button
              class="bg-primary hover:bg-primaryLight px-4 py-2 rounded-md text-white"
              onClick={() => props.setter(key)}
            >
              {provinces[key].name}
            </button>
          ))}
      </div>
    </div>
  );
}
