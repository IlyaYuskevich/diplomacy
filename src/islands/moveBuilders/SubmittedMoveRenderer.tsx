import { SubmittedMove, submittedMoves } from "types/moves.ts";
import { SubmittedMoveInsert } from "types/moves.ts";

export function SubmittedMoveRenderer(
  props: SubmittedMove | SubmittedMoveInsert,
) {
  const moveFormatter = (move: SubmittedMove | SubmittedMoveInsert) => {
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
      case "HOLD":
        return `${move.unit_type} ${move.origin} Defends`;
      case "BUILD":
        return `${move.unit_type} ${move.origin} Builds`;
      case "DISBAND":
        return `${move.unit_type} ${move.origin} Disbands`;
    }
  };

  const deleteSubmittedMove = async (id: string) => {
    await fetch(`/api/submitted-move/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    submittedMoves.value = submittedMoves.value.filter((mv) => mv.id != id);
  };

  return (
    <p class="inline-flex justify-center w-full">
      {moveFormatter(props)}
      {props.id &&
        (
          <button title="Undo Move" class="inline" onClick={() => void deleteSubmittedMove(props.id!)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
    </p>
  );
}
