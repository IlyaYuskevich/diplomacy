#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { initAllPhaseJobs } from "./crons/calc-results.ts";
import config from "./fresh.config.ts";

await initAllPhaseJobs();
await dev(import.meta.url, "./main.ts", config);
