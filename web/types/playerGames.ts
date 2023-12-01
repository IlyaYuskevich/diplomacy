import { signal } from "@preact/signals";
import { Tables } from "lib/database.types.ts";

export type PlayerGame = Tables<"player_games">

export const selectedPlayerGame = signal<PlayerGame | null>(null);