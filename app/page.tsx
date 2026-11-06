import Link from 'next/link';
import { ArrowRight, BarChart3, Lightbulb, MessageSquareText, PenTool, SearchCheck, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return <main className="min-h-screen bg-[#07070d] text-white">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 md:px-6">
      <header className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 font-bold text-violet-200">C</span><span><span className="block text-xs uppercase tracking-[0.24em] text-violet-200/80">CreatorPulse</span><span className="font-semibold">Creator Growth Coach</span></span></Link><Link href="/dashboard" className="rounded-full border border-violet-500/40 px-4 py-2 text-sm text-violet-100 hover:bg-violet-500/10">Open free workspace</Link></header>
      <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_.9fr]">
        <div><span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-violet-200">A free, creator-first coach</span><h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">A practical growth plan for your next post.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">CreatorPulse helps short-form creators understand their own performance, find content angles, and turn ideas into shootable scripts—without a subscription paywall.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/dashboard/audit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-violet-600 px-6 font-semibold hover:bg-violet-500">Start a free audit<SearchCheck className="h-4 w-4" /></Link><Link href="/dashboard/ideas" className="inline-flex min-h-12 items-center rounded-full border border-slate-700 px-6 font-semibold text-slate-200 hover:border-violet-400">Explore free idea tools</Link></div><p className="mt-4 text-xs text-slate-500">No sign-in or AI API key required for the free core tools.</p></div>
        <div className="rounded-[28px] border border-violet-500/20 bg-slate-950/80 p-5 shadow-glow"><p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Creator coaching workflow</p><div className="mt-4 space-y-3">{[
          { icon: SearchCheck, title: 'Review your profile performance', body: 'Enter your recent metrics and get a transparent, practical audit.' },
          { icon: Lightbulb, title: 'Find your next content angle', body: 'Generate niche-aware ideas and formats to test.' },
          { icon: PenTool, title: 'Build a shootable script', body: 'Turn one idea into a hook, value section, and CTA.' },
          { icon: BarChart3, title: 'Learn from your results', body: 'Log post metrics and compare your own performance over time.' },
          { icon: ShieldCheck, title: 'Free-first and honest', body: 'No fabricated results, fake account connections, or promises of virality.' },
        ].map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"><span className="mt-0.5 text-violet-200"><Icon className="h-5 w-5" /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{body}</p></div></div>)}</div><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><MessageSquareText className="h-4 w-4" />Optional hosted AI is available when you configure a provider.</div></div>
      </section>
      <footer className="border-t border-slate-900 py-5 text-xs leading-5 text-slate-500">Profile audits use metrics you enter; no social accounts are connected. Automatic analytics and reposting need platform approval and OAuth setup. Free hosted-model quotas can be limited.</footer>
    </div>
  </main>;
}
