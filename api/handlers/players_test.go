package handlers_test

import (
	"diplomacy/api/handlers"
	"diplomacy/api/types"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var (
	samplePlayer1Json        = `{"id":"d42830pp-a75c-40c5-ade3-56a38db0fd01","name":"Luke Skywalker","created_at":"2023-02-18T14:45:13.69505Z"}`
	samplePlayer2Json        = `{"id":"d42830pp-a75c-40c5-ade3-56a38db0fd02","name":"Darth Weider","created_at":"2023-02-18T14:45:13.69505Z"}`
	samplePlayer3Json        = `{"id":"d42830pp-a75c-40c5-ade3-56a38db0fd03","name":"Boba Fett","created_at":"2023-02-18T14:45:13.69505Z"}`
	samplePlayerJsonPayload1 = `{"name":"Chewbacca"}`
	samplePlayerJsonPayload2 = `{"name":"Han Solo"}`
	samplePlayer1JsonPatched = `{"id":"d42830pp-a75c-40c5-ade3-56a38db0fd01","name":"Han Solo","created_at":"2023-02-18T14:45:13.69505Z"}`
)

var samplePlayers = []types.Player{
	{
		ID:        "d42830pp-a75c-40c5-ade3-56a38db0fd01",
		Name:      "Luke Skywalker",
		CreatedAt: "2023-02-18T14:45:13.69505Z",
	},
	{
		ID:        "d42830pp-a75c-40c5-ade3-56a38db0fd02",
		Name:      "Darth Weider",
		CreatedAt: "2023-02-18T14:45:13.69505Z",
	},
	{
		ID:        "d42830pp-a75c-40c5-ade3-56a38db0fd03",
		Name:      "Boba Fett",
		CreatedAt: "2023-02-18T14:45:13.69505Z",
	},
}

func PopulatePlayers(db *gorm.DB) {
	db.Create(&samplePlayers)
}

func TestGetPlayers(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/players", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPlayers(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("[%s,%s,%s]\n", samplePlayer1Json, samplePlayer2Json, samplePlayer3Json), rec.Body.String())
	}
}

func TestGetPlayer(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/players/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pp-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.GetPlayer(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", samplePlayer1Json), rec.Body.String())
	}
}

func TestCreatePlayer(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/players", strings.NewReader(samplePlayerJsonPayload1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.CreatePlayer(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestPatchPlayer(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPatch, "/players/:id", strings.NewReader(samplePlayerJsonPayload2))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pp-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.PatchPlayer(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", samplePlayer1JsonPatched), rec.Body.String())
	}
}

func TestDeletePlayer(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/players/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pp-a75c-40c5-ade3-56a38db0fd03")
	h := handlers.DeletePlayer(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"Player %s deleted\"\n", "d42830pp-a75c-40c5-ade3-56a38db0fd03"), rec.Body.String())
	}
}
