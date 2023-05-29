package endpoints

import (
	"diplomacy/api/handlers"

	"github.com/labstack/echo/v4"
)

func ConfigurePlayerGamesEndpoints(e *echo.Echo) *echo.Echo {
	db := handlers.ConnectSupabase()
	e.POST("/player-games", handlers.CreatePlayerGame(db))
	e.GET("/player-games/:id", handlers.GetPlayerGame(db))
	e.GET("/player-games", handlers.GetPlayerGames(db))
	e.PATCH("/player-games/:id", handlers.PatchPlayerGame(db))
	e.DELETE("/player-games/:id", handlers.DeletePlayerGame(db))
	return e
}
