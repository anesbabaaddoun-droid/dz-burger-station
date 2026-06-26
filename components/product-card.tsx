'use client';

import { MenuItem } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const formattedPrice = new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(item.basePrice);

  return (
    <Link href={`/product/${item.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-lg text-orange-600">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
