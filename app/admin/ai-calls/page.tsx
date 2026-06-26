'use client';

import { useState } from 'react';
import { ChevronDown, Check, X, Edit3 } from 'lucide-react';

export default function AICallsPage() {
  const [calls, setCalls] = useState([
    {
      id: 'CALL001',
      phone: '+213 555 123 456',
      status: 'pendingApproval',
      summary: 'Customer ordered 2 Classic Cheeseburgers (XL), 1 French Fries, 1 Soft Drinks',
      duration: '2m 15s',
      transcript: `Agent: "Welcome to Crisp Quick! What would you like to order?"\nCustomer: "I want two Classic Cheeseburgers, extra large size."\nAgent: "Great! That's 2 Classic Cheeseburgers XL at 1,900 DA. What else?"\nCustomer: "Add French Fries and a Soft Drink please."\nAgent: "Perfect! That's a total of 2,480 DA for delivery. We'll call you to confirm."`,
      expandedTranscript: false,
    },
    {
      id: 'CALL002',
      phone: '+213 555 234 567',
      status: 'pendingApproval',
      summary: 'Customer ordered Margherita Pizza (L), Mozzarella Sticks',
      duration: '1m 45s',
      transcript: `Agent: "Good afternoon! How can we help?"\nCustomer: "I'd like a Margherita Pizza, large size."\nAgent: "Excellent choice! One Margherita Pizza Large at 700 DA. Anything else?"\nCustomer: "Yes, Mozzarella Sticks and a milkshake."\nAgent: "Perfect! That's 1,180 DA for pickup. Is that correct?"`,
      expandedTranscript: false,
    },
    {
      id: 'CALL003',
      phone: '+213 555 345 678',
      status: 'approved',
      summary: 'Customer ordered BBQ Bacon Burger (XXL), Chicken Wings',
      duration: '3m 20s',
      transcript: `Agent: "Hello! Welcome to Crisp Quick!"\nCustomer: "Hi, I want the BBQ Bacon Burger, extra extra large."\nAgent: "Great! One XXL BBQ Bacon Burger at 1,400 DA."\nCustomer: "And add Chicken Wings please."\nAgent: "Perfect! Total 2,000 DA for delivery."`,
      expandedTranscript: false,
    },
  ]);

  const toggleTranscript = (id: string) => {
    setCalls(
      calls.map((call) => {
        if (call.id === id) {
          return { ...call, expandedTranscript: !call.expandedTranscript };
        }
        return call;
      })
    );
  };

  const handleApprove = (id: string) => {
    setCalls(calls.map((call) => (call.id === id ? { ...call, status: 'approved' } : call)));
  };

  const handleReject = (id: string) => {
    setCalls(calls.filter((call) => call.id !== id));
  };

  const pendingCalls = calls.filter((call) => call.status === 'pendingApproval');
  const approvedCalls = calls.filter((call) => call.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">AI Calls</h1>
        <p className="text-[#6B7280] mt-1">Review and approve incoming AI orders</p>
      </div>

      {/* Pending Calls Alert */}
      {pendingCalls.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-[#F59E0B] p-4 rounded">
          <p className="font-semibold text-amber-900">
            {pendingCalls.length} pending approval
          </p>
          <p className="text-sm text-amber-800">Review and approve these calls to add them to your orders</p>
        </div>
      )}

      {/* Pending Calls Section */}
      {pendingCalls.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Pending Approval</h2>
          <div className="space-y-4">
            {pendingCalls.map((call) => (
              <div key={call.id} className="bg-white rounded-xl border-2 border-amber-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Call Info */}
                  <div>
                    <p className="text-xs text-[#6B7280] font-semibold mb-1">Call ID</p>
                    <p className="text-sm font-mono text-[#1A1A1A]">{call.id}</p>

                    <p className="text-xs text-[#6B7280] font-semibold mt-3 mb-1">Phone</p>
                    <p className="text-sm text-[#1A1A1A]">{call.phone}</p>

                    <p className="text-xs text-[#6B7280] font-semibold mt-3 mb-1">Duration</p>
                    <p className="text-sm text-[#1A1A1A]">{call.duration}</p>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-xs text-[#6B7280] font-semibold mb-2">Order Summary</p>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{call.summary}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleApprove(call.id)}
                      className="flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-green-700 text-white font-bold py-2 rounded-full transition-colors"
                    >
                      <Check className="h-5 w-5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(call.id)}
                      className="flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-red-700 text-white font-bold py-2 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" /> Reject
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-full transition-colors">
                      <Edit3 className="h-5 w-5" /> Edit
                    </button>
                  </div>
                </div>

                {/* Transcript */}
                <div className="mt-4 border-t border-[#E5E7EB] pt-4">
                  <button
                    onClick={() => toggleTranscript(call.id)}
                    className="flex items-center gap-2 text-[#B91C1C] hover:text-[#991B1B] font-semibold text-sm"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${call.expandedTranscript ? 'rotate-180' : ''}`}
                    />
                    {call.expandedTranscript ? 'Hide' : 'Show'} Transcript
                  </button>
                  {call.expandedTranscript && (
                    <pre className="mt-3 p-4 bg-gray-100 rounded-lg text-xs text-[#1A1A1A] font-mono whitespace-pre-wrap overflow-auto max-h-48">
                      {call.transcript}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Calls Section */}
      {approvedCalls.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Approved Calls</h2>
          <div className="space-y-4">
            {approvedCalls.map((call) => (
              <div key={call.id} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Call Info */}
                  <div>
                    <p className="text-xs text-[#6B7280] font-semibold mb-1">Call ID</p>
                    <p className="text-sm font-mono text-[#1A1A1A]">{call.id}</p>

                    <p className="text-xs text-[#6B7280] font-semibold mt-3 mb-1">Phone</p>
                    <p className="text-sm text-[#1A1A1A]">{call.phone}</p>

                    <p className="text-xs text-[#6B7280] font-semibold mt-3 mb-1">Duration</p>
                    <p className="text-sm text-[#1A1A1A]">{call.duration}</p>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-xs text-[#6B7280] font-semibold mb-2">Order Summary</p>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{call.summary}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-end">
                    <span className="px-4 py-2 bg-[#22C55E] text-white font-bold rounded-full text-sm">
                      ✓ Approved
                    </span>
                  </div>
                </div>

                {/* Transcript */}
                <div className="mt-4 border-t border-[#E5E7EB] pt-4">
                  <button
                    onClick={() => toggleTranscript(call.id)}
                    className="flex items-center gap-2 text-[#B91C1C] hover:text-[#991B1B] font-semibold text-sm"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${call.expandedTranscript ? 'rotate-180' : ''}`}
                    />
                    {call.expandedTranscript ? 'Hide' : 'Show'} Transcript
                  </button>
                  {call.expandedTranscript && (
                    <pre className="mt-3 p-4 bg-gray-100 rounded-lg text-xs text-[#1A1A1A] font-mono whitespace-pre-wrap overflow-auto max-h-48">
                      {call.transcript}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6B7280] text-lg">No AI calls</p>
        </div>
      )}
    </div>
  );
}
