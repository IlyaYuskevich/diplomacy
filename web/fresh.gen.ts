// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[gameId].tsx";
import * as $1 from "./routes/index.tsx";
import * as $$0 from "./islands/Controls.tsx";
import * as $$1 from "./islands/CountrySelector.tsx";
import * as $$2 from "./islands/PlayerGames.tsx";
import * as $$3 from "./islands/PossibleMoves.tsx";
import * as $$4 from "./islands/UnitSelector.tsx";
import * as $$5 from "./islands/WorldMap.tsx";

const manifest = {
  routes: {
    "./routes/[gameId].tsx": $0,
    "./routes/index.tsx": $1,
  },
  islands: {
    "./islands/Controls.tsx": $$0,
    "./islands/CountrySelector.tsx": $$1,
    "./islands/PlayerGames.tsx": $$2,
    "./islands/PossibleMoves.tsx": $$3,
    "./islands/UnitSelector.tsx": $$4,
    "./islands/WorldMap.tsx": $$5,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
