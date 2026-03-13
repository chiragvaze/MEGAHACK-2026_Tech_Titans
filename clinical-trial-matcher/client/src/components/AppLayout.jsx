export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-app-gradient">
      <header className="border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Neuroprint Suite</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Clinical Trial Matching Engine</h1>
          </div>
          <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
            AI + Rules + Explainability
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
