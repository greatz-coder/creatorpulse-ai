'use client';

import { useState } from 'react';
import { Loader2, SearchCheck } from 'lucide-react';
import { Button, Card, Input, Select } from '@/components/ui';

type Goal = 'Reach' | 'Engagement' | 'Consistency' | 'Community';
type AuditReport = {
  summary: string;
  observations: { title: string; detail: string }[];
  nextSteps: string[];
  metrics: { engagementRate: number | null; viewToFollowerRatio: number | null };
  disclaimer: string;
};
type AuditForm = { platform: string; niche: string; goal: Goal; followers: string; avgViews: string; avgLikes: string; avgComments: string; avgShares: string; postsPerWeek: string };
const initial: AuditForm = { platform: 'TikTok', niche: '', goal: 'Reach', followers: '0', avgViews: '0', avgLikes: '0', avgComments: '0', avgShares: '0', postsPerWeek: '0' };
const metrics: { key: 'followers' | 'avgViews' | 'avgLikes' | 'avgComments' | 'avgShares' | 'postsPerWeek'; label: string; hint: string }[] = [
  { key: 'followers', label: 'Followers', hint: 'Current count' },
  { key: 'avgViews', label: 'Average views', hint: 'Average across recent posts' },
  { key: 'avgLikes', label: 'Average likes', hint: 'Average per recent post' },
  { key: 'avgComments', label: 'Average comments', hint: 'Average per recent post' },
  { key: 'avgShares', label: 'Average shares', hint: 'Average per recent post' },
  { key: 'postsPerWeek', label: 'Posts per week', hint: 'Your current average' },
];

export default function ProfileAuditPage() {
  const [form, setForm] = useState<AuditForm>(initial);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [mode, setMode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setReport(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...Object.fromEntries(metrics.map(({ key }) => [key, Number(form[key])])) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create an audit.');
      setReport(data.report); setMode(data.mode);
    } catch (err) { setError(err instanceof Error ? err.message : 'Request failed.'); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <header><p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Creator Growth Coach</p><h1 className="mt-2 text-3xl font-bold">Profile & performance audit</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Get a practical review based on your own recent numbers. This tool does not log in to or fetch data from your social account. You can use the rule-based audit free, or configure the optional hosted model.</p></header>
    <Card className="border-slate-800 bg-slate-900/80 p-5 sm:p-6"><form onSubmit={analyze} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">Platform<Select value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}><option>TikTok</option><option>YouTube Shorts</option><option>Instagram Reels</option><option>Other</option></Select></label>
        <label className="space-y-2 text-sm text-slate-300">Your niche<Input required maxLength={80} value={form.niche} onChange={(event) => setForm({ ...form, niche: event.target.value })} placeholder="e.g. budget-friendly fashion" /></label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">Main growth focus<Select value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value as Goal })}><option>Reach</option><option>Engagement</option><option>Consistency</option><option>Community</option></Select></label>
      </div>
      <div><h2 className="font-semibold">Recent performance (you enter these)</h2><p className="mt-1 text-xs text-slate-500">Use averages from your recent posts, ideally the last five. Numbers stay in the form and are not saved by this page.</p><div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(({ key, label, hint }) => <label key={key} className="space-y-2 text-sm text-slate-300">{label}<Input type="number" min="0" max="1000000000" step="1" inputMode="numeric" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /><span className="block text-xs text-slate-500">{hint}</span></label>)}</div></div>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <Button type="submit" disabled={busy} className="min-h-11 gap-2">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchCheck className="h-4 w-4" />}{busy ? 'Reviewing your numbers…' : 'Create my free audit'}</Button>
    </form></Card>
    {report && <section className="space-y-4" aria-live="polite"><div><p className="text-xs uppercase tracking-wider text-violet-200/70">{mode === 'hosted-llm' ? 'Optional hosted-model coaching' : 'Free rule-based coaching'}</p><h2 className="mt-1 text-2xl font-bold">Your creator action plan</h2><p className="mt-2 text-sm leading-6 text-slate-300">{report.summary}</p></div>
      <div className="grid gap-3 sm:grid-cols-2"><Card className="border-slate-800 bg-slate-900/80 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Interactions / views</p><p className="mt-2 text-2xl font-bold">{report.metrics.engagementRate === null ? 'Not available' : `${report.metrics.engagementRate.toFixed(1)}%`}</p><p className="mt-1 text-xs text-slate-500">Simple calculation from your inputs; definitions vary by platform.</p></Card><Card className="border-slate-800 bg-slate-900/80 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Views / followers</p><p className="mt-2 text-2xl font-bold">{report.metrics.viewToFollowerRatio === null ? 'Not available' : `${report.metrics.viewToFollowerRatio.toFixed(1)}%`}</p><p className="mt-1 text-xs text-slate-500">A descriptive ratio, not a reach benchmark.</p></Card></div>
      <div className="grid gap-4 md:grid-cols-2"><Card className="border-slate-800 bg-slate-900/80 p-5"><h3 className="font-semibold">What your inputs suggest</h3><div className="mt-4 space-y-4">{report.observations.map((item) => <div key={item.title}><p className="text-sm font-medium text-violet-100">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p></div>)}</div></Card><Card className="border-violet-500/20 bg-violet-500/5 p-5"><h3 className="font-semibold">Next actions to test</h3><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">{report.nextSteps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol></Card></div>
      <p className="text-xs leading-5 text-slate-500">{report.disclaimer}</p>
    </section>}
  </div>;
}
