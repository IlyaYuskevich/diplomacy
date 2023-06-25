package main

import (
	"net/http"
	"os"

	"diplomacy/api/endpoints"
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
	"diplomacy/internal/rules"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("FRONTEND_URL")},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{echo.OPTIONS, echo.GET, echo.POST},
	}))

	e.POST("/get-possible-moves", func(c echo.Context) error {
		type Payload struct {
			Province prv.ShortName  `json:"province"`
			UnitType types.UnitType `json:"unitType"`
		}
		var payload Payload
		err := c.Bind(&payload)
		if err != nil {
			return c.String(http.StatusBadRequest, "bad request")
		}
		var possibleMoves map[prv.ShortName]string
		if payload.UnitType == types.ARMY {
			possibleMoves = rules.GetPossibleArmyMoves(payload.Province)
		} else {
			possibleMoves = rules.GetPossibleFleetMoves(payload.Province)
		}
		return c.JSON(http.StatusOK, possibleMoves)
	})

	e.GET("/units-loc-map/:game", func(c echo.Context) error {
		locMap := rules.ParseProvinceData()
		return c.JSON(http.StatusOK, locMap)
	})

	e.GET("/current-position/:game", func(c echo.Context) error {
		return c.JSON(http.StatusOK, rules.StartingPosition)
	})

	e = endpoints.ConfigureGamesEndpoints(e)
	e = endpoints.ConfigurePlayersEndpoints(e)
	e = endpoints.ConfigurePlayerGamesEndpoints(e)
	e = endpoints.ConfigureMovesEndpoints(e)

	httpPort := "8000"
	e.Logger.Fatal(e.Start(":" + httpPort))

}
