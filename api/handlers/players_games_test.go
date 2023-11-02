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
	samplePlayerGame1Json        = fmt.Sprintf(`{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"ENGLAND","color":"white","game":%s}`, sampleGame1PatchedJson)
	samplePlayerGame2Json        = fmt.Sprintf(`{"id":"bc60004f-5843-4ece-aa5f-8f94633e4832","createdAt":.{20,40},"country":"FRANCE","color":"blue","game":%s}`, sampleGame1PatchedJson)
	samplePlayerGameJsonPayload1 = `{"game":{"id":"8203c226-749b-41fa-b348-ec3206110f80"},"country":"FRANCE"}}`
	samplePlayerGameJsonPayload2 = `{"country":"turkey"}`
	samplePlayerGame1Patched     = fmt.Sprintf(`{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"turkey","color":"white","game":%s}`, sampleGame1PatchedJson)
)

var samplePlayerGames = []types.PlayerGame{
	{
		ID:       uuid.MustParse("542bdf30-586d-49aa-8ad2-c1d8de96e8d1"),
		PlayerID: "ed7bdc69-15bb-4d91-9073-4c12a4a9c3c9",
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
	{
		ID:       uuid.MustParse("35c986ba-4de7-44da-b777-465fa2b12e5f"),
		PlayerID: "4ba1bbc1-8ee4-479c-9d13-2d3a13866fb4",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "blue",
		Country:  types.GERMANY,
	},
	{
		ID:       uuid.MustParse("05364b71-5a08-4fd1-a718-e4027481d6b0"),
		PlayerID: "e9921b08-0e05-4452-9940-e64b38ac290f",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "blue",
		Country:  types.ITALY,
	},
	{
		ID:       uuid.MustParse("adc17172-a131-4b20-94c6-806fef584348"),
		PlayerID: "06990276-c5b0-450b-bf8f-d025fc4c54d9",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "blue",
		Country:  types.AUSTRIA,
	},
	{
		ID:       uuid.MustParse("473d0966-f7c4-4721-929e-f8806001ea0b"),
		PlayerID: "11ba534d-3232-4564-9946-42f5a86913c7",
		GameID:   "8203c226-749b-41fa-b348-ec3206110f80",
		Color:    "blue",
		Country:  types.TURKEY,
	},
}

func PopulatePlayerGames(db *gorm.DB) {
	db.Create(&samplePlayerGames)
}

func TestGetPlayerGames(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	req.Header.Set("X-User-Id", "d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad")
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPlayerGames(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.NotRegexp(t, samplePlayerGame1Json, rec.Body.String())
		assert.Regexp(t, samplePlayerGame2Json, rec.Body.String())
	}
}

func TestGetPlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	req.Header.Set("X-User-Id", "ed7bdc69-15bb-4d91-9073-4c12a4a9c3c9")
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("8203c226-749b-41fa-b348-ec3206110f80")
	h := handlers.GetPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Regexp(t, samplePlayerGame1Json, rec.Body.String())
	}
}

func TestCreatePlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/player-games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	req.Header.Set("X-User-Id", "04ad2507-ccd1-4069-8f1a-8f7ebb84bf97")
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("8203c226-749b-41fa-b348-ec3206110f80")
	h := handlers.GetPlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestPatchPlayerGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPatch, "/player-games/:id", strings.NewReader(samplePlayerGameJsonPayload2))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	req.Header.Set("X-User-Id", "ed7bdc69-15bb-4d91-9073-4c12a4a9c3c9")
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("8203c226-749b-41fa-b348-ec3206110f80")
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
	req.Header.Set("X-User-Id", "d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad")
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("8203c226-749b-41fa-b348-ec3206110f80")
	h := handlers.DeletePlayerGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"PlayerGame %s deleted\"\n", "bc60004f-5843-4ece-aa5f-8f94633e4832"), rec.Body.String())
	}
}
