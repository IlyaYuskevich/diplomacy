package templates

import (
	"net/http"

	"github.com/ilyayuskevich/diplomacy/api/types"
	"github.com/labstack/echo/v4"
)

type UnitPositions struct {
	types.Move
	UnitLocation
}

func MapHandler(c echo.Context) error {
	unitLoc := ParseProvinceData()

	data := []UnitPositions{
		{types.Move{UnitType: types.Army, Origin: "Ber", Country: types.GERMANY}, unitLoc["ber"]},
		{types.Move{UnitType: types.Fleet, Origin: "Nth", Country: types.GERMANY}, unitLoc["nth"]},
	}

	return c.Render(http.StatusOK, "map.html", data)
}
