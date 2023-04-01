package types

type Country string

type MoveType int16

type UnitType int16

type MoveStatus int16

type ProvinceType int16

const (
	BUILD MoveType = iota
	DESTROY
	MOVE
	SUPPORT
	CONVOY
	DEFEND
)

const (
	Army UnitType = iota
	Fleet
)

const (
	SUCCEED MoveStatus = iota
	FAILED
	UNDONE
	EFFECTLESS
)

const (
	FRANCE  Country = "france"
	GERMANY Country = "germany"
	ITALY   Country = "italy"
	RUSSIA  Country = "russia"
	AUSTRIA Country = "austria"
	ENGLAND Country = "england"
	TURKEY  Country = "turkey"
)

const (
	Land ProvinceType = iota
	Coast
	Sea
)

type Province struct {
	Name      string
	ShortName string
	Type      ProvinceType
	Neighbors []string
	Coasts    []string
}

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
	Id         string   `json:"id"`
	CreatedAt  string   `json:"created_at"`
	Type       string   `json:"type"`
	Origin     string   `json:"origin"` // also make Enum
	From       string   `json:"from"`
	To         string   `json:"to,omitempty"`
	Turn       string   `json:"turn,omitempty"`
	UnitType   UnitType `json:"unit_type"`
	Status     string   `json:"status"`
	PlayerGamr string   `json:"player_game"`
	Game       string   `json:"game"`
	Country    Country
}
