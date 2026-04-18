import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, price, imageUrl, flavors, sizes, rating, isVisible } = body;

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      flavors?: string[];
      sizes?: string[];
      rating?: number;
      isVisible?: boolean;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (flavors !== undefined) {
      updateData.flavors = Array.isArray(flavors)
        ? flavors
        : flavors.split(',').map((f: string) => f.trim()).filter(Boolean);
    }
    if (sizes !== undefined) {
      updateData.sizes = Array.isArray(sizes)
        ? sizes
        : sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (rating !== undefined) updateData.rating = parseFloat(rating);

    const cake = await prisma.cake.update({ where: { id }, data: updateData });
    revalidatePath('/');
    revalidatePath('/menu');
    return NextResponse.json(cake);
  } catch (error) {
    console.error('PATCH /api/admin/cakes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update cake' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.cake.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/menu');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/cakes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete cake' }, { status: 500 });
  }
}
