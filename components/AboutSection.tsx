import Image from 'next/image';
import { Heart, Award, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Baked with Love',
    description: 'Every cake is made with intention — from the ingredients we source to the frosting we pipe.',
  },
  {
    icon: Award,
    title: 'Premium Ingredients',
    description: 'We partner with local farms for fresh eggs, cream, and seasonal fruits.',
  },
  {
    icon: Sparkles,
    title: 'Fully Customizable',
    description: 'Your vision, our expertise. We create cakes that tell your unique story.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#fdf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Brand Story */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div>
              <p className="text-[#6a8a5b] text-sm font-semibold tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h2
                className="text-[#2c2c2c] mb-6"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: '1.2',
                }}
              >
                Baked with{' '}
                <span className="italic text-[#6a8a5b]">Love</span>
              </h2>
              <p className="text-[#888780] leading-loose text-base mb-4">
                Corazón Cakes began as a weekend passion project in a tiny kitchen, driven by one simple
                belief: that cake is more than dessert — it&apos;s the centerpiece of life&apos;s most beautiful
                moments.
              </p>
              <p className="text-[#888780] leading-loose text-base">
                Today, we craft hundreds of custom cakes each month, each one as unique as the story it
                celebrates. Whether it&apos;s a child&apos;s first birthday or an intimate anniversary dinner,
                we pour the same passion into every tier, every flower, every slice.
              </p>
            </div>

            {/* Feature list */}
            <div className="grid gap-5">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#6a8a5b]/10 flex items-center justify-center group-hover:bg-[#6a8a5b]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#6a8a5b]" />
                  </div>
                  <div>
                    <h4 className="text-[#2c2c2c] font-semibold text-base mb-1"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      {title}
                    </h4>
                    <p className="text-[#888780] text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/#order"
              id="about-order-btn"
              className="inline-flex items-center gap-2 self-start px-7 py-3.5 bg-[#6a8a5b] text-[#ffffff] rounded-full font-semibold hover:bg-[#58764a] transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/30 min-h-[44px]"
            >
              Order Your Cake
              <span>→</span>
            </a>
          </div>

          {/* Right: Baking Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1000&fit=crop"
                alt="Baker decorating a custom cake with flowers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-pink-50">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div
                    className="text-[#6a8a5b] font-bold text-2xl"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    500+
                  </div>
                  <div className="text-[#888780] text-xs">Happy Clients</div>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="text-center">
                  <div
                    className="text-[#6a8a5b] font-bold text-2xl"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    4.9★
                  </div>
                  <div className="text-[#888780] text-xs">Google Rating</div>
                </div>
              </div>
            </div>

            {/* Top accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#a8c5a0]/20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
