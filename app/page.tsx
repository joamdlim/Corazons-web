import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CakeCollection from '@/components/CakeCollection';
import OrderSection from '@/components/OrderSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

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

async function getCakes(): Promise<Cake[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cakes`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
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
