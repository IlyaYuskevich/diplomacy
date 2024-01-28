import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { DbResult } from "lib/database.types.ts";
import { authSupabaseClient, superSupa } from "lib/supabase.ts";

export type Vote = {
    voteType: "READY"
}

export const handler: Handlers<unknown, ServerState> = {
    async POST(req, ctx) {
      if (!ctx.state.supaMetadata) {
        return ctx.render();
      }

    //   superSupa.from("phases").update({"votes", })
  
  
    //   const payload = await req.json() as SubmittedMoveInsert[]
    //   if (payload.length == 0) {
    //     return new Response(null, { status: STATUS_CODE.BadRequest });
    //   }
    //   const query = supa.from("submitted_moves").insert(payload)
  
    //   const resp: DbResult<typeof query> = await query;
    //   if (resp.error) {
    //     return new Response(null, { status: STATUS_CODE.BadRequest });
    //   }
  
    //   const query2 = supa.from("submitted_moves").select().eq("phase", payload.at(0)!.phase)
    //   const resp2: DbResult<typeof query2> = await query2;
  
      return new Response(null, { status: STATUS_CODE.OK });
    },
  }