package main

import (
	"encoding/json"
	"net/http"

	"diplomacy/api/consumers"
	"diplomacy/api/types"
	"diplomacy/internal/rules"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:4000"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{echo.OPTIONS, echo.GET, echo.POST},
	}))

	e.GET("/", func(c echo.Context) error {
		moves := consumers.GetMoves("d42830dd-a75c-40c5-ade3-56a38db0fd00")
		b, err := json.Marshal(moves)
		if err != nil {
			println(err)
		}
		return c.HTML(http.StatusOK, string(b))
	})

	e.POST("/get-possible-moves", func(c echo.Context) error {
		type Payload struct {
			Province string         `json:"province"`
			UnitType types.UnitType `json:"unitType"`
		}
		var payload Payload
		err := c.Bind(&payload)
		if err != nil {
			return c.String(http.StatusBadRequest, "bad request")
		}
		var possibleMoves map[string]string
		if payload.UnitType == types.Army {
			possibleMoves = rules.GetPossibleArmyMoves(payload.Province)
		} else {
			possibleMoves = rules.GetPossibleFleetMoves(payload.Province)
		}
		return c.JSON(http.StatusOK, possibleMoves)
	})

	e.GET("/units-loc-map", func(c echo.Context) error {
		locMap := rules.ParseProvinceData()
		println(locMap)
		return c.JSON(http.StatusOK, locMap)
	})

	httpPort := "8000"
	e.Logger.Fatal(e.Start(":" + httpPort))

}
