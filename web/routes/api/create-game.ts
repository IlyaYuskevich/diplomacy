
import { Handlers, Status } from "$fresh/server.ts";
import { currentGame } from "types/games.ts";
import { ServerState } from "middlewares/auth-middleware.ts";

const BACKEND_URL = Deno.env.get("BACKEND_URL");

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await fetch(`${BACKEND_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": (ctx.state as ServerState).user!.id,
        },
        body: JSON.stringify({}),
      });

    const jsonData = await response.json();
    currentGame.value = jsonData;

    const headers = new Headers(req.headers);

    headers.set("location", `/game/${currentGame.value!.id}`);

    return new Response(null, { status: Status.Found, headers });
  },
}