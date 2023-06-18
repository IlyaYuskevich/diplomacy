package rules

import (
	"diplomacy/api/types"
	"testing"
)

func TestProcessMovesSimpleMove(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         "1",
			CreatedAt:  "01-01-01",
			Type:       types.MOVE,
			Origin:     "Bur",
			From:       "",
			To:         "Ruh",
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
			Origin:     "Bur",
			From:       "",
			To:         "Par",
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
			Origin:     "Hol",
			From:       "",
			To:         "Kie",
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
			Origin:     "Kie",
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
			Origin:     "Hol",
			From:       "",
			To:         "Ruh",
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
			Origin:     "Ruh",
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
			Origin:     "Mun",
			From:       "Hol",
			To:         "Ruh",
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
			Origin:     "Hol",
			From:       "",
			To:         "Ruh",
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
			Origin:     "Ruh",
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
			Origin:     "Mun",
			From:       "Ruh",
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
			Origin:     "Hol",
			From:       "",
			To:         "Ruh",
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
			Origin:     "Ruh",
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
			Origin:     "Mun",
			From:       "Ruh",
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
			Origin:     "Bel",
			From:       "Hol",
			To:         "Ruh",
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
			Origin:     "Hol",
			From:       "",
			To:         "Ruh",
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
			Origin:     "Ruh",
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
			Origin:     "Mun",
			From:       "Ruh",
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
			Origin:     "Bel",
			From:       "Hol",
			To:         "Ruh",
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
