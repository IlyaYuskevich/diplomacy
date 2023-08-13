import { selectedCountry } from "../types/country.ts";
import { UnitType, selectedUnit, unitLocationsMap } from "../types/units.ts";
import CountrySelector from "./CountrySelector.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { gamePosition } from "../types/gamePosition.ts";
import { IMove, MoveType, moves, selectedMoveType } from "../types/moves.ts";
import MoveTypeSelector from "./MoveTypeSelector.tsx";
import MoveTheUnit from "./MoveTheUnit.tsx";
import SupportTheUnit from "./SupportTheUnit.tsx";
import ConvoyTheUnit from "./ConvoyTheUnit.tsx";
import { FetchedProps } from "../routes/[playerGameId].tsx";
import { provincesMap } from "../types/provinces.ts";
import CoastialProvinceSelector from "./CoastialProvinceSelector.tsx";
import MovesRenderer from "./MovesRenderer.tsx";
import { selectedPlayerGame } from "../types/playerGames.ts";
import * as hooks from "preact/hooks";

export default function Controls(props: FetchedProps) {

  hooks.useEffect(() => {
    selectedPlayerGame.value = props.playerGame
    gamePosition.value = props.gamePosition
    provincesMap.value = props.provinces
    unitLocationsMap.value = props.unitLocationsMap
  }, [props])

  function renderMoveBuilder() {
     switch(selectedMoveType.value) {
      case MoveType.Move:
        return <MoveTheUnit/>;
      case MoveType.Support:
        return <SupportTheUnit/>;
      case MoveType.Convoy:
        if (selectedUnit.value!.unitType == UnitType.Fleet) {
          return <ConvoyTheUnit/>;
        } else {
          return <CoastialProvinceSelector/>;
        }
      case MoveType.Defend:
        makeDefendMove()
        return
    }
  }

  function makeDefendMove() {
    const newMove: IMove = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      unitType: selectedUnit.value!.unitType,
      phase: selectedPlayerGame.value!.game.phase,
      year: selectedPlayerGame.value!.game.year,
      playerGame: selectedPlayerGame.value!,
    }
    moves.value = [...moves.value, newMove]
    selectedCountry.value = null
    selectedUnit.value = null
    selectedMoveType.value = null
  }

  return (
    <div class="w-full p-3">
        {moves.value.length !=0 && <MovesRenderer/>}
        <CountrySelector />
        {selectedCountry.value && <UnitSelector />}
        {selectedUnit.value && <MoveTypeSelector />}
        {selectedMoveType.value && renderMoveBuilder()}
    </div>
  );
}

