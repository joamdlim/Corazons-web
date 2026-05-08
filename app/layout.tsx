import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/components/CartContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Corazón Cakes — Delight in Every Bite',
  description:
    'Custom artisan cakes baked with love. Order your dream cake for birthdays, weddings, and every sweet occasion.',
  keywords: 'custom cakes, artisan bakery, birthday cakes, wedding cakes, cake orders',
  openGraph: {
    title: 'Corazón Cakes — Delight in Every Bite',
    description: 'Custom artisan cakes baked with love.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid #333',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#6a8a5b',
                  secondary: '#1a1a1a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
