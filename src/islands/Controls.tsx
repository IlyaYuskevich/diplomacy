import { selectedCountry } from "types/country.ts";
import { selectedUnit } from "types/units.ts";
import UnitSelector from "islands/UnitSelector.tsx";
import {
  selectedMoveType,
  SubmittedMoveInsert,
  submittedMoves,
} from "types/moves.ts";
import MoveTypeSelector from "islands/MoveTypeSelector.tsx";
import MoveTheUnit from "islands/MoveTheUnit.tsx";
import SupportTheUnit from "islands/SupportTheUnit.tsx";
import ConvoyTheUnit from "islands/ConvoyTheUnit.tsx";
import CoastialProvinceSelector from "islands/CoastialProvinceSelector.tsx";
import MovesRenderer from "islands/MovesRenderer.tsx";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { useInterval } from "utils/hooks.ts";
import * as hooks from "preact/hooks";
import formatDuration from "date-fns/formatDuration/index.js";
import parseISO from "date-fns/parseISO/index.js";
import intervalToDuration from "date-fns/intervalToDuration/index.ts";
import isPast from "date-fns/isPast/index.ts";

export default function Controls() {
  function renderMoveBuilder() {
    switch (selectedMoveType.value) {
      case "MOVE":
        return <MoveTheUnit />;
      case "SUPPORT":
        return <SupportTheUnit />;
      case "CONVOY":
        if (selectedUnit.value!.unitType == "Fleet") {
          return <ConvoyTheUnit />;
        } else {
          return <CoastialProvinceSelector />;
        }
      case "DEFEND":
        makeDefendMove();
        return;
    }
  }

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

  function makeDefendMove() {
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      unit_type: selectedUnit.value!.unitType,
      phase: currentGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      to: selectedUnit.value!.province,
      game: currentGame.value!.id,
      player: selectedPlayerGame.value!.player,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }

  return (
    <div class="w-full p-3">
      {currentGame.value && (
        <p>{`${currentGame.value!.phase!.phase} Phase: ${countdown}`}</p>
      )}

      {submittedMoves.value.length != 0 && <MovesRenderer />}
      {/* <CountrySelector /> */}
      {selectedCountry.value && <UnitSelector />}
      {selectedUnit.value && <MoveTypeSelector />}
      {selectedMoveType.value && renderMoveBuilder()}
    </div>
  );
}
