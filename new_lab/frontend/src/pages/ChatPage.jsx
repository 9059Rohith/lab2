import { useState } from 'react';
import { chatWithTutor } from '../api';
import { speak } from '../utils';

export default function ChatPage({ userId, voiceEnabled }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Symbol Tutor. Ask me about +, -, ×, ÷, = and more.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);

    try {
      const data = await chatWithTutor({ message: text, userId, gameContext: 'symbol-learning' });
      const answer = data?.response || 'I am here to help you learn symbols.';
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
      speak(answer, voiceEnabled);
    } catch {
      const fallback = 'Connection issue. Please try again in a moment.';
      setMessages((prev) => [...prev, { role: 'bot', text: fallback }]);
      speak(fallback, voiceEnabled);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-wrap">
      <h2>AI Tutor Chat</h2>
      <div className="chat-shell">
        <div className="chat-log">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about any symbol..."
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </section>
  );
}
