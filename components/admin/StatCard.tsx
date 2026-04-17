import { TrendingUp, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, color = 'text-[#6a8a5b]', description }: StatCardProps) {
  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <TrendingUp className="w-4 h-4 text-[#a8c5a0]" />
      </div>
      <div
        className={`text-3xl font-bold mb-1 ${color}`}
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {value}
      </div>
      <div className="text-white/60 text-sm font-medium">{title}</div>
      {description && <div className="text-white/30 text-xs mt-1">{description}</div>}
    </div>
  );
}
