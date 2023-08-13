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
	sampleGame1Json        = `{"id":"8203c226-749b-41fa-b348-ec3206110f80","startedAt":"2023-02-18T14:45:13.69505Z","status":"FINISHED","diplomaticPhaseSpring":"23h","diplomaticPhaseFall":"22h","retreatPhase":"1h","gainingLoosingPhase":"1h","gameType":"MULTI","phase":"S","year":1901}`
	sampleGame2Json        = `{"id":"2964d6b5-4cd7-490d-a4bc-de09b7695455","startedAt":"2023-02-18T14:45:13.69505Z","status":"ACTIVE","diplomaticPhaseSpring":"23h","diplomaticPhaseFall":"22h","retreatPhase":"1h","gainingLoosingPhase":"1h","gameType":"MULTI","phase":"S","year":1901}`
	sampleGameJsonPayload1 = `{"diplomaticPhaseSpring":"23h","diplomaticPhaseFall":"22h","retreatPhase":"1h","gainingLoosingPhase":"1h","gameType":"MULTI"}`
	sampleGameJsonPayload2 = `{"phase":"F","year":1905}`
	sampleGame1PatchedJson = `{"id":"8203c226-749b-41fa-b348-ec3206110f80","startedAt":"2023-02-18T14:45:13.69505Z","status":"FINISHED","diplomaticPhaseSpring":"23h","diplomaticPhaseFall":"22h","retreatPhase":"1h","gainingLoosingPhase":"1h","gameType":"MULTI","phase":"F","year":1905}`
)

var sampleGames = []types.Game{
	{
		ID:                    uuid.MustParse("8203c226-749b-41fa-b348-ec3206110f80"),
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
		ID:                    uuid.MustParse("2964d6b5-4cd7-490d-a4bc-de09b7695455"),
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
	ctx.SetParamValues("2964d6b5-4cd7-490d-a4bc-de09b7695455")
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
	ctx.SetParamValues("8203c226-749b-41fa-b348-ec3206110f80")
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
	ctx.SetParamValues("2964d6b5-4cd7-490d-a4bc-de09b7695455")
	h := handlers.DeleteGame(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "\"Game 2964d6b5-4cd7-490d-a4bc-de09b7695455 deleted\"\n", rec.Body.String())
	}
}
