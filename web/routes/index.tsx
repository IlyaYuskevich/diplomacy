import { asset, Head } from "$fresh/runtime.ts";
import { Layout } from "components/Layout.tsx";
import { PageProps, Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import SignInForm from "islands/SignInForm.tsx";

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
      {!isAllowed ? <SignInForm /> : <a method='post' href="/api/sign-out">Sign Out</a>}
    </Layout>
  );
}
