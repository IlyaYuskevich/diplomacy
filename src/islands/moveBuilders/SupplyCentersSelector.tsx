import { ProvinceCode, provinces } from "types/provinces.ts";
import * as hooks from "preact/hooks";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import { currentGame } from "types/game.ts";
import { currentCountry } from "types/playerGames.ts";
import { SUPPLY_CENTERS } from "types/gamePosition.ts";
import { submittedMoves } from "types/moves.ts";

export default function SupplyCentersSelector(
  props: {
    setter: hooks.StateUpdater<ProvinceCode | null>;
    state: ProvinceCode | null;
  },
) {
  return (
    <div>
      Select supply center where you want to build the unit:
      <div class="flex flex-row flex-wrap gap-2">
        {currentGame.value?.game_position.domains[currentCountry.value!].filter(
          (province) => SUPPLY_CENTERS[province] == currentCountry.value
        ).filter(province => !submittedMoves.value.map(mv => mv.to).includes(province))
        .map((center, i) => (
          <button
            class={StateButtonStyle(
              props.state === center,
              props.state !== center,
            )}
            onClick={() => props.setter(center)}
          >
            {provinces[center].name}
          </button>
        ))}
      </div>
    </div>
  );
}
