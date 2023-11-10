import { signal } from "@preact/signals";
import { Enums } from "lib/database.types.ts";

export type Country = Enums<"Country">

export const CountryColors: { [key in NonNullable<Country>]: string } = {
	"AUSTRIA": "#C48F85",
	"ENGLAND": "#E74C3C",
	"FRANCE": "royalblue",
	"GERMANY": "#757D91",
	"ITALY": "#5FD6B4",
	"RUSSIA": "#5F8C3E",
	"TURKEY": "#DCCA6D"
}

export const selectedCountry = signal<Country | null>(null)