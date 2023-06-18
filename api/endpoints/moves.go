package endpoints

import (
	"diplomacy/api/handlers"

	"github.com/labstack/echo/v4"
)

func ConfigureMovesEndpoints(e *echo.Echo) *echo.Echo {
	db := handlers.ConnectSupabase()
	e.POST("/moves", handlers.CreateMove(db))
	e.GET("/moves/:id", handlers.GetMove(db))
	e.GET("/moves", handlers.GetMoves(db))
	e.PATCH("/moves/:id", handlers.PatchMove(db))
	e.DELETE("/moves/:id", handlers.DeleteMove(db))
	return e
}
