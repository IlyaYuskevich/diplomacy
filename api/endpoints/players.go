package endpoints

import (
	"diplomacy/api/handlers"

	"github.com/labstack/echo/v4"
)

func ConfigurePlayersEndpoints(e *echo.Echo) *echo.Echo {
	db := handlers.ConnectSupabase()
	e.POST("/players", handlers.CreatePlayer(db))
	e.GET("/players/:id", handlers.GetPlayer(db))
	e.GET("/players", handlers.GetPlayers(db))
	e.PATCH("/players/:id", handlers.PatchPlayer(db))
	e.DELETE("/players/:id", handlers.DeletePlayer(db))
	return e
}
