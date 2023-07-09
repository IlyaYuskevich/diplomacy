package types

import (
	"diplomacy/api/types/prv"

	"gorm.io/gorm"
)

type Country string

type MoveType string

type UnitType string

type MoveStatus string

type ProvinceType string

const (
	BUILD   MoveType = "build"
	DESTROY MoveType = "destroy"
	MOVE    MoveType = "move"
	SUPPORT MoveType = "support"
	CONVOY  MoveType = "convoy"
	DEFEND  MoveType = "defend"
)

const (
	ARMY  UnitType = "A"
	FLEET UnitType = "F"
)

const (
	SUCCEED    MoveStatus = "succeed"
	FAILED     MoveStatus = "failed"
	UNDONE     MoveStatus = "undone"
	EFFECTLESS MoveStatus = "effectless"
	SUBMITTED  MoveStatus = "submitted"
)

const (
	FRANCE  Country = "FRANCE"
	GERMANY Country = "GERMANY"
	ITALY   Country = "ITALY"
	RUSSIA  Country = "RUSSIA"
	AUSTRIA Country = "AUSTRIA"
	ENGLAND Country = "ENGLAND"
	TURKEY  Country = "TURKEY"
)

const (
	Land  ProvinceType = "LAND"
	Coast ProvinceType = "COAST"
	Sea   ProvinceType = "SEA"
)

type Province struct {
	Name string       `json:"name"`
	Type ProvinceType `json:"type"`
}

type Move struct {
	ID           string         `json:"id" gorm:"primaryKey"`
	CreatedAt    string         `json:"createdAt"`
	Type         MoveType       `json:"type"`
	Origin       prv.ShortName  `json:"origin"` // also make Enum
	From         prv.ShortName  `json:"from"`
	To           prv.ShortName  `json:"to,omitempty"`
	Phase        Phase          `json:"phase"`
	Year         uint16         `json:"year"`
	UnitType     UnitType       `json:"unitType"`
	Status       MoveStatus     `json:"status"`
	GameID       string         `json:"gameId,omitempty"`
	PlayerGameID string         `json:"playerGameId,omitempty"`
	PlayerGame   PlayerGame     `json:"playerGame"`
	DeletedAt    gorm.DeletedAt `json:"-"`
}

type UnitPosition struct {
	Province prv.ShortName `json:"province"`
	UnitType UnitType      `json:"unitType"`
}

type GamePosition struct {
	Domains       map[Country][]prv.ShortName `json:"domains"`
	UnitPositions map[Country][]UnitPosition  `json:"unitPositions"`
}
