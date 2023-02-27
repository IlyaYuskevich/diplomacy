package consumers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/ilyayuskevich/diplomacy/api/types"
)

func GetMoves(gameId string) (moves []types.Move) {
	client := http.Client{}
	url := fmt.Sprintf("https://wvmromtsfxtsksuwhlak.supabase.co/rest/v1/moves?game=eq.%s&select=*", gameId)
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Add("apikey", os.Getenv("API_SERVICE_KEY"))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("API_SERVICE_KEY")))
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}
	println(string(body))
	jsonErr := json.Unmarshal(body, &moves)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	return
}
