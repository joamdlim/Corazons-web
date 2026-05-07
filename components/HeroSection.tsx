import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function HeroSection({ settings }: { settings?: any }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#1a1a1a] flex items-center overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#6a8a5b]/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#a8c5a0]/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#6a8a5b]/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[85vh]">
          {/* Text Content */}
          <div className="flex flex-col justify-center order-1 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 mx-auto lg:mx-0">
              <span className="px-4 py-1.5 bg-[#6a8a5b]/15 border border-[#6a8a5b]/30 rounded-full text-[#6a8a5b] text-xs font-medium tracking-widest uppercase">
                ✦ Artisan Bakery
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                lineHeight: '1.1',
                fontWeight: 700,
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: (settings?.heroHeadline || "Delight in <span class='text-[#6a8a5b] italic'>Every</span><br/>Bite ✦").replace(/✦/g, '') }} />
              {(!settings?.heroHeadline || settings.heroHeadline.includes('✦')) && ' ✦'}
            </h1>

            {/* Subtext */}
            <p
              className="text-white/60 mb-10 max-w-lg mx-auto lg:mx-0 whitespace-pre-wrap"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: '1.8' }}
            >
              {settings?.heroSubtext || "Custom artisan cakes crafted with passion, premium ingredients, and a whole lot of love. From birthdays to weddings — every occasion deserves a masterpiece."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/menu"
                id="hero-order-btn"
                className="px-8 py-4 bg-[#6a8a5b] text-[#ffffff] rounded-full font-semibold text-base hover:bg-[#58764a] transition-all duration-300 hover:shadow-xl hover:shadow-pink-400/30 hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center"
              >
                Order Now
              </a>
              <a
                href="/menu"
                id="hero-menu-btn"
                className="px-8 py-4 border border-white/30 text-white rounded-full font-semibold text-base hover:border-[#6a8a5b]/60 hover:text-[#6a8a5b] transition-all duration-300 hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center backdrop-blur-sm"
              >
                View Menu
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-14 justify-center lg:justify-start">
              {[
                { value: '500+', label: 'Cakes Made' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '100%', label: 'Made with Love' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div
                    className="text-[#6a8a5b] font-bold"
                    style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontFamily: 'Playfair Display, serif' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex items-center justify-center order-2 lg:order-2">
            {/* Glow rings */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full bg-[#6a8a5b]/10 animate-pulse" />
            <div className="absolute w-60 h-60 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] rounded-full bg-[#6a8a5b]/5 border border-[#6a8a5b]/20" />

            {/* Main Image */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-4 border-[#6a8a5b]/30 shadow-2xl shadow-pink-400/20">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop"
                alt="Artisan celebration cake — dark chocolate ganache with roses"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 420px"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute top-6 right-4 lg:right-0 bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-[#6a8a5b] text-xs font-semibold tracking-wide">✦ Fresh Daily</div>
              <div className="text-white/60 text-xs mt-0.5">Baked to Order</div>
            </div>

            <div className="absolute bottom-6 left-4 lg:left-0 bg-[#6a8a5b] rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-[#ffffff] text-xs font-bold">Custom Designs</div>
              <div className="text-[#ffffff]/70 text-xs mt-0.5">Your Vision, Our Craft</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="/#collection"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-[#6a8a5b] transition-colors group"
        aria-label="Scroll to cake collection"
      >
        <span className="text-xs tracking-widest uppercase">Explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}
