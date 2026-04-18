'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CakeModal from './CakeModal';
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';

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
  isVisible: boolean;
}

interface CakesGridProps {
  cakes: Cake[];
  onRefresh: () => void;
}

export default function CakesGrid({ cakes, onRefresh }: CakesGridProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/cakes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Cake deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete cake');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (cake: Cake) => {
    try {
      const res = await fetch(`/api/admin/cakes/${cake.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !cake.isVisible }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success(cake.isVisible ? 'Cake hidden from menu' : 'Cake visible on menu');
      onRefresh();
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div>
      {/* Add New Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setEditingCake(null); setShowModal(true); }}
          id="add-cake-btn"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6a8a5b] text-[#ffffff] rounded-xl font-semibold text-sm hover:bg-[#58764a] transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Add New Cake
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            className={`bg-[#1e1e1e] border rounded-2xl overflow-hidden transition-all ${cake.isVisible ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
          >
            {/* Image */}
            <div className="relative h-44 bg-black/20">
              <Image
                src={cake.imageUrl}
                alt={cake.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {!cake.isVisible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white/70 text-xs px-3 py-1 bg-black/50 rounded-full border border-white/20">
                    Hidden
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-semibold text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {cake.name}
                </h4>
                <span className="text-[#6a8a5b] font-bold text-base">₱{cake.price}</span>
              </div>
              <p className="text-white/40 text-xs line-clamp-2 mb-3">{cake.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-amber-300 text-xs">★ {cake.rating}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/30 text-xs">{cake.flavors.length} flavors</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleVisibility(cake)}
                  id={`toggle-visibility-${cake.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/8 hover:bg-white/15 text-white/60 hover:text-white rounded-lg text-xs transition-colors min-h-[44px]"
                  title={cake.isVisible ? 'Hide from menu' : 'Show on menu'}
                >
                  {cake.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setEditingCake(cake); setShowModal(true); }}
                  id={`edit-cake-${cake.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/8 hover:bg-[#6a8a5b]/20 text-white/60 hover:text-[#6a8a5b] rounded-lg text-xs transition-colors min-h-[44px] flex-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cake.id)}
                  id={`delete-cake-${cake.id}`}
                  disabled={deletingId === cake.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/8 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg text-xs transition-colors min-h-[44px] disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {cakes.length === 0 && (
          <div className="col-span-full text-center py-16 text-white/30">
            <p className="text-base mb-3">No cakes yet.</p>
            <button
              onClick={() => { setEditingCake(null); setShowModal(true); }}
              className="text-[#6a8a5b] text-sm hover:underline"
            >
              Add your first cake →
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CakeModal
          mode={editingCake ? 'edit' : 'create'}
          initialData={editingCake ? {
            id: editingCake.id,
            name: editingCake.name,
            description: editingCake.description,
            price: String(editingCake.price),
            imageUrl: editingCake.imageUrl,
            flavors: editingCake.flavors.join(', '),
            sizes: editingCake.sizes.join(', '),
            rating: String(editingCake.rating),
            variants: editingCake.variants,
          } : undefined}
          onClose={() => { setShowModal(false); setEditingCake(null); }}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}
