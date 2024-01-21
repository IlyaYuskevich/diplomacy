import { Move, SubmittedMove, submittedMoves } from "types/moves.ts";
import { SubmittedMoveInsert } from "types/moves.ts";

export function SubmittedMoveRenderer(
  props: SubmittedMove | SubmittedMoveInsert | Move,
) {
  const moveFormatter = (move: SubmittedMove | SubmittedMoveInsert) => {
    const status = (props as Move).status || "";
    let text;
    switch (move.type) {
      case "MOVE":
        text = `${move.unit_type} ${move.origin}-${move.to}`;
        break;
      case "RETREAT":
        text = `${move.unit_type} retreats ${move.origin}-${move.to}`;
        break;
      case "SUPPORT":
        text = `${move.unit_type} ${move.origin} S ${move.from}-${move.to}`;
        break;
      case "CONVOY":
        text = move.unit_type == "Fleet"
          ? `${move.unit_type} ${move.origin} C ${move.from}-${move.to}`
          : `${move.unit_type} ${move.origin} C ${move.to}`;
        break;
      case "HOLD":
        text = `${move.unit_type} ${move.origin} Holds`;
        break;
      case "BUILD":
        text = `${move.unit_type} ${move.to} Builds`;
        break;
      case "DISBAND":
        text = `${move.unit_type} ${move.origin} Disbands`;
        break;
    }
    return status == "FAILED" ? <u>{text}</u> : <span>{text}</span>;
  };

  const deleteSubmittedMove = async (
    move: SubmittedMove | SubmittedMoveInsert,
  ) => {
    if (move.id) {
      await fetch(`/api/submitted-move/${move.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      submittedMoves.value = submittedMoves.value.filter((mv) =>
        mv.id != move.id
      );
    } else {
      submittedMoves.value = submittedMoves.value.filter((mv) =>
        mv.origin != move.origin
      );
    }
  };

  return (
    <span class="inline-flex justify-center">
      {moveFormatter(props)}
      {!(props as Move).status &&
        (
          <button
            title="Undo Move"
            class="inline"
            onClick={() => void deleteSubmittedMove(props)}
          >
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
    </span>
  );
}
