'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Cake, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/CartContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Order', href: '/menu' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Corazón Cakes Home"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden transition-transform group-hover:scale-105 border border-[#6a8a5b]/20">
              <Image src="/logo.png" alt="Corazón Cakes Logo" fill className="object-cover" />
            </div>
            <span
              className="text-white text-lg font-semibold tracking-wide"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >

            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-[#6a8a5b] transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/menu"
              id="nav-order-btn"
              className="gap-2 px-5 py-2.5 bg-[#6a8a5b] text-[#ffffff] rounded-full text-sm font-semibold hover:bg-[#58764a] transition-all duration-200 hover:shadow-lg hover:shadow-pink-300/30 min-h-[44px] min-w-[44px] flex items-center"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 ? `Cart (${totalItems})` : 'Order Now'}
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="bg-[#1a1a1a]/98 backdrop-blur-md border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-[#6a8a5b] py-3 px-4 rounded-lg hover:bg-white/5 transition-colors text-base font-medium min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/menu"
            onClick={() => setIsOpen(false)}
            className="mt-2 px-5 py-3 bg-[#6a8a5b] text-[#ffffff] rounded-full text-base font-semibold text-center hover:bg-[#58764a] transition-colors min-h-[44px] flex items-center justify-center"
          >
            Order Now
          </a>
        </div>
      </div>
    </nav>
  );
}
