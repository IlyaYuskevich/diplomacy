import { currentGame, currentPhase } from "types/game.ts";
import { useInterval } from "utils/hooks.ts";
import * as hooks from "preact/hooks";
import formatDuration from "date-fns/formatDuration/index.js";
import parseISO from "date-fns/parseISO/index.js";
import intervalToDuration from "date-fns/intervalToDuration/index.ts";
import isPast from "date-fns/isPast/index.ts";
import DiplomaticMoveBuilder from "islands/moveBuilders/DiplomaticMoveBuilder.tsx";
import RetreatAndDisbandingMoveBuilder from "islands/moveBuilders/RetreatAndDisbandingMoveBuilder.tsx";
import GainingAndLoosingBuilder from "islands/moveBuilders/GainingAndLoosingBuilder.tsx";

export default function Controls() {


  const [countdown, setCountdown] = hooks.useState("");

  useInterval(() => {
    setCountdown(formattedCountdown);
  }, 1e3);

  const formattedCountdown = () => {
    const ends_at = parseISO(currentGame.value!.phase!.ends_at, {});
    return isPast(ends_at) ? 'loading...' : formatDuration(
      intervalToDuration({
        start: new Date(),
        end: ends_at,
      }),
      {},
    );
  };

  return (
    <div class="w-full p-3">
      {currentGame.value && (
        <p>{`${currentGame.value!.phase!.phase} Phase: ${countdown}`}</p>
      )}

      {currentPhase.value == "Retreat and Disbanding" && <RetreatAndDisbandingMoveBuilder />}

      {currentPhase.value == "Diplomatic" && <DiplomaticMoveBuilder/> }

      {currentPhase.value == "Gaining and Losing" && <GainingAndLoosingBuilder/> }


    </div>
  );
}
