import { IMove, moves, selectedMoveType } from "../types/moves.ts";
import { ProvinceType, provincesMap } from "../types/provinces.ts";
import * as hooks from "preact/hooks";
import { selectedUnit } from "../types/units.ts";
import { selectedCountry } from "../types/country.ts";

export default function CoastialProvinceSelector() {

  function filterCoastialProvinces(key: string) {
    console.log(provincesMap.value![key].type == ProvinceType.Coast && !provincesMap.value![key].name.endsWith('Coast'))
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
      unitType: selectedUnit.value!.unitType,
      playerGames: {
              country: selectedCountry.value!
      }
  }
    moves.value = [...moves.value, newMove]
    selectedCountry.value = null
  }, [to])

  return (
    <div>
      <div class="flex flex-row space-x-4">
      {Object.keys(provincesMap.value!).map((key: string) =>
        filterCoastialProvinces(key) && <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" onClick={() => setTo(key)}>
          {provincesMap.value![key].name}
        </button>
      )}
      </div>
    </div>
  );
}