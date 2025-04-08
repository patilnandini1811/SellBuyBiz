
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import companiesData from "@/app/companies/companyList.json";

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
  const [loading, setLoading] = useState(false);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from("companies").select("*");

      if (error) {
        console.error("❌ Error fetching companies:", error.message);
        setAllCompanies(companiesData); // fallback
      } else {
        // ✅ Filter out incomplete entries from Supabase
        const filtered = (data || []).filter(
          (c) => c.name && c.description && c.price && c.industry
        );

        const combined = [...companiesData, ...filtered];
        setAllCompanies(combined);
      }

      setLoading(false);
    };

    fetchCompanies();
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="bg-blue-50 p-6 rounded-xl shadow-md mb-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-blue-900">Welcome to the Marketplace</h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">
          Explore Businesses You Can Buy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allCompanies.map((company: Company) => (
            <div key={company.id} className="bg-white shadow-md rounded-lg p-4 border text-black transition-transform hover:scale-105">
              <img
                src={company.image || company.image_url}
                alt={company.name || "Company Image"}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{company.name}</h2>
              <p className="text-gray-600 font-semibold">
                {company.description || "No description provided."}
              </p>
              <p className="text-sm mt-2">Industry: {company.industry}</p>
              <p className="mt-2 font-semibold">
                💰 Price: {company.price} SEK
              </p>
             
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t px-6 py-12 text-black">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Sign Up</h2>
          <p className="text-gray-600 text-center mb-6">
            Create an account to view full company details.
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
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {success && (
            <p className="text-green-600 text-center mt-4">✅ Account created! You can now sign in.</p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}



/*import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import companiesData from "@/app/companies/companyList.json";

interface Company {
  id: number;
  name: string;
  description: string;
  price: number;
  industry: string;
  image: string;
  seller: string;
}

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

  

  return (
    <main className="min-h-screen bg-gray-50">
     
      <section className="px-6 py-10 max-w-6xl mx-auto">
      <div className="bg-blue-50 p-6 rounded-xl shadow-md mb-10 max-w-3xl mx-auto text-center">
  <h1 className="text-3xl font-extrabold text-blue-900">
    Welcome to the Marketplace
  </h1>
  </div>
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">
          Explore Businesses You Can Buy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {companiesData.map((company: Company) => (
            <div key={company.id} className="bg-white p-4 rounded shadow">
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold text-blue-800">
                {company.name}
              </h2>
              <p className="text-sm text-gray-600">{company.industry}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-white border-t px-6 py-12">
      <section className="bg-white border-t px-6 py-12">
  <p className="bg-blue-50 p-6 rounded-xl shadow-md mb-10 max-w-3xl mx-auto text-center text-blue-900">
    We're excited to help you find the perfect business! 🚀
    <br />
    Want to see more details like 
    <span className="font-semibold text-blue-900"> price</span>, 
    <span className="font-semibold text-blue-900"> seller info</span>, and 
    <span className="font-semibold text-blue-900"> contact options</span>?
    <br />
 
  <span className="ttext-blue-900">Sign-up here</span> to explore more! <span className="text-xl">⬇️</span>
    
  </p>
</section>


        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Sign Up</h2>
          <p className="text-gray-600 text-center mb-6">
            Create an account to view full company details.
          </p>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <button
            onClick={handleMagicLink}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mx-auto" />
            ) : (
              "Send Magic Link"
            )}
          </button>

          <div className="relative text-center my-4">
            <span className="text-sm text-gray-400">or</span>
          </div>

          <GoogleSignInButton label="Sign up with Google" />

          {success && (
            <p className="text-green-600 text-center mt-4">
              ✅ Magic link sent! Check your email.
            </p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}*/
