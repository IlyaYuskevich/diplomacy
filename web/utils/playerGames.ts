import { signal } from "@preact/signals";

export interface Game {
  id: string,
	startedAt: string,
	status: string,
	current_turn: string,
}

export interface IPlayerGame {
	id: string,
	name: string,
	startedAt: string,
	country: string,
	color: string,
	games: Game,
	player: string
}

export const playerGame = signal<IPlayerGame | null>(null);