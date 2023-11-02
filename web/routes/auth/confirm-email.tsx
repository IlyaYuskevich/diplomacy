import { PageProps } from "$fresh/server.ts";
import { Layout } from "components/Layout.tsx";

export default function Home(props: PageProps) {
  return (
    <Layout>
      <div class="text-center">
        <p class="text-2xl">
          We sent an email to <b>{props.url.searchParams.get("email")}</b>
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          class="m-auto w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>

        <p>
          Check your inbox for an email from <b>noreply@mail.app.supabase.io</b>
        </p>
        <i class="fa fa-envelope" style="font-size:48px;color:red"></i>
        <p>Do not forget to check a spam folder</p>
      </div>
    </Layout>
  );
}
