import { useEffect, useState } from "preact/hooks";
import { computed } from "@preact/signals";
import { IUnit, selectedUnit } from "../types/units.ts";

export default function PossibleMoves() {
  const [adjacentProvinces, setAdjacentProvinces] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!selectedUnit.value) return
    void getMoves(selectedUnit.value)
  }, [selectedUnit.value])


  async function getMoves(unit: IUnit) {
    const response = await fetch("http://localhost:8000/get-possible-moves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ province: unit.province, unitType: unit.unitType }),
    });
    const jsonData = await response.json();
    setAdjacentProvinces(jsonData)
  }

  return (
    <div>
      {/* <p>{germany.province}</p> */}
      <h4>Select where you want to move the unit:</h4>
      {Object.keys(adjacentProvinces).map((key: string) =>
        <button onClick={() => console.log(key)}>
          {adjacentProvinces[key]}
        </button>
      )}
    </div>
  );
}