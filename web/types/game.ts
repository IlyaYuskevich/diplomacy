import { signal } from "@preact/signals";
import { Tables, Enums } from "lib/database.types.ts";

export type GameStatus = Enums<"GameStatus">;
export type GamePhase = Enums<"Phase">;
export type Game = Tables<"games">

export const selectedGame = signal<Game | null>(null);