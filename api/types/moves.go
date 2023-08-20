package types

import (
	"diplomacy/api/types/prv"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Country string

type MoveType string

type UnitType string

type MoveStatus string

type ProvinceType string

const (
	BUILD   MoveType = "BUILD"
	DESTROY MoveType = "DESTROY"
	MOVE    MoveType = "MOVE"
	SUPPORT MoveType = "SUPPORT"
	CONVOY  MoveType = "CONVOY"
	DEFEND  MoveType = "DEFEND"
)

const (
	ARMY  UnitType = "A"
	FLEET UnitType = "F"
)

const (
	SUCCEED    MoveStatus = "SUCCEED"
	FAILED     MoveStatus = "FAILED"
	UNDONE     MoveStatus = "UNDONE"
	EFFECTLESS MoveStatus = "EFFECTLESS"
	SUBMITTED  MoveStatus = "SUBMITTED"
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
	ID           uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	CreatedAt    time.Time      `json:"createdAt"`
	Type         MoveType       `json:"type"`
	Origin       prv.ShortName  `json:"origin"` // also make Enum
	From         prv.ShortName  `json:"from"`
	To           prv.ShortName  `json:"to,omitempty"`
	Phase        Phase          `json:"phase"`
	Year         uint16         `json:"year"`
	UnitType     UnitType       `json:"unitType"`
	Status       MoveStatus     `json:"status"`
	PlayerGameID string         `json:"-"`
	PlayerGame   PlayerGame     `json:"playerGame,omitempty"`
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
