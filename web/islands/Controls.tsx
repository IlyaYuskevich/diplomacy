
import { selectedCountry } from "../types/country.ts";
import { IUnit, selectedUnit } from "../types/units.ts";
import * as hooks from "preact/hooks";
import CountrySelector from "./CountrySelector.tsx";
import PossibleMoves from "./PossibleMoves.tsx";
import UnitSelector from "./UnitSelector.tsx";
import { IGamePosition, gamePosition } from "../types/gamePosition.ts";

type Props = { gamePosition: IGamePosition }

export default function Controls(props: Props) {

  hooks.useEffect(() => {
    gamePosition.value = props.gamePosition
  }, [props.gamePosition])

  return (
    <div>
        <CountrySelector />
        {selectedCountry.value && <UnitSelector />}
        {selectedUnit.value && <PossibleMoves />}
    </div>
  );
}

