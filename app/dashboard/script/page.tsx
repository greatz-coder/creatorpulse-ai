'use client';

import { useState } from 'react';
import { Check, Copy, Loader2, Wand2 } from 'lucide-react';
import { Button, Card, Input, Select } from '@/components/ui';

type Tone = 'Energetic' | 'Controversial' | 'Educational' | 'Humorous';
type Form = { niche: string; audience: string; topic: string; tone: Tone };
const initial: Form = { niche: '', audience: '', topic: '', tone: 'Educational' };

export default function ScriptGeneratorPage() {
  const [form, setForm] = useState<Form>(initial);
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError(''); setCopied(false);
    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not build the script.');
      setScript(data.script);
    } catch (err) { setError(err instanceof Error ? err.message : 'Request failed.'); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    if (!script) return;
    try { await navigator.clipboard.writeText(script); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setError('Clipboard access is unavailable. Select and copy the script manually.'); }
  };

  return <div className="mx-auto max-w-3xl space-y-6">
    <div><p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Script Builder · works offline</p><h1 className="mt-2 text-3xl font-bold">Shape a short-form video</h1><p className="mt-2 text-sm text-slate-400">Creates an editable structured draft from your inputs. No API key, AI service, or subscription required.</p></div>
    <Card className="border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <form onSubmit={generate} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">Niche<Input required maxLength={80} value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} placeholder="e.g. home cooking" /></label>
          <label className="space-y-2 text-sm text-slate-300">Target audience<Input required maxLength={100} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="e.g. busy students" /></label>
          <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">Topic / core message<Input required maxLength={240} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="What should viewers learn or feel?" /></label>
          <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">Tone<Select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value as Tone })}><option>Energetic</option><option>Controversial</option><option>Educational</option><option>Humorous</option></Select></label>
        </div>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <Button type="submit" disabled={loading} className="min-h-11 gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}{loading ? 'Building…' : 'Build script'}</Button>
      </form>
    </Card>
    {script && <Card className="border-slate-800 bg-slate-900/80 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Your draft</h2><Button type="button" variant="secondary" onClick={copy} className="gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy script'}</Button></div><pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-7 text-slate-100">{script}</pre><p className="mt-3 text-xs text-slate-500">Review and personalize claims, examples, and hashtags before publishing.</p></Card>}
  </div>;
}
