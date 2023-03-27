// built with ChatGPT assistance

package rules

import (
	"github.com/ilyayuskevich/diplomacy/api/types"
)

var provinces = map[string]types.Province{
	"Adr": {
		Name: "Adriatic Sea",
		Type: types.Sea,
	},
	"Aeg": {
		Name: "Aegean Sea",
		Type: types.Sea,
	},
	"Alb": {
		Name: "Albania",
		Type: types.Land,
	},
	"Ank": {
		Name: "Ankara",
		Type: types.Coast,
	},
	"Apu": {
		Name: "Apulia",
		Type: types.Coast,
	},
	"Arm": {
		Name: "Armenia",
		Type: types.Land,
	},
	"Bar": {
		Name: "Barents Sea",
		Type: types.Sea,
	},
	"Bal": {
		Name: "Baltic Sea",
		Type: types.Sea,
	},
	"Bel": {
		Name: "Belgium",
		Type: types.Coast,
	},
	"Ber": {
		Name: "Berlin",
		Type: types.Land,
	},
	"Bla": {
		Name: "Black Sea",
		Type: types.Sea,
	},
	"Bot": {
		Name: "Gulf of Bothnia",
		Type: types.Sea,
	},
	"Bre": {
		Name: "Brest",
		Type: types.Coast,
	},
	"Bud": {
		Name: "Budapest",
		Type: types.Land,
	},
	"Bul": {
		Name: "Bulgaria",
		Type: types.Coast,
	},
	"Bur": {
		Name: "Burgundy",
		Type: types.Land,
	},
	"Cly": {
		Name: "Clyde",
		Type: types.Coast,
	},
	"Con": {
		Name: "Constantinople",
		Type: types.Coast,
	},
	"Den": {
		Name: "Denmark",
		Type: types.Coast,
	},
	"Eas": {
		Name: "Eastern Mediterranean",
		Type: types.Sea,
	},
	"Edi": {
		Name: "Edinburgh",
		Type: types.Coast,
	},
	"Eng": {
		Name: "English Channel",
		Type: types.Sea,
	},
	"Gas": {
		Name: "Gascony",
		Type: types.Coast,
	},
	"Gre": {
		Name: "Greece",
		Type: types.Coast,
	},
	"GoL": {
		Name: "Gulf of Lyon",
		Type: types.Sea,
	},
	"Hol": {
		Name: "Holland",
		Type: types.Coast,
	},
	"Ion": {
		Name: "Ionian Sea",
		Type: types.Sea,
	},
	"Iri": {
		Name: "Irish Sea",
		Type: types.Sea,
	},
	"Kie": {
		Name: "Kiel",
		Type: types.Coast,
	},
	"Hel": {
		Name: "Helgoland Bight",
		Type: types.Coast,
	},
	"Lon": {
		Name: "London",
		Type: types.Coast,
	},
	"Lvp": {
		Name: "Liverpool",
		Type: types.Coast,
	},
	"Mar": {
		Name: "Marseilles",
		Type: types.Coast,
	},
	"Mid": {
		Name: "Mid-Atlantic Ocean",
		Type: types.Sea,
	},
	"Mos": {
		Name: "Moscow",
		Type: types.Land,
	},
	"Mun": {
		Name: "Munich",
		Type: types.Land,
	},
	"Naf": {
		Name: "North Africa",
		Type: types.Coast,
	},
	"Nap": {
		Name: "Naples",
		Type: types.Coast,
	},
	"NAt": {
		Name: "North Atlantic Ocean",
		Type: types.Sea,
	},
	"Nrg": {
		Name: "Norwegian Sea",
		Type: types.Sea,
	},
	"Nwy": {
		Name: "Norway",
		Type: types.Coast,
	},
	"Nth": {
		Name: "North Sea",
		Type: types.Sea,
	},
	"Par": {
		Name: "Paris",
		Type: types.Land,
	},
	"Pic": {
		Name: "Picardy",
		Type: types.Coast,
	},
	"Pie": {
		Name: "Piedmont",
		Type: types.Land,
	},
	"Por": {
		Name: "Portugal",
		Type: types.Coast,
	},
	"Pru": {
		Name: "Prussia",
		Type: types.Coast,
	},
	"Rom": {
		Name: "Rome",
		Type: types.Coast,
	},
	"Ruh": {
		Name: "Ruhr",
		Type: types.Land,
	},
	"Rum": {
		Name: "Rumania",
		Type: types.Coast,
	},
	"Ser": {
		Name: "Serbia",
		Type: types.Land,
	},
	"Sev": {
		Name: "Sevastopol",
		Type: types.Coast,
	},
	"Sil": {
		Name: "Silesia",
		Type: types.Land,
	},
	"Ska": {
		Name: "Skagerrak",
		Type: types.Land,
	},
	"Smy": {
		Name: "Smyrna",
		Type: types.Coast,
	},
	"Spa": {
		Name: "Spain",
		Type: types.Coast,
	},
	"StP": {
		Name: "Saint Petersburg",
		Type: types.Coast,
	},
	"Swe": {
		Name: "Sweden",
		Type: types.Coast,
	},
	"Syr": {
		Name: "Syria",
		Type: types.Coast,
	},
	"Tri": {
		Name: "Trieste",
		Type: types.Coast,
	},
	"Tun": {
		Name: "Tunis",
		Type: types.Coast,
	},
	"Tus": {
		Name: "Tuscany",
		Type: types.Coast,
	},
	"Tyr": {
		Name: "Tyrolia",
		Type: types.Land,
	},
	"Ukr": {
		Name: "Ukraine",
		Type: types.Land,
	},
	"Ven": {
		Name: "Venice",
		Type: types.Coast,
	},
	"Vie": {
		Name: "Vienna",
		Type: types.Land,
	},
	"Wal": {
		Name: "Wales",
		Type: types.Coast,
	},
	"War": {
		Name: "Warsaw",
		Type: types.Land,
	},
	"Wes": {
		Name: "Western Mediterranean",
		Type: types.Sea,
	},
	"Yor": {
		Name: "Yorkshire",
		Type: types.Coast,
	},
}

var FleetBorders = map[string][]string{
	"Adr":  {"Alb", "Apu", "Tri", "Ven", "Ion"},
	"Aeg":  {"Con", "BulS", "Eas", "Gre", "Smy", "Ion"},
	"Alb":  {"Adr", "Gre", "Tri", "Ion"},
	"Ank":  {"Arm", "Con", "Bla"},
	"Apu":  {"Adr", "Ion", "Nap", "Ven"},
	"Arm":  {"Ank", "Sev", "Bla"},
	"Bal":  {"Swe", "Den", "Liv", "Kie", "Ber", "Pru", "Bot"},
	"Bar":  {"Nrg", "Nwy", "StpN"},
	"Bla":  {"Sev", "Rum", "BulE", "Con", "Ank", "Arm"},
	"Bel":  {"Hol", "Pic", "Nth", "Eng"},
	"Ber":  {"Bal", "Kie", "Pru", "Sil"},
	"Bre":  {"Gas", "Eng", "Mid", "Pic"},
	"Bot":  {"Fin", "Swe", "Bal", "Liv", "StPS"},
	"BulS": {"Con", "Gre", "Aeg"},
	"BulE": {"Con", "Rum", "Bla"},
	"Cly":  {"Ngr", "NAt", "Lvp", "Edi"},
	"Con":  {"Aeg", "Ank", "Bla", "BulS", "BulE", "Smy"},
	"Den":  {"Hel", "Bal", "Kie", "Nth", "Ska", "Swe"},
	"Eas":  {"Aeg", "Ion", "Smy", "Syr"},
	"Edi":  {"Cly", "Nrg", "Nth", "Yor"},
	"Eng":  {"Bel", "Bre", "Pic", "Iri", "Lon", "Nth", "Mid", "Wal"},
	"Gas":  {"Bre", "Mid", "SpaN"},
	"Gre":  {"Alb", "Aeg", "BulS", "Ion"},
	"GoL":  {"Mar", "SpaS", "Wes", "Tyn", "Tus", "Pie"},
	"Hol":  {"Bel", "Eng", "Kie", "Nth"},
	"Hel":  {"Nth", "Hol", "Kie", "Den"},
	"Ion":  {"Gre", "Aeg", "Alb", "Adr", "Apu", "Eas", "Nap", "Tun", "Tyn"},
	"Iri":  {"Eng", "Lvp", "Mid", "NAt", "Wal"},
	"Kie":  {"Bal", "Ber", "Den", "Hel", "Hol"},
	"Lon":  {"Eng", "Wal", "Nth", "Yor"},
	"Lvp":  {"Cly", "NAt", "Iri", "Wal"},
	"Mar":  {"GoL", "Pie", "SpaS"},
	"Mid":  {"NAt", "Iri", "Eng", "Bre", "Gas", "SpaN", "Por", "SpaS", "Wes", "NAf"},
	"Nap":  {"Apu", "Ion", "Tyn", "Rom"},
	"NAt":  {"Cly", "Lvp", "Iri", "Mid", "Nrg"},
	"Nrg":  {"Bar", "Edi", "Cly", "NAt", "Nth", "Nwy"},
	"Nwy":  {"Bar", "Nrg", "Nth", "Ska", "Swe", "StPN"},
	"Nth":  {"Nrg", "Edi", "Yor", "Lon", "Eng", "Bel", "Hol", "Hel", "Den", "Ska", "Nor"},
	"Pie":  {"Mar", "Tus", "GoL"},
	"Pic":  {"Bel", "Bre", "Eng"},
	"Por":  {"SpaN", "SpaS", "Mid"},
	"Pru":  {"Ber", "Bal", "Liv"},
	"Rom":  {"Nap", "Tus", "Tyn"},
	"Rum":  {"Sev", "Bla", "BulE"},
	"Sev":  {"Arm", "Rum", "Bla"},
	"Smy":  {"Aeg", "Con", "Eas", "Syr"},
	"SpaN": {"Gas", "Por", "Mid"},
	"SpaS": {"Mar", "Por", "Mid", "Wes", "GoL"},
	"Ska":  {"Nwy", "Nth", "Den", "Swe"},
	"Swe":  {"Bot", "Nwy", "Bal", "Fin", "Den", "Ska"},
	"Tri":  {"Adr", "Alb", "Ven"},
	"Tun":  {"Ion", "NAf", "Tyn", "Wes"},
	"Tus":  {"Pie", "Rom", "Tyn", "GoL"},
	"Tyn":  {"Tus", "GoL", "Wes", "Tun", "Ion", "Nap", "Rom"},
	"Ven":  {"Adr", "Apu", "Tri"},
	"Wal":  {"Eng", "Iri", "Lvp", "Lon"},
	"Wes":  {"Mid", "NAf", "Tus", "SpaS", "Tun", "Tyn"},
	"Yor":  {"Edi", "Lon", "Nth"}}

var ArmyBorders = map[string][]string{
	"Alb": {"Gre", "Ser", "Tri"},
	"Ank": {"Arm", "Con", "Smy"},
	"Apu": {"Nap", "Ven", "Rom"},
	"Arm": {"Ank", "Sev", "Smy", "Syr"},
	"Bel": {"Bur", "Hol", "Pic", "Ruh"},
	"Ber": {"Kie", "Pru", "Sil", "Mun"},
	"Bre": {"Gas", "Par", "Pic"},
	"Boh": {"Mun", "Tyr", "Vie", "Gal", "Sil"},
	"Bud": {"Gal", "Rum", "Ser", "Tri", "Vie"},
	"Bul": {"Con", "Gre", "Rum", "Ser"},
	"Bur": {"Bel", "Gas", "Mar", "Mun", "Par", "Pic", "Ruh"},
	"Cly": {"Edi", "Lvp"},
	"Con": {"Ank", "Bul", "Smy"},
	"Den": {"Hel", "Swe"},
	"Edi": {"Cly", "Lvp", "Yor"},
	"Fin": {"Nwy", "Swe", "StP"},
	"Gal": {"War", "Sil", "Boh", "Vie", "Bud", "Run", "Ukr"},
	"Gas": {"Bre", "Bur", "Mar", "Spa", "Par"},
	"Gre": {"Alb", "Bul", "Ser"},
	"Hol": {"Bel", "Kie", "Ruh"},
	"Kie": {"Ber", "Den", "Hol", "Mun", "Ruh"},
	"Lon": {"Wal", "Yor"},
	"Lvp": {"Cly", "Edi", "Wal", "Yor"},
	"Liv": {"Pru", "War", "Mos", "StP"},
	"NAf": {"Tun"},
	"Mar": {"Bur", "Gas", "Pie", "Spa"},
	"Mos": {"Liv", "Sev", "StP", "Ukr", "War"},
	"Mun": {"Ber", "Boh", "Bur", "Kie", "Ruh", "Sil", "Tyr"},
	"Nap": {"Apu", "Rom"},
	"Nwy": {"Fin", "StP", "Swe"},
	"Pie": {"Mar", "Tus", "Tyr", "Ven"},
	"Pic": {"Bel", "Bre", "Bur", "Par"},
	"Por": {"Spa"},
	"Pru": {"Ber", "Liv", "Sil", "War"},
	"Rom": {"Apu", "Nap", "Tus", "Ven"},
	"Ruh": {"Bel", "Bur", "Hol", "Kie", "Mun"},
	"Rum": {"Bud", "Bul", "Gal", "Sev", "Ser", "Ukr"},
	"Ser": {"Alb", "Bud", "Bul", "Gre", "Rum", "Tri"},
	"Sev": {"Arm", "Mos", "Rum", "Ukr"},
	"Sil": {"Boh", "Gal", "Ber", "Mun", "Pru", "War"},
	"Smy": {"Ank", "Arm", "Con", "Syr"},
	"Spa": {"Gas", "Mar", "Por"},
	"StP": {"Nwy", "Fin", "Liv", "Mos"},
	"Syr": {"Smy", "Arm"},
	"Swe": {"Nwy", "Fin", "Den"},
	"Tri": {"Alb", "Bud", "Tyr", "Ser", "Ven", "Vie"},
	"Tun": {"Naf"},
	"Tus": {"Pie", "Rom", "Ven"},
	"Tyr": {"Boh", "Mun", "Pie", "Tri", "Ven", "Vie"},
	"Ukr": {"Gal", "Mos", "Rum", "Sev", "War"},
	"Ven": {"Apu", "Pie", "Rom", "Tyr", "Tus", "Tri"},
	"Vie": {"Boh", "Bud", "Gal", "Tri", "Tyr"},
	"Wal": {"Lon", "Lvp", "Yor"},
	"War": {"Liv", "Pru", "Sil", "Gal", "Ukr", "Mos"},
	"Yor": {"Edi", "Lon", "Lvp", "Wal"}}
