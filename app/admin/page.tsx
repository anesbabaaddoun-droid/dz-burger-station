'use client';

import { useMemo } from 'react';
import { TrendingUp, Package, Phone, Clock } from 'lucide-react';
import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';

type Order = {
  id: string;
  customerName: string;
  total: number;
  status: string;
  source: 'Website' | 'AI Call';
  createdAt?: { toDate: () => Date };
};

type AiCall = {
  id: string;
  status: string;
};

function toDate(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

function isToday(date: Date | null): boolean {
  if (!date) return false;
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-orange-100 text-orange-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const sourceColors: { [key: string]: string } = {
  Website: 'bg-blue-100 text-blue-800',
  'AI Call': 'bg-purple-100 text-purple-800',
};

export default function AdminDashboard() {
  const { data: ordersRaw, isLoading: ordersLoading } = useRealtimeCollection('orders', 'createdAt');
  const { data: aiCallsRaw, isLoading: callsLoading } = useRealtimeCollection('aiCalls', 'createdAt');

  const orders = ordersRaw as unknown as Order[];
  const aiCalls = aiCallsRaw as unknown as AiCall[];
  const isLoading = ordersLoading || callsLoading;

  const todaysOrders = useMemo(
    () => orders.filter((o) => isToday(toDate(o.createdAt))),
    [orders]
  );

  const todaysRevenue = useMemo(
    () => todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [todaysOrders]
  );

  const pendingAiCalls = useMemo(
    () => aiCalls.filter((c) => c.status === 'Pending').length,
    [aiCalls]
  );

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').length,
    [orders]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const stats = [
    { label: "Today's Orders", value: String(todaysOrders.length), icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: "Today's Revenue", value: `${todaysRevenue.toLocaleString('ar-DZ')} DA`, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Pending AI Calls', value: String(pendingAiCalls), icon: Phone, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Orders', value: String(activeOrders), icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  if (isLoading) {
    return <div className="py-24 text-center text-[#6B7280]">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1A1A1A] mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-center text-[#9CA3AF] py-10">No orders yet</p>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-[#E5E7EB] rounded-lg p-4 space-y-3 w-full max-w-full box-border overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-mono text-[#6B7280]">{order.id}</p>
                      <p className="font-bold text-[#1A1A1A]">{order.customerName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
                    <div>
                      <p className="text-xs text-[#6B7280]">Source</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${sourceColors[order.source] ?? ''}`}>
                        {order.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280]">Total</p>
                      <p className="font-bold text-[#1A1A1A]">{order.total.toLocaleString('ar-DZ')} DA</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-mono text-[#1A1A1A]">{order.id}</td>
                      <td className="py-4 px-4 text-sm text-[#1A1A1A]">{order.customerName}</td>
                      <td className="py-4 px-4 text-sm font-bold text-[#1A1A1A]">{order.total.toLocaleString('ar-DZ')} DA</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${sourceColors[order.source] ?? ''}`}>
                          {order.source}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}