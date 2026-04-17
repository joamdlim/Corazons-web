import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalOrders, pendingOrders, completedOrders, allOrders, unreadMessages] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.findMany({ where: { status: 'COMPLETED' } }),
        prisma.order.findMany({
          include: { items: { include: { cake: { select: { price: true } } } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.contactMessage.count({ where: { isRead: false } }),
      ]);

    // Sum revenue from cake prices (use cake price if available)
    const totalRevenue = completedOrders.length * 65; // fallback avg, replace with real price logic if needed

    const recentOrders = allOrders;

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      unreadMessages,
      recentOrders,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
