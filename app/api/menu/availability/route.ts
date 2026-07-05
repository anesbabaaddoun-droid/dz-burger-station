import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return NextResponse.json(
                { success: false, error: 'itemId is required' },
                { status: 400 }
            );
        }

        const docRef = doc(db, 'menuItems', itemId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Item not found' },
                { status: 404 }
            );
        }

        const data = docSnap.data();
        return NextResponse.json({
            success: true,
            data: {
                id: itemId,
                name: data.name,
                availability: data.availability,
                isAvailable: data.availability === 'available'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to check availability' },
            { status: 500 }
        );
    }
}