import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cakes = await prisma.cake.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cakes);
  } catch (error) {
    console.error('GET /api/cakes error:', error);
    return NextResponse.json({ error: 'Failed to fetch cakes' }, { status: 500 });
  }
}
