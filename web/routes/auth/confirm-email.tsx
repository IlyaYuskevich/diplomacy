import { PageProps } from "$fresh/server.ts";
import { Layout } from "components/Layout.tsx";
  
export default function Home(props: PageProps) {
  
    return (
      <Layout>
        <h6>We sent an email to <b>{props.url.searchParams.get("email")}</b></h6>
        <h4>Check your inbox for an email from <b>noreply@mail.app.supabase.io</b></h4>
        <h4>Do not forget to check a spam folder</h4>
      </Layout>
    );
  }