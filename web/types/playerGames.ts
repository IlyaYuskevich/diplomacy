import { signal } from "@preact/signals";
import { IGame } from "types/games.ts";
import { IPlayer } from "types/player.ts";
import { Enums } from "lib/database.types.ts";

export interface IPlayerGame {
	id: string,
	created_at: string,
	country: Enums<'Country'>,
	color: string,
	game_id: string,
	player_id: string,
	game?: IGame,
	player?: IPlayer
}

export const selectedPlayerGame = signal<IPlayerGame | null>(null);