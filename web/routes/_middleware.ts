import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

export const handler = [
  async function authMiddleware(
    req: Request,
    ctx: MiddlewareHandlerContext,
  ) {
    const resp = await ctx.next();
    // const url = new URL(req.url);
    // const cookies = getCookies(req.headers);
    // const auth = cookies.auth == "superzitrone";
    return resp
  },
];
