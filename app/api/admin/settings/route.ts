import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { businessName, address, phone, email, instagram, facebook, aboutText } = body;

    const existing = await prisma.settings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.settings.update({
        where: { id: existing.id },
        data: {
          ...(businessName !== undefined && { businessName }),
          ...(address !== undefined && { address }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(instagram !== undefined && { instagram }),
          ...(facebook !== undefined && { facebook }),
          ...(aboutText !== undefined && { aboutText }),
        },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          businessName: businessName || 'The Cake Shop',
          address: address || '',
          phone: phone || '',
          email: email || '',
          instagram: instagram || '',
          facebook: facebook || '',
          aboutText: aboutText || '',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('PATCH /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
