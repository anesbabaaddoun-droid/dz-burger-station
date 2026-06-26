'use client';

import { TrendingUp, Package, Phone, Clock } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data
  const stats = [
    { label: "Today's Orders", value: '12', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: "Today's Revenue", value: '45,600 DA', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Pending AI Calls', value: '3', icon: Phone, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Orders', value: '5', icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'Ahmed Hassan', total: '2,450 DA', status: 'Confirmed', source: 'Website' },
    { id: 'ORD002', customer: 'Fatima Ali', total: '1,800 DA', status: 'Preparing', source: 'AI Call' },
    { id: 'ORD003', customer: 'Mohammed Karim', total: '3,200 DA', status: 'Out for Delivery', source: 'Website' },
    { id: 'ORD004', customer: 'Leila Samir', total: '1,500 DA', status: 'Delivered', source: 'AI Call' },
    { id: 'ORD005', customer: 'Omar Ahmed', total: '2,100 DA', status: 'Pending', source: 'Website' },
  ];

  const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Preparing: 'bg-orange-100 text-orange-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
  };

  const sourceColors: { [key: string]: string } = {
    Website: 'bg-blue-100 text-blue-800',
    'AI Call': 'bg-purple-100 text-purple-800',
  };

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
        
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {recentOrders.map((order) => (
            <div key={order.id} className="border border-[#E5E7EB] rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-mono text-[#6B7280]">{order.id}</p>
                  <p className="font-bold text-[#1A1A1A]">{order.customer}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
                <div>
                  <p className="text-xs text-[#6B7280]">Source</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${sourceColors[order.source]}`}>
                    {order.source}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280]">Total</p>
                  <p className="font-bold text-[#1A1A1A]">{order.total}</p>
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
                  <td className="py-4 px-4 text-sm text-[#1A1A1A]">{order.customer}</td>
                  <td className="py-4 px-4 text-sm font-bold text-[#1A1A1A]">{order.total}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        sourceColors[order.source]
                      }`}
                    >
                      {order.source}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
