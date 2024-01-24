import { Handlers, PageProps } from "$fresh/server.ts";

import { asset } from "$fresh/runtime.ts";
import AuthForm from "islands/AuthForm.tsx";
import { ServerState } from "middlewares/auth-middleware.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const url = new URL(_req.url);
    const redirectUrl = url.searchParams.get("redirectUrl");
    return ctx.render({ state: ctx.state, redirectUrl: redirectUrl });
  },
};

export default function Page(
  props: PageProps<{ state: ServerState; redirectUrl: string | null }>,
) {
  return (
    <>
      <div class="flex justify-center">
        <div class="flex flex-col items-stretch w-[500px] md:w-2/3">
          <div class="flex justify-center">
            <img
              src={asset("/logo.svg")}
              class="w-16 h-16 mt-8 mb-4"
              alt="the fresh logo: a sliced lemon dripping with juice"
            />
          </div>
          <AuthForm mode="In" redirectUrl={props.data.redirectUrl} />
        </div>
      </div>
    </>
  );
}
