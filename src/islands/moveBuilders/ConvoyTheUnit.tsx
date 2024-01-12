import * as hooks from "preact/hooks";
import { SubmittedMoveInsert, submittedMoves, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { selectedCountry } from "types/country.ts";
import { selectedPlayerGame } from "types/playerGames.ts";
import { currentGame } from "types/game.ts";
import { ProvinceCode } from "types/provinces.ts";
import CoastialProvinceSelector from "islands/moveBuilders/CoastialProvinceSelector.tsx";

export default function ConvoyTheUnit() {

  const [from, setFrom] = hooks.useState<ProvinceCode | null>(null)
  const [to, setTo] = hooks.useState<ProvinceCode | null>(null)

  hooks.useEffect(() => {
    if (!from || !to) {
      return
    }
    const newMove: SubmittedMoveInsert = {
      type: selectedMoveType.value!,
      origin: selectedUnit.value!.province,
      to: to,
      from: from,
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
      <p>Select from which province you want to convoy the army</p>
      <CoastialProvinceSelector setter={setFrom} state={from} />
      {from && <p>Select to which province you want to convoy the army</p>}
      {from && <CoastialProvinceSelector setter={setTo} state={to} />}
    </div>
  );
}