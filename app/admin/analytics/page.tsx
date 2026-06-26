'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days'>('7days');

  // Mock data
  const revenueData =
    timePeriod === '7days'
      ? [
          { day: 'Mon', revenue: 12000 },
          { day: 'Tue', revenue: 15000 },
          { day: 'Wed', revenue: 10000 },
          { day: 'Thu', revenue: 18000 },
          { day: 'Fri', revenue: 25000 },
          { day: 'Sat', revenue: 30000 },
          { day: 'Sun', revenue: 22000 },
        ]
      : [
          { day: 'Week 1', revenue: 112000 },
          { day: 'Week 2', revenue: 128000 },
          { day: 'Week 3', revenue: 145000 },
          { day: 'Week 4', revenue: 165000 },
        ];

  const topProducts = [
    { name: 'Classic Cheeseburger', orders: 145, revenue: 94250 },
    { name: 'Margherita Pizza', orders: 128, revenue: 89600 },
    { name: 'BBQ Bacon Burger', orders: 96, revenue: 76800 },
    { name: 'French Fries', orders: 187, revenue: 46750 },
    { name: 'Premium Milkshake', orders: 103, revenue: 41200 },
  ];

  const sourceData = [
    { name: 'Website', value: 65, color: '#2563EB' },
    { name: 'AI Call', value: 35, color: '#7C3AED' },
  ];

  const categoryPerformance = [
    { name: 'Burgers', revenue: 185000, orders: 245 },
    { name: 'Pizza', revenue: 142000, orders: 189 },
    { name: 'Sides', revenue: 98000, orders: 312 },
    { name: 'Drinks', revenue: 52000, orders: 241 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const maxCategoryRevenue = Math.max(...categoryPerformance.map((c) => c.revenue));

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
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              timePeriod === '7days'
                ? 'bg-[#B91C1C] text-white'
                : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimePeriod('30days')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              timePeriod === '30days'
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Source Distribution */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Order Source</h2>
          <div className="flex items-center justify-center gap-12">
            {/* Donut Chart */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={sourceData[0].color}
                  strokeWidth="12"
                  strokeDasharray={`${(sourceData[0].value / 100) * 251.2} 251.2`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={sourceData[1].color}
                  strokeWidth="12"
                  strokeDasharray={`${(sourceData[1].value / 100) * 251.2} 251.2`}
                  strokeDashoffset={-((sourceData[0].value / 100) * 251.2)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1A1A1A]">100</p>
                  <p className="text-xs text-[#6B7280]">orders</p>
                </div>
              </div>
            </div>

            {/* Legend */}
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
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Category Performance</h2>
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
      </div>
    </div>
  );
}
