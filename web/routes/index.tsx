import { asset, Head } from "$fresh/runtime.ts";
import { Layout } from "components/Layout.tsx";

export default function Home() {
  const isAllowed = false;
  return (
    <Layout isAllowed={isAllowed}>
      <Head>
        <title>Diplomacy</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      {/* {!auth.value ? <SignInForm /> : <a href="/api/sign-out">Sign Out</a>} */}
    </Layout>
  );
}
