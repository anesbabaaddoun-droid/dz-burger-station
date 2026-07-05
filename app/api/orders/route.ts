import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
    try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { customerName, customerPhone, orderType, items, deliveryAddress, notes } = body;

        if (!customerName || !customerPhone || !orderType || !items) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

        const subtotal = parsedItems.reduce((sum: number, item: { price: number; quantity: number }) => {
            return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }, 0);

        const deliveryFee = orderType === 'Delivery' ? 0 : 0;
        const total = subtotal + deliveryFee;

        const order = {
            customerName,
            customerPhone,
            orderType,
            source: 'AI Call',
            status: 'Pending',
            items: parsedItems,
            deliveryAddress: deliveryAddress || null,
            notes: notes || null,
            deliveryFee,
            subtotal,
            total,
            paymentMethod: 'COD',
            aiCallId: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'orders'), order);

        return NextResponse.json({
            success: true,
            data: { orderId: docRef.id, ...order }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}