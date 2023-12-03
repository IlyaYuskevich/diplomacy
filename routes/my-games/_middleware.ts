import { protectedRouteMiddleware } from "middlewares/auth-middleware.ts";

export const handler = [
  protectedRouteMiddleware
];
