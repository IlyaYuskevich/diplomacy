import { PlayerGame } from "types/playerGames.ts";
import formatRelative from "date-fns/formatRelative/index.ts";
import parseISO from "date-fns/parseISO/index.js";

export default function PlayerGameItem(props: PlayerGame) {
  return (
    <div class="flex gap-5 pb-2">
      <div>{formatRelative(parseISO(props.created_at, {}), new Date())}</div>
      <div>{`${props.country ? props.country : "Not Started"}`}</div>
      <form action={`/game/${props.game}`}>
        <button
          class="bg-slate-600 px-4 py-2 hover:bg-slate-900 rounded-md text-white"
          type="submit"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
