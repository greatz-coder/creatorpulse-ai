'use client';

import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

type Message = { id: string; role: 'user' | 'assistant'; content: string; mode?: string };
const starters = ['Help me improve this hook: ', 'Give me 5 ideas for ', 'How should I structure a 30-second video about '];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: 'I’m your Creator Coach. If a hosted model is configured, I can use it for flexible AI answers; otherwise I use practical rule-based frameworks locally. No paid API is required by the app.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const user = { id: crypto.randomUUID(), role: 'user' as const, content: text.trim() };
    const next = [...messages, user];
    setMessages(next); setInput(''); setBusy(true); setError('');
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not get coaching advice.');
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: data.reply, mode: data.mode }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally { setBusy(false); }
  };

  useEffect(() => { document.getElementById('chat-end')?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  return <div className="space-y-5">
    <div><p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Creator Coach · free model option</p><h1 className="mt-2 text-3xl font-bold">Plan your next post</h1><p className="mt-2 text-sm text-slate-400">Configure a free-tier OpenAI-compatible provider on the server for LLM answers. Without one, the no-key rule-based coach remains available.</p></div>
    <Card className="overflow-hidden border-slate-800 bg-slate-900/70">
      <div className="flex h-[48vh] min-h-72 flex-col gap-4 overflow-y-auto p-4" aria-live="polite">
        {messages.map((message) => <div key={message.id} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-violet-600 text-white' : 'bg-slate-800 text-slate-100'}`}><p>{message.content}</p>{message.mode && <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">{message.mode === 'hosted-llm' ? 'Hosted model' : 'Local rule-based'}</p>}</div>)}
        {busy && <div className="flex items-center gap-2 self-start rounded-2xl bg-slate-800 px-4 py-3 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Thinking…</div>}
        <div id="chat-end" />
      </div>
      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex flex-wrap gap-2">{starters.map((starter) => <button key={starter} type="button" onClick={() => setInput(starter)} className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-violet-400">{starter.trim()}</button>)}</div>
        {error && <p role="alert" className="mb-2 text-sm text-rose-300">{error}</p>}
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void send(input); }}>
          <Input value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} placeholder="Share your draft, niche, or goal…" className="min-w-0 flex-1 border-slate-700 bg-slate-950" />
          <Button type="submit" disabled={busy || !input.trim()} className="gap-2"><Send className="h-4 w-4" /><span className="hidden sm:inline">Send</span></Button>
        </form>
      </div>
    </Card>
  </div>;
}
