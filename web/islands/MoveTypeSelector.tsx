import { MoveType, selectedMove } from "../types/moves.ts";

export default function MoveTypeSelector() {
  
  function selectMoveType(moveType: MoveType) {
    selectedMove.value = moveType
  }

  return (
    <div>
      <h4>Select type of the move:</h4>
      {Object.keys(MoveType).map((key) =>
        <button onClick={() => selectMoveType(MoveType[key as keyof typeof MoveType])}>
          {key}
        </button>
      )}
    </div>
  );
}