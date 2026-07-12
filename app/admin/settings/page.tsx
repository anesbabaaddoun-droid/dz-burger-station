'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Save } from 'lucide-react';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { useApiMutation } from '@/hooks/useApiMutation';

interface DaySchedule {
  isOpen: boolean;
  open: string;
  close: string;
}

interface WorkingHours {
  [day: string]: DaySchedule;
}

interface SettingsData {
  restaurantName: string;
  phone: string;
  address: string;
  acceptOrders: boolean;
  acceptAiCalls: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  preparationTime: number;
  soundNotifications: boolean;
  browserNotifications: boolean;
  workingHours: WorkingHours;
  logoUrl?: string;
  deliveryFee: number;
}

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DEFAULT_SETTINGS: SettingsData = {
  restaurantName: '',
  phone: '',
  address: '',
  acceptOrders: true,
  acceptAiCalls: true,
  deliveryEnabled: true,
  pickupEnabled: true,
  preparationTime: 25,
  soundNotifications: true,
  browserNotifications: false,
  workingHours: DAYS_ORDER.reduce((acc, day) => {
    acc[day] = { isOpen: true, open: '11:00', close: '23:00' };
    return acc;
  }, {} as WorkingHours),
  deliveryFee: 250,
};

export default function SettingsPage() {
  const { data, isLoading } = useFirestoreDoc('settings', 'config');
  const { mutate, isLoading: isSaving } = useApiMutation<SettingsData>('/api/settings', 'PUT');

  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings({
        restaurantName: data.restaurantName ?? '',
        phone: data.phone ?? '',
        address: data.address ?? '',
        acceptOrders: data.acceptOrders ?? true,
        acceptAiCalls: data.acceptAiCalls ?? true,
        deliveryEnabled: data.deliveryEnabled ?? true,
        pickupEnabled: data.pickupEnabled ?? true,
        preparationTime: data.preparationTime ?? 25,
        soundNotifications: data.soundNotifications ?? true,
        browserNotifications: data.browserNotifications ?? false,
        workingHours: data.workingHours ?? DEFAULT_SETTINGS.workingHours,
        logoUrl: data.logoUrl,
        deliveryFee: data.deliveryFee ?? 250,
      });
    }
  }, [data]);

  const handleToggle = useCallback((key: keyof SettingsData) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleScheduleChange = useCallback(
    (day: string, field: keyof DaySchedule, value: string | boolean) => {
      setSettings((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: { ...prev.workingHours[day], [field]: value },
        },
      }));
    },
    []
  );

  const scheduleEntries = useMemo(
    () => DAYS_ORDER.map((day) => ({ day, ...settings.workingHours[day] })),
    [settings.workingHours]
  );

  const handleSave = async () => {
    setSaved(false);
    const success = await mutate(settings);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl w-full mx-auto py-24 text-center text-[#6B7280]">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl w-full mx-auto box-border pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-[#6B7280] mt-1">Manage your restaurant settings and preferences</p>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Restaurant Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Restaurant Name</label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Settings */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Operating Settings</h2>
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { key: 'acceptOrders' as const, label: 'Accept Web Orders' },
              { key: 'acceptAiCalls' as const, label: 'Accept AI Call Orders' },
              { key: 'deliveryEnabled' as const, label: 'Delivery Enabled' },
              { key: 'pickupEnabled' as const, label: 'Pickup Enabled' },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-[#1A1A1A]">{toggle.label}</p>
                <button
                  onClick={() => handleToggle(toggle.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings[toggle.key] ? 'bg-[#22C55E]' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[toggle.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[#1A1A1A]">Preparation Time</p>
              <p className="text-lg font-bold text-[#B91C1C]">{settings.preparationTime} min</p>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={settings.preparationTime}
              onChange={(e) => setSettings({ ...settings, preparationTime: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="deliveryFee" className="font-semibold text-[#1A1A1A]">Delivery Fee (DA)</label>
            </div>
            <p className="text-xs text-[#6B7280] mb-2">Applied automatically to every delivery order.</p>
            <input
              id="deliveryFee"
              type="number"
              min="0"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              className="w-full sm:w-48 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
            />
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Weekly Schedule</h2>
        <div className="space-y-3">
          {scheduleEntries.map(({ day, isOpen, open, close }) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-gray-50 rounded-lg w-full box-border">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <p className="font-semibold text-[#1A1A1A] sm:w-24 capitalize">{day}</p>
                <label className="flex items-center gap-2 sm:w-auto">
                  <input
                    type="checkbox"
                    checked={!isOpen}
                    onChange={(e) => handleScheduleChange(day, 'isOpen', !e.target.checked)}
                    className="h-4 w-4 rounded accent-[#B91C1C]"
                  />
                  <span className="text-sm text-[#6B7280]">Closed</span>
                </label>
              </div>

              {isOpen && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto sm:flex-1">
                  <input
                    type="time"
                    value={open}
                    onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 sm:py-1 border border-[#E5E7EB] rounded text-sm box-border flex-1"
                  />
                  <span className="hidden sm:inline text-[#6B7280]">to</span>
                  <input
                    type="time"
                    value={close}
                    onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 sm:py-1 border border-[#E5E7EB] rounded text-sm box-border flex-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Notifications</h2>
        <div className="space-y-3">
          {[
            { key: 'soundNotifications' as const, label: 'Sound Notifications' },
            { key: 'browserNotifications' as const, label: 'Browser Notifications' },
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-[#1A1A1A]">{notif.label}</p>
              <button
                onClick={() => handleToggle(notif.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings[notif.key] ? 'bg-[#22C55E]' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[notif.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:static sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] admin-dark:border-[#2E2E2E] bg-white/95 admin-dark:bg-[#111111]/95 backdrop-blur px-5 py-4 shadow-lg w-[calc(100%-2rem)] sm:w-full mx-auto box-border text-center sm:text-left z-20">
        <p className="text-sm text-[#6B7280] w-full sm:w-auto">
          {saved ? (
            <span className="text-[#22C55E] font-semibold">✓ Changes saved</span>
          ) : (
            'Changes are saved to the database.'
          )}
        </p>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 text-white font-bold w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full transition-colors shadow-sm box-border"
        >
          <Save className="h-4 w-4" /> {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}