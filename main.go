package main

import (
	"encoding/json"
	"net/http"
	"os"

	"diplomacy/api/endpoints"
	"diplomacy/api/handlers"
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
		AllowOrigins: []string{os.Getenv("FRONTEND_URL")},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{echo.OPTIONS, echo.GET, echo.POST},
	}))

	e.POST("/api/moves", func(c echo.Context) error {
		type Payload struct {
			GameId string `json:"gameId"`
		}
		var payload Payload
		err := c.Bind(&payload)
		moves := handlers.GetMoves(payload.GameId)
		b, err := json.Marshal(moves)
		if err != nil {
			println(err)
		}
		return c.HTML(http.StatusOK, string(b))
	})

	e.POST("/player-games", func(c echo.Context) error {
		type Payload struct {
			PlayerId string `json:"playerId"`
		}
		var payload Payload
		err := c.Bind(&payload)
		if err != nil {
			return c.String(http.StatusBadRequest, "bad request")
		}
		playerGames := handlers.GetPlayerGames(payload.PlayerId)
		b, err := json.Marshal(playerGames)
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

	e.GET("/units-loc-map/:game", func(c echo.Context) error {
		locMap := rules.ParseProvinceData()
		return c.JSON(http.StatusOK, locMap)
	})

	e = endpoints.ConfigureGamesEndpoints(e)

	httpPort := "8000"
	e.Logger.Fatal(e.Start(":" + httpPort))

}
