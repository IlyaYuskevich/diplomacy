import { IMove, moves, selectedMoveType } from "types/moves.ts";
import { ProvinceType, provincesMap } from "types/provinces.ts";
import * as hooks from "preact/hooks";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";

export default function CoastialProvinceSelector() {

  function filterCoastialProvinces(key: string) {
    return provincesMap.value![key].type == ProvinceType.Coast && !provincesMap.value![key].name.endsWith('Coast')
  }

  const [to, setTo] = hooks.useState<string | null>(null)

  hooks.useEffect(() => {
    if (!to) {
      return
    }
    const newMove: IMove = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      phase: selectedPlayerGame.value!.game.phase,
      year: selectedPlayerGame.value!.game.year,
      unitType: selectedUnit.value!.unitType,
      playerGame: selectedPlayerGame.value!,
  }
    moves.value = [...moves.value, newMove]
    selectedCountry.value = null
    selectedUnit.value = null
    selectedMoveType.value = null
  }, [to])

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-2">
      {Object.keys(provincesMap.value!).map((key: string) =>
        filterCoastialProvinces(key) && <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" onClick={() => setTo(key)}>
          {provincesMap.value![key].name}
        </button>
      )}
      </div>
    </div>
  );
}