package main

import (
	"encoding/json"
	"html/template"
	"io"
	"net/http"

	"github.com/ilyayuskevich/diplomacy/api/consumers"
	"github.com/ilyayuskevich/diplomacy/templates/map"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type TemplateRegistry struct {
	templates *template.Template
}

// Implement e.Renderer interface
func (t *TemplateRegistry) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		moves := consumers.GetMoves("d42830dd-a75c-40c5-ade3-56a38db0fd00")
		b, err := json.Marshal(moves)
		if err != nil {
			println(err)
		}
		return c.HTML(http.StatusOK, string(b))
	})

	renderer := &TemplateRegistry{
		templates: template.Must(template.ParseGlob("templates/map/*")),
	}
	e.Renderer = renderer

	e.GET("/map", templates.MapHandler)

	e.GET("/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, struct{ Status string }{Status: "OK"})
	})

	httpPort := "8000"
	e.Logger.Fatal(e.Start(":" + httpPort))

}
