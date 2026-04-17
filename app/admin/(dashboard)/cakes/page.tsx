'use client';

import { useState, useEffect, useCallback } from 'react';
import CakesGrid from '@/components/admin/CakesGrid';
import { RefreshCw } from 'lucide-react';

interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  flavors: string[];
  sizes: string[];
  rating: number;
  isVisible: boolean;
}

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCakes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cakes');
      if (res.ok) setCakes(await res.json());
    } catch {
      console.error('Failed to fetch cakes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCakes();
  }, [fetchCakes]);

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-white text-2xl lg:text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Cakes
          </h1>
          <p className="text-white/40 text-sm">{cakes.length} cakes in catalogue</p>
        </div>
        <button
          onClick={fetchCakes}
          id="refresh-cakes-btn"
          className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/15 text-white/60 rounded-xl text-sm hover:text-white hover:border-white/30 transition-colors min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[#6a8a5b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm mt-4">Loading cakes...</p>
        </div>
      ) : (
        <CakesGrid cakes={cakes} onRefresh={fetchCakes} />
      )}
    </div>
  );
}
