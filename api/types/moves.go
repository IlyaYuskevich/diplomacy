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

type Move struct {
	ID           string     `json:"id" gorm:"primaryKey"`
	CreatedAt    string     `json:"created_at"`
	Type         MoveType   `json:"type"`
	Origin       string     `json:"origin"` // also make Enum
	From         string     `json:"from"`
	To           string     `json:"to,omitempty"`
	Turn         string     `json:"turn,omitempty"`
	UnitType     UnitType   `json:"unit_type"`
	Status       MoveStatus `json:"status"`
	GameID       string
	Game         Game `json:"game"`
	PlayerGameID string
	PlayerGame   PlayerGame `json:"player_game"`
}

type GamePosition struct {
	Domains      map[Country][]string
	UnitLocation map[Country][]string
}
