import { useEffect, useState } from "preact/hooks";
import { computed } from "@preact/signals";

export default function PossibleMoves() {
  const [adjacentProvinces, setAdjacentProvinces] = useState<{ [key: string]: string }>({});

  // useEffect(() => {
  //   void getMoves()
  // }, [])

  // const germany = computed(() => gamePosition.value.unitPositions.GERMANY);

  // async function getMoves() {
  //   if (!germany.value[0]) return
  //   const response = await fetch("http://localhost:8000/get-possible-moves", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ province: germany.value[0].province, unitType: germany.value[0].type }),
  //   });
  //   const jsonData = await response.json();
  //   setAdjacentProvinces(jsonData)
  // }

  // function handlePossibleMove(newProvince: string) {
  //   const updatedUnit = Object.assign({}, units.value[0]);
  //   updatedUnit.province = newProvince;
  //   units.value = [updatedUnit];
  //   void getMoves()
  // }

  return (
    <div>
      {/* <p>{germany.province}</p> */}
      {Object.keys(adjacentProvinces).map((key: string) =>
        // <button onClick={() => handlePossibleMove(key)}>
        <button>
          {adjacentProvinces[key]}
        </button>
      )}
    </div>
  );
}