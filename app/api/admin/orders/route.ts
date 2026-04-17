import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;

    const where: {
      status?: OrderStatusType;
      OR?: Array<{ customerName?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (status && status !== 'ALL') {
      where.status = status as OrderStatusType;
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawOrders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { cake: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const orders = rawOrders.map(order => {
      const item = order.items?.[0] || {};
      return {
        ...order,
        cakeType: item.cakeType || 'Custom Order',
        cakeName: item.cakeName || '',
        customMessage: item.customMessage || null,
        note: item.note || null,
        cakeId: item.cakeId || null,
        cake: item.cake || null,
      };
    });

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET /api/admin/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
