import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const itemRef = doc(db, 'menuItems', id);
        const itemSnap = await getDoc(itemRef);

        if (!itemSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Menu item not found' },
                { status: 404 }
            );
        }

        await updateDoc(itemRef, {
            ...body,
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            data: { id, ...body }
        });
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update menu item' },
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

        const itemRef = doc(db, 'menuItems', id);
        const itemSnap = await getDoc(itemRef);

        if (!itemSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Menu item not found' },
                { status: 404 }
            );
        }

        await deleteDoc(itemRef);

        return NextResponse.json({
            success: true,
            data: { id, deleted: true }
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete menu item' },
            { status: 500 }
        );
    }
}