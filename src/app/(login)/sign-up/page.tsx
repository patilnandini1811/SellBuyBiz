"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import companiesData from "@/app/companies/companyList.json";
import { AuthApiError } from "@supabase/supabase-js";

interface Company {
  id: string | number;
  name?: string;
  description?: string;
  price?: number;
  industry?: string;
  image?: string;
  image_url?: string;
  seller?: string;
  seller_name?: string;
  email?: string;
  seller_email?: string;
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);        
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from("companies").select("*");
        if (error) {
          console.error("❌ Error fetching companies:", error.message);
          setAllCompanies(companiesData); // fallback
          return;
        }

       
        const filtered = (data || []).filter(
          (c: any) =>
            c.name &&
            c.description &&
            c.price !== null && c.price !== undefined &&
            c.industry
        );

        setAllCompanies([...companiesData, ...filtered]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [supabase]);

  const handleSignUp = async () => {
    setError(null);
    setSuccess(false);
  
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }, 
    });
  
    if (error) {
     
      if (error instanceof AuthApiError && error.status === 400 && /already registered/i.test(error.message)) {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError(error.message);
      }
      return;
    }
  
    
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setError("An account with this email already exists. Please log in.");
      return;
    }
  
    // New user created
    setSuccess(true);
    setEmail("");
    setPassword("");
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
    
<section className="px-6 py-10 max-w-6xl mx-auto">
  <div className="bg-blue-50 p-6 rounded-xl shadow-md mb-10 max-w-3xl mx-auto text-center">
    <h1 className="text-3xl font-extrabold text-blue-900">Welcome to SellBuyBiz</h1>
    <p className="mt-2 text-blue-800">Browse a preview below. Create an account to see full details.</p>
  </div>

  <h2 className="text-2xl font-bold text-center text-blue-100 mb-8">
    Explore Businesses You Can Buy
  </h2>

  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 rounded-xl bg-white/20 animate-pulse" />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allCompanies.map((company) => (
        <article
          key={company.id}
          className="group rounded-xl border border-white/20 bg-white shadow-sm text-black transition hover:shadow-md"
        >
          {/* Image */}
          <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={company.image || company.image_url || "/placeholder.svg"}
              alt={company.name || "Company"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {company.description || "No description provided."}
            </p>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-700">
                Industry: {company.industry || "—"}
              </span>
              <span className="font-semibold">
                💰 {company.price ?? "—"} SEK
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
</section>


      {/* Sign-up form */}
      <section className="bg-white border-t px-6 py-12 text-black">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Sign Up</h2>
          <p className="text-gray-600 text-center mb-6">
            Create an account to view full company details and contact sellers.
          </p>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <button
            onClick={handleSignUp}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create account
          </button>

          {success && (
            <p className="text-green-600 text-center mt-4">
              ✅ Check you inbox forlog in.
            </p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
           
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
