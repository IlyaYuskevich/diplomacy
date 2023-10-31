import { asset, Head } from "$fresh/runtime.ts";
import { Layout, Link } from "components/index.ts";
import { PageProps, Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

export type Data = {
  isAllowed: boolean;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return ctx.render({ isAllowed: cookies.auth == "superzitrone" });
  }
}

export default function Home({data: {isAllowed}}: PageProps<Data> ) {
  return (
    <Layout isAllowed={isAllowed}>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      {!isAllowed ? <Link href="/sign-in" >Sign In</Link> :  <Link href="/api/sign-out">Sign Out</Link>}
    </Layout>
  );
}
