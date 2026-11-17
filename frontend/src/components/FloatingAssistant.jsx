import { useMemo, useState } from 'react';

const helperKnowledge = [
  {
    keywords: ['add provider', 'provider form', 'register provider'],
    response:
      'To add a provider, login and navigate to Add Provider from the navigation bar. Fill in the details, upload images, add available time slots, and submit. We will automatically sync your provider with the marketplace.',
  },
  {
    keywords: ['explore providers', 'find professionals', 'browse'],
    response:
      'Visit the Providers page to browse all professionals. Use the filters on the left to narrow down by profession, cost, rating, or availability.',
  },
  {
    keywords: ['log in', 'login', 'sign in'],
    response:
      'Open the Login page from the top right corner, enter your registered email and password, and you are in. No account yet? Choose Sign Up instead.',
  },
  {
    keywords: ['book', 'schedule', 'time slot'],
    response:
      'Open a provider profile, pick an available time slot, and use the “Book Slot” button. You need to be logged in to confirm a booking.',
  },
  {
    keywords: ['review', 'rate', 'feedback'],
    response:
      'After a service, head to the provider profile, scroll to the Reviews section, and submit your rating and comments. Log in is required to share feedback.',
  },
];

const defaultResponse =
  "I'm here to help with Service Snaps navigation. Try asking about adding providers, exploring professionals, logging in, booking, or reviewing.";

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 0,
      from: 'bot',
      text: 'Hey there! Need directions around Service Snaps? Ask me how to add providers, book slots, or explore professionals.',
    },
  ]);

  const findResponse = useMemo(
    () => (question) => {
      const normalized = question.toLowerCase();
      const match = helperKnowledge.find((item) =>
        item.keywords.some((keyword) => normalized.includes(keyword))
      );
      return match?.response || defaultResponse;
    },
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: 'user', text: trimmed },
      { id: prev.length + 1, from: 'bot', text: findResponse(trimmed) },
    ]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Service Snaps Assistant</p>
              <p className="text-xs text-primary/20">Navigation & help tips only</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-lg leading-none">
              ×
            </button>
          </div>

          <div className="flex max-h-72 flex-col gap-2 overflow-auto px-4 py-3 text-sm text-slate-600">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  message.from === 'bot'
                    ? 'self-start bg-slate-100 text-slate-700'
                    : 'self-end bg-primary text-white'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a help question"
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:bg-primary/90"
        aria-label="Toggle assistant"
      >
        💬
      </button>
    </div>
  );
};

export default FloatingAssistant;

