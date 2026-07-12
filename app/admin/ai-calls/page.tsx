'use client';

import { useState, useMemo, useCallback } from 'react';
import { Eye, X, Phone, Trash2 } from 'lucide-react';
import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';
import { useApiMutation } from '@/hooks/useApiMutation';

type AiCall = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed';
  orderType: 'Delivery' | 'Pickup';
  source: 'AI Call';
  summary: string;
  duration: string;
  total: number;
  transcript: string;
  aiCallId: string | null;
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; darkBg: string; darkText: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', darkBg: 'admin-dark:bg-amber-900/30', darkText: 'admin-dark:text-amber-300' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', darkBg: 'admin-dark:bg-blue-900/30', darkText: 'admin-dark:text-blue-300' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', darkBg: 'admin-dark:bg-orange-900/30', darkText: 'admin-dark:text-orange-300' },
  Completed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', darkBg: 'admin-dark:bg-green-900/30', darkText: 'admin-dark:text-green-300' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', darkBg: 'admin-dark:bg-gray-800/30', darkText: 'admin-dark:text-gray-300' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} ${s.darkBg} ${s.darkText}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Modal({ call, onClose, onDelete }: { call: AiCall; onClose: () => void; onDelete: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-0.5">{call.aiCallId ?? call.id}</p>
            <h2 className="text-lg font-bold text-gray-900">Call Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{call.customerName}</p>
              <p className="text-sm text-gray-500">{call.customerPhone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge status={call.status} />
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
              {call.orderType}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              Duration: {call.duration}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Summary</p>
            <p className="text-sm text-gray-700">{call.summary || 'No summary available'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Transcript</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{call.transcript || 'No transcript available'}</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold rounded-xl transition-all text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AiCallsPage() {
  const [selectedCall, setSelectedCall] = useState<AiCall | null>(null);

  const { data: calls, isLoading } = useRealtimeCollection('aiCalls', 'createdAt');
  const typedCalls = useMemo(() => calls as AiCall[], [calls]);
  const { mutate: mutateDelete } = useApiMutation<undefined>('', 'DELETE');

  const handleDelete = useCallback(async (callId: string) => {
    if (confirm('Are you sure you want to delete this call?')) {
      const success = await mutateDelete(undefined, `/api/ai-calls/${callId}`);
      if (success) {
        setSelectedCall(null);
      }
    }
  }, [mutateDelete]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-[#6B7280]">Loading calls…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">AI Calls</h1>
        <p className="text-[#6B7280] mt-1">Calls handled by the AI phone agent</p>
      </div>

      <div className="bg-white admin-dark:bg-black border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl shadow-sm overflow-hidden">

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3 p-3 overflow-x-hidden">
          {typedCalls.length > 0 ? (
            typedCalls.map((call) => (
              <div
                key={call.id}
                className="bg-white admin-dark:bg-[#111111] border border-[#E5E7EB] admin-dark:border-[#2E2E2E] rounded-xl p-4 flex flex-col gap-3 w-full overflow-hidden"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#111827] admin-dark:text-white truncate">{call.customerName}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{call.customerPhone}</p>
                    <span className="font-mono text-xs text-[#6B7280] truncate block max-w-full">{call.aiCallId ?? call.id}</span>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={call.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-y border-[#E5E7EB] admin-dark:border-[#2E2E2E] py-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Order Type</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-100 text-teal-700 admin-dark:bg-teal-900/30 admin-dark:text-teal-300">
                      {call.orderType}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                    <span className="text-sm text-[#374151] admin-dark:text-white font-medium">{call.duration}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs text-[#6B7280] truncate flex-1">
                    {call.summary ? `${call.summary.slice(0, 40)}...` : 'No summary'}
                  </span>
                  <button
                    onClick={() => setSelectedCall(call)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-[#9CA3AF]">
              <p className="text-base font-medium">No AI calls yet</p>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto overflow-y-visible">
          <table className="w-full text-sm min-w-max whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E5E7EB] admin-dark:border-[#2E2E2E] bg-[#F9FAFB] admin-dark:bg-black">
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Customer</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Order Type</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Status</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Duration</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] admin-dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] admin-dark:divide-[#2E2E2E]">
              {typedCalls.length > 0 ? (
                typedCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-[#F3F4F6] admin-dark:hover:bg-[#111111] transition-colors admin-dark:bg-black">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <p className="font-semibold text-[#111827] admin-dark:text-white">{call.customerName}</p>
                        <span className="font-mono text-xs text-[#6B7280] admin-dark:text-[#9CA3AF]">{call.aiCallId ?? call.id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-100 text-teal-700 admin-dark:bg-teal-900/30 admin-dark:text-teal-300">
                        {call.orderType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={call.status} />
                    </td>
                    <td className="px-3 py-2 text-[#6B7280] admin-dark:text-white">{call.duration}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setSelectedCall(call)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#E5E7EB] admin-dark:border-[#2E2E2E] text-[11px] font-bold text-[#374151] admin-dark:text-white hover:bg-[#E5E7EB] admin-dark:hover:bg-[#1A1A1A] transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-[#9CA3AF]">
                    <p className="text-base font-medium">No AI calls yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCall && (
        <Modal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onDelete={() => handleDelete(selectedCall.id)}
        />
      )}
    </div>
  );
}