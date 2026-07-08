import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const callRef = doc(db, 'aiCalls', id);
        const callSnap = await getDoc(callRef);

        if (!callSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'AI call record not found' },
                { status: 404 }
            );
        }

        await deleteDoc(callRef);

        return NextResponse.json({
            success: true,
            data: { id, deleted: true },
        });
    } catch (error) {
        console.error('Error deleting AI call:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete AI call' },
            { status: 500 }
        );
    }
}
