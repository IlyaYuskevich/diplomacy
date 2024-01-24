package endpoints

import (
	"diplomacy/api/handlers"

	"github.com/labstack/echo/v4"
)

func ConfigureGamesEndpoints(e *echo.Echo) *echo.Echo {
	db := handlers.ConnectSupabase()
	e.POST("/games", handlers.CreateGame(db))
	e.GET("/games/:id", handlers.GetGame(db))
	e.GET("/games", handlers.GetGames(db))
	e.PATCH("/games/:id", handlers.PatchGame(db))
	e.DELETE("/games/:id", handlers.DeleteGame(db))
	return e
}
