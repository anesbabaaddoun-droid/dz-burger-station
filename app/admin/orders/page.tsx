'use client';

import { useState } from 'react';
import { Eye, Trash2, Check, X, ChevronDown } from 'lucide-react';

type Order = {
  id: string;
  customer: string;
  phone: string;
  items: string[];
  total: number;
  orderType: 'Delivery' | 'Pickup';
  source: 'Website' | 'AI Call';
  status: string;
};

const INITIAL_ORDERS: Order[] = [
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
    status: 'In Progress',
  },
  {
    id: 'ORD004',
    customer: 'Leila Samir',
    phone: '+213 555 456 789',
    items: ['Pepperoni Pizza (XL)', 'Mozzarella Sticks'],
    total: 1500,
    orderType: 'Pickup',
    source: 'AI Call',
    status: 'Pending',
  },
  {
    id: 'ORD005',
    customer: 'Omar Ahmed',
    phone: '+213 555 567 890',
    items: ['Mushroom Swiss Burger (L)', 'French Fries'],
    total: 2100,
    orderType: 'Delivery',
    source: 'Website',
    status: 'Completed',
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:     { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'  },
  Confirmed:   { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'In Progress':{ bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Completed:   { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500'  },
  Cancelled:   { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-400'    },
};

const SOURCE_STYLES: Record<string, string> = {
  Website: 'bg-slate-100 text-slate-700',
  'AI Call': 'bg-purple-100 text-purple-700',
};

const ORDER_TYPE_STYLES: Record<string, string> = {
  Delivery: 'bg-sky-100 text-sky-700',
  Pickup:   'bg-teal-100 text-teal-700',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Modal({ order, onClose, onConfirm, onDelete }: {
  order: Order;
  onClose: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-0.5">{order.id}</p>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Customer Info */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#B91C1C]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#B91C1C] font-bold text-sm">{order.customer.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.phone}</p>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={order.status} />
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_TYPE_STYLES[order.orderType]}`}>
              {order.orderType}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${SOURCE_STYLES[order.source]}`}>
              {order.source}
            </span>
          </div>

          {/* Items */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Order Items</p>
            <ul className="space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-[#B91C1C]/10 text-[#B91C1C] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-[#B91C1C]/5 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-[#B91C1C]">{order.total.toLocaleString('ar-DZ')} DA</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold rounded-xl transition-all text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            <Check className="h-4 w-4" />
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus && o.status !== filterStatus) return false;
    if (filterSource && o.source !== filterSource) return false;
    return true;
  });

  const handleConfirm = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Confirmed' } : o))
    );
    setSelectedOrder(null);
  };

  const handleDelete = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Orders Management</h1>
        <p className="text-[#6B7280] mt-1">Manage and track all incoming orders</p>
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-[#374151] mr-1">Filter by:</span>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>

        {/* Source filter */}
        <div className="relative">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] cursor-pointer"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="AI Call">AI Call</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>

        {(filterStatus || filterSource) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterSource(''); }}
            className="text-sm text-[#B91C1C] hover:underline font-medium"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-sm text-[#6B7280]">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Order Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Source</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Total</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-[#6B7280]">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#111827]">{order.customer}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{order.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_TYPE_STYLES[order.orderType]}`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${SOURCE_STYLES[order.source]}`}>
                        {order.source}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-[#B91C1C]">
                      {order.total.toLocaleString('ar-DZ')} DA
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-[#9CA3AF]">
                    <p className="text-base font-medium">No orders found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <Modal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={() => handleConfirm(selectedOrder.id)}
          onDelete={() => handleDelete(selectedOrder.id)}
        />
      )}
    </div>
  );
}
