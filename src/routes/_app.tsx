import { AppProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>web</title>
        <link rel="stylesheet" href={asset("/style.css")} />
        <link rel="stylesheet" href={asset("/tailwind-styles.css")} />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}