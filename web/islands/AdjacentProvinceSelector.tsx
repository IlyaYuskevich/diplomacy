import { StateUpdater, useEffect, useState } from "preact/hooks";
import { UnitType } from "../types/units.ts";

export default function AdjacentProvinceSelector(props: {province: string, setter: StateUpdater<string | null>, unitType?: UnitType}) {
  const [adjacentProvinces, setAdjacentProvinces] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!props.province) return
    void getMoves(props.province, props.unitType || null)
  }, [props.province])


  async function getMoves(province: string, unitType: UnitType | null) {
    const response = await fetch("http://localhost:8000/get-possible-moves", {
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
      <div class="flex flex-row space-x-4">
      {Object.keys(adjacentProvinces).map((key: string) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"  onClick={() => props.setter(key)}>
          {adjacentProvinces[key]}
        </button>
      )}
      </div>
    </div>
  );
}