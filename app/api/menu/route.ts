import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
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
        console.error('Error fetching menu:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, categoryId, basePrice, ingredients, imageUrl } = body;

        if (!name || !categoryId || basePrice === undefined) {
            return NextResponse.json(
                { success: false, error: 'name, categoryId, and basePrice are required' },
                { status: 400 }
            );
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json(
                { success: false, error: 'ingredients must be a non-empty array' },
                { status: 400 }
            );
        }

        const newItem = {
            name,
            description: description || '',
            categoryId,
            basePrice: Number(basePrice),
            ingredients,
            imageUrl: imageUrl || '/images/placeholder.png',
            availability: 'available',
            variants: [],
            extrasIds: [],
            displayOrder: 999,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'menuItems'), newItem);

        return NextResponse.json({
            success: true,
            data: { id: docRef.id, ...newItem }
        });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create menu item' },
            { status: 500 }
        );
    }
}