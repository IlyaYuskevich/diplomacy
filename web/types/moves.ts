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
	Retreat = 'RETREAT',
}

export const MoveTypeNames = {
	SUPPORT: 'Support',
	MOVE: 'Move',
	CONVOY: 'Convoy',
	BUILD: 'Build',
	DESTROY: 'Destroy',
	DEFEND: 'Defend',
	RETREAT: 'Retreat',
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