// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
     
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/25 backdrop-blur">
       
        <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-3xl md:text-4xl font-extrabold tracking-tight
                       bg-gradient-to-r from-white to-fuchsia-200 bg-clip-text text-transparent"
          >
            SellBuyBiz
          </Link>

          <nav className="hidden gap-8 sm:flex">
            <Link href="/sign-up" className="text-white/90 hover:text-white">Sign up</Link>
            <Link href="/sign-in" className="text-white/90 hover:text-white">Log in</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Buy & Sell Businesses with Confidence
            </h1>
            <p className="mt-4 text-lg text-white/90">
              A modern marketplace to list your company, discover opportunities, and connect
              with interested buyers — powered by Next.js & Supabase.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
             
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:w-auto"
              >
                Explore Listings
              </Link>
            </div>

            <div className="mt-6 text-sm text-white/80">
              Secure auth • Image uploads • Interest tracking
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 bg-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Secure Auth", desc: "Sign up, log in, and manage sessions with Supabase Auth." },
            { title: "Smart Listings", desc: "Search & filter by industry and keywords. Upload company images." },
            { title: "Express Interest", desc: "Logged-in buyers can express interest. Sellers see all buyers." },
            { title: "Deployed on Vercel", desc: "Fast, reliable, and shareable with recruiters." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/85">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-white/80">
          © {new Date().getFullYear()} SellBuyBiz. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
