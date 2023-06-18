package types

import "gorm.io/gorm"

type Player struct {
	ID        string         `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name"`
	CreatedAt string         `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
