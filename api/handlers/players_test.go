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
	samplePlayer1Json        = `{"id":"d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad","name":"Luke Skywalker","createdAt":"2023-02-18T14:45:13.69505Z"}`
	samplePlayer2Json        = `{"id":"a00935cb-4e9d-409d-814a-e4d704e0e61d","name":"Darth Weider","createdAt":"2023-02-18T14:45:13.69505Z"}`
	samplePlayer3Json        = `{"id":"675c0b41-23ea-4833-ac9d-5182b0df0605","name":"Boba Fett","createdAt":"2023-02-18T14:45:13.69505Z"}`
	samplePlayerJsonPayload1 = `{"name":"Chewbacca"}`
	samplePlayerJsonPayload2 = `{"name":"Han Solo"}`
	samplePlayer1JsonPatched = `{"id":"d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad","name":"Han Solo","createdAt":"2023-02-18T14:45:13.69505Z"}`
)

var samplePlayers = []types.Player{
	{
		ID:        uuid.MustParse("d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad"),
		Name:      "Luke Skywalker",
		CreatedAt: "2023-02-18T14:45:13.69505Z",
	},
	{
		ID:        uuid.MustParse("a00935cb-4e9d-409d-814a-e4d704e0e61d"),
		Name:      "Darth Weider",
		CreatedAt: "2023-02-18T14:45:13.69505Z",
	},
	{
		ID:        uuid.MustParse("675c0b41-23ea-4833-ac9d-5182b0df0605"),
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
	ctx.SetParamValues("d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad")
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
	ctx.SetParamValues("d3ee3df0-56cf-43f8-85ff-bcb4efb3d4ad")
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
	ctx.SetParamValues("675c0b41-23ea-4833-ac9d-5182b0df0605")
	h := handlers.DeletePlayer(db)
	if assert.NoError(t, h(ctx)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, fmt.Sprintf("\"Player %s deleted\"\n", "675c0b41-23ea-4833-ac9d-5182b0df0605"), rec.Body.String())
	}
}
