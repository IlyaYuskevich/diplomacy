package types

type Country string

type MoveType string

type UnitType string

type MoveStatus string

type ProvinceType int16

const (
	BUILD   MoveType = "BUILD"
	DESTROY MoveType = "DESTROY"
	MOVE    MoveType = "MOVE"
	SUPPORT MoveType = "SUPPORT"
	CONVOY  MoveType = "CONVOY"
	DEFEND  MoveType = "DEFEND"
)

const (
	Army  UnitType = "A"
	Fleet UnitType = "F"
)

const (
	SUCCEED    MoveStatus = "succeed"
	FAILED     MoveStatus = "failed"
	UNDONE     MoveStatus = "undone"
	EFFECTLESS MoveStatus = "effectless"
	SUBMITTED  MoveStatus = "submitted"
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
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	StartedAt string    `json:"started_at"`
	Country   Country   `json:"country"`
	Color     string    `json:"color"`
	Game      GameShort `json:"games"`
	Player    string    `json:"player"`
}

type PlayerGameShort struct {
	Country Country `json:"country"`
}

type Move struct {
	Id         string     `json:"id"`
	CreatedAt  string     `json:"created_at"`
	Type       MoveType   `json:"type"`
	Origin     string     `json:"origin"` // also make Enum
	From       string     `json:"from"`
	To         string     `json:"to,omitempty"`
	Turn       string     `json:"turn,omitempty"`
	UnitType   UnitType   `json:"unit_type"`
	Status     MoveStatus `json:"status"`
	Game       string     `json:"game"`
	PlayerGame struct {
		Country Country `json:"country"`
	} `json:"player_games"`
}

type GamePosition struct {
	Domains      map[Country][]string
	UnitLocation map[Country][]string
}
