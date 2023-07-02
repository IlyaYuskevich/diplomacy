import { signal } from "@preact/signals";
import { UnitType } from "./units.ts";

export enum MoveType {
	Support = 'SUPPORT',
	Move = 'MOVE',
	Convoy = 'CONVOY',
	Build = 'BUILD',
	Destroy = 'DESTROY',
	Defend = 'DEFEND',
}

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
	playerGames: {country: string}
}

export const units = signal<IMove[]>([]);
export const selectedMove = signal<MoveType | null>(null);