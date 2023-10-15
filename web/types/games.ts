export enum GameStatus {
	Finished = 'FINISHED',
	Started = 'STARTED'
}

export enum GameType {
	Multi = 'MULTI',
	Hosted = 'HOSTED'
}

export enum GamePhase {
	Spring = 'S',
	Fall = 'F'
}

export const GamePhaseName = {
	S: 'Spring',
	F: 'Fall',
}

export interface IGame {
  	id: string,
	startedAt: string,
	status: GameStatus,
	diplomaticPhaseSpring: string,
	diplomaticPhaseFall: string,
	retreatPhase: string,
	gainingLoosingPhase: string,
	gameType: GameType,
	phase: GamePhase,
	year: number,
}

// export const currentGame = signal<IGame | null>(null);