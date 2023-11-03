import * as hooks from "preact/hooks";
import { UnitType } from "types/units.ts";
import { BACKEND_URL } from "lib/environment.ts";

export default function AdjacentProvinceSelector(props: {province: string, setter: hooks.StateUpdater<string | null>, unitType?: UnitType}) {
  const [adjacentProvinces, setAdjacentProvinces] = hooks.useState<{ [key: string]: string }>({});

  hooks.useEffect(() => {
    if (!props.province) return
    void getMoves(props.province, props.unitType || null)
  }, [props.province])


  async function getMoves(province: string, unitType: UnitType | null) {
    const response = await fetch(`${BACKEND_URL}/get-possible-moves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ province, unitType }),
    });
    const jsonData = await response.json();
    setAdjacentProvinces(jsonData)
  }

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
      {Object.keys(adjacentProvinces).map((key: string) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"  onClick={() => props.setter(key)}>
          {adjacentProvinces[key]}
        </button>
      )}
      </div>
    </div>
  );
}