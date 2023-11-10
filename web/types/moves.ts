import { signal } from "@preact/signals";
import { Tables, Enums } from "lib/database.types.ts";

export type Move = Tables<"moves">

export type MoveType = Enums<"MoveType">

export const units = signal<Move[]>([]);
export const selectedMoveType = signal<MoveType | null>(null);
export const moves = signal<Move[]>([]);