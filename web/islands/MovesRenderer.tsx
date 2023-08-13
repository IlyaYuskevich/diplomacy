import { IMove, moves, MoveType } from "../types/moves.ts";
import { IPlayerGame } from "../types/playerGames.ts";
import { UnitType } from "../types/units.ts";

export default function MovesRenderer() {
  function moveFormatter(move: IMove) {
    switch (move.type) {
      case MoveType.Move:
        return `${move.unitType} ${move.origin}-${move.to}`;
      case MoveType.Retreat:
        return `${move.unitType} ${move.origin}-${move.to}`;
      case MoveType.Support:
        return `${move.unitType} ${move.origin} S ${move.from}-${move.to}`;
      case MoveType.Convoy:
        return move.unitType == UnitType.Fleet
          ? `${move.unitType} ${move.origin} C ${move.from}-${move.to}`
          : `${move.unitType} ${move.origin} C ${move.to}`;
      case MoveType.Defend:
        return `${move.unitType} ${move.origin} Defends`;
      case MoveType.Build:
        return `${move.unitType} ${move.origin} Builds`;
      case MoveType.Destroy:
        return `${move.unitType} ${move.origin} Disbands`;
    }
  }

  async function submitMoves() {
    const response = await fetch("http://localhost:8000/moves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moves.value),
    });
    const jsonData = await response.json();
    console.log(moves.value, response, jsonData)
    moves.value = jsonData
  }

  return (
    <div class="bg-red-900 text-white rounded-lg p-3 text-center">
      {moves.value.map((move) => <p>{moveFormatter(move)}</p>)}
      <button class="bg-white px-4 py-2 bg-[#FFFFFF00] hover:bg-[#FFFFFF55] rounded-md text-white border-2 border-white" onClick={() => void submitMoves()}>
        Submit
      </button>
    </div>
  );
}
