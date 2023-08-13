package types

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlayerGame struct {
	ID        uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	StartedAt string         `json:"startedAt,omitempty"`
	Country   Country        `json:"country"`
	Color     string         `json:"color"`
	Player    *Player        `json:"player,omitempty"`
	PlayerID  string         `json:"-"`
	Game      *Game          `json:"game,omitempty"`
	GameID    string         `json:"-"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
