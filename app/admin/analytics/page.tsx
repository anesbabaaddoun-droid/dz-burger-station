'use client';

import { useState, useMemo } from 'react';
import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';

type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  total: number;
  source: 'Website' | 'AI Call';
  status: string;
  items: OrderItem[];
  createdAt?: { toDate: () => Date };
};

type MenuItem = {
  id: string;
  categoryId: string;
};

function toDate(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days'>('7days');

  const { data: ordersRaw, isLoading: ordersLoading } = useRealtimeCollection('orders', 'createdAt');
  const { data: menuItemsRaw, isLoading: menuLoading } = useRealtimeCollection('menuItems');

  const orders = ordersRaw as unknown as Order[];
  const menuItems = menuItemsRaw as unknown as MenuItem[];

  const isLoading = ordersLoading || menuLoading;

  const daysBack = timePeriod === '7days' ? 7 : 30;

  const filteredOrders = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    return orders.filter((o) => {
      if (o.status === 'Cancelled') return false;
      const d = toDate(o.createdAt);
      return d ? d >= cutoff : false;
    });
  }, [orders, daysBack]);

  // Revenue trend
  const revenueData = useMemo(() => {
    if (timePeriod === '7days') {
      const buckets: { day: string; revenue: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        buckets.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: 0 });
      }
      filteredOrders.forEach((o) => {
        const d = toDate(o.createdAt);
        if (!d) return;
        const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
        const idx = 6 - diffDays;
        if (idx >= 0 && idx < 7) buckets[idx].revenue += o.total || 0;
      });
      return buckets;
    } else {
      const buckets = [
        { day: 'Week 1', revenue: 0 },
        { day: 'Week 2', revenue: 0 },
        { day: 'Week 3', revenue: 0 },
        { day: 'Week 4', revenue: 0 },
      ];
      filteredOrders.forEach((o) => {
        const d = toDate(o.createdAt);
        if (!d) return;
        const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
        const weekIdx = 3 - Math.floor(diffDays / 7);
        if (weekIdx >= 0 && weekIdx < 4) buckets[weekIdx].revenue += o.total || 0;
      });
      return buckets;
    }
  }, [filteredOrders, timePeriod]);

  // Top products
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; orders: number; revenue: number }>();
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const existing = map.get(item.itemId) ?? { name: item.name, orders: 0, revenue: 0 };
        existing.orders += item.quantity;
        existing.revenue += item.price * item.quantity;
        map.set(item.itemId, existing);
      });
    });
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  // Order source distribution
  const sourceData = useMemo(() => {
    const total = filteredOrders.length;
    const websiteCount = filteredOrders.filter((o) => o.source === 'Website').length;
    const aiCount = filteredOrders.filter((o) => o.source === 'AI Call').length;
    if (total === 0) {
      return [
        { name: 'Website', value: 0, color: '#2563EB' },
        { name: 'AI Call', value: 0, color: '#7C3AED' },
      ];
    }
    return [
      { name: 'Website', value: Math.round((websiteCount / total) * 100), color: '#2563EB' },
      { name: 'AI Call', value: Math.round((aiCount / total) * 100), color: '#7C3AED' },
    ];
  }, [filteredOrders]);

  // Category performance
  const categoryPerformance = useMemo(() => {
    const itemToCategory = new Map<string, string>();
    menuItems.forEach((m) => itemToCategory.set(m.id, m.categoryId));

    const map = new Map<string, { revenue: number; orders: number }>();
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const catId = itemToCategory.get(item.itemId) || 'Other';
        const existing = map.get(catId) ?? { revenue: 0, orders: 0 };
        existing.revenue += item.price * item.quantity;
        existing.orders += item.quantity;
        map.set(catId, existing);
      });
    });

    return Array.from(map.entries())
      .map(([id, val]) => ({ name: capitalize(id), ...val }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, menuItems]);

  const maxRevenue = Math.max(1, ...revenueData.map((d) => d.revenue));
  const maxCategoryRevenue = Math.max(1, ...categoryPerformance.map((c) => c.revenue));
  const totalOrdersCount = filteredOrders.length;

  if (isLoading) {
    return <div className="py-24 text-center text-[#6B7280]">Loading analytics…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Analytics</h1>
          <p className="text-[#6B7280] mt-1">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimePeriod('7days')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${timePeriod === '7days'
                ? 'bg-[#B91C1C] text-white'
                : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
              }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimePeriod('30days')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${timePeriod === '30days'
                ? 'bg-[#B91C1C] text-white'
                : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
              }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Revenue Trend</h2>
        {revenueData.every((d) => d.revenue === 0) ? (
          <p className="text-center text-[#9CA3AF] py-12">No revenue data for this period</p>
        ) : (
          <div className="flex items-end justify-around gap-2 h-64">
            {revenueData.map((data, idx) => {
              const height = (data.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-[#B91C1C] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                    title={`${data.revenue.toLocaleString()} DA`}
                  />
                  <p className="text-xs text-[#6B7280] font-semibold">{data.day}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Source Distribution */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Order Source</h2>
          <div className="flex items-center justify-center gap-12">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={sourceData[0].color} strokeWidth="12"
                  strokeDasharray={`${(sourceData[0].value / 100) * 251.2} 251.2`}
                />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={sourceData[1].color} strokeWidth="12"
                  strokeDasharray={`${(sourceData[1].value / 100) * 251.2} 251.2`}
                  strokeDashoffset={-((sourceData[0].value / 100) * 251.2)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1A1A1A]">{totalOrdersCount}</p>
                  <p className="text-xs text-[#6B7280]">orders</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {sourceData.map((source, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{source.name}</p>
                    <p className="text-sm text-[#6B7280]">{source.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-center text-[#9CA3AF] py-8">No products sold in this period</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                    <p className="text-xs text-[#6B7280]">{product.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#B91C1C]">{product.revenue.toLocaleString()} DA</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Category Performance</h2>
        {categoryPerformance.length === 0 ? (
          <p className="text-center text-[#9CA3AF] py-8">No category data for this period</p>
        ) : (
          <div className="space-y-6">
            {categoryPerformance.map((category, idx) => {
              const width = (category.revenue / maxCategoryRevenue) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#1A1A1A]">{category.name}</p>
                    <div className="text-right">
                      <p className="font-bold text-[#B91C1C]">{category.revenue.toLocaleString()} DA</p>
                      <p className="text-xs text-[#6B7280]">{category.orders} orders</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#B91C1C] h-full rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}