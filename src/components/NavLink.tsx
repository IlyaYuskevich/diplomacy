import { JSX } from "preact";
import { Link } from "components/index.ts";

export function NavLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      {...props}
      class="text-white px-4"
    />
  );
}
