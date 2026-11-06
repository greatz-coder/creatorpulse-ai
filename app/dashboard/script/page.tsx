'use client';

import { useState } from 'react';
import { ArrowUpRight, Loader2, Send } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const starterPrompts = [
  'Fix my hook',
  'Give me 5 viral video ideas for tech creators',
  'Write a 30-second retention script',
  'How can I improve my CTR on Shorts?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: 'Hi! I am CreatorPulse AI. Ask me about hooks, scripts, or algorithm ideas for your next short-form video.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply || 'I could not generate a response. Try again in a moment.',
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Something went wrong while generating the response.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Creator Copilot Chat</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Ask about your next viral idea</h1>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/70">
        <div className="flex h-[56vh] flex-col gap-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                message.role === 'user'
                  ? 'ml-auto bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {message.content}
            </div>
          ))}

          {isLoading ? (
            <div className="flex items-center gap-2 self-start rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">
              <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
              Thinking...
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400 hover:text-violet-100"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question about your niche, idea, or content strategy..."
              className="flex-1 border-slate-700 bg-slate-950 text-white"
            />
            <Button onClick={() => sendMessage(input)} className="gap-2 px-4">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
