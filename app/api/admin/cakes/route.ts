import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cakes = await prisma.cake.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cakes);
  } catch (error) {
    console.error('GET /api/admin/cakes error:', error);
    return NextResponse.json({ error: 'Failed to fetch cakes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, flavors, sizes, rating, variants } = body;

    if (!name || !description || price === undefined || !imageUrl) {
      return NextResponse.json(
        { error: 'name, description, price, and imageUrl are required.' },
        { status: 400 }
      );
    }

    const cake = await prisma.cake.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        flavors: Array.isArray(flavors)
          ? flavors
          : (flavors || '').split(',').map((f: string) => f.trim()).filter(Boolean),
        sizes: Array.isArray(sizes)
          ? sizes
          : (sizes || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        rating: parseFloat(rating) || 0,
        variants: variants || [],
        isVisible: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/menu');
    return NextResponse.json(cake, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cakes error:', error);
    return NextResponse.json({ error: 'Failed to create cake' }, { status: 500 });
  }
}
