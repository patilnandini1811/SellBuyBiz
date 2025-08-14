/* FILE: src/app/companies/page.tsx */
"use client";

import Link from "next/link";
import companiesData from "../../app/companies/companyList.json";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import LogoutButton from "@/components/logout/page";

type Company = {
  id?: string | number;
  name: string;
  description: string;
  price: number;
  industry: string;
  image?: string;
  image_url?: string;   
  seller?: string;      
  seller_name?: string;
  email?: string;      
  seller_email?: string; 
};

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from("companies").select("*");
        if (error) {
          console.error("❌ Error fetching companies:", error.message);
          setAllCompanies(companiesData); 
          return;
        }
        const combined = [...companiesData, ...(data || [])];
        setAllCompanies(combined);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [supabase]);

  const handleInterest = async (companyId: string | number, seller_email: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      alert("Please log in to express interest.");
      return;
    }

    const { error } = await supabase.from("interests").insert([
      {
        company_uuid: String(companyId),     
        buyer_id: session.user.id,
        buyer_email: session.user.email,
      },
    ]);

    if (error) {
      console.error("❌ Error saving interest:", error.message);
      alert("Something went wrong. Try again.");
    } else {
      alert("Interest sent successfully! 🙌");
    }
  };

  const filteredCompanies = allCompanies.filter((company) => {
    const matchesSearch =
      (company.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "" || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(
    new Set(allCompanies.map((c) => c.industry).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      {/* Header bar */}
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore Businesses for Sale</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/companies/registrationForm"
            className="hidden sm:inline-flex rounded-md border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20"
          >
            List your company
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mx-auto max-w-6xl px-4 pb-6">
        <div className="rounded-xl bg-white p-4 text-blue-700 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full md:w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {selectedIndustry && (
              <button
                onClick={() => setSelectedIndustry("")}
                className="w-full md:w-auto rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-xl bg-white/30 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="rounded-xl bg-white/10 p-10 text-center">
            <p className="text-white/90">
              No companies match your search. Try a different keyword or industry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company: Company) => {
              const isFromSupabase =
                typeof company.id === "string" && (company.id as string).length === 36;
              const img = company.image || company.image_url || "/placeholder.svg";
              const seller = company.seller || company.seller_name || "—";
              const email = company.email || company.seller_email || "—";

              return (
                <article
                  key={company.id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/20 bg-white text-blue-700 shadow-sm transition hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={img}
                      alt={company.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="text-lg font-semibold">{company.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {company.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                        {company.industry}
                      </span>
                      <span className="font-semibold text-blue-700">
                        💰 {company.price} SEK
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <p>📦 Seller: {seller}</p>
                      <p>📧 Email: {email}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end">
                      <button
                        disabled={!isFromSupabase}
                        onClick={() =>
                          isFromSupabase &&
                          handleInterest(company.id!, company.seller_email || company.email || "")
                        }
                        className={`rounded-md px-4 py-2 font-semibold border transition ${
                          isFromSupabase
                            ? "border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white"
                            : "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500"
                        }`}
                        title={
                          isFromSupabase
                            ? "Express interest"
                            : "Only available for live listings"
                        }
                      >
                        Interested
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/companies/interests"
            className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            View Interested Buyers
          </Link>
          <Link
            href="/companies/registrationForm"
            className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-700 transition hover:bg-indigo-50"
          >
            Register Your Company
          </Link>
        </div>
      </div>
    </div>
  );
}
