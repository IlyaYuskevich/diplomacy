import { SubmittedMoveInsert, submittedMoves } from "types/moves.ts";
import { SubmittedMoveRenderer } from "./SubmittedMoveRenderer.tsx";
import { computed } from "@preact/signals";

export default function MovesRenderer() {
  async function submitMoves() {
    const response = await fetch(`/api/create-moves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedMoves.value.filter((mv) => !mv.created_at)),
    });
    const jsonData = await response.json();
    submittedMoves.value = jsonData;
  }

  const areAllSubmitted = computed(() =>
    submittedMoves.value.every((mv) => mv.id)
  );

  return (
    <div class="bg-slate-600 text-white rounded-lg p-3 text-center">
      {submittedMoves.value.map((move: SubmittedMoveInsert) => (
        <SubmittedMoveRenderer {...move} />
      ))}
      {!areAllSubmitted.value && (
        <button
          class="px-4 py-2 bg-slate-600 hover:bg-slate-400 rounded-md text-white border-2 border-white"
          onClick={() => void submitMoves()}
        >
          Submit
        </button>
      )}
    </div>
  );
}
