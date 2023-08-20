package handlers_test

import (
	"diplomacy/api/handlers"
	"diplomacy/api/types"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var (
	samplePlayerGame1Json        = fmt.Sprintf(`{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"ENGLAND","color":"white","player":%s,"game":%s}`, samplePlayer1Json, sampleGame1PatchedJson)
	samplePlayerGame2Json        = fmt.Sprintf(`{"id":"bc60004f-5843-4ece-aa5f-8f94633e4832","createdAt":.{20,40},"country":"FRANCE","color":"blue","player":%s,"game":%s}`, samplePlayer1Json, sampleGame1PatchedJson)
	samplePlayerGameJsonPayload1 = `{"player":{"id":"a00935cb-4e9d-409d-814a-e4d704e0e61d"},"game":{"id":"8203c226-749b-41fa-b348-ec3206110f80"},"country":"FRANCE"}}`
	samplePlayerGameJsonPayload2 = `{"country":"turkey"}`
	samplePlayerGame1Patched     = fmt.Sprintf(`{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"turkey","color":"white","player":%s,"game":%s}`, samplePlayer1Json, sampleGame1PatchedJson)
)

var samplePlayerGames = []types.PlayerGame{
	{
		ID:       uuid.MustParse("542bdf30-586d-49aa-8ad2-c1d8de96e8d1"),
		PlayerID: "d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "white",
		Country:  types.ENGLAND,
	},
	{
		ID:       uuid.MustParse("bc60004f-5843-4ece-aa5f-8f94633e4832"),
		PlayerID: "d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "blue",
		Country:  types.FRANCE,
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
		assert.Regexp(t, samplePlayerGame1Json, rec.Body.String())
		assert.Regexp(t, samplePlayerGame2Json, rec.Body.String())
	}
}

func TestGetPlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("542bdf30-586d-49aa-8ad2-c1d8de96e8d1")
	h := handlers.GetPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Regexp(t, samplePlayerGame1Json, rec.Body.String())
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
	ctx.SetParamValues("542bdf30-586d-49aa-8ad2-c1d8de96e8d1")
	h := handlers.PatchPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Regexp(t, samplePlayerGame1Patched, rec.Body.String())
	}
}

func TestDeletePlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("bc60004f-5843-4ece-aa5f-8f94633e4832")
	h := handlers.DeletePlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"PlayerGame %s deleted\"\n", "bc60004f-5843-4ece-aa5f-8f94633e4832"), rec.Body.String())
	}
}
