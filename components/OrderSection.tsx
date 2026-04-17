'use client';

import OrderForm from './OrderForm';

export default function OrderSection() {
  return (
    <section id="order" className="py-20 lg:py-28 bg-[#fdf8f3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[#6a8a5b] text-sm font-semibold tracking-widest uppercase mb-3">
            Reserve Your Date
          </p>
          <h2
            className="text-[#2c2c2c] mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Place Your Order
          </h2>
          <p className="text-[#888780] max-w-xl mx-auto text-base">
            Tell us about your dream cake and select your preferred pickup date.
            We&apos;ll confirm your order within 24 hours.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <span className="w-12 h-0.5 bg-[#6a8a5b] rounded-full" />
            <span className="w-3 h-0.5 bg-[#6a8a5b]/40 rounded-full" />
          </div>
        </div>

        {/* Centered Order Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 p-8 md:p-12">
          <div className="flex items-center justify-center gap-3 mb-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#6a8a5b]/15 flex items-center justify-center text-xl">
              🎂
            </div>
            <div className="text-left">
              <h3
                className="text-[#2c2c2c] font-semibold text-lg"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Your Order Details
              </h3>
              <p className="text-[#888780] text-xs">Fill in the fields below to get started</p>
            </div>
          </div>
          <OrderForm />
        </div>
      </div>
    </section>
  );
}
