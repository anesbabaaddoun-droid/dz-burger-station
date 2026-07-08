import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query, Timestamp, doc, getDoc } from 'firebase/firestore';
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

        const { customerName, customerPhone, orderType, items, deliveryAddress, notes, source, deliveryFee: bodyDeliveryFee, extraPrepMinutes: bodyExtraPrepMinutes } = body;

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

        // Use the fee sent by the client checkout (zone-based) or 0 for non-delivery.
        const deliveryFee = orderType === 'Delivery' ? (Number(bodyDeliveryFee) || 0) : 0;
        const extraPrepMinutes = Number(bodyExtraPrepMinutes) || 0;
        const total = subtotal + deliveryFee;

        // Fetch base preparation time from settings so estimatedPrepMinutes is persisted on the order.
        let basePrepTime = 25; // safe fallback
        try {
            const settingsSnap = await getDoc(doc(db, 'settings', 'config'));
            if (settingsSnap.exists()) {
                basePrepTime = settingsSnap.data().preparationTime ?? 25;
            }
        } catch { /* keep fallback */ }

        const estimatedPrepMinutes = basePrepTime + extraPrepMinutes;

        const order = {
            customerName,
            customerPhone,
            orderType,
            source: source === 'Website' ? 'Website' : 'AI Call',
            status: 'Pending',
            items: parsedItems,
            deliveryAddress: deliveryAddress || null,
            notes: notes || null,
            deliveryFee,
            subtotal,
            total,
            estimatedPrepMinutes,
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