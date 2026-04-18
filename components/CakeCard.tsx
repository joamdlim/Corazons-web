'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/CartContext';

interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  flavors: string[];
  sizes: string[];
  rating: number;
  variants?: { flavor: string; size: string; price: number }[];
}

interface CakeCardProps {
  cake: Cake;
}

export default function CakeCard({ cake }: CakeCardProps) {
  const { addToCart } = useCart();
  const startingPrice = cake.variants && cake.variants.length > 0
    ? Math.min(...cake.variants.map((v) => v.price))
    : cake.price;

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
      style={{ border: '1px solid rgba(244,167,185,0.15)' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#fdf8f3]">
        <Image
          src={cake.imageUrl}
          alt={`${cake.name} — artisan custom cake`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price pill on hover */}
        <div className="absolute top-3 right-3 bg-[#6a8a5b] text-[#ffffff] px-3 py-1 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          From ₱{startingPrice.toFixed(0)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(cake.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              }`}
            />
          ))}
          <span className="text-[#888780] text-xs ml-1">({cake.rating})</span>
        </div>

        <h3
          className="text-[#2c2c2c] font-semibold text-base mb-2 line-clamp-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {cake.name}
        </h3>

        <p className="text-[#888780] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {cake.description}
        </p>

        {/* Price & CTA row */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span
              className="text-[#2c2c2c] font-bold text-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              ₱{startingPrice.toFixed(0)}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/cake/${cake.id}`}
              id={`view-cake-${cake.id}`}
              className="p-2 border border-[#6a8a5b]/40 text-[#6a8a5b] rounded-full hover:bg-[#6a8a5b]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`View details for ${cake.name}`}
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                const f = cake.flavors[0] || 'Original';
                const s = cake.sizes[0] || 'Standard';
                const v = cake.variants?.find((v) => v.flavor === f && v.size === s);
                addToCart({
                  cakeId: cake.id,
                  name: cake.name,
                  flavor: f,
                  size: s,
                  price: v ? v.price : cake.price,
                  quantity: 1,
                  imageUrl: cake.imageUrl,
                });
              }}
              id={`order-cake-${cake.id}`}
              className="px-4 py-2 bg-[#6a8a5b] text-[#ffffff] rounded-full text-sm font-semibold hover:bg-[#58764a] transition-all duration-200 min-h-[44px] flex items-center"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
