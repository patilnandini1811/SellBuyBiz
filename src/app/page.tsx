import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-6xl font-bold mb-6">Marketplace</h1>
        <p className="text-xl mb-8">Buy, Sell, and Grow Your Business Here</p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
        <Link href="/sign-up" className="bg-white text-blue-500 px-6 py-3 rounded-md text-lg font-semibold transition duration-300 hover:bg-blue-500 hover:text-white">
              Explore Listings
            
          </Link>
        </div>
      </div>

      <footer className="bg-purple-600 text-white text-center p-4 mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
