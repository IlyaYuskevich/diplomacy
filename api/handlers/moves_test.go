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
	sampleMove1Json        = `{"id":"52187d0b-30b5-4cea-bc42-023fa6e1aba1","createdAt":.{20,40},"type":"SUPPORT","origin":"Par","from":"Par","to":"Bur","phase":"S","year":1903,"unitType":"A","status":"SUBMITTED","playerGame":{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"ENGLAND","color":"white"}}`
	sampleMoveJsonPayload1 = fmt.Sprintf(`[{"type":"MOVE","origin":"Ber","to":"Mun","phase":"S","year":1903,"unitType":"A","playerGame":%s}]`, `{"id":"bc60004f-5843-4ece-aa5f-8f94633e4832","country":"FRANCE","color":"blue","player":{"id":"d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad"},"game":{"id":"8203c226-749b-41fa-b348-ec3206110f80"}}`)
	sampleMoveJsonPayload2 = `{"status":"UNDONE"}`
	sampleMove1Patched     = `{"id":"52187d0b-30b5-4cea-bc42-023fa6e1aba1","createdAt":.{20,40},"type":"SUPPORT","origin":"Par","from":"Par","to":"Bur","phase":"S","year":1903,"unitType":"A","status":"UNDONE","playerGame":{"id":"542bdf30-586d-49aa-8ad2-c1d8de96e8d1","createdAt":.{20,40},"country":"ENGLAND","color":"white"}}`
)

var sampleMoves = []types.Move{
	{
		ID:           uuid.MustParse("52187d0b-30b5-4cea-bc42-023fa6e1aba1"),
		Type:         types.SUPPORT,
		Origin:       "Par",
		From:         "Par",
		To:           "Bur",
		Phase:        types.SPRING,
		Year:         1903,
		UnitType:     types.ARMY,
		Status:       types.SUBMITTED,
		PlayerGameID: "542bdf30-586d-49aa-8ad2-c1d8de96e8d1",
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
		assert.Regexp(t, sampleMove1Json, rec.Body.String())
	}
}

func TestGetMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/moves/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("52187d0b-30b5-4cea-bc42-023fa6e1aba1")
	h := handlers.GetMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Regexp(t, sampleMove1Json, rec.Body.String())
	}
}

func TestCreateMoves(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/moves", strings.NewReader(sampleMoveJsonPayload1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.CreateMoves(db)
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
	ctx.SetParamValues("52187d0b-30b5-4cea-bc42-023fa6e1aba1")
	h := handlers.PatchMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Regexp(t, sampleMove1Patched, rec.Body.String())
	}
}

func TestDeleteMove(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/moves/:id", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetParamNames("id")
	ctx.SetParamValues("52187d0b-30b5-4cea-bc42-023fa6e1aba1")
	h := handlers.DeleteMove(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"Move %s deleted\"\n", "52187d0b-30b5-4cea-bc42-023fa6e1aba1"), rec.Body.String())
	}
}
