import { signal, computed } from "@preact/signals";
import { Tables, Enums } from "lib/database.types.ts";
import { START_POSITION } from "types/gamePosition.ts";

export type GameStatus = Enums<"game_status">;
export type GamePhase = Enums<"Phase">;

export type Phase = Tables<"phases">;
export type Game = Tables<"games">

export const currentGame = signal<Game | null>(null);

export const gamePosition = computed(() => currentGame.value?.game_position || START_POSITION)

