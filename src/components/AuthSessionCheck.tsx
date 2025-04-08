"use client";
import { useEffect } from "react";
import { createClient } from "@/supabase/client";

export default function AuthSessionCheck() {
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      console.log("🟣 Session from layout.tsx:", data.session);
    };

    checkSession();
  }, []);

  return null;
}
