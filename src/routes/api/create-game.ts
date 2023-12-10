import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { superSupa } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { START_POSITION } from "types/gamePosition.ts";

export const handler: Handlers<unknown, ServerState> = {
  async GET(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }

    const query1 = superSupa.from("games").insert({game_position: START_POSITION}).select().single();
    const resp1: DbResult<typeof query1> = await query1;
    if (resp1.error) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    const headers = new Headers(req.headers);

    headers.set("location", `/game/${resp1.data!.id}`);

    return new Response(null, { status: STATUS_CODE.Found, headers });
  },
};
