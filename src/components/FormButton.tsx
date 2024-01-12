import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function FormButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`flex-grow inline-block cursor-pointer px-4 py-2 rounded disabled:(opacity-50 cursor-not-allowed) bg-slate-600 bg-slate-600y text-white hover:bg-slate-900 hover:border-slate-900 ${
        props.class ?? ""
      }`}
    />
  );
}
