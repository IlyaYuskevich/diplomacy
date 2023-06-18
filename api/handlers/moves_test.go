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
	sampleMove1Json        = `{"id":"d42830mv-a75c-40c5-ade3-56a38db0fd01","created_at":"2023-02-18T14:45:13.69505Z","type":"support","origin":"Par","from":"Par","to":"Bur","phase":"S","year":1903,"unit_type":"A","status":"submitted","game_id":"d42830gg-a75c-40c5-ade3-56a38db0fd01","player_game_id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","player_game":{"id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","country":"england","color":"white"}}`
	sampleMoveJsonPayload1 = `{"type":"move","origin":"Ber","to":"Mun","phase":"S","year":1903,"unit_type":"A","player_game_id":"d42830pg-a75c-40c5-ade3-56a38db0fd02","game_id":"d42830gg-a75c-40c5-ade3-56a38db0fd01"}`
	sampleMoveJsonPayload2 = `{"status":"undone"}`
	sampleMove1Patched     = `{"id":"d42830mv-a75c-40c5-ade3-56a38db0fd01","created_at":"2023-02-18T14:45:13.69505Z","type":"support","origin":"Par","from":"Par","to":"Bur","phase":"S","year":1903,"unit_type":"A","status":"undone","game_id":"d42830gg-a75c-40c5-ade3-56a38db0fd01","player_game_id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","player_game":{"id":"d42830pg-a75c-40c5-ade3-56a38db0fd01","country":"england","color":"white"}}`
)

var sampleMoves = []types.Move{
	{
		ID:           "d42830mv-a75c-40c5-ade3-56a38db0fd01",
		CreatedAt:    "2023-02-18T14:45:13.69505Z",
		Type:         types.SUPPORT,
		Origin:       "Par",
		From:         "Par",
		To:           "Bur",
		Phase:        types.SPRING,
		Year:         1903,
		UnitType:     types.Army,
		Status:       types.SUBMITTED,
		PlayerGameID: "d42830pg-a75c-40c5-ade3-56a38db0fd01",
		GameID:       "d42830gg-a75c-40c5-ade3-56a38db0fd01",
	},
}

func PopulateMoves(db *gorm.DB) {
	db.Create(&sampleMoves)
}

func TestGetMoves(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/moves", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetMoves(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("[%s]\n", sampleMove1Json), rec.Body.String())
	}
}

func TestGetMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/moves/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830mv-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.GetMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", sampleMove1Json), rec.Body.String())
	}
}

func TestCreateMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/moves", strings.NewReader(sampleMoveJsonPayload1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.CreateMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestPatchMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPatch, "/moves/:id", strings.NewReader(sampleMoveJsonPayload2))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830mv-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.PatchMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("%s\n", sampleMove1Patched), rec.Body.String())
	}
}

func TestDeleteMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/moves/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("d42830mv-a75c-40c5-ade3-56a38db0fd01")
	h := handlers.DeleteMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"Move %s deleted\"\n", "d42830mv-a75c-40c5-ade3-56a38db0fd01"), rec.Body.String())
	}
}
