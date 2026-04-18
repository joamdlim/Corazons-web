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
  variants: { flavor: string; size: string; price: number }[];
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
  variants: [],
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
    variants: (initialData?.variants as { flavor: string; size: string; price: number }[]) || [],
  });
  
  // Create a fast lookup for existing variants
  const [variantPrices, setVariantPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (initialData?.variants && Array.isArray(initialData.variants)) {
      initialData.variants.forEach((v) => {
        map[`${v.flavor}-${v.size}`] = v.price.toString();
      });
    }
    return map;
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || (!form.imageUrl && !imageFile)) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }
    setLoading(true);
    try {
      let finalImageUrl = form.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        toast.error('Please provide an image');
        setLoading(false);
        return;
      }

      const url = mode === 'edit' && initialData?.id
        ? `/api/admin/cakes/${initialData.id}`
        : '/api/admin/cakes';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      // Compute variants
      const activeVariants: { flavor: string; size: string; price: number }[] = [];
      const fList = form.flavors.split(',').map(f => f.trim()).filter(Boolean);
      const sList = form.sizes.split(',').map(s => s.trim()).filter(Boolean);
      
      const basePrice = parseFloat(form.price);
      
      fList.forEach(flavor => {
        sList.forEach(size => {
          const key = `${flavor}-${size}`;
          const overriddenPrice = variantPrices[key];
          activeVariants.push({
            flavor,
            size,
            price: overriddenPrice ? parseFloat(overriddenPrice) : basePrice
          });
        });
      });

      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        variants: activeVariants,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
              Cake Image <span className="text-[#6a8a5b]">*</span>
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/15">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#6a8a5b] file:text-white hover:file:bg-[#58764a] transition-all cursor-pointer"
              />
            </div>
            <p className="text-white/30 text-xs mt-1.5">Upload an image of the cake.</p>
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

          {/* Dynamic Variant Prices Grid */}
          {(form.flavors.trim() || form.sizes.trim()) && (
            <div className="pt-2 border-t border-white/10">
              <label className="block text-white/60 text-sm mb-3">
                Variant Prices (Leave blank for base price)
              </label>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {form.flavors.split(',').map(f => f.trim()).filter(Boolean).length === 0 
                  ? <p className="text-xs text-white/30 italic">Please add flavors first.</p> 
                  : form.sizes.split(',').map(s => s.trim()).filter(Boolean).length === 0
                  ? <p className="text-xs text-white/30 italic">Please add sizes first.</p>
                  : form.flavors.split(',').map(f => f.trim()).filter(Boolean).map(flavor => (
                  <div key={flavor} className="space-y-2">
                    <div className="text-xs font-semibold text-[#6a8a5b]">{flavor}</div>
                    {form.sizes.split(',').map(s => s.trim()).filter(Boolean).map(size => {
                      const key = `${flavor}-${size}`;
                      return (
                        <div key={key} className="flex items-center gap-3 pl-3">
                          <span className="text-white/50 text-xs w-20 truncate">{size}</span>
                          <input
                            type="number"
                            step="0.01"
                            value={variantPrices[key] || ''}
                            onChange={(e) => setVariantPrices(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder={`Base: ₱${form.price || '0'}`}
                            className="flex-1 px-3 py-1.5 bg-white/5 border border-white/15 rounded-lg text-white text-xs placeholder-white/20 focus:outline-none focus:border-[#6a8a5b]/60"
                          />
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

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
