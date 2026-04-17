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

export default async function HomePage() {
  const cakes = await getCakes();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CakeCollection cakes={cakes} />
        <OrderSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
