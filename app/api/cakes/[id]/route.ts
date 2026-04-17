import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cake = await prisma.cake.findFirst({
      where: { id, isVisible: true },
    });
    if (!cake) {
      return NextResponse.json({ error: 'Cake not found' }, { status: 404 });
    }
    return NextResponse.json(cake);
  } catch (error) {
    console.error('GET /api/cakes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch cake' }, { status: 500 });
  }
}
