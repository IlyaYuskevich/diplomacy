import { Status, MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { supabase } from "lib/supabase.ts";

type User = {
  id: number;
  email: string;
  access_token: string;
};

export type ServerState = {
  user: User | null;
  error: { code: number; msg: string } | null;
};

export async function authMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  if (ctx.destination !== "route") {
    return ctx.next()
  }
  const cookies = getCookies(req.headers);
  const access_token = cookies.auth;

  const headers = new Headers();
  headers.set("location", "/auth/sign-in");

  // if (!access_token) {
  //   // Can't use 403 if we want to redirect to home page.
  //   return new Response(null, { headers, status: Status.SeeOther });
  // }

  if (access_token) {
    // TODO: introduce redis caching here at some point
    const user_data = await supabase.auth.getUser(access_token);
    console.log('User data', user_data)

    if (!user_data) {
      headers.set("location", "/auth/sign-in");
      return new Response(null, { headers, status: Status.SeeOther });
    }

    ctx.state.user = user_data;
  }

  return await ctx.next();
}
