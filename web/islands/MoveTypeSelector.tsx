import { MoveType, selectedMoveType } from "../types/moves.ts";

export default function MoveTypeSelector() {
  
  function selectMoveType(moveType: MoveType) {
    selectedMoveType.value = moveType
  }

  return (
    <div>
      <h4>Select type of the move:</h4>
      <div class="flex flex-row space-x-4">
      {Object.keys(MoveType).map((key) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" onClick={() => selectMoveType(MoveType[key as keyof typeof MoveType])}>
          {key}
        </button>
      )}
      </div>
    </div>
  );
}