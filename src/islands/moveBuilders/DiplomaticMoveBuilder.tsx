import MovesRenderer from "./MovesRenderer.tsx";
import UnitSelector from "./UnitSelector.tsx";
import MoveTypeSelector from "./MoveTypeSelector.tsx";
import {
  selectedMoveType,
  SubmittedMoveInsert,
  submittedMoves,
} from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { currentGame } from "types/game.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import MoveTheUnit from "./MoveTheUnit.tsx";
import SupportTheUnit from "./SupportTheUnit.tsx";
import ConvoyTheUnit from "./ConvoyTheUnit.tsx";
import SupportHold from "islands/moveBuilders/SupportHold.tsx";

export default function DiplomaticMoveBuilder() {
  function renderMoveBuilder() {
    switch (selectedMoveType.value) {
      case "MOVE":
        return <MoveTheUnit />;
      case "SUPPORT":
        return <SupportTheUnit />;
      case "SUPPORT HOLD":
        return <SupportHold />;
      case "CONVOY":
        return <ConvoyTheUnit />;
      case "HOLD":
        orderHold();
        return;
    }
  }

  function orderHold() {
    const newMove: SubmittedMoveInsert = {
      type: "HOLD",
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
    <>
      {submittedMoves.value.length != 0 && <MovesRenderer />}
      <UnitSelector />
      {selectedUnit.value && <MoveTypeSelector />}
      {selectedMoveType.value && renderMoveBuilder()}
    </>
  );
}
