'use client';

import { useState } from 'react';
import { Eye, Trash2, Check, X, ChevronDown, Phone, Clock, FileText } from 'lucide-react';

type CallStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed';

type AICall = {
  id: string;
  customer: string;
  phone: string;
  status: CallStatus;
  orderType: 'Delivery' | 'Pickup';
  source: 'AI Call';
  summary: string;
  duration: string;
  total: number;
  transcript: string;
};

const INITIAL_CALLS: AICall[] = [
  {
    id: 'CALL001',
    customer: 'Ahmed Hassan',
    phone: '+213 555 123 456',
    status: 'Pending',
    orderType: 'Delivery',
    source: 'AI Call',
    summary: '2x Classic Cheeseburger (XL), French Fries, Soft Drinks',
    duration: '2m 15s',
    total: 2480,
    transcript: `Agent: "Welcome to DZ Burger Station! What would you like to order?"
Customer: "I want two Classic Cheeseburgers, extra large size."
Agent: "Great! That's 2 Classic Cheeseburgers XL at 1,900 DA. What else?"
Customer: "Add French Fries and a Soft Drink please."
Agent: "Perfect! That's a total of 2,480 DA for delivery. We'll call you to confirm."`,
  },
  {
    id: 'CALL002',
    customer: 'Fatima Ali',
    phone: '+213 555 234 567',
    status: 'Pending',
    orderType: 'Pickup',
    source: 'AI Call',
    summary: 'Margherita Pizza (L), Mozzarella Sticks, Premium Milkshake',
    duration: '1m 45s',
    total: 1800,
    transcript: `Agent: "Good afternoon! How can we help?"
Customer: "I'd like a Margherita Pizza, large size."
Agent: "Excellent choice! One Margherita Pizza Large at 700 DA. Anything else?"
Customer: "Yes, Mozzarella Sticks and a milkshake."
Agent: "Perfect! That's 1,800 DA for pickup. Is that correct?"`,
  },
  {
    id: 'CALL003',
    customer: 'Mohammed Karim',
    phone: '+213 555 345 678',
    status: 'Confirmed',
    orderType: 'Delivery',
    source: 'AI Call',
    summary: 'BBQ Bacon Burger (XXL), Chicken Wings',
    duration: '3m 20s',
    total: 2000,
    transcript: `Agent: "Hello! Welcome to DZ Burger Station!"
Customer: "Hi, I want the BBQ Bacon Burger, extra extra large."
Agent: "Great! One XXL BBQ Bacon Burger at 1,400 DA."
Customer: "And add Chicken Wings please."
Agent: "Perfect! Total 2,000 DA for delivery."`,
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:      { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'  },
  Confirmed:    { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'In Progress':{ bg: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-500' },
  Completed:    { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500'  },
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

function CallModal({ call, onClose, onConfirm, onDelete }: {
  call: AICall;
  onClose: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}) {
  const [showTranscript, setShowTranscript] = useState(false);

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
            <p className="text-xs font-mono text-gray-400 mb-0.5">{call.id}</p>
            <h2 className="text-lg font-bold text-gray-900">AI Call Details</h2>
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
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold text-sm">{call.customer.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{call.customer}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{call.phone}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{call.duration}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={call.status} />
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_TYPE_STYLES[call.orderType]}`}>
              {call.orderType}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              AI Call
            </span>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Order Summary</p>
            <p className="text-sm text-gray-700 leading-relaxed">{call.summary}</p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-[#B91C1C]/5 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Estimated Total</span>
            <span className="text-xl font-bold text-[#B91C1C]">{call.total.toLocaleString('ar-DZ')} DA</span>
          </div>

          {/* Transcript Toggle */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                Call Transcript
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
            </button>
            {showTranscript && (
              <pre className="px-4 pb-4 pt-1 text-xs text-gray-600 font-mono whitespace-pre-wrap bg-gray-50 border-t border-gray-100 max-h-40 overflow-y-auto">
                {call.transcript}
              </pre>
            )}
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AICallsPage() {
  const [calls, setCalls] = useState<AICall[]>(INITIAL_CALLS);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [selectedCall, setSelectedCall] = useState<AICall | null>(null);

  const filteredCalls = calls.filter((c) => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterSource && c.source !== filterSource) return false;
    return true;
  });

  const pendingCount = calls.filter((c) => c.status === 'Pending').length;

  const handleConfirm = (id: string) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Confirmed' as CallStatus } : c)));
    setSelectedCall(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this AI call record?')) {
      setCalls((prev) => prev.filter((c) => c.id !== id));
      setSelectedCall(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">AI Calls</h1>
        <p className="text-[#6B7280] mt-1">Review and manage incoming AI voice orders</p>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
          <div>
            <p className="font-semibold text-amber-800">{pendingCount} call{pendingCount !== 1 ? 's' : ''} awaiting review</p>
            <p className="text-sm text-amber-700 mt-0.5">Click "View Details" to review and confirm or delete the order.</p>
          </div>
        </div>
      )}

      {/* Filtering Toolbar */}
      <div className="bg-white admin-dark:bg-black border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl p-3 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center">
        <span className="text-sm font-semibold text-[#374151] w-full sm:w-auto">Filter by:</span>

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
          {filteredCalls.length} record{filteredCalls.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Data Table / Cards */}
      <div className="bg-transparent sm:bg-white admin-dark:sm:bg-black sm:border border-[#E5E7EB] admin-dark:border-[#2E2E2E] sm:rounded-xl sm:shadow-sm">
        
        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-4">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call) => (
              <div key={call.id} className="bg-white admin-dark:bg-[#000000] border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:bg-[#F9FAFB] admin-dark:hover:bg-[#111111] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-[#6B7280]">{call.id}</span>
                    <p className="font-semibold text-[#111827] admin-dark:text-white mt-0.5">{call.customer}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{call.phone}</p>
                  </div>
                  <StatusBadge status={call.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm border-y border-[#E5E7EB] admin-dark:border-[#2E2E2E] py-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Type</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${ORDER_TYPE_STYLES[call.orderType]}`}>{call.orderType}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                    <span className="text-[#374151] admin-dark:text-[#D1D5DB] font-medium">{call.duration}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700">AI Call</span>
                  <button onClick={() => setSelectedCall(call)} className="admin-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-all">
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white admin-dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] admin-dark:border-[#2E2E2E] text-[#9CA3AF]">
              <p className="text-base font-medium">No AI calls found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto overflow-y-visible rounded-xl">
          <table className="w-full text-sm min-w-max whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E5E7EB] admin-dark:border-[#2E2E2E] bg-[#F9FAFB] admin-dark:bg-black">
                <th className="sticky left-0 z-20 bg-[#F9FAFB] admin-dark:bg-black text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white shadow-[1px_0_0_#E5E7EB] admin-dark:shadow-[1px_0_0_#2E2E2E]">Call ID & Customer</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Order Type</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Source</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Duration</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Status</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] admin-dark:divide-[#2E2E2E]">
              {filteredCalls.length > 0 ? (
                filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-[#F3F4F6] admin-dark:hover:bg-[#111111] transition-colors group admin-dark:bg-black">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-[#F3F4F6] admin-dark:bg-black admin-dark:group-hover:bg-[#111111] px-3 py-2 shadow-[1px_0_0_#E5E7EB] admin-dark:shadow-[1px_0_0_#2E2E2E]">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#6B7280]">{call.id}</span>
                        <p className="font-semibold text-[#111827] admin-dark:text-white mt-0.5">{call.customer}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${ORDER_TYPE_STYLES[call.orderType]}`}>
                        {call.orderType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700">
                        AI Call
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[#374151] admin-dark:text-[#D1D5DB]">{call.duration}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={call.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setSelectedCall(call)}
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
                    <p className="text-base font-medium">No AI call records found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCall && (
        <CallModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onConfirm={() => handleConfirm(selectedCall.id)}
          onDelete={() => handleDelete(selectedCall.id)}
        />
      )}
    </div>
  );
}
