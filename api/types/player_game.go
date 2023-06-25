package types

import "gorm.io/gorm"

type PlayerGame struct {
	ID        string         `json:"id" gorm:"primaryKey"`
	StartedAt string         `json:"startedAt,omitempty"`
	Country   Country        `json:"country"`
	Color     string         `json:"color"`
	Player    *Player        `json:"player,omitempty"`
	PlayerID  string         `json:"playerId,omitempty"`
	Game      *Game          `json:"game,omitempty"`
	GameID    string         `json:"gameId,omitempty"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
