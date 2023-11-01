import { asset, Head } from "$fresh/runtime.ts";
import { Layout } from "components/index.ts";
import { PageProps, Handlers } from "$fresh/server.ts";
import { ServerState } from "lib/auth-middleware.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render(ctx.state);
  }
}

export default function Home(props: PageProps<ServerState> ) {
  console.log(props)

  return (
    <Layout state={props.data}>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
    </Layout>
  );
}
