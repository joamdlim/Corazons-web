import CakeCard from './CakeCard';

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

interface CakeCollectionProps {
  cakes: Cake[];
}

// Loading skeleton for CakeCard
function CakeCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-50 animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-100 rounded-full" />
          ))}
        </div>
        <div className="h-5 bg-gray-100 rounded-full w-3/4" />
        <div className="h-4 bg-gray-100 rounded-full w-full" />
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
          <div className="h-10 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function CakeCollection({ cakes }: CakeCollectionProps) {
  return (
    <section id="collection" className="py-20 lg:py-28 bg-[#fdf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[#6a8a5b] text-sm font-semibold tracking-widest uppercase mb-3">
            Our Creations
          </p>
          <h2
            className="text-[#2c2c2c] mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Cake Collection
          </h2>
          <p className="text-[#888780] max-w-xl mx-auto text-base leading-relaxed">
            Each cake is handcrafted with seasonal ingredients and made fresh to
            order. Choose your favorite or let us create something uniquely yours.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <span className="w-12 h-0.5 bg-[#6a8a5b] rounded-full" />
            <span className="w-3 h-0.5 bg-[#6a8a5b]/40 rounded-full" />
          </div>
        </div>

        {/* Cake Grid */}
        {cakes.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CakeCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/menu"
            id="view-all-cakes-btn"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#6a8a5b] text-[#6a8a5b] rounded-full font-semibold hover:bg-[#6a8a5b] hover:text-[#ffffff] transition-all duration-300 min-h-[44px]"
          >
            View Full Menu
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
