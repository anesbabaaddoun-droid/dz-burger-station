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

        const customerName = customer.name || 'Unknown Caller';
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