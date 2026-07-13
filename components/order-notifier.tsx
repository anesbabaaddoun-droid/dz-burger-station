'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { Bell, X } from 'lucide-react';

type ToastData = {
  message: string;
  clickable: boolean;
};

export function OrderNotifier() {
  const router = useRouter();
  const [toast, setToast] = useState<ToastData | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const knownIdsRef = useRef<Set<string> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: settings } = useFirestoreDoc('settings', 'config');
  const soundEnabled = settings?.soundNotifications !== false;

  const playBeep = async () => {
    try {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error('[OrderNotifier] playBeep failed:', err);
    }
  };

  const showToast = (message: string, clickable: boolean) => {
    setToast({ message, clickable });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 6000);
  };

  useEffect(() => {
    const unlockAudio = () => {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();
    };
    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'Pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const currentIds = new Set(snapshot.docs.map((d) => d.id));
      const isFirstLoad = knownIdsRef.current === null;
      const previousIds = knownIdsRef.current ?? new Set<string>();
      const newIds = [...currentIds].filter((id) => !previousIds.has(id));
      knownIdsRef.current = currentIds;

      // Always notify (with sound) whenever there is at least one pending
      // order to show, whether it's the first load or a fresh arrival.
      const countToAnnounce = isFirstLoad ? currentIds.size : newIds.length;

      if (countToAnnounce > 0) {
        if (soundEnabled) void playBeep();
        showToast(
          isFirstLoad
            ? `🔔 ${countToAnnounce} pending order${countToAnnounce > 1 ? 's' : ''} waiting — check Orders`
            : countToAnnounce === 1
              ? '🔔 New order received — check Orders'
              : `🔔 ${countToAnnounce} new orders received — check Orders`,
          true
        );
      }
    });

    return () => {
      unsubscribe();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  if (!toast) return null;

  const handleClick = () => {
    if (toast.clickable) {
      router.push('/admin/orders');
      setToast(null);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#1A1A1A] text-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-4 ${toast.clickable ? 'cursor-pointer hover:bg-[#2A2A2A]' : ''
        } transition-colors`}
    >
      <Bell className="h-5 w-5 text-[#E8A33D] flex-shrink-0" />
      <span className="text-sm font-semibold">{toast.message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setToast(null);
        }}
        className="ml-1 text-white/60 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}