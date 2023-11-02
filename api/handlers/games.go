package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"gorm.io/gorm"

	"diplomacy/api/types"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// CreateGame function creates a new game.
func CreateGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		game := types.Game{}
		err := c.Bind(&game)
		if err != nil {
			return err
		}

		// Set default values for optional fields if not provided.
		game.Status = types.FORMING
		game.Phase = types.SPRING
		game.Year = 1901
		if game.GameType == "" {
			game.GameType = types.HOSTED
		}
		if game.DiplomaticPhaseSpring == "" {
			game.DiplomaticPhaseSpring = "24h"
		}
		if game.DiplomaticPhaseFall == "" {
			game.DiplomaticPhaseFall = "23h"
		}
		if game.RetreatPhase == "" {
			game.RetreatPhase = "30m"
		}
		if game.GainingLoosingPhase == "" {
			game.GainingLoosingPhase = "30m"
		}

		resp := db.Create(&game)
		if errors.Is(resp.Error, gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusCreated, game)
	}
}

// GetGame function returns games.
func GetGames(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		var games []types.Game
		err := db.Find(&games).Error
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, games)
	}
}

// GetGame function returns a game by ID.
func GetGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var game types.Game

		err := db.First(&game, "id = ?", id).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, game)
	}
}

// PatchGame function updates a game by ID.
func PatchGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		game := types.Game{ID: uuid.MustParse(c.Param("id"))}
		resp1 := db.First(&game)
		c.Bind(&game)
		resp2 := db.Save(&game)
		if errors.Is(errors.Join(resp1.Error, resp2.Error), gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, game)
	}
}

// DeleteGame function deletes a game by ID.
func DeleteGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var game types.Game
		err := db.Where("id = ?", id).Delete(&game).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, fmt.Sprintf("Game %s deleted", id))
	}
}
