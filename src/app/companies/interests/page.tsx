"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

type Company = {
  id: string;
  name: string;
  description: string;
};

type Interest = {
  id: string;
  company_uuid: string;
  buyer_email: string;
};

export default function InterestedBuyersPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        alert("You must be logged in.");
        return;
      }

      const userId = session.user.id;

      // 1. Get all companies created by this seller
      const { data: sellerCompanies, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", userId);

      if (companyError) {
        console.error("Error fetching companies:", companyError.message);
        return;
      }

      const companyIds = sellerCompanies.map((c) => c.id);

      // 2. Get interests for those companies
      const { data: interestData, error: interestError } = await supabase
        .from("interests")
        .select("*")
        .in("company_uuid", companyIds);

      if (interestError) {
        console.error("Error fetching interests:", interestError.message);
        return;
      }

      setCompanies(sellerCompanies);
      setInterests(interestData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">Interested Buyers</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        companies.map((company) => (
          <div key={company.id} className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{company.name}</h2>
            <p className="text-gray-600 mb-4">{company.description}</p>

            <h3 className="text-md font-medium text-gray-700 mb-2">Interested Buyers:</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {interests.filter(i => i.company_uuid === company.id).length === 0 ? (
                <li className="text-gray-400 italic">No interest yet</li>
              ) : (
                interests
                  .filter(i => i.company_uuid === company.id)
                  .map(i => (
                    <li key={i.id}>{i.buyer_email}</li>
                  ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
