"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      router.push("/"); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white text-blue-500 px-6 py-3 rounded-md text-lg font-semibold transition duration-300 hover:bg-blue-500 hover:text-white"
    >
      Logout
    </button>
  );
}
