import { PageProps } from "$fresh/server.ts";
import { Layout } from "components/Layout.tsx";

export default function Home(props: PageProps) {
  return (
    <Layout>
      <div class="text-center">
        <p>
          We sent an email to <b>{props.url.searchParams.get("email")}</b>
        </p>
        <p class="text-2xl">
          Check your inbox for an email from <b>noreply@mail.app.supabase.io</b>
        </p>
        <i class="fa fa-envelope" style="font-size:48px;color:red"></i>
        <p>Do not forget to check a spam folder</p>
      </div>
    </Layout>
  );
}
