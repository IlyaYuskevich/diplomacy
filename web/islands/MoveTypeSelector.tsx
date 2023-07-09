import { currentGame } from "../types/games.ts";
import { MoveType, MoveTypeNames, selectedMoveType } from "../types/moves.ts";
import { GamePhase } from "../types/games.ts";
import { selectedUnit, UnitType } from "../types/units.ts";
import { ProvinceType, provincesMap } from "../types/provinces.ts";

export default function MoveTypeSelector() {
  const SpringMoves = [
    MoveType.Move,
    MoveType.Defend,
    MoveType.Support,
  ];
  const FallMoves = [MoveType.Build, MoveType.Retreat];
  
  function getSpringMoves() {
    const unitType = selectedUnit.value!.unitType
    const provinceType = provincesMap.value![selectedUnit.value!.province].type
    if (unitType == UnitType.Fleet && provinceType == ProvinceType.Sea) {
       return [...SpringMoves, MoveType.Convoy]
    }
    if (unitType == UnitType.Army && provinceType == ProvinceType.Coast) {
      return [...SpringMoves, MoveType.Convoy]
   }
   return SpringMoves
  }

  function selectMoveType(moveType: MoveType) {
    selectedMoveType.value = moveType;
  }

  return (
    <div>
      <h4>Select type of the move:</h4>
      <div class="flex flex-row space-x-4">
        {currentGame.value &&
          (currentGame.value!.phase == GamePhase.Spring
            ? getSpringMoves()
            : FallMoves).map((val) => (
              <button
                class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"
                onClick={() => selectMoveType(val)}
              >
                {MoveTypeNames[val]}
              </button>
            ))}
      </div>
    </div>
  );
}
