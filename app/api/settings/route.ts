import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DaySchedule {
    isOpen: boolean;
    open: string;  // format "HH:mm"
    close: string; // format "HH:mm"
}

interface WorkingHours {
    [day: string]: DaySchedule;
}

function isRestaurantOpen(workingHours: WorkingHours): boolean {
    const now = new Date();

    const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Algiers',
        weekday: 'long',
    });
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const currentDay = dayFormatter.format(now).toLowerCase();
    const currentTime = timeFormatter.format(now);

    const todaySchedule = workingHours[currentDay];

    if (!todaySchedule || !todaySchedule.isOpen) {
        return false;
    }

    const toMinutes = (time: string): number => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    const nowMinutes = toMinutes(currentTime);
    const openMinutes = toMinutes(todaySchedule.open);
    const closeMinutes = toMinutes(todaySchedule.close);

    if (closeMinutes <= openMinutes) {
        return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    }

    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

export async function GET() {
    try {
        const docRef = doc(db, 'settings', 'config');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Settings not found' },
                { status: 404 }
            );
        }

        const settingsData = docSnap.data();
        const isOpenNow = settingsData.workingHours
            ? isRestaurantOpen(settingsData.workingHours)
            : false;

        return NextResponse.json({
            success: true,
            data: { id: 'config', ...settingsData, isOpenNow }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const {
            restaurantName,
            phone,
            address,
            acceptOrders,
            acceptAiCalls,
            deliveryEnabled,
            pickupEnabled,
            preparationTime,
            soundNotifications,
            browserNotifications,
            workingHours,
            logoUrl,
            deliveryZones,
            defaultDeliveryFee,
        } = body;

        if (!restaurantName || !phone || !address) {
            return NextResponse.json(
                { success: false, error: 'restaurantName, phone, and address are required' },
                { status: 400 }
            );
        }

        const updatedSettings = {
            restaurantName,
            phone,
            address,
            acceptOrders: acceptOrders ?? true,
            acceptAiCalls: acceptAiCalls ?? true,
            deliveryEnabled: deliveryEnabled ?? true,
            pickupEnabled: pickupEnabled ?? true,
            preparationTime: preparationTime ?? 25,
            soundNotifications: soundNotifications ?? true,
            browserNotifications: browserNotifications ?? false,
            workingHours: workingHours ?? {},
            logoUrl: logoUrl ?? '/images/logo.png',
            deliveryZones: deliveryZones ?? [],
            defaultDeliveryFee: defaultDeliveryFee ?? 250,
            updatedAt: new Date(),
        };

        await setDoc(doc(db, 'settings', 'config'), updatedSettings, { merge: true });

        return NextResponse.json({
            success: true,
            data: { id: 'config', ...updatedSettings }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}