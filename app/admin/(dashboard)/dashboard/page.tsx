import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/admin/StatCard';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface RecentOrder {
  id: string;
  customerName: string;
  cakeType: string;
  status: string;
  createdAt: Date;
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  CONFIRMED: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  COMPLETED: 'bg-green-900/30 text-green-300 border-green-700/30',
  CANCELLED: 'bg-red-900/30 text-red-300 border-red-700/30',
};

async function getStats() {
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
  const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } });
  const rawRecent = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { cake: { select: { name: true, price: true } } } } },
  });
  const completedOrders = await prisma.order.findMany({
    where: { status: 'COMPLETED' },
    include: { items: { include: { cake: { select: { price: true } } } } },
  });

  let totalRevenue = 0;
  for (const o of completedOrders) {
    totalRevenue += o.items?.[0]?.cake?.price ?? 65;
  }

  const recentOrders: RecentOrder[] = rawRecent.map((o) => ({
    id: o.id,
    customerName: o.customerName,
    cakeType: o.items?.[0]?.cakeType || 'Custom Order',
    status: o.status,
    createdAt: o.createdAt,
  }));

  return { totalOrders, pendingOrders, unreadMessages, recentOrders, totalRevenue };
}

export default async function DashboardPage() {
  const { totalOrders, pendingOrders, unreadMessages, recentOrders, totalRevenue } =
    await getStats();

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-2xl lg:text-3xl font-bold mb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Dashboard
        </h1>
        <p className="text-white/40 text-sm">Welcome back! Here&apos;s an overview of your bakery.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          color="text-[#6a8a5b]"
          description="All time"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          color="text-amber-400"
          description="Awaiting confirmation"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${totalRevenue.toFixed(0)}`}
          icon={DollarSign}
          color="text-[#a8c5a0]"
          description="From completed orders"
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          icon={MessageSquare}
          color="text-blue-400"
          description="From contact form"
        />
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/admin/orders', label: 'Go to Orders', icon: ShoppingBag },
          { href: '/admin/cakes', label: 'Manage Cakes', icon: MessageSquare },
          { href: '/admin/messages', label: 'View Messages', icon: MessageSquare },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-5 py-4 bg-[#1e1e1e] border border-white/10 rounded-2xl hover:border-[#6a8a5b]/30 hover:bg-[#6a8a5b]/5 transition-all group min-h-[44px]"
          >
            <span className="text-white/70 text-sm font-medium group-hover:text-white">{label}</span>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#6a8a5b] transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2
            className="text-white font-semibold"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[#6a8a5b] text-sm hover:underline flex items-center gap-1 min-h-[44px]"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Cake</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{order.customerName}</td>
                  <td className="px-6 py-3 text-white/60">{order.cakeType}</td>
                  <td className="px-6 py-3 text-white/40 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-white/30 text-sm">
                    No orders yet. Orders will appear here once customers start ordering!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-white/5">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{order.customerName}</p>
                <p className="text-white/40 text-xs mt-0.5">{order.cakeType}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[order.status] || ''}`}>
                {order.status}
              </span>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className="px-4 py-8 text-center text-white/30 text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
