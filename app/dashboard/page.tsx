'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Copy, LineChart, MessageSquareText, PenTool, Sparkles } from 'lucide-react';
import { formatCount, interactionRate, readPosts, type PostEntry } from '@/lib/creator-data';

const actions = [
  { href: '/dashboard/chat', title: 'Creator Coach', detail: 'Get practical, no-key guidance', icon: MessageSquareText },
  { href: '/dashboard/script', title: 'Script Builder', detail: 'Draft a hook, body, and CTA', icon: PenTool },
  { href: '/dashboard/analytics', title: 'Performance Log', detail: 'Track your real post results', icon: LineChart },
];
const hooks = [
  'I wish I knew this before I started [your topic].',
  'Stop doing [common mistake] if you want to [specific result].',
  'Here are three things I learned after trying [your method].',
  'Most people get [your topic] backwards. Here is a simpler way.',
];

export default function DashboardPage() {
  const [posts, setPosts] = useState<PostEntry[]>([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => setPosts(readPosts()), []);

  const views = posts.reduce((sum, post) => sum + post.views, 0);
  const rate = interactionRate(posts);
  const hook = hooks[new Date().getDate() % hooks.length];
  const copyHook = async () => {
    try {
      await navigator.clipboard.writeText(hook);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Your creator workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Insights below come from posts you log in this browser—not estimates.</p>
        </div>
        <Link href="/dashboard/analytics" className="w-fit rounded-full bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500">Log a post</Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Logged views', value: formatCount(views), note: `${posts.length} post${posts.length === 1 ? '' : 's'} recorded` },
          { label: 'Engagement rate', value: `${rate.toFixed(1)}%`, note: 'likes + comments + shares + saves / views' },
          { label: 'Accounts connected', value: '0', note: 'No social account is linked yet' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-violet-500/20 bg-slate-900/80 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200"><Sparkles className="h-5 w-5" /></div>
            <div><p className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Daily hook prompt</p><p className="text-xs text-slate-400">A writing prompt, not a prediction of virality.</p></div>
          </div>
          <button type="button" onClick={copyHook} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-violet-500/40 px-4 text-sm text-violet-100 hover:bg-violet-500/10"><Copy className="h-4 w-4" />{copied ? 'Copied' : 'Copy prompt'}</button>
        </div>
        <p className="mt-5 text-lg leading-8 text-slate-100">“{hook}”</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, detail, icon: Icon }) => (
          <Link key={href} href={href} className="group rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-400">
            <div className="flex justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-violet-200" /></div>
            <h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-slate-400">{detail}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="font-semibold">Social account connections</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">This version does not pretend to connect accounts. Direct analytics and publishing require approved platform OAuth apps and credentials. Until those are configured, track results manually in Performance Log.</p>
      </section>
    </div>
  );
}
