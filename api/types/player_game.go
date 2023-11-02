package types

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlayerGame struct {
	ID        uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	CreatedAt time.Time      `json:"createdAt"`
	Country   Country        `json:"country"`
	Color     string         `json:"color"`
	PlayerID  string         `json:"-"`
	Game      *Game          `json:"game,omitempty"`
	GameID    string         `json:"-"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
