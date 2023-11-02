import { Head, asset, assetSrcSet } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { NavLink } from "./NavLink.tsx";
import { NavButton } from "./NavButton.tsx";
import { ServerState } from "../middlewares/auth-middleware.ts";


type Props = {
  children: ComponentChildren;
  state?: ServerState;
};

export function Layout(props: Props) {
  const buttProps = props.state?.user
    ? { href: "/api/sign-out", text: "Sign Out" }
    : { href: "/auth/sign-in", text: "Sign In" };

  return (
    <>
      <Head>
        <title>Diplomacy</title>
        <link rel="icon" type="image/x-icon" href={asset("/logo.svg")}/>
      </Head>

      <div class="bg-primary">
        <nav class="flex items-center justify-between flex-wrap min-h-[80px] max-w-screen-md mx-auto p-4">
          <a href="/">
            <div class="flex flex-shrink-0 border-white">
              <img
                src={asset("/logo.svg")}
                class="w-8 h-8"
                alt="the fresh logo: a sliced lemon dripping with juice"
              />
              <h1 class="ml-2 text-white">Diplomacy</h1>
            </div>
          </a>

          <div class="flex flex-grow border-gray pt-1">
            <div class="flex flex-grow">
            <NavLink href="/my-games">Games</NavLink>
            </div>
            <div class="flex sm:flex-shrink-0">
              {!props.state?.user && <NavLink href="/auth/sign-up">Create account</NavLink>}
              <NavButton href={buttProps.href}>{buttProps.text}</NavButton>
            </div>
          </div>
        </nav>
      </div>

      <div class="mx-auto max-w-screen-md p-4">
        {props.children}
      </div>
    </>
  );
}
