import { fleetToArmyBorder, ProvinceCode } from "types/provinces.ts";
import { Game } from "types/game.ts";
import { Country, COUNTRY_ARRAY } from "types/country.ts";
import { Move } from "types/moves.ts";
import { isActiveMove, MoveIntention } from "types/intention.ts";
import { getCountry, PlayerGame } from "types/playerGames.ts";
import {
  Dislodgement,
  GamePosition,
  SUPPLY_CENTERS,
} from "types/gamePosition.ts";
import { provinces } from "types/provinces.ts";
import { ProvinceType } from "types/provinces.ts";

const occupyProvince = (
  occupant: NonNullable<Country>,
  province: ProvinceCode,
  game: Game,
) => {
  /* Change country owning the giving province */
  const provinceMapped = fleetToArmyBorder(province);
  Object.keys(game.game_position.domains).forEach((country) => {
    const domains = game.game_position.domains[country as NonNullable<Country>];
    const index = domains.indexOf(provinceMapped);
    index != -1 ? domains.splice(index, 1) : null;
  });
  game.game_position.domains[occupant].push(provinceMapped);
};

const moveUnit = (
  country: NonNullable<Country>,
  prevProvince: ProvinceCode,
  nextProvince: ProvinceCode,
  game: Game,
) => {
  /* Change unit position */
  const unit = game.game_position.unitPositions[country].find((unit) =>
    unit.province == prevProvince
  );
  unit ? unit.province = nextProvince : null;
};

const disbandUnit = (
  gamePosition: GamePosition,
  country: NonNullable<Country>,
  province: ProvinceCode,
  move?: Move,
) => {
  /* Disband unit */
  const unitIndex = gamePosition.unitPositions[country].findIndex((unit) =>
    unit.province == province
  )!;
  const unit = gamePosition.unitPositions[country].splice(unitIndex, 1).at(0)!;
  gamePosition.disbanded = gamePosition.disbanded || {
    AUSTRIA: [],
    ENGLAND: [],
    FRANCE: [],
    GERMANY: [],
    ITALY: [],
    RUSSIA: [],
    TURKEY: [],
  };
  gamePosition.disbanded[country] = [...gamePosition.disbanded[country], unit];
  if (move) move.status = "FAILED";
};

const buildUnit = (
  gamePosition: GamePosition,
  country: NonNullable<Country>,
  move: Move,
) => {
  /* Build unit */
  const unit = { province: move.to, unitType: move.unit_type };
  gamePosition.built = gamePosition.built || {
    AUSTRIA: [],
    ENGLAND: [],
    FRANCE: [],
    GERMANY: [],
    ITALY: [],
    RUSSIA: [],
    TURKEY: [],
  };
  gamePosition.built[country] = [...gamePosition.built[country], unit];
  gamePosition.unitPositions[country] = [
    ...gamePosition.unitPositions[country],
    unit,
  ];
};

const addDislodgement = (
  country: NonNullable<Country>,
  dislodgement: Dislodgement,
  game: Game,
) => {
  /* Add dislodgement  */
  game.game_position.dislodged = game.game_position.dislodged || {
    AUSTRIA: [],
    ENGLAND: [],
    FRANCE: [],
    GERMANY: [],
    ITALY: [],
    RUSSIA: [],
    TURKEY: [],
  };
  game.game_position.dislodged[country] = [
    ...new Set([...game.game_position.dislodged[country], dislodgement]),
  ];
};

const addStandoff = (
  province: ProvinceCode,
  game: Game,
) => {
  /* Add standoff  */
  game.game_position.standoffs = game.game_position.standoffs || [];
  game.game_position.standoffs = [
    ...new Set([...game.game_position.standoffs, province]),
  ];
};

const markFailedMoves = (moves: Move[]) => (intention: MoveIntention): Move => {
  const move = moves.find((mv) => mv.id == intention.move.id)!;
  move.status = (intention.dislodged || intention.bounced || intention.cut)
    ? "FAILED"
    : "SUCCEED";
  return move;
};

export function calcNextPositionDiplomatic(
  intentions: MoveIntention[],
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
): [Move[], Game] {
  /* Calculates next game position: moves, standoffs and dislodgements */
  intentions.map(markFailedMoves(moves))
    .forEach((mv) => {
      const intention = intentions.find((i) => i.move.id == mv.id)!;
      const country = getCountry(mv.player_game, playerGames)!;
      intention?.dislodged &&
        addDislodgement(country, {
          province: mv.origin!,
          dislodgedFrom: intention.dislodgedFrom!,
        }, game);
      if (!isActiveMove(intention)) return;
      // mv.status == "SUCCEED" && mv.type !== "HOLD" &&
      //   occupyProvince(country, mv.to, game);
      mv.status == "SUCCEED" && mv.type !== "HOLD" &&
        moveUnit(country, mv.origin!, mv.to, game);
      intention?.standoffIn && addStandoff(intention.standoffIn, game);
    });

  return [moves, game];
}

export function calcNextPositionDisbandAndRetreat(
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
): [Move[], Game] {
  /* Calculates next game position; finds auto disbands. */
  moves.forEach((mv) => {
    const country = getCountry(mv.player_game, playerGames)!;
    moveUnit(country, mv.origin!, mv.to, game);
  });
  moves
    .filter((mv) =>
      moves.some((m) =>
        fleetToArmyBorder(m.to) == fleetToArmyBorder(mv.to) && mv.id != m.id
      )
    )
    .forEach((mv) => {
      const country = getCountry(mv.player_game, playerGames)!;
      disbandUnit(game.game_position, country, mv.to, mv);
    });

  COUNTRY_ARRAY.forEach((country) =>
    game.game_position.dislodged &&
    game.game_position.dislodged[country].map((dislodge) => dislodge.province)
      .filter((province) => !moves.find((mv) => mv.origin == province))
      .forEach(
        (province) => disbandUnit(game.game_position, country, province),
      )
  );
  // occupy provinces
  COUNTRY_ARRAY.forEach((country) =>
    game.game_position.unitPositions[country].map((unit) => unit.province)
      .filter((province) => provinces[province].type !== ProvinceType.Sea)
      .forEach(
        (province) => occupyProvince(country, province, game),
      )
  );
  if (winnerCountry(game)) {
    game.status = "FINISHED";
  }
  return [moves, game];
}

export function winnerCountry(game: Game) {
  return COUNTRY_ARRAY.map((country) => {
    const supplyCentersNum = game.game_position.domains[country].filter(
      (provinceCode) => Object.keys(SUPPLY_CENTERS).includes(provinceCode)
    ).reduce((a, _) => a + 1, 0);
    if (supplyCentersNum >= 18) {
      return country;
    }
    return null;
  }).filter((x) => !!x).at(0) || null;
}

export function calcNextPositionGainingAndLosing(
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
): [Move[], Game] {
  /* Calculates next game position, adds builds and disbands. */
  moves.filter((mv) => mv.type == "BUILD").forEach((mv) => {
    const country = getCountry(mv.player_game, playerGames)!;
    buildUnit(game.game_position, country, mv);
  });
  moves.filter((mv) => mv.type == "DISBAND").forEach((mv) => {
    const country = getCountry(mv.player_game, playerGames)!;
    disbandUnit(game.game_position, country, mv.to);
  });
  return [moves, game];
}
