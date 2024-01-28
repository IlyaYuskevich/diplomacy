import { signal, computed } from "@preact/signals";
import { Tables, Enums } from "lib/database.types.ts";
import { START_POSITION } from "types/gamePosition.ts";
import { Country } from "types/country.ts";

export type GameStatus = Enums<"game_status">;
export type GamePhase = Enums<"Phase">;
export type PhaseType = Enums<"Phase">;

export type Turn = Enums<"Turn">;

export type Phase = Tables<"phases">;
export type Game = Tables<"games">;

export type Votes = {
    ready: Country[]
}

export const currentGame = signal<Game | null>(null);

export const gamePosition = computed(() => currentGame.value?.phase?.game_position || START_POSITION)

export const currentPhase = computed(() => currentGame.value?.phase?.phase)

