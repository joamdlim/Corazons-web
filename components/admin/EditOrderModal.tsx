'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, X, Loader2, Save } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email?: string | null;
  phone?: string | null;
  cakeType: string;
  cakeName: string;
  customMessage?: string | null;
  note?: string | null;
  pickupDate?: string | null;
  status: string;
  createdAt: string;
  cake?: { name: string } | null;
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  CONFIRMED: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  COMPLETED: 'bg-green-900/30 text-green-300 border-green-700/30',
  CANCELLED: 'bg-red-900/30 text-red-300 border-red-700/30',
};

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditOrderModal({ order, onClose, onSaved }: EditOrderModalProps) {
  const [form, setForm] = useState({
    status: order.status,
    cakeName: order.cakeName,
    customMessage: order.customMessage || '',
    note: order.note || '',
    pickupDate: order.pickupDate ? order.pickupDate.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update order');
      toast.success('Order updated successfully');
      onSaved();
      onClose();
    } catch {
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#6a8a5b]" />
            <h3 className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Edit Order
            </h3>
          </div>
          <button
            onClick={onClose}
            id="close-edit-order-modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="text-xs text-white/40 mb-2">Order ID: {order.id.slice(0, 8)}...</div>

          {/* Status */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              id="edit-order-status"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#1e1e1e]">{s}</option>
              ))}
            </select>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[form.status] || ''}`}>
                {form.status}
              </span>
            </div>
          </div>

          {/* Cake Name */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Cake Name</label>
            <input
              name="cakeName"
              value={form.cakeName}
              onChange={handleChange}
              id="edit-order-cake-name"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Custom Message</label>
            <input
              name="customMessage"
              value={form.customMessage}
              onChange={handleChange}
              id="edit-order-message"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              id="edit-order-note"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 resize-none"
            />
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Pickup Date</label>
            <input
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={handleChange}
              id="edit-order-pickup-date"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white text-sm rounded-xl hover:bg-white/8 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            id="save-order-btn"
            className="flex items-center gap-2 px-5 py-2 bg-[#6a8a5b] text-[#ffffff] rounded-xl text-sm font-semibold hover:bg-[#58764a] transition-colors disabled:opacity-60 min-h-[44px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
