import { ProvinceCode, provinces } from "types/provinces.ts";
import { gamePosition } from "types/game.ts";
import { currentCountry } from "types/playerGames.ts";
import * as hooks from "preact/hooks";

export default function RetreatAndDisbandingMoveBuilder() {
    const [origin, setOrigin] = hooks.useState<ProvinceCode | null>(null);
    const [to, setTo] = hooks.useState<ProvinceCode | null>(null);
    return (
    <div class="flex flex-row flex-wrap gap-2">
        {gamePosition.value.dislodged ? gamePosition.value.dislodged[currentCountry.value!].map(dislodge => 
            <button
              class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white"
              onClick={() => setOrigin(dislodge.province)}
            >
              {provinces[dislodge.province as ProvinceCode].name}
            </button>
        ) : "No retreats needed"}
      </div>
    )
}