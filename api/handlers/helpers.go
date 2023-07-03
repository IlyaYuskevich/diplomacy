package handlers

import (
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
	"diplomacy/internal/rules"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/exp/maps"
)

func GetPossibleMoves() echo.HandlerFunc {
	return func(c echo.Context) error {
		type Payload struct {
			Province prv.ShortName   `json:"province"`
			UnitType *types.UnitType `json:"unitType"`
		}
		var payload Payload
		err := c.Bind(&payload)
		if err != nil {
			return c.String(http.StatusBadRequest, "bad request")
		}
		var possibleMoves map[prv.ShortName]string
		if payload.UnitType == nil {
			possibleMoves = rules.GetPossibleArmyMoves(payload.Province)
			maps.Copy(possibleMoves, rules.GetPossibleFleetMoves(payload.Province))
			return c.JSON(http.StatusOK, possibleMoves)
		}
		if *payload.UnitType == types.ARMY {
			possibleMoves = rules.GetPossibleArmyMoves(payload.Province)
		} else {
			possibleMoves = rules.GetPossibleFleetMoves(payload.Province)
		}
		return c.JSON(http.StatusOK, possibleMoves)
	}
}
