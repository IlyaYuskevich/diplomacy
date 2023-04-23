import { signal } from "@preact/signals";
import { UnitType } from "./units.ts";

export interface IMove {
	id: string,
	createdAt: string,
	type: string,
	origin: string,
	from: string,
	to: string,
	turn: string,
	unitType: UnitType,
	status: string,
	game: string,
	player_games: {country: string}
}

export const units = signal<IMove[]>([]);