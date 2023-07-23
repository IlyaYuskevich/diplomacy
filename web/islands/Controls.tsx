import { selectedCountry } from "../types/country.ts";
import { IUnit, UnitType, selectedUnit, unitLocationsMap } from "../types/units.ts";
import { useEffect, useState } from "preact/hooks";
import CountrySelector from "./CountrySelector.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { IGamePosition, gamePosition } from "../types/gamePosition.ts";
import { IMove, MoveType, moves, selectedMoveType } from "../types/moves.ts";
import MoveTypeSelector from "./MoveTypeSelector.tsx";
import MoveTheUnit from "./MoveTheUnit.tsx";
import SupportTheUnit from "./SupportTheUnit.tsx";
import ConvoyTheUnit from "./ConvoyTheUnit.tsx";
import { FetchedProps } from "../routes/[gameId].tsx";
import { currentGame } from "../types/games.ts";
import { provincesMap } from "../types/provinces.ts";
import CoastialProvinceSelector from "./CoastialProvinceSelector.tsx";
import MovesRenderer from "./MovesRenderer.tsx";

export default function Controls(props: FetchedProps) {

  useEffect(() => {
    gamePosition.value = props.gamePosition
    currentGame.value = props.game
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
      playerGames: {
              country: selectedCountry.value!
      }
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

