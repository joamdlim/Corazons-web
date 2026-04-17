'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Trash2, ChevronDown, ChevronUp, Mail } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagesTableProps {
  messages: Message[];
  onRefresh: () => void;
}

export default function MessagesTable({ messages, onRefresh }: MessagesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !isRead }),
      });
      toast.success(isRead ? 'Marked as unread' : 'Marked as read');
      onRefresh();
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      toast.success('Message deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {messages.map((msg) => (
              <>
                <tr
                  key={msg.id}
                  className={`hover:bg-white/3 transition-colors cursor-pointer ${!msg.isRead ? 'bg-[#6a8a5b]/3' : ''}`}
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                >
                  <td className="px-4 py-3 text-white font-medium">{msg.name}</td>
                  <td className="px-4 py-3 text-white/60">{msg.email}</td>
                  <td className="px-4 py-3 text-white/50 max-w-xs">
                    <span className="line-clamp-1">{msg.message}</span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">{formatDate(msg.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      msg.isRead
                        ? 'bg-white/8 text-white/40 border-white/10'
                        : 'bg-[#6a8a5b]/15 text-[#6a8a5b] border-[#6a8a5b]/20'
                    }`}>
                      {msg.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMarkRead(msg.id, msg.isRead)}
                        id={`mark-read-${msg.id}`}
                        title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        className="p-1.5 bg-white/8 hover:bg-[#6a8a5b]/20 text-white/60 hover:text-[#6a8a5b] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        id={`delete-msg-${msg.id}`}
                        className="p-1.5 bg-white/8 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === msg.id && (
                  <tr key={`${msg.id}-expanded`} className="bg-white/3">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="bg-[#1a1a1a]/50 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-3.5 h-3.5 text-[#6a8a5b]" />
                          <span className="text-[#6a8a5b] text-xs font-semibold">Full Message</span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-white/30">
                  No messages yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border rounded-xl overflow-hidden ${!msg.isRead ? 'bg-[#6a8a5b]/5 border-[#6a8a5b]/20' : 'bg-[#1e1e1e] border-white/10'}`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold text-sm">{msg.name}</p>
                  <p className="text-white/40 text-xs">{msg.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#6a8a5b]" />
                  )}
                  {expandedId === msg.id ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </div>
              </div>
              <p className="text-white/50 text-xs line-clamp-2">{msg.message}</p>
            </div>

            {expandedId === msg.id && (
              <div className="px-4 pb-4">
                <div className="bg-black/30 rounded-xl p-3 mb-3 border border-white/10">
                  <p className="text-white/70 text-xs leading-relaxed">{msg.message}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkRead(msg.id, msg.isRead)}
                    className="flex items-center gap-1 text-[#6a8a5b] text-xs font-medium min-h-[44px]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="flex items-center gap-1 text-red-400 text-xs font-medium min-h-[44px] ml-4"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-white/30 text-center py-10 text-sm">No messages yet</p>
        )}
      </div>
    </div>
  );
}
