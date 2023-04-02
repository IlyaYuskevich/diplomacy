package rules

func GetPossibleMoves(Origin string) map[string]string {
	moves := ArmyBorders[Origin]

	possibleMoves := map[string]string{}

	for _, v := range moves {
		possibleMoves[v] = Provinces[v].Name
	}
	return possibleMoves
}
