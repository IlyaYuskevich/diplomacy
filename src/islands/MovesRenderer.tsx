import { SubmittedMoveInsert, submittedMoves } from "types/moves.ts";

export default function MovesRenderer() {
  function moveFormatter(move: SubmittedMoveInsert) {
    switch (move.type) {
      case "MOVE":
        return `${move.unit_type} ${move.origin}-${move.to}`;
      case "RETREAT":
        return `${move.unit_type} ${move.origin}-${move.to}`;
      case "SUPPORT":
        return `${move.unit_type} ${move.origin} S ${move.from}-${move.to}`;
      case "CONVOY":
        return move.unit_type == "Fleet"
          ? `${move.unit_type} ${move.origin} C ${move.from}-${move.to}`
          : `${move.unit_type} ${move.origin} C ${move.to}`;
      case "DEFEND":
        return `${move.unit_type} ${move.origin} Defends`;
      case "BUILD":
        return `${move.unit_type} ${move.origin} Builds`;
      case "DESTROY":
        return `${move.unit_type} ${move.origin} Disbands`;
    }
  }

  async function submitMoves() {
    const response = await fetch(`/api/create-moves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedMoves.value.filter(mv => !mv.created_at)),
    });
    const jsonData = await response.json();
    submittedMoves.value = jsonData;
  }

  return (
    <div class="bg-primary text-white rounded-lg p-3 text-center">
      {submittedMoves.value.map((move: SubmittedMoveInsert) => <p>{moveFormatter(move)}</p>)}
      <button
        class="px-4 py-2 bg-primary hover:bg-primaryLight rounded-md text-white border-2 border-white"
        onClick={() => void submitMoves()}
      >
        Submit
      </button>
    </div>
  );
}
