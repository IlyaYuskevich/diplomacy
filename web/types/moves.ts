import { signal } from "@preact/signals";
import { UnitType } from "./units.ts";
import { Country } from "./country.ts";

export enum MoveType {
	Support = 'SUPPORT',
	Move = 'MOVE',
	Convoy = 'CONVOY',
	Build = 'BUILD',
	Destroy = 'DESTROY',
	Defend = 'DEFEND',
}

export enum MoveStatus {
	Submitted = 'SUBMITTED',
}

export interface IMove {
	id?: string,
	createdAt?: string,
	type: MoveType,
	origin: string,
	from?: string,
	to?: string,
	turn?: string,
	unitType: UnitType,
	status?: MoveStatus,
	game?: string,
	playerGames: {country: Country}
}

export const units = signal<IMove[]>([]);
export const selectedMoveType = signal<MoveType | null>(null);
export const moves = signal<IMove[]>([]);