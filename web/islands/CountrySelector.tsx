import { selectedCountry, Country } from "types/country.ts";
import { selectedMoveType } from "types/moves.ts";
import { selectedUnit } from "types/units.ts";

export default function CountrySelector() {

  function selectCountry(country: Country) {
    selectedCountry.value = country
    selectedUnit.value = null
    selectedMoveType.value = null
  }

  return (
    <div>
      <h4>Select country:</h4>
      <div class="flex flex-row flex-wrap gap-2">
      {["AUSTRIA", "ENGLAND", "FRANCE", "GERMANY", "ITALY", "RUSSIA", "TURKEY"].map((key) =>
        <button class="bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md text-white" 
          onClick={() => selectCountry(key as NonNullable<Country>)}>
          {key}
        </button>
      )}
    </div>
    </div>
  );
}