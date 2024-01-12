import { selectedMoveType } from "types/moves.ts";
import { selectedUnit, Unit } from "types/units.ts";
import { ProvinceCode, provinces } from "types/provinces.ts";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import { currentGame } from "types/game.ts";
import { currentCountry } from "types/playerGames.ts";
import { SUPPLY_CENTERS } from "types/gamePosition.ts";

export default function SupplyCentersSelector(props: {state: ProvinceCode[]}) {


function addBuildMove(center: string): void {
  throw new Error("Function not implemented.");
}

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {currentGame.value?.game_position.domains[currentCountry.value!].filter(province => SUPPLY_CENTERS[province] == currentCountry.value).map((center, i) => (
          <button
            class={StateButtonStyle(center, props.state[i])}
            onClick={() => addBuildMove(center)}
          >
            {provinces[center].name}
          </button>
        ))}
      </div>
    </div>
  );
}
