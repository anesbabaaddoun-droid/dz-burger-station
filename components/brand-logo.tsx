import { Flame } from 'lucide-react';

export function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  return (
    <div
      className={`relative ${dims} rounded-full bg-gradient-to-br from-[#B91C1C] to-[#7A1212] flex items-center justify-center ring-2 ring-[#E8A33D]/50 shadow-[0_0_12px_rgba(232,163,61,0.25)]`}
    >
      <Flame className={`${iconSize} text-[#F5F1E8]`} strokeWidth={2.5} />
    </div>
  );
}
