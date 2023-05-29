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
	sampleGame1Json        = `{"id":"d42830gg-a75c-40c5-ade3-56a38db0fd01","started_at":"2023-02-18T14:45:13.69505Z","status":"FINISHED","diplomatic_phase_spring":"23h","diplomatic_phase_fall":"22h","retreat_phase":"1h","gaining_loosing_phase":"1h","game_type":"MULTI","phase":"S","year":1901}`
	sampleGame2Json        = `{"id":"d42830gg-a75c-40c5-ade3-56a38db0fd02","started_at":"2023-02-18T14:45:13.69505Z","status":"ACTIVE","diplomatic_phase_spring":"23h","diplomatic_phase_fall":"22h","retreat_phase":"1h","gaining_loosing_phase":"1h","game_type":"MULTI","phase":"S","year":1901}`
	sampleGameJsonPayload1 = `{"diplomatic_phase_spring":"23h","diplomatic_phase_fall":"22h","retreat_phase":"1h","gaining_loosing_phase":"1h","game_type":"MULTI"}`
	sampleGameJsonPayload2 = `{"phase":"F","year":1905}`
	sampleGame1PatchedJson = `{"id":"d42830gg-a75c-40c5-ade3-56a38db0fd01","started_at":"2023-02-18T14:45:13.69505Z","status":"FINISHED","diplomatic_phase_spring":"23h","diplomatic_phase_fall":"22h","retreat_phase":"1h","gaining_loosing_phase":"1h","game_type":"MULTI","phase":"F","year":1905}`
)

var sampleGames = []types.Game{
	{
		ID:                    "d42830gg-a75c-40c5-ade3-56a38db0fd01",
		StartedAt:             "2023-02-18T14:45:13.69505Z",
		Status:                "FINISHED",
		DiplomaticPhaseSpring: "23h",
		DiplomaticPhaseFall:   "22h",
		RetreatPhase:          "1h",
		GainingLoosingPhase:   "1h",
		GameType:              "MULTI",
		Phase:                 "S",
		Year:                  1901,
	},
	{
		ID:                    "d42830gg-a75c-40c5-ade3-56a38db0fd02",
		StartedAt:             "2023-02-18T14:45:13.69505Z",
		Status:                "ACTIVE",
		DiplomaticPhaseSpring: "23h",
		DiplomaticPhaseFall:   "22h",
		RetreatPhase:          "1h",
		GainingLoosingPhase:   "1h",
		GameType:              "MULTI",
		Phase:                 "S",
		Year:                  1901,
	},
}

func PopulateGames(db *gorm.DB) {
	db.Create(&sampleGames)
}

func TestGetGames(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/games", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetGames(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("[%s,%s]\n", sampleGame1Json, sampleGame2Json), rec.Body.String())
	}
}

func TestGetGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830gg-a75c-40c5-ade3-56a38db0fd02")
	h := handlers.GetGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", sampleGame2Json), rec.Body.String())
	}
}

func TestCreateGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/games", strings.NewReader(sampleGameJsonPayload1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.CreateGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestPatchGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPatch, "/games/:id", strings.NewReader(sampleGameJsonPayload2))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830gg-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.PatchGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", sampleGame1PatchedJson), rec.Body.String())
	}
}

func TestDeleteGame(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/games/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830gg-a75c-40c5-ade3-56a38db0fd02")
	h := handlers.DeleteGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "\"Game d42830gg-a75c-40c5-ade3-56a38db0fd02 deleted\"\n", rec.Body.String())
	}
}
