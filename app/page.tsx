import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CakeCollection from '@/components/CakeCollection';
import OrderSection from '@/components/OrderSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
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
  rating: number;
}

async function getCakes() {
  try {
    const cakes = await prisma.cake.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
    return cakes;
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

export default async function HomePage() {
  const [cakes, settings] = await Promise.all([getCakes(), getSettings()]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection settings={settings} />
        <CakeCollection cakes={cakes} />
        <OrderSection />
        <AboutSection settings={settings} />
        <ContactSection settings={settings} />
      </main>
      <Footer />
    </>
  );
}
