import Color from "color";
import { MoveType } from "types/moves.ts";
import { Country, CountryColors } from "types/country.ts";
import { ProvinceCode, UNIT_LOC_MAP } from "types/provinces.ts";

export function drawLink(
  drawer: any,
  origin: ProvinceCode,
  to: ProvinceCode | null,
  from: ProvinceCode | null,
  type: MoveType,
  country: NonNullable<Country>,
) {
  if (!drawer || !to) return;
  const arrowColor = Color(CountryColors[country]).darken(.5).alpha(0.8)
    .toString();
  // deno-lint-ignore no-explicit-any
  const arrowHead = drawer.marker(2, 2, function (add: any) {
    add.path("M 0 0 L 2 1 L 0 2 z");
  });
  const start = UNIT_LOC_MAP[origin];
  const end = UNIT_LOC_MAP[to];

  const bezier = calcBezierShape(start, end);

  const path = drawer.path(
    `M ${start.X} ${start.Y} C ${start.X + bezier[0]} ${start.Y + bezier[1]}, ${
      end.X + bezier[2]
    } ${end.Y + bezier[3]}, ${end.X} ${end.Y}`,
  )
    .stroke({ width: 10, color: arrowColor }).fill("none").attr({
      "stroke-linecap": "round",
    });
  path.marker("end", arrowHead.fill(arrowColor));
  path.css({ "filter": "drop-shadow(0px 0px 2px white" });
  if (type == "SUPPORT") {
    path.attr({ "stroke-dasharray": "3,13" });
  }
}

function calcBezierShape(
  start: { X: number; Y: number },
  end: { X: number; Y: number },
) {
  if ((start.X > end.X) && (start.Y > end.Y)) {
    return [-30, 30, 30, 30];
  }
  if ((start.X < end.X) && (start.Y > end.Y)) {
    return [-30, -30, -30, -30];
  }
  if ((start.X < end.X) && (start.Y < end.Y)) {
    return [30, -30, 30, -30];
  }
  return [-30, 30, 30, 30];
}
