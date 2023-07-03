import { signal } from "@preact/signals";

export enum Country {
	France = "FRANCE",
	Germany = "GERMANY",
	Italy = "ITALY",
	Russia = "RUSSIA",
	Austria = "AUSTRIA",
	England = "ENGLAND",
	Turkey = "TURKEY",
}

export const CountryColors: { [key in Country]: string } = {
	[Country.Austria]: "#C48F85",
	[Country.England]: "#E74C3C",
	[Country.France]: "royalblue",
	[Country.Germany]: "#757D91",
	[Country.Italy]: "#5FD6B4",
	[Country.Russia]: "#5F8C3E",
	[Country.Turkey]: "#DCCA6D"
}

export const selectedCountry = signal<Country | null>(null)