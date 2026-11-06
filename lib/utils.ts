import { cn } from '@/lib/utils';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7',
            message.role === 'user' ? 'ml-auto bg-violet-600 text-white' : 'bg-slate-800 text-slate-100',
          )}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
