package templates

import (
	"net/http"

	"github.com/ilyayuskevich/diplomacy/api/types"
	"github.com/labstack/echo/v4"
)

func MapHandler(c echo.Context) error {
	data := []types.UnitPositions{
		{UnitType: types.Army, Origin: "Ber", Country: types.GERMANY, X: 488, Y: 845},
		{UnitType: types.Army, Origin: "Ber", Country: types.FRANCE, X: 200, Y: 412},
		{UnitType: types.Army, Origin: "Ber", Country: types.ITALY, X: 510, Y: 123},
	}
	return c.Render(http.StatusOK, "map.html", data)
}
