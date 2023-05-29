package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"gorm.io/gorm"

	"diplomacy/api/types"

	"github.com/labstack/echo/v4"
)

// CreatePlayerGame function creates a new game session.
func CreatePlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		playerGame := types.PlayerGame{}

		// Set default values for optional fields if not provided.
		playerGame.StartedAt = time.Now().String()
		err := c.Bind(&playerGame)
		if err != nil {
			return err
		}

		resp := db.Create(&playerGame)
		if errors.Is(resp.Error, gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusCreated, playerGame)
	}
}

// GetPlayerGames function returns game sessions.
func GetPlayerGames(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		var playerGames []types.PlayerGame
		err := db.Joins("Game").Joins("Player").Omit("GameID", "PlayerID").Find(&playerGames).Error
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, playerGames)
	}
}

// GetPlayerGame function returns a player's game by ID.
func GetPlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		playerGame := types.PlayerGame{ID: c.Param("id")}

		resp := db.Joins("Game").Joins("Player").Omit("GameID", "PlayerID").First(&playerGame)
		if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, playerGame)
	}
}

// PatchPlayerGame function updates a player game by ID.
func PatchPlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		playerGame := types.PlayerGame{ID: c.Param("id")}
		resp1 := db.Joins("Game").Joins("Player").First(&playerGame)
		err := c.Bind(&playerGame)
		if err != nil {
			return err
		}

		resp2 := db.Save(&playerGame)
		if errors.Is(errors.Join(resp1.Error, resp2.Error), gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}
		return c.JSON(http.StatusOK, playerGame)
	}
}

// DeletePlayerGame function deletes a player's game by ID.
func DeletePlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		playerGame := types.PlayerGame{ID: c.Param("id")}

		resp := db.Delete(&playerGame)
		if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, fmt.Sprintf("PlayerGame %s deleted", c.Param("id")))
	}
}
