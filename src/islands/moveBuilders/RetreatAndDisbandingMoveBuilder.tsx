import { ProvinceCode, provinces } from "types/provinces.ts";
import { currentGame, gamePosition } from "types/game.ts";
import { currentCountry, selectedPlayerGame } from "types/playerGames.ts";
import * as hooks from "preact/hooks";
import { SubmittedMoveInsert, submittedMoves } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";
import RetreatProvinceSelector from "islands/moveBuilders/RetreatProvinceSelector.tsx";
import { Dislodgement } from "types/gamePosition.ts";
import MovesRenderer from "islands/moveBuilders/MovesRenderer.tsx";

export default function RetreatAndDisbandingMoveBuilder() {
  const [to, setTo] = hooks.useState<ProvinceCode | null>(null);
  const [dislodge, setDislodge] = hooks.useState<Dislodgement | null>(null);

  function setRetreatUnit(dlg: Dislodgement) {
    setDislodge(dlg);
    selectedUnit.value = gamePosition.value.unitPositions[currentCountry.value!]
      .find((unit) => unit.province == dlg.province)!;
  }

  hooks.useEffect(() => {
    if (!selectedUnit.value || !to) return;
    const newMove: SubmittedMoveInsert = {
      type: "RETREAT",
      origin: selectedUnit.value.province,
      unit_type: selectedUnit.value.unitType,
      phase: currentGame.value!.phase!.id,
      player_game: selectedPlayerGame.value!.id,
      from: null,
      to: to,
      game: currentGame.value!.id,
      player: selectedPlayerGame.value!.player,
    };
    submittedMoves.value = [...submittedMoves.value, newMove];
    selectedUnit.value = null;
    setDislodge(null);
  }, [to]);

  return (
    <div class="flex flex-row flex-wrap gap-2">
      {submittedMoves.value.length != 0 && <MovesRenderer />}
      {gamePosition.value.dislodged
        ? gamePosition.value.dislodged[currentCountry.value!].filter((dslg) =>
          !submittedMoves.value.map((mv) => mv.origin).includes(dslg.province)
        ).map(
          (dislodge) => (
            <button
              class={StateButtonStyle(
                selectedUnit.value?.province == dislodge.province,
                true,
              )}
              onClick={() => setRetreatUnit(dislodge)}
            >
              {provinces[dislodge.province as ProvinceCode].name}
            </button>
          ),
        )
        : "No retreats needed"}
      {selectedUnit.value && dislodge &&
        (
          <div>
            Select destination to which you wantt to retreat
            <RetreatProvinceSelector
              dislodgement={dislodge}
              setter={setTo}
              unitType={selectedUnit.value.unitType}
            />
          </div>
        )}
    </div>
  );
}
