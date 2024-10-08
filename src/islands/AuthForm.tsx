import { FormButton, Input, Link } from "components/index.ts";

type Props = {
  mode: "In" | "Up";
  redirectUrl: string | null;
};

export default function AuthForm({ mode, redirectUrl }: Props) {
  const signIn = {
    title: "Sign In",
    href: "/sign-in",
    text: "Have an account?",
  };

  const signUp = {
    title: "Create account",
    href: "/sign-up",
    text: "No account?",
  };

  const buttProps = mode == "In" ? signIn : signUp;
  const footProps = mode == "In" ? signUp : signIn;

  return (
    <div class="items-stretch min-w-0">
      <div class="flex justify-center">
        <h2 class="my-4">{buttProps.title}</h2>
      </div>

      <form method="post" class="flex flex-col space-y-4 min-w-0">
        <Input autofocus type="email" name="email" />
        <Input type="password" name="password" />
        <input type="hidden" name="redirectUrl" value={redirectUrl || '/'} />
        <FormButton
          type="submit"
          formAction={"/api-auth" + buttProps.href}
          class="!mt-8"
        >
          {buttProps.title}
        </FormButton>

        <p>
          {footProps.text}{" "}
          <Link href={"/auth" + footProps.href}>{footProps.title}</Link>
        </p>
      </form>
    </div>
  );
}
