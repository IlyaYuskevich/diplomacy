import { ProvinceCode } from "types/provinces.ts";
import { Game } from "types/game.ts";
import { Country } from "types/country.ts";
import { Move } from "types/moves.ts";
import { isActiveMove, MoveIntention } from "types/intention.ts";
import { PlayerGame } from "types/playerGames.ts";

const occupyProvince = (
  occupant: NonNullable<Country>,
  province: ProvinceCode,
  game: Game,
) => {
  /* Change country owning the giving province */
  Object.keys(game.game_position.domains).forEach((country) => {
    const domains = game.game_position.domains[country as NonNullable<Country>];
    const index = domains.indexOf(province);
    index != -1 ? domains.splice(index, 1) : null;
  });
  game.game_position.domains[occupant].push(province);
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

const addDislodgement = (
  country: NonNullable<Country>,
  origin: ProvinceCode,
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
    ...new Set([...game.game_position.dislodged[country], origin]),
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

export function calcNextPosition(
  intentions: MoveIntention[],
  moves: Move[],
  game: Game,
  playerGames: PlayerGame[],
): [Move[], Game] {
  /* Calculates next game position: moves, standoffs and dislodgements */
  intentions.map(markFailedMoves(moves))
    .forEach((mv) => {
      const intention = intentions.find((i) => i.move.id == mv.id)!;
      const country = playerGames.find((pg) => pg.id == mv.player_game)!
        .country!;
      intention?.dislodged && addDislodgement(country, mv.origin!, game);
      if (!isActiveMove(intention)) return;
      mv.status == "SUCCEED" && mv.type !== "HOLD" &&
        occupyProvince(country, mv.to, game);
      mv.status == "SUCCEED" && mv.type !== "HOLD" &&
        moveUnit(country, mv.origin!, mv.to, game);
      intention?.standoffIn && addStandoff(intention.standoffIn, game);
    });

  return [moves, game];
}
