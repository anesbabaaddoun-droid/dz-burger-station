'use client';

import { useState, useMemo } from 'react';
import { Eye, X, Phone } from 'lucide-react';
import { useRealtimeCollection } from '@/hooks/useRealtimeCollection';

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

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Completed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
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

function Modal({ call, onClose }: { call: AiCall; onClose: () => void }) {
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
            <p className="text-xs font-mono text-gray-400 mb-0.5">{call.id}</p>
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
      </div>
    </div>
  );
}

export default function AiCallsPage() {
  const [selectedCall, setSelectedCall] = useState<AiCall | null>(null);

  const { data: calls, isLoading } = useRealtimeCollection('aiCalls', 'createdAt');
  const typedCalls = useMemo(() => calls as AiCall[], [calls]);

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

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm min-w-max whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Customer</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Order Type</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Status</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Duration</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {typedCalls.length > 0 ? (
                typedCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-[#F3F4F6] transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <p className="font-semibold text-[#111827]">{call.customerName}</p>
                        <span className="text-xs text-[#6B7280]">{call.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-100 text-teal-700">
                        {call.orderType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={call.status} />
                    </td>
                    <td className="px-3 py-2 text-[#6B7280]">{call.duration}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setSelectedCall(call)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#E5E7EB] text-[11px] font-bold text-[#374151] hover:bg-[#E5E7EB] transition-all"
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
        <Modal call={selectedCall} onClose={() => setSelectedCall(null)} />
      )}
    </div>
  );
}