import { authMiddleware } from "middlewares/auth-middleware.ts";

export const handler = [
  authMiddleware
];
