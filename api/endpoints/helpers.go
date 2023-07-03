package endpoints

import (
	"diplomacy/api/handlers"

	"github.com/labstack/echo/v4"
)

func ConfigureHelperEndpoints(e *echo.Echo) *echo.Echo {
	e.POST("/get-possible-moves", handlers.GetPossibleMoves())
	return e
}
