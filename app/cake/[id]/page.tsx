import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  flavors: string[];
  sizes: string[];
  variants?: { flavor: string; size: string; price: number }[];
  rating: number;
}

async function getCake(id: string): Promise<Cake | null> {
  try {
    const cake = await prisma.cake.findFirst({
      where: { id, isVisible: true },
    });
    if (!cake) return null;
    return cake as unknown as Cake;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cake = await getCake(id);
  if (!cake) return { title: 'Cake Not Found — Corazón Cakes' };
  return {
    title: `${cake.name} — Corazón Cakes`,
    description: cake.description,
  };
}

export default async function CakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cake = await getCake(id);
  if (!cake) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-[#fdf8f3] min-h-screen pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-[#888780]">
            <a href="/" className="hover:text-[#6a8a5b] transition-colors">Home</a>
            <span>/</span>
            <a href="/menu" className="hover:text-[#6a8a5b] transition-colors">Menu</a>
            <span>/</span>
            <span className="text-[#2c2c2c]">{cake.name}</span>
          </nav>
        </div>
        <ProductDetail cake={cake} />
      </main>
      <Footer />
    </>
  );
}
