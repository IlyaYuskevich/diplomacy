import { signal } from "@preact/signals";
import { IGame } from "./games.ts";
import { IPlayer } from "./player.ts";
import { Country } from "./country.ts";

export interface IPlayerGame {
	id: string,
	startedAt: string,
	country: Country,
	color: string,
	game: IGame,
	player: IPlayer
}

export const playerGame = signal<IPlayerGame | null>(null);