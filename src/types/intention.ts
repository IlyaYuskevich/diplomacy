import { Move } from "types/moves.ts";
import { ProvinceCode, isCoast, fleetToArmyBorder } from "types/provinces.ts";

export type MoveIntention = { // wrapper around move representing it the process of conflict resolution according to Diplomacy rules
    move: Move;
    score: number; // score given to unit to resolve particular case
    bounced: boolean; // when unit's movement was blocked, it stays in the original province and acts as unit ordererd to HOLD
    dislodged: boolean; // when unit pushed out from the original province; unit can be bounced and dislodged at the same time
    dislodgedFrom: ProvinceCode | null; // province code that caused dislodgement
    cut: boolean; // support is cut when supporting unit province is under attack
    standoffIn: ProvinceCode | null; // indicate if unit participated in a standoff
    resolved: boolean; // final state, resolver won't change intention state. if all intentions are resolved, the resolver stops iterating
  };
  
  export function createIntentions(moves: Move[]) {
    /* Creates intentions that are iterated over. */
    return moves
      .map((mv) => ({
        move: mv,
        score: 1 + 0.5 * Number(mv.type == "HOLD"),
      } as MoveIntention));
  }
  
  export const isActiveMove = (intention: MoveIntention) => {
    return ["MOVE", "HOLD"].includes(intention.move.type) ||
      (intention.move.type == "CONVOY" && intention.move.unit_type == "Army");
  };
  
  export const isTargetingSameProvince = (
    intention1: MoveIntention,
    intention2: MoveIntention,
  ) => {
    /* Verifies that provided intentions target same province. */
    return fleetToArmyBorder(intention1.move.to) == fleetToArmyBorder(intention2.move.to);
  };
  
  export const isTradingProvinceAttempt = (
    intention1: MoveIntention,
    intention2: MoveIntention,
  ) => {
    /* Verify if provided moves try to occupy each other's origin province. */
    return intention1.move.origin == fleetToArmyBorder(intention2.move.to) &&
      intention2.move.origin == fleetToArmyBorder(intention1.move.to) &&
      intention1.move.id != intention2.move.id;
  };
  
  export const isSupporting = (support: MoveIntention, supported: MoveIntention) => {
    /* Verify that argument supports second argument. */
    return support.move.type == "SUPPORT" &&
      support.move.from == supported.move.origin &&
      support.move.to == fleetToArmyBorder(supported.move.to);
  };
  
  export const isConvoying = (convoyer: MoveIntention, convoyee: MoveIntention) => {
    /* Verify atomic convoy order. */
    if (convoyer.move.type != "CONVOY" || convoyer.move.unit_type != "Fleet") return false
    if (isCoast(convoyer.move.origin!)) return false
    return convoyer.move.from == convoyee.move.origin &&
      convoyer.move.to == convoyee.move.to;
  };
  
  export const isAttacking = (attacker: MoveIntention, defender: MoveIntention) => {
    /* Verify that first argument tries to attack (move or support) province occupied by second argument. */
    return attacker.move.to == defender.move.origin &&
      attacker.move.id != defender.move.id &&
      attacker.move.player_game != defender.move.player_game; // can't attack own units
  };
  
  export const isHoldingProvince = (
    intention: MoveIntention,
    province: ProvinceCode,
  ) => {
    return intention.move.type == "HOLD" && intention.move.origin == fleetToArmyBorder(province);
  };
  
  export const isDisrupted = (intention: MoveIntention) => {
    return intention.cut || intention.bounced || intention.dislodged || false;
  };