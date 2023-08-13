package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"gorm.io/gorm"

	"diplomacy/api/types"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// CreatePlayer function creates a new player.
func CreatePlayer(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		player := types.Player{}

		// Set default values for optional fields if not provided.
		player.CreatedAt = time.Now().String()
		err := c.Bind(&player)
		if err != nil {
			return err
		}

		resp := db.Create(&player)
		if errors.Is(resp.Error, gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusCreated, player)
	}
}

// GetPlayers function returns players.
func GetPlayers(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		var players []types.Player
		err := db.Find(&players).Error
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, players)
	}
}

// GetPlayer function returns a player by ID.
func GetPlayer(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var player types.Player

		resp := db.First(&player, "id = ?", id)
		if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, player)
	}
}

// PatchPlayer function updates a player by ID.
func PatchPlayer(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		player := types.Player{ID: uuid.MustParse(c.Param("id"))}
		resp1 := db.First(&player)
		err := c.Bind(&player)
		if err != nil {
			return err
		}

		resp2 := db.Save(&player)
		if errors.Is(errors.Join(resp1.Error, resp2.Error), gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, player)
	}
}

// DeletePlayer function deletes a player by ID.
func DeletePlayer(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		player := types.Player{ID: uuid.MustParse(c.Param("id"))}

		resp := db.Delete(&player)
		if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, fmt.Sprintf("Player %s deleted", c.Param("id")))
	}
}
