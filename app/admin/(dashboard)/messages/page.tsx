'use client';

import { useState, useEffect, useCallback } from 'react';
import MessagesTable from '@/components/admin/MessagesTable';
import { RefreshCw, Mail } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) setMessages(await res.json());
    } catch {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-white text-2xl lg:text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Messages
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-white/40 text-sm">{messages.length} total messages</p>
            {unread > 0 && (
              <span className="px-2.5 py-0.5 bg-[#6a8a5b]/15 text-[#6a8a5b] border border-[#6a8a5b]/20 rounded-full text-xs font-semibold">
                {unread} unread
              </span>
            )}
          </div>
        </div>
        <button
          onClick={fetchMessages}
          id="refresh-messages-btn"
          className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/15 text-white/60 rounded-xl text-sm hover:text-white hover:border-white/30 transition-colors min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[#6a8a5b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm mt-4">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/30 text-base">No messages yet</p>
          <p className="text-white/20 text-sm mt-1">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <MessagesTable messages={messages} onRefresh={fetchMessages} />
      )}
    </div>
  );
}
