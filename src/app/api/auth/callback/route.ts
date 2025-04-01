// src/app/api/auth/callback/route.ts
import { createClient } from "@/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.redirect(new URL("/companies", request.url));
}
