'use client';

import { useState } from 'react';
import EditOrderModal from './EditOrderModal';
import { Pencil, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, User, Phone, Calendar, Cake } from 'lucide-react';

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

interface OrdersTableProps {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
  onPageChange: (p: number) => void;
  onRefresh: () => void;
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  CONFIRMED: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  COMPLETED: 'bg-green-900/30 text-green-300 border-green-700/30',
  CANCELLED: 'bg-red-900/30 text-red-300 border-red-700/30',
};

export default function OrdersTable({
  orders,
  total,
  page,
  pages,
  onPageChange,
  onRefresh,
}: OrdersTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedOrders(next);
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Table for Desktop */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 text-left font-semibold">Customer</th>
              <th className="px-6 py-4 text-left font-semibold">Number</th>
              <th className="px-6 py-4 text-left font-semibold">Pickup Date & Time</th>
              <th className="px-6 py-4 text-left font-semibold">Cake Name</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className={`hover:bg-white/3 transition-colors cursor-pointer ${expandedOrders.has(order.id) ? 'bg-white/5' : ''}`}
                  onClick={() => toggleExpand(order.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6a8a5b]/20 flex items-center justify-center text-[#6a8a5b]">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60">{order.phone || '—'}</td>
                  <td className="px-6 py-4 text-white/60 font-medium">{formatDate(order.pickupDate)}</td>
                  <td className="px-6 py-4 text-white/50 italic max-w-xs truncate">
                    {order.cakeName || order.cakeType}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor[order.status] || 'bg-white/10 text-white/60'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                        onClick={(e) => { e.stopPropagation(); setEditingOrder(order); }}
                        className="p-2 hover:bg-[#6a8a5b]/20 text-white/40 hover:text-[#6a8a5b] rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {expandedOrders.has(order.id) ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                    </div>
                  </td>
                </tr>
                {expandedOrders.has(order.id) && (
                  <tr className="bg-white/[0.02]">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div className="space-y-4">
                          <h4 className="text-[#6a8a5b] font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            <User className="w-3 h-3" /> Customer Details
                          </h4>
                          <div className="space-y-1">
                            <p className="text-white font-medium">{order.customerName}</p>
                            <p className="text-white/50">{order.email || 'No email provided'}</p>
                            <p className="text-white/50">{order.phone || 'No phone provided'}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[#6a8a5b] font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            <Cake className="w-3 h-3" /> Order Details
                          </h4>
                          <div className="space-y-1">
                            <p className="text-white/80"><span className="text-white/30">Cake:</span> {order.cakeName}</p>
                            <p className="text-white/80"><span className="text-white/30">Type:</span> {order.cakeType}</p>
                            {order.customMessage && (
                              <p className="text-amber-300"><span className="text-white/30">Msg:</span> &ldquo;{order.customMessage}&rdquo;</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[#6a8a5b] font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            <Calendar className="w-3 h-3" /> Logistics
                          </h4>
                          <div className="space-y-1">
                            <p className="text-white/80"><span className="text-white/30">Pickup:</span> {formatDate(order.pickupDate)}</p>
                            <p className="text-white/80"><span className="text-white/30">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                            {order.note && (
                              <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-white/40 text-xs italic">&ldquo;{order.note}&rdquo;</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Cake className="w-10 h-10 text-white/5" />
                    <p className="text-white/20">No orders found in this category.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Expandable too) */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden">
             <div 
              className="p-5 flex items-start justify-between cursor-pointer"
              onClick={() => toggleExpand(order.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-bold">{order.customerName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColor[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-white/40 text-xs">{order.phone || 'No phone'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingOrder(order); }}
                  className="p-2 bg-white/5 rounded-lg text-white/40"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {expandedOrders.has(order.id) ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
              </div>
            </div>

            {expandedOrders.has(order.id) && (
              <div className="px-5 pb-5 pt-0 border-t border-white/5 bg-white/[0.02] space-y-4">
                <div className="pt-4 grid grid-cols-1 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="text-white/30 uppercase tracking-widest font-bold text-[9px]">Pickup Details</p>
                    <p className="text-white/80">{formatDate(order.pickupDate)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/30 uppercase tracking-widest font-bold text-[9px]">Order Items</p>
                    <p className="text-white/80 font-medium">{order.cakeName}</p>
                    {order.customMessage && (
                      <p className="text-amber-300 italic">&ldquo;{order.customMessage}&rdquo;</p>
                    )}
                  </div>
                  {order.note && (
                    <div className="space-y-2">
                      <p className="text-white/30 uppercase tracking-widest font-bold text-[9px]">Client Notes</p>
                      <p className="text-white/40 italic bg-white/5 p-3 rounded-xl">&ldquo;{order.note}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-white/20 text-xs font-medium">Total {total} entries</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-10 transition-all flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1 items-center px-4">
               <span className="text-white font-bold text-sm">{page}</span>
               <span className="text-white/20 text-xs">of</span>
               <span className="text-white/50 text-sm">{pages}</span>
            </div>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-10 transition-all flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}

// Global React import for Fragment if needed, although Next.js usually handles it.
import React from 'react';

