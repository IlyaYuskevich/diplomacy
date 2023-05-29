package types

type PlayerGame struct {
	ID        string  `json:"id" gorm:"primaryKey"`
	StartedAt string  `json:"started_at"`
	Country   Country `json:"country"`
	Color     string  `json:"color"`
	Player    Player  `json:"player"`
	PlayerID  string  `json:"player_id,omitempty"`
	Game      Game    `json:"game"`
	GameID    string  `json:"game_id,omitempty"`
}
