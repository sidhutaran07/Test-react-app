// Banner.jsx
export default function Banner() {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl p-[2px]">
      {/* animated border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl [mask:linear-gradient(#000,transparent_40%)]">
        <div className="absolute inset-[-50%] animate-spin-slow rounded-full bg-[conic-gradient(at_50%_50%,#22d3ee_0deg,#a78bfa_120deg,#f472b6_240deg,#22d3ee_360deg)] opacity-70" />
      </div>

      {/* inner card */}
      <div className="relative rounded-2xl bg-neutral-900/60 p-6 backdrop-blur">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI Pages
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Build. Chat. Ship. 🚀
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-white/70">
            A minimalist banner component with an animated chroma border. Drop it atop your AI pages.
          </p>
        </div>
      </div>
    </div>
  );
}
