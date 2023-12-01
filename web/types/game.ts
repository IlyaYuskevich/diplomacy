import { signal } from "@preact/signals";
import { Tables, Enums } from "lib/database.types.ts";

export type GameStatus = Enums<"game_status">;
export type GamePhase = Enums<"Phase">;

export type Phase = Tables<"phases">;
export type Game = Tables<"games">

export const selectedGame = signal<Game | null>(null);