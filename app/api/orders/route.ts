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

type RawOrderItem = {
    itemId: string;
    name?: string;
    price?: number;
    quantity: number;
};

async function completeItemData(item: RawOrderItem): Promise<{ itemId: string; name: string; price: number; quantity: number }> {
    // If both name and price are already present and valid, use them as-is (e.g. Website checkout).
    if (item.name && typeof item.price === 'number' && !isNaN(item.price)) {
        return {
            itemId: item.itemId,
            name: item.name,
            price: item.price,
            quantity: Number(item.quantity) || 0,
        };
    }

    // Otherwise (e.g. AI Call sending only itemId + quantity), look up the menu item to fill the gaps.
    try {
        const menuItemSnap = await getDoc(doc(db, 'menuItems', item.itemId));
        if (menuItemSnap.exists()) {
            const menuData = menuItemSnap.data();
            return {
                itemId: item.itemId,
                name: item.name || menuData.name || 'Unknown Item',
                price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : (menuData.basePrice ?? 0),
                quantity: Number(item.quantity) || 0,
            };
        }
    } catch {
        // fall through to safe default below
    }

    // Menu item not found or lookup failed — return a safe fallback instead of NaN.
    return {
        itemId: item.itemId,
        name: item.name || 'Unknown Item',
        price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0,
        quantity: Number(item.quantity) || 0,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { customerName, customerPhone, orderType, items, deliveryAddress, notes, source } = body;

        if (!customerName || !customerPhone || !orderType || !items) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const rawItems: RawOrderItem[] = typeof items === 'string' ? JSON.parse(items) : items;

        // Complete any missing name/price by looking up menuItems (handles AI Call orders that only send itemId + quantity).
        const parsedItems = await Promise.all(rawItems.map(completeItemData));

        const subtotal = parsedItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        // Fetch settings once (used for both delivery fee and base prep time),
        // so the fee is always authoritative and consistent regardless of who places the order
        // (Website checkout or the Vapi AI phone agent).
        let basePrepTime = 25; // safe fallback
        let configuredDeliveryFee = 0;
        try {
            const settingsSnap = await getDoc(doc(db, 'settings', 'config'));
            if (settingsSnap.exists()) {
                const settingsData = settingsSnap.data();
                basePrepTime = settingsData.preparationTime ?? 25;
                configuredDeliveryFee = settingsData.deliveryFee ?? 0;
            }
        } catch { /* keep fallbacks */ }

        const deliveryFee = orderType === 'Delivery' ? configuredDeliveryFee : 0;
        const total = subtotal + deliveryFee;
        const estimatedPrepMinutes = basePrepTime;

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