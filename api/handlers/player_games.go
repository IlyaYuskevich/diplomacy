package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"gorm.io/gorm"

	"diplomacy/api/types"

	"github.com/labstack/echo/v4"
)

// // CreatePlayerGame function creates a new game session.
// func CreatePlayerGame(db *gorm.DB) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		userId := c.Request().Header.Get("X-User-Id")
// 		playerGame := types.PlayerGame{PlayerID: userId}

// 		// Set default values for optional fields if not provided.
// 		err := c.Bind(&playerGame)
// 		if err != nil {
// 			return err
// 		}

// 		resp := db.Create(&playerGame)
// 		if errors.Is(resp.Error, gorm.ErrInvalidData) {
// 			return echo.NewHTTPError(http.StatusBadRequest)
// 		}

// 		return c.JSON(http.StatusCreated, playerGame)
// 	}
// }

// GetPlayerGames function returns game sessions.
func GetPlayerGames(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		userId := c.Request().Header.Get("X-User-Id")

		var playerGames []types.PlayerGame
		err := db.Where("player_id = ?", userId).Joins("Game").Omit("GameID", "PlayerID").Find(&playerGames).Error
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, playerGames)
	}
}

// GetPlayerGame function returns a player's game by gameId.
func GetPlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		userId := c.Request().Header.Get("X-User-Id")
		gameId := c.Param("id")

		var playerGame types.PlayerGame
		var pgCount int64
		var game types.Game

		resp1 := db.First(&game, "id = ?", gameId)
		resp2 := db.Model(&types.PlayerGame{}).Where(&types.PlayerGame{GameID: gameId}).Count(&pgCount)

		if resp1.Error != nil && resp2 != nil {
			return echo.NewHTTPError(http.StatusBadRequest, resp1.Error)
		}

		query := db.Joins("Game").Omit("GameID", "PlayerID").Where(&types.PlayerGame{GameID: gameId, PlayerID: userId})
		isAccepting := game.Status == types.FORMING && pgCount < 7
		var resp *gorm.DB
		if isAccepting {
			resp = query.FirstOrCreate(&playerGame)
		} else {
			resp = query.First(&playerGame)
			if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
				return echo.NewHTTPError(http.StatusNotFound)
			}
		}

		if int(resp.RowsAffected) == 1 {
			return c.JSON(http.StatusCreated, playerGame)
		}
		return c.JSON(http.StatusOK, playerGame)
	}
}

// PatchPlayerGame function updates a player game by ID.
func PatchPlayerGame(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userId := c.Request().Header.Get("X-User-Id")
		gameId := c.Param("id")
		var playerGame types.PlayerGame

		resp1 := db.Joins("Game").Where(&types.PlayerGame{GameID: gameId, PlayerID: userId}).First(&playerGame)
		if errors.Is(resp1.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

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
		userId := c.Request().Header.Get("X-User-Id")
		gameId := c.Param("id")
		var playerGame types.PlayerGame

		resp1 := db.Where(&types.PlayerGame{GameID: gameId, PlayerID: userId}).First(&playerGame)
		if errors.Is(resp1.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		db.Delete(&playerGame)
		return c.JSON(http.StatusOK, fmt.Sprintf("PlayerGame %s deleted", playerGame.ID))
	}
}
