'use client';

import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customer: 'Ahmed Hassan',
      phone: '+213 555 123 456',
      items: ['Classic Cheeseburger (XL)', 'French Fries'],
      total: 2450,
      orderType: 'Delivery',
      source: 'Website',
      status: 'Pending',
    },
    {
      id: 'ORD002',
      customer: 'Fatima Ali',
      phone: '+213 555 234 567',
      items: ['Margherita Pizza (L)', 'Soft Drinks'],
      total: 1800,
      orderType: 'Pickup',
      source: 'AI Call',
      status: 'Confirmed',
    },
    {
      id: 'ORD003',
      customer: 'Mohammed Karim',
      phone: '+213 555 345 678',
      items: ['BBQ Bacon Burger (XXL)', 'Onion Rings', 'Premium Milkshake'],
      total: 3200,
      orderType: 'Delivery',
      source: 'Website',
      status: 'Preparing',
    },
    {
      id: 'ORD004',
      customer: 'Leila Samir',
      phone: '+213 555 456 789',
      items: ['Pepperoni Pizza (XL)', 'Mozzarella Sticks'],
      total: 1500,
      orderType: 'Pickup',
      source: 'AI Call',
      status: 'Out for Delivery',
    },
    {
      id: 'ORD005',
      customer: 'Omar Ahmed',
      phone: '+213 555 567 890',
      items: ['Mushroom Swiss Burger (L)', 'French Fries'],
      total: 2100,
      orderType: 'Delivery',
      source: 'Website',
      status: 'Delivered',
    },
  ]);

  const statusFlow: { [key: string]: string } = {
    Pending: 'Confirm Order',
    Confirmed: 'Start Preparing',
    Preparing: 'Out for Delivery',
    'Out for Delivery': 'Mark Delivered',
    Delivered: 'Completed',
  };

  const nextStatus: { [key: string]: string } = {
    Pending: 'Confirmed',
    Confirmed: 'Preparing',
    Preparing: 'Out for Delivery',
    'Out for Delivery': 'Delivered',
    Delivered: 'Delivered',
  };

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

  const filteredOrders = orders.filter((order) => {
    if (filterStatus && order.status !== filterStatus) return false;
    if (filterSource && order.source !== filterSource) return false;
    return true;
  });

  const handleNextStep = (orderId: string) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: nextStatus[order.status] };
        }
        return order;
      })
    );
  };

  const handleCancel = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Orders Management</h1>
        <p className="text-[#6B7280] mt-1">Manage and track all incoming orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={filterSource || ''}
            onChange={(e) => setFilterSource(e.target.value || null)}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="AI Call">AI Call</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 w-full max-w-full box-border overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Order Details */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-mono text-[#6B7280]">{order.id}</p>
                      <p className="text-lg font-bold text-[#1A1A1A]">{order.customer}</p>
                      <p className="text-sm text-[#6B7280]">{order.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-[#6B7280] mb-1">Items:</p>
                      <ul className="text-sm text-[#1A1A1A] space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-xs text-[#6B7280] font-semibold">Type</p>
                        <p className="text-[#1A1A1A]">{order.orderType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] font-semibold">Source</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${sourceColors[order.source]}`}>
                          {order.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Total & Actions */}
                <div className="flex flex-col justify-between">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-[#6B7280] mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-[#B91C1C]">{order.total.toLocaleString('ar-DZ')} DA</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleNextStep(order.id)}
                      disabled={order.status === 'Delivered'}
                      className="flex-1 bg-[#B91C1C] hover:bg-[#991B1B] disabled:bg-gray-300 text-white font-semibold py-2 rounded-full transition-colors text-sm"
                    >
                      {statusFlow[order.status]}
                    </button>
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-4 py-2 border-2 border-[#EF4444] text-[#EF4444] hover:bg-red-50 font-semibold rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6B7280] text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
