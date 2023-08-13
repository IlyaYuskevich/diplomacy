package types

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

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
	ID                    uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	StartedAt             string         `json:"startedAt"`
	Status                GameStatus     `json:"status"`
	DiplomaticPhaseSpring string         `json:"diplomaticPhaseSpring"`
	DiplomaticPhaseFall   string         `json:"diplomaticPhaseFall"`
	RetreatPhase          string         `json:"retreatPhase"`
	GainingLoosingPhase   string         `json:"gainingLoosingPhase"`
	GameType              GameType       `json:"gameType"`
	Phase                 Phase          `json:"phase"`
	Year                  uint16         `json:"year"`
	DeletedAt             gorm.DeletedAt `json:"-"`
}

type GameShort struct {
	Id        string     `json:"id"`
	StartedAt string     `json:"startedAt"`
	Status    GameStatus `json:"status"`
	Phase     Phase      `json:"phase"`
	Year      int8       `json:"year"`
}
