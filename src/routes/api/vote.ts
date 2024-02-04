import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { DbResult } from "lib/database.types.ts";
import { authSupabaseClient, superSupa } from "lib/supabase.ts";

export type Vote = {
    gameId: string
    ready?: boolean
    wait?: boolean
}

export const handler: Handlers<unknown, ServerState> = {
    async POST(req, ctx) {
      if (!ctx.state.supaMetadata) {
        return ctx.render();
      }
      
      const payload = await req.json() as Vote

      if (payload.ready === undefined && payload.wait === undefined) {
        return new Response(null, { status: STATUS_CODE.BadRequest });
      }

      const supa = await authSupabaseClient(ctx.state.supaMetadata);

      const query = supa.from("votes").update(payload).eq("player", ctx.state.user!.id);

      const resp: DbResult<typeof query> = await query;
      if (resp.error) {
        return new Response(null, { status: STATUS_CODE.BadRequest });
      }
  
      return new Response(null, { status: STATUS_CODE.OK });
    },
  }