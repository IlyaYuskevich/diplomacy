import { signal } from "@preact/signals";

export interface IPlayer {
	id: string,
	createdAt: string,
	name: string,
}

export const units = signal<IPlayer[]>([]);