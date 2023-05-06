package types

type GameStatus string
type GameType string
type Phase string

const (
	CREATED  GameStatus = "CREATED"
	ACTIVE   MoveType   = "ACTIVE"
	FINISHED MoveType   = "FINISHED"
)

const (
	MULTI  GameType = "MULTI"
	HOSTED GameType = "HOSTED"
)

const (
	SPRING Phase = "S"
	FALL   Phase = "F"
)

type Game struct {
	Id                    string     `json:"id"`
	StartedAt             string     `json:"started_at"`
	Status                GameStatus `json:"status"`
	DiplomaticPhaseSpring string     `json:"diplomatic_phase_spring"`
	DiplomaticPhaseFall   string     `json:"diplomatic_phase_fall"`
	RetreatPhase          string     `json:"retreat_phase"`
	GainingLoosingPhase   string     `json:"gaining_loosing_phase"`
	GameType              GameType   `json:"game_type"`
	Phase                 Phase      `json:"phase"`
	Year                  int16      `json:"year"`
}

type GameShort struct {
	Id        string     `json:"id"`
	StartedAt string     `json:"started_at"`
	Status    GameStatus `json:"status"`
	Phase     Phase      `json:"phase"`
	Year      int8       `json:"year"`
}
