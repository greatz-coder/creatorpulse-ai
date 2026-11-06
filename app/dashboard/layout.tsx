import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 md:px-6">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 text-lg font-bold text-violet-300">
              C
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-300/80">CreatorPulse</p>
              <h1 className="text-xl font-semibold">AI Studio</h1>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-violet-500/40 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
          >
            Dashboard
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-violet-200">
              Free creator growth system
            </span>
            <div className="space-y-4">
              <h2 className="max-w-xl text-4xl font-black tracking-tight md:text-6xl">
                Turn content chaos into scroll-stopping momentum.
              </h2>
              <p className="max-w-xl text-lg text-slate-300">
                CreatorPulse AI helps creators brainstorm hooks, write scripts, track engagement, and connect their social accounts in a single dark-mode workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Continue as Guest
              </Link>
              <Link
                href="/dashboard/chat"
                className="rounded-full border border-slate-600 bg-slate-900/80 px-6 py-3 font-semibold text-slate-100 transition hover:border-violet-400 hover:text-violet-200"
              >
                Open Copilot Chat
              </Link>
            </div>

            <div className="grid max-w-lg gap-4 sm:grid-cols-3">
              {[
                ['Views', '1.8M'],
                ['Engagement', '6.4%'],
                ['Growth', '94'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <p className="mt-3 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-violet-500/20 bg-slate-950/80 p-5 shadow-glow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-violet-200/80">Live brief</p>
                <h3 className="mt-2 text-xl font-semibold">TikTok growth sprint</h3>
              </div>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                Active
              </span>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Viral hook', value: 'I tested this strategy for 7 days and my CTR tripled.' },
                { label: 'Content angle', value: 'AI workflows for creators that save 5+ hours a week.' },
                { label: 'CTA', value: 'Comment “growth” and I’ll send the exact prompt pack.' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
