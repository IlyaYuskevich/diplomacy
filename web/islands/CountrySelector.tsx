import { Country, selectedCountry } from "../types/country.ts";
import { selectedUnit } from "../types/units.ts";

export default function CountrySelector() {

  function selectCountry(country: Country) {
    selectedCountry.value = country
    selectedUnit.value = null
  }

  return (
    <div>
      <h4>Select country:</h4>
      {Object.keys(Country).map((key) =>
        <button onClick={() => selectCountry(Country[key as keyof typeof Country])}>
          {key}
        </button>
      )}
    </div>
  );
}