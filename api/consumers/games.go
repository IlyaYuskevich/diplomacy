package consumers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"diplomacy/api/types"
	"github.com/labstack/echo/v4"
)

// CreateGame function creates a new game.
func CreateGame(c echo.Context) error {
	game := new(types.Game)

	// Set default values for optional fields if not provided.
	game.StartedAt = time.Now().String()
	game.Status = types.CREATED
	game.Phase = types.SPRING
	game.Year = 1901
	if game.GameType == "" {
		game.GameType = types.HOSTED
	}
	if game.DiplomaticPhaseSpring == "" {
		game.DiplomaticPhaseSpring = "24h"
	}
	if game.DiplomaticPhaseFall == "" {
		game.DiplomaticPhaseFall = "23h"
	}
	if game.RetreatPhase == "" {
		game.RetreatPhase = "30m"
	}
	if game.GainingLoosingPhase == "" {
		game.GainingLoosingPhase = "30m"
	}

	// Convert Game struct to JSON.
	jsonValue, err := json.Marshal(game)
	if err != nil {
		return err
	}

	client := http.Client{}
	url := "https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/games"
	req, _ := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jsonValue))
	req.Header.Add("apikey", os.Getenv("API_SERVICE_KEY"))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("API_SERVICE_KEY")))

	// Send POST request to Supabase REST API to create a new game.
	resp, err := client.Do(req)
	fmt.Println(resp)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return c.JSON(http.StatusCreated, game)
}

// GetGame function returns games.
func GetGames(c echo.Context) error {

	client := http.Client{}
	url := "https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/games"
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Add("apikey", os.Getenv("API_SERVICE_KEY"))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("API_SERVICE_KEY")))

	// Send GET request to Supabase REST API to get the game by ID.
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
		return err
	}
	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}
	var games []types.Game
	jsonErr := json.Unmarshal(body, &games)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	fmt.Println(games)

	return c.JSON(http.StatusOK, games)
}

// GetGame function returns a game by ID.
func GetGame(c echo.Context) error {
	id := c.Param("id")

	client := http.Client{}
	url := "https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/games?id=eq." + id
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Add("apikey", os.Getenv("API_SERVICE_KEY"))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("API_SERVICE_KEY")))

	// Send GET request to Supabase REST API to get the game by ID.
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
		return err
	}
	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}
	var game []types.Game
	jsonErr := json.Unmarshal(body, &game)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	fmt.Println(game)

	return c.JSON(http.StatusOK, game[0])
}

// PatchGame function updates a game by ID.
func PatchGame(c echo.Context) error {
	id := c.Param("id")
	game := new(types.Game)
	if err := c.Bind(game); err != nil {
		return err
	}

	// Convert Game struct to JSON.
	jsonValue, err := json.Marshal(game)
	if err != nil {
		return err
	}

	// Send PATCH request to Supabase REST API to update the game by ID.
	req, err := http.NewRequest(http.MethodPatch, "https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/games?id=eq."+id, bytes.NewBuffer(jsonValue))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return c.NoContent(http.StatusOK)
}

// DeleteGame function deletes a game by ID.
func DeleteGame(c echo.Context) error {
	id := c.Param("id")

	client := http.Client{}
	url := "https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/games?id=eq." + id
	req, _ := http.NewRequest(http.MethodDelete, url, nil)
	req.Header.Add("apikey", os.Getenv("API_SERVICE_KEY"))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("API_SERVICE_KEY")))

	// Send DELETE request to Supabase REST API to delete the game by ID.
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return c.JSON(http.StatusOK, "Game deleted")
}
