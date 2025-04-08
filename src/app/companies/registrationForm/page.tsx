"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

type Company = {
  id: number;
  name: string;
  description: string;
  price: number;
  industry: string;
  image_url?: string;
  seller_name: string;
  seller_email: string;
  user_id?: string;
};

type RegistrationFormPageProps = {
  addCompany?: (newCompany: Company) => void;
};

export default function RegistrationFormPage({ addCompany }: RegistrationFormPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    industry: "",
    image_url: "",
    seller_name: "",
    seller_email: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient();
  const router = useRouter();


  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log("🟣 Session from useEffect:", session);
      if (error) console.log("🔴 Error:", error);
    };

    checkSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      setError("Failed to retrieve session. Please try logging in again.");
      return;
    }
  
    const session = data.session;
    let imageUrl = "";
  
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
  
      const { error: uploadError } = await supabase
        .storage
        .from("company-logos") // 🔔 Make sure this bucket exists
        .upload(filePath, imageFile);
  
      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        return;
      }
  
      const { data: publicUrlData } = supabase
        .storage
        .from("company-logos")
        .getPublicUrl(filePath);
  
      imageUrl = publicUrlData?.publicUrl || "";
    }
  
    const { data: insertData, error: insertError } = await supabase
      .from("companies")
      .insert([
        {
          ...formData,
          price: parseFloat(formData.price),
          user_id: session.user.id,
          image_url: imageUrl,
        },
      ])
      .select("*")
      .single();
  
    if (insertError) {
      setError(insertError.message);
    } else {
      if (addCompany && insertData) {
        addCompany(insertData);
      }
      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        price: "",
        industry: "",
        image_url: "",
        seller_name: "",
        seller_email: "",
      });
      setImageFile(null);
      setTimeout(() => router.push("/companies"), 1500);
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Register Your Company for Sale
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-purple-50 p-6 rounded-lg shadow-lg text-black"
        >
          {[
            { label: "Company Name", name: "name", type: "text", placeholder: "Enter company name" },
            { label: "Description", name: "description", type: "textarea", placeholder: "Enter company description" },
            { label: "Price (SEK)", name: "price", type: "number", placeholder: "Enter price" },
            { label: "Industry Type", name: "industry", type: "text", placeholder: "e.g., IT, Food, Education" },
            { label: "Image URL", name: "image_url", type: "text", placeholder: "https://example.com/logo.png" },
            { label: "Seller Name", name: "seller_name", type: "text", placeholder: "Enter your full name" },
            { label: "Seller Email", name: "seller_email", type: "email", placeholder: "you@example.com" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block font-medium text-purple-800 mb-1">{label}</label>
              {type === "textarea" ? (
  <textarea
    name={name}
    placeholder={placeholder}
    value={formData[name as keyof typeof formData]}
    onChange={handleChange}
    required
    className="w-full p-3 border border-gray-300 rounded placeholder-black"
  />
) : name === "image_url" ? (
  <>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
      }}
      required
      className="w-full p-3 border border-gray-300 rounded placeholder-black"
    />
    {imageFile && (
      <img
        src={URL.createObjectURL(imageFile)}
        alt="Preview"
        className="h-32 w-auto mt-2 rounded shadow"
      />
    )}
  </>
) : (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={formData[name as keyof typeof formData]}
    onChange={handleChange}
    required={name !== "image_url"}
    className="w-full p-3 border border-gray-300 rounded placeholder-black"
  />
)}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white p-3 rounded font-semibold"
          >
            Submit Company
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">Company registered successfully! 🎉</p>}
        </form>
      </div>
    </div>
  );
}
