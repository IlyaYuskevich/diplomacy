import { PageProps, Handlers, Status } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const headers = new Headers();
    if (!ctx.state.user) {
      // redirect to sign in page if not authentified
      headers.set("location", "/auth/sign-in");
      return new Response(null, {status: Status.SeeOther, headers})
    } else {
      headers.set("location", "/my-games");
      return new Response(null, {status: Status.SeeOther, headers})
    }
  }
}
