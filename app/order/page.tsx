import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import OrderSection from '@/components/OrderSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Place Your Order — Corazón Cakes',
  description: 'Order your custom artisan cake. Select your pickup date and fill in your details.',
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fdf8f3] min-h-screen pt-16">
        {/* Header */}
        <div className="bg-[#1a1a1a] pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className="text-white mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              Place Your Order
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Select your pickup date and tell us about your dream cake. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
