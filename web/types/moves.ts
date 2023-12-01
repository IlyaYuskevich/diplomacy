import { signal } from "@preact/signals";
import { Tables, TablesInsert, Enums } from "lib/database.types.ts";

export type Move = Tables<"moves">
export type SubmittedMove = Tables<"submitted_moves">
export type SubmittedMoveInsert = TablesInsert<"submitted_moves">

export type MoveType = Enums<"MoveType">

export const units = signal<Move[]>([]);
export const selectedMoveType = signal<MoveType | null>(null);
export const submittedMoves = signal<SubmittedMoveInsert[]>([]);