package handlers_test

import (
	"diplomacy/api/handlers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetPossibleMovesFleet(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/get-possible-moves", strings.NewReader(`{"province":"Ven","unitType":"F"}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPossibleMoves()
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "{\"Adr\":\"Adriatic Sea\",\"Apu\":\"Apulia\",\"Tri\":\"Trieste\"}\n", rec.Body.String())
	}
}

func TestGetPossibleMovesArmy(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/get-possible-moves", strings.NewReader(`{"province":"Ven","unitType":"A"}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPossibleMoves()
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "{\"Apu\":\"Apulia\",\"Pie\":\"Piedmont\",\"Rom\":\"Rome\",\"Tri\":\"Trieste\",\"Tus\":\"Tuscany\",\"Tyr\":\"Tyrolia\"}\n", rec.Body.String())
	}
}

func TestGetPossibleMovesAny(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/get-possible-moves", strings.NewReader(`{"province":"Ven","unitType":null}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	h := handlers.GetPossibleMoves()
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "{\"Adr\":\"Adriatic Sea\",\"Apu\":\"Apulia\",\"Pie\":\"Piedmont\",\"Rom\":\"Rome\",\"Tri\":\"Trieste\",\"Tus\":\"Tuscany\",\"Tyr\":\"Tyrolia\"}\n", rec.Body.String())
	}
}
