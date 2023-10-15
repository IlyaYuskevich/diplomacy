import { signal } from "@preact/signals";
import { UnitType } from "types/units.ts";
import { IPlayerGame } from "types/playerGames.ts";
import { GamePhase, IGame } from "types/games.ts";

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
	year: number,
	phase: GamePhase,
	unitType: UnitType,
	status?: MoveStatus,
	playerGame: IPlayerGame
}

export const units = signal<IMove[]>([]);
export const selectedMoveType = signal<MoveType | null>(null);
export const moves = signal<IMove[]>([]);