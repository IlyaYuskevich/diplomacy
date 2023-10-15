import { signal } from "@preact/signals";
import { IGame } from "types/games.ts";
import { IPlayer } from "types/player.ts";
import { Country } from "types/country.ts";

export interface IPlayerGame {
	id: string,
	createdAt: string,
	country: Country,
	color: string,
	game: IGame,
	player: IPlayer
}

export const selectedPlayerGame = signal<IPlayerGame | null>(null);