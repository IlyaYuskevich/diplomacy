import { signal } from "@preact/signals";

export interface Game {
  id: string,
	started_at: string,
	status: string,
	current_turn: string,
}

export interface IPlayerGame {
	id: string,
	name: string,
	started_at: string,
	country: string,
	color: string,
	games: Game,
	player: string
}

export const playerGame = signal<IPlayerGame | null>(null);