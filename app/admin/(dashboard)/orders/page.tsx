'use client';

import { useState, useEffect, useCallback } from 'react';
import OrdersTable from '@/components/admin/OrdersTable';
import { Search, Filter, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

interface Order {
  id: string;
  customerName: string;
  email: string;
  cakeType: string;
  cakeName: string;
  customMessage?: string | null;
  note?: string | null;
  pickupDate?: string | null;
  status: string;
  createdAt: string;
  cake?: { name: string } | null;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

export default function OrdersPage() {
  const [data, setData] = useState<OrdersResponse>({ orders: [], total: 0, page: 1, pages: 1 });
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status !== 'ALL') params.set('status', status);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) setData(await res.json());
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timeout);
  }, [fetchOrders]);

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-white text-2xl lg:text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Orders
          </h1>
          <p className="text-white/40 text-sm">{data.total} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          id="refresh-orders-btn"
          className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/15 text-white/60 rounded-xl text-sm hover:text-white hover:border-white/30 transition-colors min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            id="orders-search"
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e1e] border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            id="orders-status-filter"
            className="pl-10 pr-8 py-2.5 bg-[#1e1e1e] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px] cursor-pointer appearance-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#1e1e1e]">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#6a8a5b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm mt-4">Loading orders...</p>
        </div>
      ) : (
        <OrdersTable
          orders={data.orders}
          total={data.total}
          page={data.page}
          pages={data.pages}
          onPageChange={(p) => setPage(p)}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}
