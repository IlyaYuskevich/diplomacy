import { MiddlewareHandlerContext, Status } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { supabase } from "lib/supabase.ts";

type User = {
  id: string;
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
    return ctx.next();
  }
  const cookies = getCookies(req.headers);
  const access_token = cookies.auth;

  const headers = new Headers();
  headers.set("location", "/auth/sign-in");

  if (access_token) {
    // TODO: introduce redis caching here at some point
    const user_data = await supabase.auth.getUser(access_token);

    if (!user_data) {
      headers.set("location", "/auth/sign-in");
      return new Response(null, { headers, status: Status.SeeOther });
    }

    if (user_data.error) {
      return new Response(user_data.error.message, {
        headers,
        status: Status.InternalServerError,
      });
    }

    ctx.state.user = user_data.data.user;
  }

  return await ctx.next();
}

export async function protectedRouteMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }
  const cookies = getCookies(req.headers);
  const access_token = cookies.auth;
  const url = new URL(req.url);

  if (!access_token) {
    const headers = new Headers();
    headers.set("location", `/auth/sign-in?redirectUrl=${url.pathname}`);
    return new Response(null, { headers, status: Status.SeeOther });
  }

  return await ctx.next();
}
