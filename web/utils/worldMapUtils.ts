import Color from "https://esm.sh/v127/*color@4.2.3";
import { IUnitLocation } from "../types/units.ts";

export function drawLink(
  unitLocationsMap: Record<string, IUnitLocation>,
  draw: any,
  origin: string,
  destination: string,
  type: "move" | "support",
  color: string,
) {
  const arrowColor = Color(color).darken(.5).toString();
  // deno-lint-ignore no-explicit-any
  const arrowHead = draw.marker(2, 2, function (add: any) {
    add.path("M 0 0 L 2 1 L 0 2 z");
  });
  const start = unitLocationsMap[origin];
  const end = unitLocationsMap[destination];

  const bezier = calcBezierShape(start, end);

  const path = draw.path(
    `M ${start.X} ${start.Y} C ${start.X + bezier[0]} ${start.Y + bezier[1]}, ${
      end.X + bezier[2]
    } ${end.Y + bezier[3]}, ${end.X} ${end.Y}`,
  )
    .stroke({ width: 10, color: arrowColor }).fill("none").attr({
      "stroke-linecap": "round",
    });
  path.marker("end", arrowHead.fill(arrowColor));
  path.css({ "filter": "drop-shadow(0px 0px 2px white" });
  if (type == "support") {
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
