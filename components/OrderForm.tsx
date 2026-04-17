'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function OrderForm() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    pickupDate: '',
    customMessage: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty! Please add some cakes first.');
      return;
    }

    if (!formData.customerName || !formData.pickupDate) {
      toast.error('Please fill in all required fields (Name and Pickup Date).');
      return;
    }

    setLoading(true);
    
    // Serialize Cart into cakeName
    const formattedCakeName = items
      .map((i) => `${i.quantity}x ${i.name} (${i.size}, ${i.flavor})`)
      .join(' | ');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cakeType: 'Online Cart Order',
          cakeName: formattedCakeName,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit order');
      }
      toast.success('🎂 Your order has been placed! We\'ll be in touch soon.');
      clearCart();
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        pickupDate: '',
        customMessage: '',
        note: '',
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* CART SUMMARY */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <h3 className="text-[#2c2c2c] font-bold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Your Cart
        </h3>
        
        {items.length === 0 ? (
          <p className="text-sm text-[#888780] py-4 text-center">Your cart is currently empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#2c2c2c] truncate">{item.name}</h4>
                  <p className="text-xs text-[#888780] truncate">{item.size} • {item.flavor}</p>
                  <p className="text-xs font-medium text-[#6a8a5b] mt-1">${item.price.toFixed(2)} ea</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-100">
                    <button type="button" onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="p-1.5 text-gray-400 hover:text-[#6a8a5b]"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm font-medium text-[#2c2c2c] w-6 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-1.5 text-gray-400 hover:text-[#6a8a5b]"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.cartId)} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
              <span className="text-[#2c2c2c] font-semibold text-sm">Total</span>
              <span className="text-[#6a8a5b] font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="order-name" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
            Your Name <span className="text-[#6a8a5b]">*</span>
          </label>
          <input
            id="order-name"
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="order-email" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
            Email (Optional)
          </label>
          <input
            id="order-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@email.com"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm min-h-[44px]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label htmlFor="order-phone" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
            Phone Number
          </label>
          <input
            id="order-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm min-h-[44px]"
          />
        </div>
        {/* Pickup Date Calendar */}
        <div>
          <label htmlFor="order-pickup" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
            Pickup Date & Time <span className="text-[#6a8a5b]">*</span>
          </label>
          <input
            id="order-pickup"
            type="datetime-local"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm min-h-[44px]"
          />
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label htmlFor="order-message" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
          Custom Plaque Message (Optional)
        </label>
        <input
          id="order-message"
          type="text"
          name="customMessage"
          value={formData.customMessage}
          onChange={handleChange}
          placeholder="Happy Birthday, Sarah! 🎂"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm min-h-[44px]"
        />
      </div>

      {/* Special Notes */}
      <div>
        <label htmlFor="order-note" className="block text-[#2c2c2c] text-sm font-semibold mb-2">
          Special Instructions / Notes
        </label>
        <textarea
          id="order-note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Allergies, design preferences, dietary requirements..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#2c2c2c] placeholder-[#888780] focus:outline-none focus:border-[#6a8a5b] focus:ring-2 focus:ring-[#6a8a5b]/20 transition-all text-sm resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="submit-order-btn"
        disabled={loading || items.length === 0}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#6a8a5b] text-[#ffffff] rounded-full font-bold text-base hover:bg-[#58764a] transition-all duration-300 hover:shadow-xl hover:shadow-[#6a8a5b]/20 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Complete Order
          </>
        )}
      </button>
    </form>
  );
}
