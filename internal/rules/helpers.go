package rules

import (
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
)

func GetPossibleArmyMoves(Origin prv.ShortName) map[prv.ShortName]string {
	moves := ArmyBorders[Origin]

	possibleMoves := map[prv.ShortName]string{}

	for _, v := range moves {
		possibleMoves[v] = Provinces[v].Name
	}
	return possibleMoves
}

func GetPossibleFleetMoves(Origin prv.ShortName) map[prv.ShortName]string {
	moves := FleetBorders[Origin]

	possibleMoves := map[prv.ShortName]string{}

	for _, v := range moves {
		possibleMoves[v] = Provinces[v].Name
	}
	return possibleMoves
}

func findMoveToSupport(supportingMove types.Move, moves []types.Move) (supportedMoveIndex int) {
	// returns index of a move that is aimed for support
	for i, candidateMove := range moves {
		if candidateMove.Origin == supportingMove.From && candidateMove.To == supportingMove.To {
			return i
		}
	}
	return -1
}

func calcMoveStatus(move types.Move, strength map[prv.ShortName]map[types.Country]int) (moveStatus types.MoveStatus) {
	// returns move status taking into account other moves made in this turn
	strongestCountry := func(strength map[types.Country]int) types.Country {
		// returns the strongest country after all moves or "" if equals
		var winner types.Country
		max := 0
		isEqual := false
		for key, val := range strength {
			if val == max {
				isEqual = true
			}
			if val > max {
				max = val
				winner = key
				isEqual = false
			}
		}
		if isEqual {
			return "equal"
		} else {
			return winner
		}
	}
	if move.Type == types.BUILD || move.Type == types.DESTROY {
		return types.SUCCEED
	}
	if move.Type == types.MOVE {
		if strongestCountry(strength[move.To]) == move.PlayerGame.Country {
			return types.SUCCEED
		}
	}
	if move.Type == types.DEFEND {
		country := strongestCountry(strength[move.Origin])
		if country == move.PlayerGame.Country || country == "equal" {
			return types.SUCCEED
		}
	}
	return types.FAILED
}

func ProcessMoves(submittedMoves []types.Move) []types.Move {
	// assess whether a given move was successful or not. Provide with the moves, that we created in the same turn!

	activeMoves := func(moves []types.Move) (res []types.Move) {
		for _, move := range moves {
			if move.Status == types.UNDONE {
				continue
			}
			if move.Type == types.MOVE || move.Type == types.DEFEND || move.Type == types.BUILD {
				res = append(res, move)
			}
		}
		return res
	}(submittedMoves)

	supportMoves := func(moves []types.Move) (res []types.Move) {
		for _, move := range moves {
			if move.Status == types.UNDONE {
				continue
			}
			if move.Type == types.SUPPORT || move.Type == types.CONVOY {
				res = append(res, move)
			}
		}
		return res
	}(submittedMoves)

	strength := make(map[prv.ShortName]map[types.Country]int) // map[War:map[austria:1 germany:1 russia:3]]
	for _, move := range append(activeMoves, supportMoves...) {
		if strength[move.To] == nil { // creating strength map for a given province if it does not exist
			strength[move.To] = make(map[types.Country]int)
		}
		if strength[move.Origin] == nil { // creating strength map for a given province if it does not exist
			strength[move.Origin] = make(map[types.Country]int)
		}
		if move.Type == types.MOVE { // adds a point if unit attempts to move to a province
			strength[move.To][move.PlayerGame.Country] += 1
		}
		if move.Type == types.DEFEND {
			strength[move.Origin][move.PlayerGame.Country] += 1
		}
		if move.Type == types.SUPPORT {
			supportedMoveIndex := findMoveToSupport(move, activeMoves)
			if supportedMoveIndex != -1 {
				supportedMove := activeMoves[supportedMoveIndex]
				strength[supportedMove.To][supportedMove.PlayerGame.Country] += 1
			}
		}
	}

	for i, move := range activeMoves { // calc statuses for MOVE, BUILD, DEFEND
		activeMoves[i].Status = calcMoveStatus(move, strength)
	}

	for i, move := range supportMoves { // calc statuses for SUPPORT, CONVOY
		supportedMoveIndex := findMoveToSupport(move, activeMoves)
		if supportedMoveIndex == -1 {
			supportMoves[i].Status = types.EFFECTLESS
		} else {
			supportedMove := activeMoves[supportedMoveIndex]
			supportMoves[i].Status = supportedMove.Status
		}
	}
	return append(activeMoves, supportMoves...)
}
