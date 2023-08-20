package types

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Player struct {
	ID        uuid.UUID      `json:"id,omitempty" gorm:"type:uuid;default:uuid_generate_v4()"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"-"`
}
