import { signal } from "@preact/signals";
import { Tables } from "lib/database.types.ts";

export type PlayerGame = Tables<"player_games">

export function getCountry(playerGameId: string, playerGames: PlayerGame[]) {
    return playerGames.find(pg => pg.id == playerGameId)?.country || null
}

export const selectedPlayerGame = signal<PlayerGame | null>(null);