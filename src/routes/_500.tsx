import { ErrorPageProps } from "$fresh/server.ts";

export default function Error500Page({ error }: ErrorPageProps) {
  return (
    <div>
      <p class="text-8xl font-black text-center">500</p>
      <p class="text-2xl text-center">Internal server error {(error as Error).message}</p>
    </div>
  );
}
