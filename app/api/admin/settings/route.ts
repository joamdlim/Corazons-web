import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
    const {
      businessName, address, phone, email, instagram, facebook, aboutText,
      heroHeadline, heroSubtext, menuHeadline, menuSubtext, aboutHeadline,
      contactHeadline, contactSubtext, aboutImage, heroImage
    } = body;

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
          ...(heroHeadline !== undefined && { heroHeadline }),
          ...(heroSubtext !== undefined && { heroSubtext }),
          ...(menuHeadline !== undefined && { menuHeadline }),
          ...(menuSubtext !== undefined && { menuSubtext }),
          ...(aboutHeadline !== undefined && { aboutHeadline }),
          ...(contactHeadline !== undefined && { contactHeadline }),
          ...(contactSubtext !== undefined && { contactSubtext }),
          ...(aboutImage !== undefined && { aboutImage }),
          ...(heroImage !== undefined && { heroImage }),
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
          heroHeadline: heroHeadline || '',
          heroSubtext: heroSubtext || '',
          menuHeadline: menuHeadline || '',
          menuSubtext: menuSubtext || '',
          aboutHeadline: aboutHeadline || '',
          contactHeadline: contactHeadline || '',
          contactSubtext: contactSubtext || '',
          aboutImage: aboutImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop',
          heroImage: heroImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop',
        },
      });
    }

    revalidatePath('/');
    revalidatePath('/menu');
    return NextResponse.json(settings);
  } catch (error) {
    console.error('PATCH /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
