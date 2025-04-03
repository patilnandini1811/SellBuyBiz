import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookies = await cookieStore;
          return cookies.get(name)?.value;
        },

        set(name: string, value: string, options?: CookieOptions) {
          // On server components, cookies() is read-only
        },
        remove(name: string, options?: CookieOptions) {
        
        },
      },
    }
  );
}
