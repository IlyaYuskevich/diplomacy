import { PageProps } from "$fresh/server.ts";
import SignInForm from "islands/SignInForm.tsx";

export default function Login(props: PageProps) {
  return (
    <>
      <div>You are on the login page '{props.url.href}'.</div>
      <SignInForm />
    </>
  );
}
