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

export const selectedCountry = signal<Country | null>(null)