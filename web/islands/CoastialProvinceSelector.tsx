import {
  selectedMoveType,
  submittedMoves,
  SubmittedMoveInsert,
} from "types/moves.ts";
import { ProvinceCode, provinces, ProvinceType } from "types/provinces.ts";
import * as hooks from "preact/hooks";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { selectedGame } from "types/game.ts";

export default function CoastialProvinceSelector() {
  function filterCoastialProvinces(key: ProvinceCode) {
    return provinces[key].type == ProvinceType.Coast &&
      !provinces[key].name.endsWith("Coast");
  }

  const [to, setTo] = hooks.useState<ProvinceCode | null>(null);

  hooks.useEffect(() => {
    if (!to) {
      return;
    }
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      phase: selectedGame.value!.phase!.id,
      unit_type: selectedUnit.value!.unitType,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      game: selectedGame.value!.id,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedCountry.value = null;
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }, [to]);

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
        {(Object.keys(provinces) as ProvinceCode[]).map((key) =>
          filterCoastialProvinces(key) && (
            <button
              class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"
              onClick={() => setTo(key)}
            >
              {provinces[key as ProvinceCode].name}
            </button>
          )
        )}
      </div>
    </div>
  );
}
