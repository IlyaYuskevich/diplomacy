import { Handlers, Status } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const headers = new Headers();
    headers.set("location", "/my-games");

    return new Response(null, {status: Status.SeeOther, headers})
  }
}
