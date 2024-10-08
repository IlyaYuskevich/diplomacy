// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_auth_sign_in from "./routes/api-auth/sign-in.ts";
import * as $api_auth_sign_out from "./routes/api-auth/sign-out.ts";
import * as $api_auth_sign_up from "./routes/api-auth/sign-up.tsx";
import * as $api_middleware from "./routes/api/_middleware.ts";
import * as $api_create_game from "./routes/api/create-game.ts";
import * as $api_create_moves from "./routes/api/create-moves.ts";
import * as $api_submitted_move_id_ from "./routes/api/submitted-move/[id].ts";
import * as $auth_confirm_email from "./routes/auth/confirm-email.tsx";
import * as $auth_sign_in from "./routes/auth/sign-in.tsx";
import * as $auth_sign_up from "./routes/auth/sign-up.tsx";
import * as $game_gameId_ from "./routes/game/[gameId].tsx";
import * as $game_middleware from "./routes/game/_middleware.ts";
import * as $index from "./routes/index.tsx";
import * as $my_games_middleware from "./routes/my-games/_middleware.ts";
import * as $my_games_index from "./routes/my-games/index.tsx";
import * as $AuthForm from "./islands/AuthForm.tsx";
import * as $GamePreparationView from "./islands/GamePreparationView.tsx";
import * as $GameView from "./islands/GameView.tsx";
import * as $PlayerGames from "./islands/PlayerGames.tsx";
import * as $WorldMap from "./islands/WorldMap.tsx";
import * as $moveBuilders_AdjacentProvinceSelector from "./islands/moveBuilders/AdjacentProvinceSelector.tsx";
import * as $moveBuilders_CoastialProvinceSelector from "./islands/moveBuilders/CoastialProvinceSelector.tsx";
import * as $moveBuilders_Controls from "./islands/moveBuilders/Controls.tsx";
import * as $moveBuilders_ConvoyTheUnit from "./islands/moveBuilders/ConvoyTheUnit.tsx";
import * as $moveBuilders_CountrySelector from "./islands/moveBuilders/CountrySelector.tsx";
import * as $moveBuilders_DiplomaticMoveBuilder from "./islands/moveBuilders/DiplomaticMoveBuilder.tsx";
import * as $moveBuilders_GainingAndLoosingBuilder from "./islands/moveBuilders/GainingAndLoosingBuilder.tsx";
import * as $moveBuilders_MoveTheUnit from "./islands/moveBuilders/MoveTheUnit.tsx";
import * as $moveBuilders_MoveTypeSelector from "./islands/moveBuilders/MoveTypeSelector.tsx";
import * as $moveBuilders_MovesRenderer from "./islands/moveBuilders/MovesRenderer.tsx";
import * as $moveBuilders_PreviousMovesRenderer from "./islands/moveBuilders/PreviousMovesRenderer.tsx";
import * as $moveBuilders_RetreatAndDisbandingMoveBuilder from "./islands/moveBuilders/RetreatAndDisbandingMoveBuilder.tsx";
import * as $moveBuilders_RetreatProvinceSelector from "./islands/moveBuilders/RetreatProvinceSelector.tsx";
import * as $moveBuilders_SubmittedMoveRenderer from "./islands/moveBuilders/SubmittedMoveRenderer.tsx";
import * as $moveBuilders_SupplyCentersSelector from "./islands/moveBuilders/SupplyCentersSelector.tsx";
import * as $moveBuilders_SupportTheUnit from "./islands/moveBuilders/SupportTheUnit.tsx";
import * as $moveBuilders_UnitSelector from "./islands/moveBuilders/UnitSelector.tsx";
import * as $moveBuilders_UnitTypeSelector from "./islands/moveBuilders/UnitTypeSelector.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api-auth/sign-in.ts": $api_auth_sign_in,
    "./routes/api-auth/sign-out.ts": $api_auth_sign_out,
    "./routes/api-auth/sign-up.tsx": $api_auth_sign_up,
    "./routes/api/_middleware.ts": $api_middleware,
    "./routes/api/create-game.ts": $api_create_game,
    "./routes/api/create-moves.ts": $api_create_moves,
    "./routes/api/submitted-move/[id].ts": $api_submitted_move_id_,
    "./routes/auth/confirm-email.tsx": $auth_confirm_email,
    "./routes/auth/sign-in.tsx": $auth_sign_in,
    "./routes/auth/sign-up.tsx": $auth_sign_up,
    "./routes/game/[gameId].tsx": $game_gameId_,
    "./routes/game/_middleware.ts": $game_middleware,
    "./routes/index.tsx": $index,
    "./routes/my-games/_middleware.ts": $my_games_middleware,
    "./routes/my-games/index.tsx": $my_games_index,
  },
  islands: {
    "./islands/AuthForm.tsx": $AuthForm,
    "./islands/GamePreparationView.tsx": $GamePreparationView,
    "./islands/GameView.tsx": $GameView,
    "./islands/PlayerGames.tsx": $PlayerGames,
    "./islands/WorldMap.tsx": $WorldMap,
    "./islands/moveBuilders/AdjacentProvinceSelector.tsx":
      $moveBuilders_AdjacentProvinceSelector,
    "./islands/moveBuilders/CoastialProvinceSelector.tsx":
      $moveBuilders_CoastialProvinceSelector,
    "./islands/moveBuilders/Controls.tsx": $moveBuilders_Controls,
    "./islands/moveBuilders/ConvoyTheUnit.tsx": $moveBuilders_ConvoyTheUnit,
    "./islands/moveBuilders/CountrySelector.tsx": $moveBuilders_CountrySelector,
    "./islands/moveBuilders/DiplomaticMoveBuilder.tsx":
      $moveBuilders_DiplomaticMoveBuilder,
    "./islands/moveBuilders/GainingAndLoosingBuilder.tsx":
      $moveBuilders_GainingAndLoosingBuilder,
    "./islands/moveBuilders/MoveTheUnit.tsx": $moveBuilders_MoveTheUnit,
    "./islands/moveBuilders/MoveTypeSelector.tsx":
      $moveBuilders_MoveTypeSelector,
    "./islands/moveBuilders/MovesRenderer.tsx": $moveBuilders_MovesRenderer,
    "./islands/moveBuilders/PreviousMovesRenderer.tsx":
      $moveBuilders_PreviousMovesRenderer,
    "./islands/moveBuilders/RetreatAndDisbandingMoveBuilder.tsx":
      $moveBuilders_RetreatAndDisbandingMoveBuilder,
    "./islands/moveBuilders/RetreatProvinceSelector.tsx":
      $moveBuilders_RetreatProvinceSelector,
    "./islands/moveBuilders/SubmittedMoveRenderer.tsx":
      $moveBuilders_SubmittedMoveRenderer,
    "./islands/moveBuilders/SupplyCentersSelector.tsx":
      $moveBuilders_SupplyCentersSelector,
    "./islands/moveBuilders/SupportTheUnit.tsx": $moveBuilders_SupportTheUnit,
    "./islands/moveBuilders/UnitSelector.tsx": $moveBuilders_UnitSelector,
    "./islands/moveBuilders/UnitTypeSelector.tsx":
      $moveBuilders_UnitTypeSelector,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
