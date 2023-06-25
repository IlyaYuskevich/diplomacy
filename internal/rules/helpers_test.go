package rules

import (
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
	"testing"
)

func TestProcessMovesSimpleMove(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.BUR,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1901,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.BUR,
			From:       "",
			To:         prv.PAR,
			Phase:      types.FALL,
			Year:       1901,
			UnitType:   types.Army,
			Status:     types.UNDONE,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		})
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.SUCCEED))
	}
}

func TestProcessMovesFailed(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.KIE,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.DEFEND,
			Origin:     prv.KIE,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		})
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.FAILED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.FAILED))
	}
	if types.MoveType(moves[1].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[1].Status, types.MoveType(types.SUCCEED))
	}
}

func TestProcessSuccessfulAttackSupport(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         "3",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
	)
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.SUCCEED))
	}
	if types.MoveType(moves[1].Status) != types.MoveType(types.FAILED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[1].Status, types.MoveType(types.FAILED))
	}
	if types.MoveType(moves[2].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[2].Status, types.MoveType(types.SUCCEED))
	}
}

func TestProcessSuccessfulDefenceSupport(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         "3",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
	)
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.FAILED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.FAILED))
	}
	if types.MoveType(moves[1].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[1].Status, types.MoveType(types.SUCCEED))
	}
	if types.MoveType(moves[2].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[2].Status, types.MoveType(types.SUCCEED))
	}
}

func TestProcessUsuccessfulSupport(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         "3",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
		types.Move{
			ID:         "4",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.BEL,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		},
	)
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.SUCCEED))
	}
	if types.MoveType(moves[1].Status) != types.MoveType(types.FAILED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[1].Status, types.MoveType(types.FAILED))
	}
	if types.MoveType(moves[2].Status) != types.MoveType(types.FAILED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[2].Status, types.MoveType(types.FAILED))
	}
	if types.MoveType(moves[3].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[3].Status, types.MoveType(types.SUCCEED))
	}
}

func TestProcessNoEffectSupport(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.UNDONE,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         "2",
			CreatedAt:  "01-01-01",
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         "3",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
		types.Move{
			ID:         "4",
			CreatedAt:  "01-01-01",
			Type:       types.SUPPORT,
			Origin:     prv.BEL,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.Army,
			Status:     types.SUBMITTED,
			GameID:     "",
			PlayerGame: types.PlayerGame{Country: types.ENGLAND},
		},
	)
	moves = ProcessMoves(moves)
	if types.MoveType(moves[0].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[0].Status, types.MoveType(types.SUCCEED))
	}
	if types.MoveType(moves[1].Status) != types.MoveType(types.SUCCEED) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[1].Status, types.MoveType(types.SUCCEED))
	}
	if types.MoveType(moves[2].Status) != types.MoveType(types.EFFECTLESS) {
		t.Errorf("Result was incorrect, got: %s, want: %s.", moves[2].Status, types.MoveType(types.EFFECTLESS))
	}
}
