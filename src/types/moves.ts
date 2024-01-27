import { signal } from "@preact/signals";
import { Tables, TablesInsert, Enums } from "lib/database.types.ts";

export type Move = Tables<"moves">

export type MoveInsert = TablesInsert<"moves">
export type SubmittedMove = Tables<"submitted_moves">
export type SubmittedMoveInsert = TablesInsert<"submitted_moves">

export type MoveType = Enums<"MoveType">
export type MoveTypeUi = MoveType | "SUPPORT HOLD"

export const units = signal<Move[]>([]);
export const selectedMoveType = signal<MoveTypeUi | null>(null);
export const submittedMoves = signal<SubmittedMoveInsert[]>([]);

export const previousMoves = signal<Move[]>([]);

export const DIPLOMATIC_PHASE_MOVES: MoveTypeUi[] = [
    "MOVE",
    "HOLD",
    "SUPPORT",
    "CONVOY",
    "SUPPORT HOLD",
  ];
  export const RETREAT_PHASE_MOVES: MoveType[] = [
    "RETREAT"
  ];
export const GAINING_LOSING_MOVES: MoveType[] = ["BUILD", "DISBAND"];