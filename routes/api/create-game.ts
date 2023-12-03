
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient, superSupa } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import {addHours, formatISO} from "date-fns";

export const handler: Handlers<unknown, ServerState> = {
  async GET(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }

    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query1 = supa.from("games").insert({}).select().single();
    const resp1: DbResult<typeof query1> = await query1;
    if (resp1.error) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }
    const query2 = superSupa.from("phases").insert({game: resp1.data!.id, ends_at: formatISO(addHours(Date.now(), 24), {})}).select('id').single();
    const resp2: DbResult<typeof query2> = await query2;
    if (resp2.error) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }
    const query3 = superSupa.from("games").update({phase: resp2.data.id}).eq('id', resp1.data!.id);
    const resp3: DbResult<typeof query3> = await query3;
    if (resp3.error) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    const headers = new Headers(req.headers);

    headers.set("location", `/game/${resp1.data!.id}`);

    return new Response(null, { status: STATUS_CODE.Found, headers });
  },
}