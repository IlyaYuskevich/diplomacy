import * as hooks from "preact/hooks";
import { SubmittedMoveInsert, submittedMoves, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";
import CoastialProvinceSelector from "features/moveBuilder/islands/CoastialProvinceSelector.tsx";
import { computed } from "@preact/signals";

export default function ConvoyTheUnit() {

  const [from, setFrom] = hooks.useState<ProvinceCode | null>(null)
  const [to, setTo] = hooks.useState<ProvinceCode | null>(null)
  const selectDestination = computed(() => !!from || (selectedUnit.value?.unitType === "Army"))

  hooks.useEffect(() => {
    if (!to) {
      return
    }
    const newMove: SubmittedMoveInsert = {
      type: "CONVOY",
      origin: selectedUnit.value!.province,
      to: to,
      from: selectedUnit.value?.unitType === "Fleet" ? from : null,
      unit_type: selectedUnit.value!.unitType,
      phase: currentGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      game: currentGame.value!.id,
      player: selectedPlayerGame.value!.player,
    }
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    selectedMoveType.value = null;
  }, [to, from])

  return (
    <div>
      {selectedUnit.value?.unitType === "Fleet" && <p>Select from which province you want to convoy the army</p>}
      {selectedUnit.value?.unitType === "Fleet" && <CoastialProvinceSelector setter={setFrom} state={from} />}
      {selectDestination && <p>Select to which province you want to convoy the army</p>}
      {selectDestination && <CoastialProvinceSelector setter={setTo} state={to} />}
    </div>
  );
}