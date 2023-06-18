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
	samplePlayerGame1Json        = fmt.Sprintf(`{"id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","started_at":"2023-02-18T14:45:13.69505Z","country":"england","color":"white","player":%s,"game":%s}`, samplePlayer1Json, sampleGame1PatchedJson)
	samplePlayerGame2Json        = fmt.Sprintf(`{"id":"d42830pg-a75c-40c5-ade3-56a38db0fd02","started_at":"2023-02-18T14:45:13.69505Z","country":"france","color":"blue","player":%s,"game":%s}`, samplePlayer1Json, sampleGame1PatchedJson)
	samplePlayerGameJsonPayload1 = `{"player_id":"d42830pp-a75c-40c5-ade3-56a38db0fd02","game_id":"d42830gg-a75c-40c5-ade3-56a38db0fd01","country":"france"}`
	samplePlayerGameJsonPayload2 = `{"country":"turkey"}`
	samplePlayerGame1Patched     = fmt.Sprintf(`{"id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","started_at":"2023-02-18T14:45:13.69505Z","country":"turkey","color":"white","player":%s,"player_id":"d42830pp-a75c-40c5-ade3-56a38db0fd01","game":%s,"game_id":"d42830gg-a75c-40c5-ade3-56a38db0fd01"}`, samplePlayer1Json, sampleGame1PatchedJson)
)

var samplePlayerGames = []types.PlayerGame{
	{
		ID:        "d42830pg-a75c-40c5-ade3-56a38db0fd01",
		StartedAt: "2023-02-18T14:45:13.69505Z",
		PlayerID:  "d42830pp-a75c-40c5-ade3-56a38db0fd01",
		GameID:    "d42830gg-a75c-40c5-ade3-56a38db0fd01",
		Color:     "white",
		Country:   types.ENGLAND,
	},
	{
		ID:        "d42830pg-a75c-40c5-ade3-56a38db0fd02",
		StartedAt: "2023-02-18T14:45:13.69505Z",
		PlayerID:  "d42830pp-a75c-40c5-ade3-56a38db0fd01",
		GameID:    "d42830gg-a75c-40c5-ade3-56a38db0fd01",
		Color:     "blue",
		Country:   types.FRANCE,
	},
}

func PopulatePlayerGames(db *gorm.DB) {
	db.Create(&samplePlayerGames)
}

func TestGetPlayerGames(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPlayerGames(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("[%s,%s]\n", samplePlayerGame1Json, samplePlayerGame2Json), rec.Body.String())
	}
}

func TestGetPlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pg-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.GetPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", samplePlayerGame1Json), rec.Body.String())
	}
}

func TestCreatePlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/player-games", strings.NewReader(samplePlayerGameJsonPayload1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.CreatePlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestPatchPlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPatch, "/player-games/:id", strings.NewReader(samplePlayerGameJsonPayload2))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pg-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.PatchPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", samplePlayerGame1Patched), rec.Body.String())
	}
}

func TestDeletePlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830pg-a75c-40c5-ade3-56a38db0fd02")
	h := handlers.DeletePlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"PlayerGame %s deleted\"\n", "d42830pg-a75c-40c5-ade3-56a38db0fd02"), rec.Body.String())
	}
}
