import { signal } from "@preact/signals";

export type Country = "FRANCE" | "GERMANY" | "ITALY" | "RUSSIA" | "AUSTRIA" | "ENGLAND" | "TURKEY" | null

export const COUNTRY_ARRAY: NonNullable<Country>[] = ["AUSTRIA", "ENGLAND", "FRANCE", "GERMANY", "ITALY", "RUSSIA", "TURKEY"];

export const CountryColors: { [key in NonNullable<Country>]: string } = {
	"AUSTRIA": "#C48F85",
	"ENGLAND": "#E74C3C",
	"FRANCE": "royalblue",
	"GERMANY": "#757D91",
	"ITALY": "#5FD6B4",
	"RUSSIA": "#5F8C3E",
	"TURKEY": "#DCCA6D"
}

export const selectedCountry = signal<Country>(null)