import { selectedCountry } from "../types/country.ts";
import { IUnit, UnitType, selectedUnit, unitLocationsMap } from "../types/units.ts";
import { useEffect, useState } from "preact/hooks";
import CountrySelector from "./CountrySelector.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { IGamePosition, gamePosition } from "../types/gamePosition.ts";
import { MoveType, selectedMoveType } from "../types/moves.ts";
import MoveTypeSelector from "./MoveTypeSelector.tsx";
import MoveTheUnit from "./MoveTheUnit.tsx";
import SupportTheUnit from "./SupportTheUnit.tsx";
import ConvoyTheUnit from "./ConvoyTheUnit.tsx";
import { FetchedProps } from "../routes/[gameId].tsx";
import { currentGame } from "../types/games.ts";
import { provincesMap } from "../types/provinces.ts";
import CoastialProvinceSelector from "./CoastialProvinceSelector.tsx";

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
    }
  }

  return (
    <div class="w-full">
        <CountrySelector />
        {selectedCountry.value && <UnitSelector />}
        {selectedUnit.value && <MoveTypeSelector />}
        {selectedMoveType.value && renderMoveBuilder()}
    </div>
  );
}
