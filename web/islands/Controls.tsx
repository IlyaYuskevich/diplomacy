import { selectedCountry } from "../types/country.ts";
import { IUnit, selectedUnit } from "../types/units.ts";
import { useEffect, useState } from "preact/hooks";
import CountrySelector from "./CountrySelector.tsx";
import AdjacentProvinceSelector from "./AdjacentProvinceSelector.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { IGamePosition, gamePosition } from "../types/gamePosition.ts";
import { selectedMove } from "../types/moves.ts";
import MoveTypeSelector from "./MoveTypeSelector.tsx";

type Props = { gamePosition: IGamePosition }

export default function Controls(props: Props) {

  useEffect(() => {
    gamePosition.value = props.gamePosition
  }, [props.gamePosition])

  return (
    <div class="w-full">
        <CountrySelector />
        {selectedCountry.value && <UnitSelector />}
        {selectedUnit.value && <MoveTypeSelector />}
        {selectedMove.value && <AdjacentProvinceSelector />}
    </div>
  );
}

