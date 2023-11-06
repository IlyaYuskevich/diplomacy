import { MiddlewareHandlerContext, Status } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "std/http/cookie.ts";
import { supabase } from "lib/supabase.ts";
import { User } from "@supabase";
import { ISupaSettings } from "types/supaSettings.ts";
import { SUPABASE_KEY, SUPABASE_URL } from "lib/environment.ts";

export type ServerState = {
  user: User | null;
  supaMetadata?: ISupaSettings;
  error: { code: number; msg: string } | null;
};

export async function authMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<ServerState>,
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
  ctx: MiddlewareHandlerContext<ServerState>,
) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }
  const cookies = getCookies(req.headers);
  let access_token = cookies.auth;
  let refresh_token = cookies.refresh;
  const url = new URL(req.url);
  const headers = new Headers();

  if (!access_token && refresh_token) {
    const resp = await supabase.auth.refreshSession({refresh_token})
    if (resp.error) {
      console.error(resp.error.message)
      deleteCookie(headers, "refresh", { path: "/", domain: url.hostname });
      headers.set("location", '/');
      return new Response(null, { headers, status: Status.SeeOther });
    }
    access_token = resp.data.session!.access_token
    refresh_token = resp.data.session!.refresh_token
    
    setCookie(headers, {
      name: "auth",
      value: access_token,
      maxAge: resp.data.session!.expires_in,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    setCookie(headers, {
      name: "refresh",
      value: refresh_token,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });
    headers.set("location", url.pathname);
    return new Response(null, { headers, status: Status.SeeOther });
  }

  if (!access_token) {
    headers.set("location", `/auth/sign-in?redirectUrl=${url.pathname}`);
    return new Response(null, { headers, status: Status.SeeOther });
  }

  ctx.state.supaMetadata = {
    accessToken: access_token,
    refreshToken: refresh_token,
    url: SUPABASE_URL,
    apiKey: SUPABASE_KEY,
  }

  return await ctx.next();
}
