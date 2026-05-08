import Image from 'next/image';


export default function AboutSection({ settings }: { settings?: any }) {
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
                {settings?.aboutHeadline || 'Baked with Love'}
              </h2>
              <p className="text-[#888780] leading-loose text-base whitespace-pre-wrap">
                {settings?.aboutText || "Corazón Cakes began as a weekend passion project in a tiny kitchen, driven by one simple belief: that cake is more than dessert — it's the centerpiece of life's most beautiful moments.\n\nToday, we craft hundreds of custom cakes each month, each one as unique as the story it celebrates. Whether it's a child's first birthday or an intimate anniversary dinner, we pour the same passion into every tier, every flower, every slice."}
              </p>
            </div>
          </div>

          {/* Right: Baking Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
              <Image
                src={settings?.aboutImage || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop"}
                alt="Baker decorating a custom cake with flowers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />
            </div>


            {/* Top accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#a8c5a0]/20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
