package main

import (
	"net/http"
	"os"

	"diplomacy/api/endpoints"
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

	e.GET("/units-loc-map/:game", func(c echo.Context) error {
		locMap := rules.ParseProvinceData()
		return c.JSON(http.StatusOK, locMap)
	})

	e.GET("/current-position/:game", func(c echo.Context) error {
		return c.JSON(http.StatusOK, rules.StartingPosition)
	})

	e = endpoints.ConfigureGamesEndpoints(e)
	e = endpoints.ConfigurePlayerGamesEndpoints(e)
	e = endpoints.ConfigureMovesEndpoints(e)
	e = endpoints.ConfigureHelperEndpoints(e)

	httpPort := "8000"
	e.Logger.Fatal(e.Start(":" + httpPort))

}
