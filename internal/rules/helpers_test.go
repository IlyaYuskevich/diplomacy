package rules

import (
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestProcessMovesSimpleMove(t *testing.T) {
	var moves []types.Move
	moves = append(moves,
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.BUR,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1901,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.BUR,
			From:       "",
			To:         prv.PAR,
			Phase:      types.FALL,
			Year:       1901,
			UnitType:   types.ARMY,
			Status:     types.UNDONE,
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
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.KIE,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.DEFEND,
			Origin:     prv.KIE,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
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
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
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
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
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
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.BEL,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
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
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.MOVE,
			Origin:     prv.HOL,
			From:       "",
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.UNDONE,
			PlayerGame: types.PlayerGame{Country: types.FRANCE},
		}, types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.DEFEND,
			Origin:     prv.RUH,
			From:       "",
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.GERMANY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.MUN,
			From:       prv.RUH,
			To:         "",
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
			PlayerGame: types.PlayerGame{Country: types.ITALY},
		},
		types.Move{
			ID:         uuid.UUID{},
			CreatedAt:  time.Now(),
			Type:       types.SUPPORT,
			Origin:     prv.BEL,
			From:       prv.HOL,
			To:         prv.RUH,
			Phase:      types.FALL,
			Year:       1903,
			UnitType:   types.ARMY,
			Status:     types.SUBMITTED,
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
