package types

type Country string

type MoveType string

type UnitType string

type MoveStatus string

type ProvinceType int16

const (
	BUILD   MoveType = "build"
	DESTROY MoveType = "destroy"
	MOVE    MoveType = "move"
	SUPPORT MoveType = "support"
	CONVOY  MoveType = "convoy"
	DEFEND  MoveType = "defend"
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
	Phase        Phase      `json:"phase"`
	Year         uint16     `json:"year"`
	UnitType     UnitType   `json:"unit_type"`
	Status       MoveStatus `json:"status"`
	GameID       string     `json:"game_id,omitempty"`
	PlayerGameID string     `json:"player_game_id,omitempty"`
	PlayerGame   PlayerGame `json:"player_game"`
}

type GamePosition struct {
	Domains      map[Country][]string
	UnitLocation map[Country][]string
}