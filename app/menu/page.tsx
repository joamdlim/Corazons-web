import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import CakeCard from '@/components/CakeCard';
import Footer from '@/components/Footer';
import { Cake } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Full Cake Menu — Corazón Cakes',
  description: 'Browse our complete collection of artisan custom cakes. Filter by type, size, and flavor.',
};

interface CakeData {
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

async function getAllCakes() {
  try {
    const cakes = await prisma.cake.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
    return cakes as unknown as CakeData[];
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    return await prisma.settings.findFirst();
  } catch {
    return null;
  }
}

export default async function MenuPage() {
  const [cakes, settings] = await Promise.all([getAllCakes(), getSettings()]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fdf8f3]">
        {/* Header */}
        <div className="bg-[#1a1a1a] pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6a8a5b]/15 border border-[#6a8a5b]/30 rounded-full text-[#6a8a5b] text-xs font-semibold tracking-widest uppercase mb-6">
              <Cake className="w-3.5 h-3.5" />
              Our Menu
            </div>
            <h1
              className="text-white mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              {settings?.menuHeadline || 'Full Cake Menu'}
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-base whitespace-pre-wrap">
              {settings?.menuSubtext || 'Every cake is handcrafted and made to order. Browse all our flavors and designs — or let us create something custom just for you.'}
            </p>
          </div>
        </div>

        {/* Cakes Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {cakes.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-[#6a8a5b]/15 flex items-center justify-center mx-auto mb-4">
                  <Cake className="w-8 h-8 text-[#6a8a5b]" />
                </div>
                <p className="text-[#888780] text-lg">No cakes available yet. Check back soon!</p>
              </div>
            ) : (
              <>
                <p className="text-[#888780] text-sm mb-8">{cakes.length} cakes available</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {cakes.map((cake) => (
                    <CakeCard key={cake.id} cake={cake} />
                  ))}
                </div>
              </>
            )}


          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
