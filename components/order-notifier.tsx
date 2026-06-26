'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';

/**
 * Simulates real-time "new order" sound notifications for the Admin panel.
 * In production this listens to a websocket/Firestore onSnapshot for new
 * orders with status `received` or `pendingApproval` and fires the same beep.
 */
export function OrderNotifier() {
  const [toast, setToast] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    try {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // ignore — audio not available in this environment
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const soundEnabled = localStorage.getItem('soundNotifications') !== 'false';
      if (soundEnabled) playBeep();
      setToast('🔔 New order received — check Orders');
      setTimeout(() => setToast(null), 4000);
    }, 60000); // demo cadence; real backend would push events instantly

    return () => clearInterval(interval);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#1A1A1A] text-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-4">
      <Bell className="h-5 w-5 text-[#E8A33D]" />
      <span className="text-sm font-semibold">{toast}</span>
    </div>
  );
}
