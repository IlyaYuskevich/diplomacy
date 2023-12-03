import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <div>
      <p class="text-8xl font-black text-center">Oooops!</p>
      <p class="text-2xl text-center"><b>404</b> - Not found</p>
      <p class="text-4xl text-center">Page <b>{url.pathname}</b> doesn't exist</p>
    </div>
  );
}
