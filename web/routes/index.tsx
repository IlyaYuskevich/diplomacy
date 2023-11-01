import { asset, Head } from "$fresh/runtime.ts";
import { Layout } from "components/index.ts";
import { PageProps, Handlers, Status } from "$fresh/server.ts";
import { ServerState } from "../middlewares/auth-middleware.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    if (!ctx.state.user) {
      // redirect to sign in page if not authentified
      const headers = new Headers();
      headers.set("location", "/auth/sign-in");
      return new Response(null, {status: Status.SeeOther, headers})
    }
    return ctx.render(ctx.state);
  }
}

export default function Home(props: PageProps<ServerState> ) {

  return (
    <Layout state={props.data}>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
        <link href={asset("logo.svg")} />
      </Head>
    </Layout>
  );
}
