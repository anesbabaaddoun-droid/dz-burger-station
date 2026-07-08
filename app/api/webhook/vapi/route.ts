import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Vapi webhook received:', JSON.stringify(body, null, 2));

        const message = body.message;

        if (!message || message.type !== 'end-of-call-report') {
            return NextResponse.json({ received: true, ignored: true });
        }

        const call = message.call ?? {};
        const customer = call.customer ?? {};
        const analysis = message.analysis ?? {};

        // FIX: Prefer the name extracted from the conversation by the AI assistant.
        // Vapi populates `analysis.structuredData` when the assistant is configured with a
        // structured-data extraction schema (e.g. { customerName: "..." }).
        // If your Vapi assistant is NOT configured for structured extraction, this will be
        // undefined and we fall back to the caller-ID metadata (`customer.name`).
        // To fix this at the source: configure your Vapi assistant's "Analysis Plan" with a
        // JSON schema that extracts `customerName` from the conversation transcript.
        const structuredName =
            analysis.structuredData?.customerName ||
            analysis.structuredData?.name ||
            null;

        const customerName = structuredName || customer.name || 'Unknown Caller';
        const customerPhone = customer.number || 'Unknown';
        const transcript = message.transcript || '';
        const summary = analysis.summary || '';

        const durationSeconds = message.durationSeconds || 0;
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const duration = `${minutes}m ${seconds}s`;

        await adminDb.collection('aiCalls').add({
            customerName,
            customerPhone,
            status: 'Pending',
            orderType: 'Pickup',
            source: 'AI Call',
            summary,
            duration,
            total: 0,
            transcript,
            aiCallId: call.id || null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ received: true, saved: true });
    } catch (error) {
        console.error('Error processing Vapi webhook:', error);
        return NextResponse.json(
            { received: false, error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}