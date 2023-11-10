import { MoveType, selectedMoveType } from "types/moves.ts";
import { selectedUnit, UnitType } from "types/units.ts";
import { ProvinceType, provinces } from "types/provinces.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";

export default function MoveTypeSelector() {
  const SpringMoves: MoveType[] = [
    "MOVE",
    "DEFEND",
    "SUPPORT",
  ];
  const FallMoves: MoveType[] = ["BUILD", "RETREAT", "DESTROY"];
  
  function getSpringMoves(): MoveType[] {
    if (!selectedUnit.value) {
      return []
    }
    const unitType = selectedUnit.value.unitType
    const provinceCode = selectedUnit.value.province
    const provinceType = provinces[provinceCode].type
    if (unitType == "Fleet" && provinceType == ProvinceType.Sea) {
       return [...SpringMoves, "CONVOY"]
    }
    if (unitType =="Army" && provinceType == ProvinceType.Coast) {
      return [...SpringMoves, "CONVOY"]
   }
   return SpringMoves
  }

  function selectMoveType(moveType: MoveType) {
    selectedMoveType.value = moveType;
  }

  return (
    <div>
      <h4>Select type of the move:</h4>
      <div class="flex flex-row flex-wrap gap-2">
        {selectedGame.value &&
          (selectedGame.value.phase == "SPRING"
            ? getSpringMoves()
            : FallMoves).map((val) => (
              <button
                class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"
                onClick={() => selectMoveType(val)}
              >
                {val}
              </button>
            ))}
      </div>
    </div>
  );
}
