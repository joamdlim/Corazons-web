import { NextResponse } from 'next/server';
// Force recompile after prisma generate
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, email, phone, cakeType, cakeName, customMessage, note, cakeId, pickupDate } = body;

    if (!customerName || !cakeType || !cakeName) {
      return NextResponse.json(
        { error: 'customerName, cakeType, and cakeName are required.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone: phone || null,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        status: 'PENDING',
        totalAmount: 0, // Fallback for now till frontend cart calculates it
        items: {
          create: [{
            cakeId: cakeId || null,
            cakeName,
            cakeType,
            customMessage: customMessage || null,
            note: note || null,
            priceAtTime: 0, // Fallback for single item purchases without known price
            quantity: 1,
          }]
        }
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
