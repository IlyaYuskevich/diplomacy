import {
  getBuildsDisbandsBalance,
  getGainingLosingNumber,
} from "utils/validators.ts";
import { currentGame } from "types/game.ts";
import { currentCountry, selectedPlayerGame } from "types/playerGames.ts";
import { MoveInsert, SubmittedMoveInsert, submittedMoves } from "types/moves.ts";
import { computed } from "@preact/signals";
import UnitSelector from "islands/moveBuilders/UnitSelector.tsx";
import SupplyCentersSelector from "islands/moveBuilders/SupplyCentersSelector.tsx";
import * as hooks from "preact/hooks";
import { ProvinceCode } from "types/provinces.ts";
import { UnitType, selectedUnit } from "types/units.ts";
import UnitTypeSelector from "islands/moveBuilders/UnitTypeSelector.tsx";
import MovesRenderer from "islands/moveBuilders/MovesRenderer.tsx";

export default function GainingAndLoosingBuilder() {

  const [supplyCenter, setSupplyCenter] = hooks.useState<ProvinceCode | null>(null);
  const [unitType, setUnitType] = hooks.useState<UnitType | null>(null);
  const gainingLoosingNumber = computed(() =>
    getGainingLosingNumber(
      currentGame.value!.game_position,
      currentCountry.value!,
    ) - getBuildsDisbandsBalance(submittedMoves.value as MoveInsert[])
  );

  hooks.useEffect(() => {
    if (!supplyCenter || !unitType) return
    const newMove: SubmittedMoveInsert = {
      type: "BUILD",
      origin: supplyCenter,
      unit_type: unitType,
      phase: currentGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      to: supplyCenter,
      game: currentGame.value!.id,
      player: selectedPlayerGame.value!.player,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    setSupplyCenter(null);
    setUnitType(null);
  }, [unitType]);

  hooks.useEffect(() => {
    if (!selectedUnit.value) return
    const newMove: SubmittedMoveInsert = {
      type: "DISBAND",
      origin: selectedUnit.value.province,
      unit_type: selectedUnit.value.unitType,
      phase: currentGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      to: selectedUnit.value.province,
      game: currentGame.value!.id,
      player: selectedPlayerGame.value!.player,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
  }, [selectedUnit.value]);


  const gainingOrLoosingBuilder = computed(() => {
    if (gainingLoosingNumber.value > 0) {
      return (
        <div>
          {submittedMoves.value.length != 0 && <MovesRenderer />}
          You need to build {gainingLoosingNumber.value} units
          <SupplyCentersSelector state={supplyCenter} setter={setSupplyCenter}/>
          {supplyCenter && <UnitTypeSelector setter={setUnitType} supplyCenter={supplyCenter}/>}
        </div>
      );
    }
    if (gainingLoosingNumber.value > 0) {
      return (
        <div>
          You need to disband {gainingLoosingNumber.value} units
          <UnitSelector />
        </div>
      );
    }
  });
  return (
    <>
      {gainingOrLoosingBuilder}
    </>
  );
}
