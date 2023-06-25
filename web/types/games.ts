enum GameStatus {
	Finished = 'FINISHED',
	Started = 'STARTED'
}

enum GameType {
	Multi = 'MULTI',
	Hosted = 'HOSTED'
}

enum GamePhase {
	Spring = 'S',
	Fall = 'F'
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