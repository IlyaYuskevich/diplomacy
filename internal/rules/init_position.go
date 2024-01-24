package rules

import (
	"diplomacy/api/types"
	"diplomacy/api/types/prv"
)

var StartingPosition = types.GamePosition{
	Domains: map[types.Country][]prv.ShortName{
		types.AUSTRIA: {prv.BOH, prv.BUD, prv.GAL, prv.TRI, prv.TYR, prv.VIE},
		types.ENGLAND: {prv.CLY, prv.EDI, prv.LVP, prv.LON, prv.WAL, prv.YOR},
		types.FRANCE:  {prv.BRE, prv.BUR, prv.GAS, prv.MAR, prv.PAR, prv.PIC},
		types.GERMANY: {prv.BER, prv.KIE, prv.MUN, prv.PRU, prv.RUH, prv.SIL},
		types.ITALY:   {prv.APU, prv.NAP, prv.PIE, prv.ROM, prv.TUS, prv.VEN},
		types.RUSSIA:  {prv.LVN, prv.MOS, prv.SEV, prv.STP, prv.UKR, prv.WAR},
		types.TURKEY:  {prv.ANK, prv.ARM, prv.CON, prv.SMY, prv.SYR},
	},
	UnitPositions: map[types.Country][]types.UnitPosition{
		types.AUSTRIA: {
			types.UnitPosition{
				Province: prv.VIE,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.BUD,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.TRI,
				UnitType: types.FLEET,
			}},
		types.ENGLAND: {
			types.UnitPosition{
				Province: prv.LON,
				UnitType: types.FLEET,
			}, types.UnitPosition{
				Province: prv.EDI,
				UnitType: types.FLEET,
			}, types.UnitPosition{
				Province: prv.LVP,
				UnitType: types.ARMY,
			}},
		types.FRANCE: {
			types.UnitPosition{
				Province: prv.PAR,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.MAR,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.BRE,
				UnitType: types.FLEET,
			}},
		types.GERMANY: {
			types.UnitPosition{
				Province: prv.BER,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.MUN,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.KIE,
				UnitType: types.FLEET,
			}},
		types.ITALY: {
			types.UnitPosition{
				Province: prv.ROM,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.VEN,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.NAP,
				UnitType: types.FLEET,
			}},
		types.RUSSIA: {
			types.UnitPosition{
				Province: prv.MOS,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.SEV,
				UnitType: types.FLEET,
			}, types.UnitPosition{
				Province: prv.WAR,
				UnitType: types.ARMY,
			}, types.UnitPosition{
				Province: prv.STPS,
				UnitType: types.FLEET,
			}},
		types.TURKEY: {
			types.UnitPosition{
				Province: prv.ANK,
				UnitType: types.FLEET,
			}, types.UnitPosition{
				Province: prv.CON,
				UnitType: types.FLEET,
			}, types.UnitPosition{
				Province: prv.SMY,
				UnitType: types.ARMY,
			}},
	},
}
