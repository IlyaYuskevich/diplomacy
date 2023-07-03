import { selectedCountry } from "../types/country.ts";
import { IUnit, selectedUnit } from "../types/units.ts";
import { useEffect, useState } from "preact/hooks";
import CountrySelector from "./CountrySelector.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { IGamePosition, gamePosition } from "../types/gamePosition.ts";
import { MoveType, selectedMoveType } from "../types/moves.ts";
import MoveTypeSelector from "./MoveTypeSelector.tsx";
import MoveTheUnit from "./MoveTheUnit.tsx";
import SupportTheUnit from "./SupportTheUnit.tsx";
import ConvoyTheUnit from "./ConvoyTheUnit.tsx";

type Props = { gamePosition: IGamePosition }

export default function Controls(props: Props) {

  useEffect(() => {
    gamePosition.value = props.gamePosition
  }, [props.gamePosition])

  function renderMoveBuilder() {
     switch(selectedMoveType.value) {
      case MoveType.Move:
        return <MoveTheUnit/>;
      case MoveType.Support:
        return <SupportTheUnit/>;
      case MoveType.Convoy:
        return <ConvoyTheUnit/>;
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

