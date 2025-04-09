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
  image_url?: string;   // for Supabase
  seller?: string;      // for JSON
  seller_name?: string;
  email: string; // for JSON
  seller_email?: string // for Supabase
};

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const supabase = createClient();
  

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from("companies").select("*");

      if (error) {
        console.error("❌ Error fetching companies:", error.message);
        setAllCompanies(companiesData); // fallback to JSON only
      } else {
        const combined = [...companiesData, ...(data || [])];
        setAllCompanies(combined);
      }

    
    };

    fetchCompanies();
  }, []);

  const handleInterest = async (companyId: string | number, seller_email: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      alert("Please log in to express interest.");
      return;
    }

    const { error } = await supabase.from("interests").insert([
      {
        company_uuid: companyId,
        user_id: session.user.id,
        buyer_email: session.user.email,
      }
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
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "" || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full px-12 flex flex-col bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12">
      <h1 className="text-3xl font-bold mb-2 text-center mt-8">
  Explore Businesses for Sale
</h1>
<p className="text-lg text-center mb-8">
  Find the perfect business opportunity and let sellers know you’re interested.
</p>

        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
  <input
    type="text"
    placeholder="Search by name or description"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-1/2 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-blue-600 placeholder-blue-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
  <select
    value={selectedIndustry}
    onChange={(e) => setSelectedIndustry(e.target.value)}
    className="w-full md:w-1/4 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    <option value="">All Industries</option>
    {[...new Set(allCompanies.map(c => c.industry))].map((industry) => (
      <option key={industry} value={industry}>
        {industry}
      </option>
    ))}
  </select>
</div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-blue-600">
        {filteredCompanies.map((company: Company) => {
  const isFromSupabase = typeof company.id === "string" && company.id.length === 36;

  return (
    <div key={company.id} className="bg-white shadow-md rounded-lg p-4 transition-transform hover:scale-105">
      <img
        src={company.image || company.image_url}
        alt={company.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{company.name}</h2>
      <p className="text-sm text-gray-600">{company.description}</p>
      <p className="text-sm text-gray-700 mt-1">Industry: {company.industry}</p>
      <p className="text-sm mt-1 font-semibold text-blue-700">💰 Price: {company.price} SEK</p>
      <p className="text-sm mt-1">📦 Seller: {company.seller || company.seller_name}</p>
      <p className="text-sm mt-1">📧 Email: {company.email || company.seller_email}</p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <button
          disabled={!isFromSupabase}
          onClick={() =>
            isFromSupabase && handleInterest(company.id!, company.seller_email || company.email)
          }
          className={`px-4 py-2 rounded-md font-semibold border ${
            isFromSupabase
              ? "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
              : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
          }`}
        >
          Interested
        </button>
      </div>
    </div>
  );
})}

        </div>

        <div className="flex justify-center mt-8 gap-5">
          <Link
            href="/companies/interests"
            className="bg-white text-blue-500 px-6 py-3 border text-lg border-blue-500 rounded-md font-semibold hover:bg-blue-500 hover:text-white"
          >
            View Interested Buyers
          </Link>
          <Link
            href="/companies/registrationForm"
            className="bg-white text-blue-500 px-6 py-3 rounded-md text-lg font-semibold transition duration-300 hover:bg-blue-500 hover:text-white"
          >
            Register Your Company
          </Link>
        </div>
      </div>
    </div>
  );
}
