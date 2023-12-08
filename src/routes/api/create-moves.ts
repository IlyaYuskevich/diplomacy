
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { SubmittedMoveInsert } from "types/moves.ts";

export const handler: Handlers<unknown, ServerState> = {
  async POST(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }


    const supa = await authSupabaseClient(ctx.state.supaMetadata);
    const payload = await req.json() as SubmittedMoveInsert[]
    if (payload.length == 0) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }
    const query = supa.from("submitted_moves").insert(payload)

    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    const query2 = supa.from("submitted_moves").select().eq("phase", payload.at(0)!.phase)
    const resp2: DbResult<typeof query2> = await query2;

    return new Response(JSON.stringify(resp2.data), { status: STATUS_CODE.OK });
  },
}