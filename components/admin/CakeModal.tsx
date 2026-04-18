'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Loader2, Save } from 'lucide-react';

interface CakeFormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  flavors: string;
  sizes: string;
  rating: string;
}

interface CakeModalProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CakeFormData> & { id?: string };
  onClose: () => void;
  onSaved: () => void;
}

const defaultForm: CakeFormData = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  flavors: '',
  sizes: '6 inch, 8 inch, 10 inch',
  rating: '4.5',
};

export default function CakeModal({ mode, initialData, onClose, onSaved }: CakeModalProps) {
  const [form, setForm] = useState<CakeFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    imageUrl: initialData?.imageUrl || '',
    flavors: Array.isArray(initialData?.flavors)
      ? (initialData.flavors as unknown as string[]).join(', ')
      : (initialData?.flavors as string) || '',
    sizes: Array.isArray(initialData?.sizes)
      ? (initialData.sizes as unknown as string[]).join(', ')
      : (initialData?.sizes as string) || '6 inch, 8 inch, 10 inch',
    rating: initialData?.rating?.toString() || '4.5',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/admin/cakes/${initialData.id}`
        : '/api/admin/cakes';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save cake');
      toast.success(mode === 'edit' ? 'Cake updated!' : 'Cake created!');
      onSaved();
      onClose();
    } catch {
      toast.error('Failed to save cake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#1e1e1e]">
          <h3 className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
            {mode === 'create' ? 'Add New Cake' : 'Edit Cake'}
          </h3>
          <button
            onClick={onClose}
            id="close-cake-modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">
              Name <span className="text-[#6a8a5b]">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              id="cake-modal-name"
              placeholder="Classic Red Velvet"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">
              Description <span className="text-[#6a8a5b]">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              id="cake-modal-description"
              placeholder="A moist and decadent cake..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-white/60 text-sm mb-1.5 font-medium">
                Price (₱) <span className="text-[#6a8a5b]">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                id="cake-modal-price"
                placeholder="65.00"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Rating (0–5)</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={handleChange}
                id="cake-modal-rating"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">
              Image URL <span className="text-[#6a8a5b]">*</span>
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
              id="cake-modal-image"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">
              Flavors <span className="text-white/30 text-xs">(comma-separated)</span>
            </label>
            <input
              name="flavors"
              value={form.flavors}
              onChange={handleChange}
              id="cake-modal-flavors"
              placeholder="Vanilla, Chocolate, Strawberry"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">
              Sizes <span className="text-white/30 text-xs">(comma-separated)</span>
            </label>
            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              id="cake-modal-sizes"
              placeholder="6 inch, 8 inch, 10 inch"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white text-sm rounded-xl hover:bg-white/8 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              id="save-cake-btn"
              className="flex items-center gap-2 px-5 py-2 bg-[#6a8a5b] text-[#ffffff] rounded-xl text-sm font-semibold hover:bg-[#58764a] transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {mode === 'create' ? 'Add Cake' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
