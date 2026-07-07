import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: `status must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const orderRef = doc(db, 'orders', id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        await updateDoc(orderRef, {
            status,
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json({
            success: true,
            data: { id, status }
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const orderRef = doc(db, 'orders', id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        await deleteDoc(orderRef);

        return NextResponse.json({
            success: true,
            data: { id, deleted: true }
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete order' },
            { status: 500 }
        );
    }
}