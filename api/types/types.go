package types

type MoveType int16

type UnitType int16

type MoveStatus int16

const (
	BUILD MoveType = iota
	DESTROY
	MOVE
	SUPPORT
	CONVOY
	DEFEND
)

const (
	A UnitType = iota
	F
)

const (
	SUCCEED MoveStatus = iota
	FAILED
	UNDONE
	EFFECTLESS
)

type PlayerGame struct {
	id   string
	name string
}

type Game struct {
	Id        string
	StartedAt string
	Status    string
}

type Move struct {
	Id         string `json:"id"`
	CreatedAt  string `json:"created_at"`
	Type       string `json:"type"`
	Origin     string `json:"origin"` // also make Enum
	From       string `json:"from"`
	To         string `json:"to,omitempty"`
	Turn       string `json:"turn,omitempty"`
	UnitType   string `json:"unit_type"`
	Status     string `json:"status"`
	PlayerGamr string `json:"player_game"`
	Game       string `json:"game"`
}
