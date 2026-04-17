import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isRead } = body;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: isRead ?? true },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error('PATCH /api/admin/messages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/messages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
