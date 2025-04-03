"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null); 
const [success, setSuccess] = useState(false);           
  const supabase = createClient();

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/api/auth/callback",
      },
    });
    
  
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };
  

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setLoading(false);
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="p-10 flex flex-col justify-between bg-white">
        {/* Top Nav */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold ext-blue-900 ">Marketplace</h1>
          <Link
            href="/companies"
            className="text-blue-600 hover:underline text-sm"
          >
            Browse Companies
          </Link>
        </div>

        {/* Welcome Text */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold mb-4">Sign Up</h2>
          <p className="text-gray-600 mb-8">
            Create a new account using your email or Google.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              onClick={handleMagicLink}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Send Magic Link"}
            </button>

            <div className="relative text-center my-4">
              <span className="text-sm text-gray-400">or</span>
            </div>
            <GoogleSignInButton label="Sign up with Google" />



            <p className="text-sm text-center mt-4 text-gray-500">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block bg-[url('/images/background.jpg')] bg-cover bg-center" />
    </main>
  );
}
