import { useState, useEffect, useRef } from 'react';

export function useAIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I can't connect right now. Please check your internet." }]);
    } finally {
      setLoading(false);
    }
  };

  const snapAndSolve = async (base64Image: string) => {
    setMessages(prev => [...prev, { role: 'user', text: "[Image Uploaded]" }]);
    setLoading(true);
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I couldn't analyze that image. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, snapAndSolve };
}
