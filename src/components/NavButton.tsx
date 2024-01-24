import { JSX } from "preact";
import { Button } from "components/index.ts";

export function NavButton(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Button
      {...props}
      class="rounded border-2 border-white text-white hover:bg-slate-400 hover:border-slate-400"
    />
  );
}
