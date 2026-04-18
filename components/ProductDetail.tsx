'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';
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

export default function ProductDetail({ cake }: { cake: Cake }) {
  const { addToCart } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavors[0] || '');
  const [selectedSize, setSelectedSize] = useState(cake.sizes[0] || '');

  const activeVariant = cake.variants?.find(
    (v) => v.flavor === selectedFlavor && v.size === selectedSize
  );
  const displayPrice = activeVariant ? activeVariant.price : cake.price;
  
  // Starting price (lowest variant, or base price)
  const startingPrice = cake.variants && cake.variants.length > 0 
    ? Math.min(...cake.variants.map((v) => v.price))
    : cake.price;

  return (
    <section id="product-detail" className="py-20 lg:py-28 bg-[#fdf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Large Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl">
              <Image
                src={cake.imageUrl}
                alt={`${cake.name} — product detail`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
            </div>
            {/* Floating price tag */}
            <div className="absolute -bottom-4 -right-4 bg-[#6a8a5b] rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-[#ffffff] text-xs font-semibold uppercase tracking-wide">Starting from</div>
              <div
                className="text-[#ffffff] font-bold text-2xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                ₱{startingPrice.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <span className="inline-flex w-fit px-3 py-1 bg-[#6a8a5b]/15 border border-[#6a8a5b]/30 text-[#6a8a5b] text-xs font-semibold rounded-full tracking-widest uppercase">
              ✦ Signature Cake
            </span>

            {/* Name */}
            <h2
              className="text-[#2c2c2c]"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                lineHeight: '1.15',
              }}
            >
              {cake.name}
            </h2>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(cake.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#888780] text-sm">
                {cake.rating} out of 5
              </span>
            </div>

            {/* Description */}
            <p className="text-[#888780] leading-relaxed text-base">{cake.description}</p>

            {/* Flavor Pills */}
            {cake.flavors.length > 0 && (
              <div>
                <p className="text-[#2c2c2c] font-semibold text-sm mb-3">Choose Flavor</p>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      id={`flavor-${flavor.toLowerCase().replace(/\s/g, '-')}`}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                        selectedFlavor === flavor
                          ? 'bg-[#6a8a5b] text-[#ffffff] shadow-md'
                          : 'bg-white border border-gray-200 text-[#888780] hover:border-[#6a8a5b] hover:text-[#6a8a5b]'
                      }`}
                    >
                      {selectedFlavor === flavor && <Check className="w-3 h-3" />}
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Pills */}
            {cake.sizes.length > 0 && (
              <div>
                <p className="text-[#2c2c2c] font-semibold text-sm mb-3">Choose Size</p>
                <div className="flex flex-wrap gap-2">
                  {cake.sizes.map((size) => (
                    <button
                      key={size}
                      id={`size-${size.toLowerCase().replace(/\s/g, '-')}`}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                        selectedSize === size
                          ? 'bg-[#a8c5a0] text-white shadow-md'
                          : 'bg-white border border-gray-200 text-[#888780] hover:border-[#a8c5a0] hover:text-[#a8c5a0]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price display */}
            <div className="flex items-center gap-3">
              <span className="text-[#888780] text-sm">Total:</span>
              <span
                className="text-[#2c2c2c] font-bold text-3xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                ₱{displayPrice.toFixed(2)}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                addToCart({
                  cakeId: cake.id,
                  name: cake.name,
                  flavor: selectedFlavor,
                  size: selectedSize,
                  price: displayPrice,
                  quantity: 1,
                  imageUrl: cake.imageUrl,
                });
              }}
              id="product-order-btn"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6a8a5b] text-[#ffffff] rounded-full font-semibold text-base hover:bg-[#58764a] transition-all duration-300 hover:shadow-xl hover:shadow-pink-400/30 hover:-translate-y-0.5 min-h-[44px] w-full sm:w-auto"
            >
              Add to Cart
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
