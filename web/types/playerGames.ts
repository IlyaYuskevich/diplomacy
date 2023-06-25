import { signal } from "@preact/signals";
import { IGame } from "./games.ts";
import { IPlayer } from "./player.ts";

export enum Country {
	France = "FRANCE",
	Germany = "GERMANY",
	Italy = "ITALY",
	Russia = "RUSSIA",
	Austria = "AUSTRIA",
	England = "ENGLAND",
	Turkey = "TURKEY",
}

export interface IPlayerGame {
	id: string,
	startedAt: string,
	country: Country,
	color: string,
	game: IGame,
	player: IPlayer
}

export const playerGame = signal<IPlayerGame | null>(null);