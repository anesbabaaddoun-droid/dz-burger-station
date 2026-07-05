import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, 'menuItems'));
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
}