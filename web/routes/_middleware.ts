import { authMiddleware } from "lib/auth-middleware.ts";

export const handler = [
  authMiddleware
];
