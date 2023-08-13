package types

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Player struct {
	ID        uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	Name      string         `json:"name"`
	CreatedAt string         `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
