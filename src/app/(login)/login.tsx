"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      window.location.href = "/companies"; // Redirect after login
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 ">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        {success ? (
          <div className="text-green-600 text-center">✅ Logged in successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        <p className="text-sm text-center text-gray-500">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <Link href={mode === "signin" ? "/sign-up" : "/sign-in"} className="text-blue-600 hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
