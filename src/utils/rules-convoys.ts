import { GamePosition } from "types/gamePosition.ts";
import { ProvinceCode } from "types/provinces.ts";
import { COUNTRY_ARRAY } from "types/country.ts";
import { isArmyInCoast, isFleetInSea, Unit } from "types/units.ts";
import { fleetBorders } from "types/provinces.ts";
import { isCoast } from "types/provinces.ts";
import { fleetToArmyBorder } from "types/provinces.ts";
import { armyToFleetBorder } from "types/provinces.ts";

export type Convoy = {
  chain: ProvinceCode[];
};

export const findAllConvoys = (gamePosition: GamePosition) => {
  const possibleConvoyers = COUNTRY_ARRAY.flatMap((country) =>
    gamePosition.unitPositions[country]
  ).filter(isFleetInSea);
  const possibleConvoyees = COUNTRY_ARRAY.flatMap((country) =>
    gamePosition.unitPositions[country]
  ).filter(isArmyInCoast);
  const convoys = possibleConvoyees.flatMap((unit) =>
    findNextChainEl(possibleConvoyers, {
      chain: [unit.province],
    }, [])
  );
  return convoys
    .filter((conv, i) =>
      !convoys.some((conv2, j) => conv.chain.join("") === conv2.chain.join("") && j > i)
    );
};

const findNextChainEl = (
  fleets: Unit[],
  currentConvoy: Convoy,
  convoys: Convoy[],
): Convoy[] => { // builds recursive chain of convoys while not reached destination (move.to)
  const borders = armyToFleetBorder(currentConvoy.chain.at(-1)!).flatMap(
    (prov) => fleetBorders[prov]!,
  );
  const endChains = borders.filter(isCoast).map(fleetToArmyBorder);
  const convoysRes = convoys.concat(
    endChains.map(
      (prov) => ({ chain: [...currentConvoy.chain, prov] } satisfies Convoy),
    )
      .filter((conv) => conv.chain.length > 2)
      .filter((conv) => conv.chain.at(0) !== conv.chain.at(-1)),
  );
  const nextConvoyers = borders.filter((prov) =>
    fleets.map((u) => u.province).includes(prov)
  ).filter((prov) => !currentConvoy.chain.includes(prov));
  const convoysNext = convoysRes.concat(
    nextConvoyers.flatMap((prov) =>
      findNextChainEl(
        fleets,
        { chain: [...currentConvoy.chain, prov] },
        convoysRes,
      )
    ),
  );
  return convoysNext;
};
