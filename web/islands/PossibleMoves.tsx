import { useEffect, useState } from "preact/hooks";
import { units } from "../utils/units.ts";

export default function PossibleMoves() {
  const [adjacentProvinces, setAdjacentProvinces] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    void getMoves()
  }, [])

  async function getMoves() {
    const response = await fetch("http://localhost:8000/get-possible-moves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ province: units.value[0].province, unitType: units.value[0].type }),
    });
    const jsonData = await response.json();
    setAdjacentProvinces(jsonData)
  }

  function handlePossibleMove(newProvince: string) {
    const updatedUnit = Object.assign({}, units.value[0]);
    updatedUnit.province = newProvince;
    units.value = [updatedUnit];
    void getMoves()
  }

  return (
    <div>
      <p>{units.value[0].province}</p>
      {Object.keys(adjacentProvinces).map((key: string) =>
        <button onClick={() => handlePossibleMove(key)}>
          {adjacentProvinces[key]}
        </button>
      )}
    </div>
  );
}