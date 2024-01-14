import { DIPLOMATIC_PHASE_MOVES, GAINING_LOSING_MOVES, MoveType, RETREAT_PHASE_MOVES, selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";
import { ProvinceType, provinces } from "types/provinces.ts";
import { sentenceCase } from "https://deno.land/x/case@2.2.0/mod.ts";
import { GamePhase, currentGame } from "types/game.ts";
import { computed } from "@preact/signals";
import { StateButtonStyle } from "utils/moveSelectorsUtils.ts";

export default function MoveTypeSelector() {
  
  function getPossibleMoves(): MoveType[] {
    if (!selectedUnit.value || !currentGame.value?.phase) {
      return []
    }
    const unitType = selectedUnit.value.unitType
    const provinceCode = selectedUnit.value.province
    const provinceType = provinces[provinceCode].type
    const curentPhase: GamePhase = currentGame.value.phase.phase;
    switch (curentPhase) {
      case "Diplomatic":
        if (unitType =="Army" && provinceType == ProvinceType.Land) {
          return DIPLOMATIC_PHASE_MOVES.filter(mv => mv != "CONVOY")
       }
       return DIPLOMATIC_PHASE_MOVES
       case "Retreat and Disbanding":
        return RETREAT_PHASE_MOVES
       case "Gaining and Losing":
        return GAINING_LOSING_MOVES
    }    
  }

  const buttonStyle = computed(() => (key: MoveType) => StateButtonStyle(key === selectedMoveType.value, !selectedMoveType.value))

  function selectMoveType(moveType: MoveType) {
    selectedMoveType.value = moveType;
  }

  return (
    <div>
      <h4>Select type of the move:</h4>
      <div class="flex flex-row flex-wrap gap-2">
        {currentGame.value?.phase &&
          getPossibleMoves().map((val) => (
              <button
                class={buttonStyle.value(val)}
                onClick={() => selectMoveType(val)}
              >
                {sentenceCase(val)}
              </button>
            ))}
      </div>
    </div>
  );
}
