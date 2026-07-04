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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} admin-dark:text-white`}>
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden max-h-[90dvh] flex flex-col animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
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
        <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 overflow-y-auto">
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
      <div className="bg-white admin-dark:bg-black border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl p-3 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center">
        <span className="text-sm font-semibold text-[#374151] w-full sm:w-auto">Filter by:</span>

        {/* Status filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] cursor-pointer"
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
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] cursor-pointer"
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

      {/* Data Table / Cards */}
      <div className="bg-transparent sm:bg-white admin-dark:sm:bg-black sm:border border-[#E5E7EB] admin-dark:border-[#2E2E2E] sm:rounded-xl sm:shadow-sm">
        
        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white admin-dark:bg-[#000000] border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:bg-[#F9FAFB] admin-dark:hover:bg-[#111111] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-[#6B7280]">{order.id}</span>
                    <p className="font-semibold text-[#111827] admin-dark:text-white mt-0.5">{order.customer}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{order.phone}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm border-y border-[#E5E7EB] admin-dark:border-[#2E2E2E] py-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Type</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${ORDER_TYPE_STYLES[order.orderType]}`}>{order.orderType}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Source</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${SOURCE_STYLES[order.source]}`}>{order.source}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-mono font-bold text-[#B91C1C] admin-dark:text-[#EF4444]">{order.total.toLocaleString('ar-DZ')} DA</span>
                  <button onClick={() => setSelectedOrder(order)} className="admin-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-all">
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white admin-dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] admin-dark:border-[#2E2E2E] text-[#9CA3AF]">
              <p className="text-base font-medium">No orders found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto overflow-y-visible rounded-xl">
          <table className="w-full text-sm min-w-max whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E5E7EB] admin-dark:border-[#2E2E2E] bg-[#F9FAFB] admin-dark:bg-black">
                <th className="sticky left-0 z-20 bg-[#F9FAFB] admin-dark:bg-black text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white shadow-[1px_0_0_#E5E7EB] admin-dark:shadow-[1px_0_0_#2E2E2E]">Order & Customer</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Order Type</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Source</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Status</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Total</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] admin-dark:divide-[#2E2E2E]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F3F4F6] admin-dark:hover:bg-[#111111] transition-colors group admin-dark:bg-black">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-[#F3F4F6] admin-dark:bg-black admin-dark:group-hover:bg-[#111111] px-3 py-2 shadow-[1px_0_0_#E5E7EB] admin-dark:shadow-[1px_0_0_#2E2E2E]">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#6B7280]">{order.id}</span>
                        <p className="font-semibold text-[#111827] admin-dark:text-white mt-0.5">{order.customer}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${ORDER_TYPE_STYLES[order.orderType]}`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${SOURCE_STYLES[order.source]}`}>
                        {order.source}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-[#B91C1C] admin-dark:text-[#EF4444]">
                      {order.total.toLocaleString('ar-DZ')} DA
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="admin-action-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#E5E7EB] text-[11px] font-bold text-[#374151] hover:bg-[#E5E7EB] transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-[#9CA3AF]">
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
