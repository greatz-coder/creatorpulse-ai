import Link from 'next/link';
import { ArrowRight, BarChart3, MessageSquareText, PenTool, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return <main className="min-h-screen bg-[#07070d] text-white">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 md:px-6">
      <header className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 font-bold text-violet-200">C</span><span><span className="block text-xs uppercase tracking-[0.24em] text-violet-200/80">CreatorPulse</span><span className="font-semibold">Creator Studio</span></span></Link><Link href="/dashboard" className="rounded-full border border-violet-500/40 px-4 py-2 text-sm text-violet-100 hover:bg-violet-500/10">Open workspace</Link></header>
      <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_.9fr]">
        <div><span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-violet-200">A practical creator toolkit</span><h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Make a better plan for your next post.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Build scripts, get structured creator coaching, and track your actual post results—all without a paid AI API key.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/dashboard" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-violet-600 px-6 font-semibold hover:bg-violet-500">Open free workspace<ArrowRight className="h-4 w-4" /></Link><Link href="/dashboard/analytics" className="inline-flex min-h-12 items-center rounded-full border border-slate-700 px-6 font-semibold text-slate-200 hover:border-violet-400">Track a post</Link></div><p className="mt-4 text-xs text-slate-500">No sign-in required. Your performance log stays in this browser.</p></div>
        <div className="rounded-[28px] border border-violet-500/20 bg-slate-950/80 p-5 shadow-glow"><p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Built for real workflows</p><div className="mt-4 space-y-3">{[
          { icon: PenTool, title: 'Script Builder', body: 'Draft a hook, value section, CTA, and relevant hashtags from your brief.' },
          { icon: BarChart3, title: 'Performance Log', body: 'Record real metrics and calculate engagement from your own platform data.' },
          { icon: MessageSquareText, title: 'Creator Coach', body: 'Use reusable frameworks and prompts without sending data to an AI API.' },
          { icon: ShieldCheck, title: 'Honest by design', body: 'No invented analytics, fake account connections, or claims of guaranteed virality.' },
        ].map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4"><span className="mt-0.5 text-violet-200"><Icon className="h-5 w-5" /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{body}</p></div></div>)}</div><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Sparkles className="h-4 w-4" />Script and coaching tools are rule/template-based, not an LLM.</div></div>
      </section>
      <footer className="border-t border-slate-900 py-5 text-xs leading-5 text-slate-500">Social OAuth, automatic analytics sync, and reposting are not enabled. Those require platform-approved applications, credentials, and user authorization; this app will not claim otherwise.</footer>
    </div>
  </main>;
}
