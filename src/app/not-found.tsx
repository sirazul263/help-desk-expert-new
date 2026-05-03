import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center p-6">
      <main className="relative z-10 max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-12 overflow-hidden">
        <div className="absolute -right-32 -top-24 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 opacity-60 blur-md pointer-events-none" />
        <div className="absolute -left-28 -bottom-20 w-64 h-64 rounded-full bg-gradient-to-br from-rose-50 to-orange-50 opacity-60 blur-md pointer-events-none" />

        <div className="relative z-20 text-center">
          <div className="mx-auto w-28 h-28 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-sky-500 text-white rounded-full shadow-xl -mt-14">
            <span className="font-extrabold text-2xl">404</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900">
            We can't find that page
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            The page you were looking for doesn't exist, or has been moved. Try
            returning home or search for what you need.
          </p>

          <form className="mt-6 flex max-w-lg mx-auto items-center gap-3">
            <input
              aria-label="Search site"
              name="q"
              className="flex-1 min-w-0 rounded-full border border-slate-200 px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Search the site"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-indigo-600 border border-slate-200 shadow hover:bg-indigo-50 transition"
            >
              Go home
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
            >
              Contact support
            </Link>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            Or try these popular pages:{" "}
            <Link href="/services" className="text-indigo-600 hover:underline">
              Services
            </Link>
            ,{" "}
            <Link href="/pricing" className="text-indigo-600 hover:underline">
              Pricing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
