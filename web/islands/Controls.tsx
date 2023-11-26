import { selectedCountry } from "types/country.ts";
import { selectedUnit, UnitType } from "types/units.ts";
import UnitSelector from "islands/UnitSelector.tsx";
import { SubmittedMoveInsert, submittedMoves, MoveType, selectedMoveType } from "types/moves.ts";
import MoveTypeSelector from "islands/MoveTypeSelector.tsx";
import MoveTheUnit from "islands/MoveTheUnit.tsx";
import SupportTheUnit from "islands/SupportTheUnit.tsx";
import ConvoyTheUnit from "islands/ConvoyTheUnit.tsx";
import CoastialProvinceSelector from "islands/CoastialProvinceSelector.tsx";
import MovesRenderer from "islands/MovesRenderer.tsx";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";

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

  function makeDefendMove() {
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      unit_type: selectedUnit.value!.unitType,
      phase: selectedGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      to: null,
      game: selectedGame.value!.id,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }

  return (
    <div class="w-full p-3">
      {submittedMoves.value.length != 0 && <MovesRenderer />}
      {/* <CountrySelector /> */}
      {selectedCountry.value && <UnitSelector />}
      {selectedUnit.value && <MoveTypeSelector />}
      {selectedMoveType.value && renderMoveBuilder()}
    </div>
  );
}
