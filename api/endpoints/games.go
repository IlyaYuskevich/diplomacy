package endpoints

import (
	"diplomacy/api/consumers"
	"github.com/labstack/echo/v4"
)

func ConfigureGameEndpoints(e *echo.Echo) *echo.Echo {
	e.POST("/games", consumers.CreateGame)
	e.GET("/games/:id", consumers.GetGame)
	e.GET("/games", consumers.GetGames)
	e.PATCH("/games/:id", consumers.PatchGame)
	e.DELETE("/games/:id", consumers.DeleteGame)
	return e
}
