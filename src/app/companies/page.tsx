import Link from "next/link";

export default function CompaniesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Available Companies</h1>
      <p className="text-gray-600 mb-6">Browse the latest companies available for sale.</p>

      <Link
        href="/auth/sign-in"
        className="text-indigo-600 underline hover:text-indigo-800"
      >
        Sign in to contact sellers →
      </Link>
    </div>
  );
}
