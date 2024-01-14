import { ProvinceCode, provinces, ProvinceType } from "types/provinces.ts";
import * as hooks from "preact/hooks";
import { Button } from "components/Button.tsx";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";

export default function CoastialProvinceSelector(
  props: { setter: hooks.StateUpdater<ProvinceCode | null>, state: ProvinceCode | null },
) {
  function filterCoastialProvinces(key: ProvinceCode) {
    return provinces[key].type == ProvinceType.Coast &&
      !provinces[key].name.endsWith("Coast");
  }

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {(Object.keys(provinces) as ProvinceCode[]).map((key) =>
          filterCoastialProvinces(key) && (
            <button
              onClick={() => props.setter(key)}
              class={StateButtonStyle(key === props.state, props.state === null)}
            >
              {provinces[key as ProvinceCode].name}
            </button>
          )
        )}
      </div>
    </div>
  );
}
