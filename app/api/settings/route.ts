import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
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
    // الحصول على اليوم والوقت الحالي بتوقيت الجزائر
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

    const currentDay = dayFormatter.format(now).toLowerCase(); // مثال: "friday"
    const currentTime = timeFormatter.format(now); // مثال: "14:35"

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

    // حالة الإغلاق بعد منتصف الليل (مثلاً open: "11:00", close: "00:00")
    if (closeMinutes <= openMinutes) {
        // المطعم مفتوح إذا الوقت الحالي بعد وقت الفتح، أو قبل وقت الإغلاق (اليوم الموالي)
        return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    }

    // الحالة العادية (فتح وإغلاق في نفس اليوم)
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
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}