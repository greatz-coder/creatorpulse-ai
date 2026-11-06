'use client';

import Link from 'next/link';
import { ArrowUpRight, Copy, LineChart, MessageSquareText, PenTool, Sparkles } from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Views', value: '1.8M', change: '+18.2%' },
  { label: 'Engagement', value: '6.4%', change: '+2.1%' },
  { label: 'Growth', value: '94', change: '+11 pts' },
];

const quickActions = [
  { href: '/dashboard/chat', title: 'AI Copilot Chat', icon: MessageSquareText },
  { href: '/dashboard/script', title: 'Script Generator', icon: PenTool },
  { href: '/dashboard', title: 'Analytics Tracker', icon: LineChart },
];

export default function DashboardPage() {
  const [hook, setHook] = useState('I tested this strategy for 7 days and my CTR tripled.');
  const [socialStatus, setSocialStatus] = useState<{ provider: string; connected: boolean }[]>([
    { provider: 'TikTok', connected: false },
    { provider: 'YouTube', connected: false },
    { provider: 'Instagram', connected: false },
  ]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hook);
  };

  const connectSocial = async (provider: string) => {
    const token = `${provider.toLowerCase()}_demo_token_${Date.now()}`;

    const response = await fetch('/api/social/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, token }),
    });

    const data = await response.json();

    if (data.ok) {
      setSocialStatus((current) =>
        current.map((item) =>
          item.provider === provider ? { ...item, connected: true } : item,
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-violet-500/20 bg-slate-900/80 p-6 shadow-glow">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Viral Hook of the Day</p>
              <h2 className="mt-1 text-2xl font-bold">Creator growth prompt</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
          >
            <Copy className="h-4 w-4" />
            Copy hook
          </button>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">“{hook}”</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map(({ href, title, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-400 hover:bg-violet-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-violet-200" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">Launch the AI workflow and keep your content pipeline moving.</p>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Connected social accounts</h3>
          <span className="text-xs uppercase tracking-[0.24em] text-violet-200/70">Secure sync</span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {socialStatus.map((item) => (
            <div key={item.provider} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{item.provider}</p>
                <span className={`rounded-full px-2 py-1 text-xs ${item.connected ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                  {item.connected ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => connectSocial(item.provider)}
                className="mt-4 w-full rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
              >
                {item.connected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
