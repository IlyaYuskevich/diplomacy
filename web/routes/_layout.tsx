import { LayoutProps } from "$fresh/server.ts";
import { Head, asset } from "$fresh/runtime.ts";
import { NavLink } from "components/NavLink.tsx";
import { NavButton } from "components/NavButton.tsx";

export default function Layout({ Component, state }: LayoutProps) {
    const buttProps = state?.user
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
                    src={asset("/logo-inverted.svg")}
                    class="w-8 h-8"
                    alt=""
                  />
                  <h1 class="ml-2 text-white">Diplomacy</h1>
                </div>
              </a>
    
              <div class="flex flex-grow border-gray pt-1">
                <div class="flex flex-grow">
                <NavLink href="/my-games">Games</NavLink>
                </div>
                <div class="flex sm:flex-shrink-0">
                  {!state?.user && <NavLink href="/auth/sign-up">Create account</NavLink>}
                  <NavButton href={buttProps.href}>{buttProps.text}</NavButton>
                </div>
              </div>
            </nav>
          </div>
    
          <div class="mx-auto max-w-screen-md p-4">
            <Component/>
          </div>
        </>
      );
    }