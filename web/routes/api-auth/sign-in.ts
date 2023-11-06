import { Handlers, Status } from "$fresh/server.ts";
import { setCookie } from "std/http/cookie.ts";
import { supabase } from "lib/supabase.ts";
import { isAuthApiError } from "@supabase";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();

    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const redirectUrl = String(form.get("redirectUrl"));
    const headers = new Headers();

    const { data: { user, session }, error } = await supabase.auth
      .signInWithPassword({
        email,
        password,
      });

    if (error != null || user == null || session == null) {
      // TODO: Add some actual error handling. Differentiate between 500 & 403.
      if (isAuthApiError(error)) {
        if (error.message == "Email not confirmed") {
          headers.set("location", `/auth/confirm-email?email=${email}`);
          return new Response(null, { status: Status.SeeOther, headers });
        }
        return new Response(error.message, { status: error.status });
      }
      return new Response(null, { status: Status.InternalServerError });
    }

    setCookie(headers, {
      name: "auth",
      value: session.access_token,
      maxAge: session.expires_in,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    setCookie(headers, {
      name: "refresh",
      value: session.refresh_token,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    headers.set("location", redirectUrl);

    return new Response(
      null,
      { status: Status.SeeOther, headers },
    );
  },
};
