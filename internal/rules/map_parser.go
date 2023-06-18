package rules

import (
	"encoding/xml"
	"os"
)

type ProvinceLocData struct {
	XMLName   xml.Name       `xml:"PROVINCE_DATA"`
	Provinces []ProvinceData `xml:"PROVINCE"`
}

type ProvinceData struct {
	XMLName       xml.Name     `xml:"PROVINCE"`
	Name          string       `xml:"name,attr"`
	Unit          UnitLocation `xml:"UNIT"`
	DislodgedUnit UnitLocation `xml:"DISLODGED_UNIT"`
}

type UnitLocation struct {
	X float32 `xml:"x,attr"`
	Y float32 `xml:"y,attr"`
}

type SVG struct {
	XMLName         xml.Name        `xml:"svg"`
	ProvinceLocData ProvinceLocData `xml:"PROVINCE_DATA"`
}

func ParseProvinceData() map[string]UnitLocation {
	file, err := os.Open("./internal/map/map.svg")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	decoder := xml.NewDecoder(file)
	var data SVG
	err = decoder.Decode(&data)
	if err != nil {
		panic(err)
	}

	locMap := map[string]UnitLocation{}

	for _, v := range data.ProvinceLocData.Provinces {
		locMap[v.Name] = v.Unit
	}

	return locMap
}
