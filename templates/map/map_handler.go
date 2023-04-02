package templates

import (
	"net/http"

	"github.com/ilyayuskevich/diplomacy/api/types"
	"github.com/ilyayuskevich/diplomacy/internal/rules"
	"github.com/labstack/echo/v4"
)

type UnitPositions struct {
	types.Move
	UnitLocation
}

type MapHandlerType struct {
	PossibleMoves map[string]string
	UnitPositions []UnitPositions
}

func MapHandler(c echo.Context) error {
	unitLoc := ParseProvinceData()
	possibleMoves := rules.GetPossibleMoves("Ber")

	data := MapHandlerType{
		UnitPositions: []UnitPositions{
			{types.Move{UnitType: types.Army, Origin: "Ber", Country: types.GERMANY}, unitLoc["ber"]},
			{types.Move{UnitType: types.Fleet, Origin: "Nth", Country: types.GERMANY}, unitLoc["nth"]},
		},
		PossibleMoves: possibleMoves,
	}

	return c.Render(http.StatusOK, "map.html", data)
}

func MapHandler2(c echo.Context) error {
	unitLoc := ParseProvinceData()
	possibleMoves := rules.GetPossibleMoves("Kie")

	data := MapHandlerType{
		UnitPositions: []UnitPositions{
			{types.Move{UnitType: types.Army, Origin: "Kie", Country: types.GERMANY}, unitLoc["kie"]},
			{types.Move{UnitType: types.Fleet, Origin: "Nth", Country: types.GERMANY}, unitLoc["nth"]},
		},
		PossibleMoves: possibleMoves,
	}

	return c.Render(http.StatusOK, "map.html", data)
}
