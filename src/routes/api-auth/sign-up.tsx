import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { supabase } from "lib/supabase.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");

    const { data: { user, session }, error } = await supabase.auth.signUp({
      email: String(email),
      password: String(password),
    });

    if (error != null) {
      console.error(error);
      return new Response(error.message, { status: error.status});
    }

    const exists = await supabase.auth.getUser(String(user));
    if (exists?.data.user) {
      return new Response('This email is already registred', { status: STATUS_CODE.BadRequest });
    }

    const headers = new Headers();

    headers.set("location", `/auth/confirm-email?email=${email}`);
    
    return new Response(null, { status: STATUS_CODE.SeeOther, headers });
  },
};