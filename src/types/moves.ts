import { signal } from "@preact/signals";
import { Tables, TablesInsert, Enums } from "lib/database.types.ts";

export type Move = Tables<"moves">

export type MoveInsert = TablesInsert<"moves">
export type SubmittedMove = Tables<"submitted_moves">
export type SubmittedMoveInsert = TablesInsert<"submitted_moves">

export type MoveType = Enums<"MoveType">

export const units = signal<Move[]>([]);
export const selectedMoveType = signal<MoveType | null>(null);
export const submittedMoves = signal<SubmittedMoveInsert[]>([]);

export const previousMoves = signal<Move[]>([]);

export const DIPLOMATIC_PHASE_MOVES: MoveType[] = [
    "MOVE",
    "HOLD",
    "SUPPORT",
    "CONVOY"
  ];
  export const RETREAT_PHASE_MOVES: MoveType[] = [
    "RETREAT"
  ];
export const GAINING_LOSING_MOVES: MoveType[] = ["BUILD", "DISBAND"];