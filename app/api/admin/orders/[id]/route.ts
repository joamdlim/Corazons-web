import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, cakeName, customMessage, note, pickupDate } = body;

    const updateData: any = {};
    if (status) updateData.status = status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    if (pickupDate !== undefined) updateData.pickupDate = pickupDate ? new Date(pickupDate) : null;

    // We use a nested updateMany because we don't know the item id, and there's 1 item legacy.
    const itemUpdates: any = {};
    if (cakeName !== undefined) itemUpdates.cakeName = cakeName;
    if (customMessage !== undefined) itemUpdates.customMessage = customMessage || null;
    if (note !== undefined) itemUpdates.note = note || null;

    if (Object.keys(itemUpdates).length > 0) {
      updateData.items = {
        updateMany: {
          where: {}, // Update all items (legacy only had 1)
          data: itemUpdates,
        }
      };
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('PATCH /api/admin/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
