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
        const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error != null || user == null || session == null) {
        // TODO: Add some actual error handling. Differentiate between 500 & 403.
        if (isAuthApiError(error)) {
            return new Response(error.message, { status: error.status });
        }
        return new Response(null, { status: Status.InternalServerError });
        }

        const headers = new Headers();
        headers.set("location", "/");

        setCookie(headers, {
        name: "auth",
        value: "superzitrone",
        maxAge: 3600,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
        });

        return new Response(null, { status: Status.SeeOther, headers });

    }
}