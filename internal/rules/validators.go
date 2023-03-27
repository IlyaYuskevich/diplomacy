// built with ChatGPT assistance

package rules

import (
	"github.com/ilyayuskevich/diplomacy/api/types"
)

/*
The canMove function first checks whether both provinces exist in the provinces map. If either of them does not exist, the function returns false immediately.

If the unit type is Army, the function checks that both provinces are land provinces and that there is a border between the two provinces. If the unit type is Fleet, the function checks that the starting and destinating provinces are either a coastal or a sea province, and that there is a border between the two provinces.

Note that this function does not check other factors that might affect whether a move is valid in the game Diplomacy, such as whether there is another unit occupying the destination province or whether the move violates the game's rules of diplomacy.
*/

func canMove(fromProvince, toProvince string, unit types.UnitType) bool {
	from, ok := provinces[fromProvince]
	if !ok {
		return false
	}
	to, ok := provinces[toProvince]
	if !ok {
		return false
	}

	// Check adjacency
	adj, ok := ArmyBorders[fromProvince]
	found := false
	for _, p := range adj {
		if p == toProvince {
			found = true
			break
		}
	}
	if !found {
		return false
	}

	// Check move type
	if unit == types.Fleet {
		if from.Type == types.Land {
			return false
		}
		if to.Type == types.Land {
			return false
		}
	}
	if unit == types.Fleet {
		if from.Type == types.Sea {
			return false
		}
		if to.Type == types.Sea {
			return false
		}
	}

	return true
}
