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

// CreateMove function creates a new move.
func CreateMove(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		move := types.Move{}
		err := c.Bind(&move)
		if err != nil {
			return err
		}

		// Set default values for optional fields if not provided.
		move.CreatedAt = time.Now().String()
		move.Status = types.SUBMITTED

		resp := db.Create(&move)
		if errors.Is(resp.Error, gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusCreated, move)
	}
}

// GetMoves function returns moves.
func GetMoves(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		var moves []types.Move
		resp := db.Preload("PlayerGame", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, color, country")
		}).Find(&moves)
		if resp.Error != nil {
			return resp.Error
		}
		return c.JSON(http.StatusOK, moves)
	}
}

// GetMove function returns a move by ID.
func GetMove(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var move types.Move

		resp := db.Preload("PlayerGame", func(db *gorm.DB) *gorm.DB { return db.Omit("Player", "Game") }).Omit("PlayerGameID").First(&move, "id = ?", id)
		if errors.Is(resp.Error, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, move)
	}
}

// PatchMove function updates a move by ID.
func PatchMove(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		move := types.Move{ID: c.Param("id")}
		resp1 := db.Preload("PlayerGame", func(db *gorm.DB) *gorm.DB { return db.Omit("Player", "Game") }).First(&move)
		c.Bind(&move)
		resp2 := db.Save(&move)
		if errors.Is(errors.Join(resp1.Error, resp2.Error), gorm.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, move)
	}
}

// DeleteMove function deletes a move by ID.
func DeleteMove(db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var move types.Move
		err := db.Where("id = ?", id).Delete(&move).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return c.JSON(http.StatusOK, fmt.Sprintf("Move %s deleted", id))
	}
}
