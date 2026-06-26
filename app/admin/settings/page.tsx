'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: 'Crisp Quick',
    phone: '+213 555 123 456',
    address: 'Bab Ezzouar, Algiers',
    acceptOrders: true,
    acceptAICalls: true,
    deliveryEnabled: true,
    pickupEnabled: true,
    prepTime: 25,
    soundNotifications: true,
    browserNotifications: false,
    darkMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 700)); // simulated API call
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [schedule, setSchedule] = useState([
    { day: 'Monday', open: '11:00', close: '23:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '23:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '23:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '23:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '11:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '11:00', close: '23:00', closed: false },
  ]);

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const handleScheduleChange = (idx: number, field: string, value: string | boolean) => {
    const newSchedule = [...schedule];
    newSchedule[idx] = { ...newSchedule[idx], [field]: value };
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6 max-w-4xl">
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

          <div className="grid grid-cols-2 gap-4">
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
          {/* Toggles */}
          <div className="space-y-3">
            {[
              { key: 'acceptOrders', label: 'Accept Web Orders' },
              { key: 'acceptAICalls', label: 'Accept AI Call Orders' },
              { key: 'deliveryEnabled', label: 'Delivery Enabled' },
              { key: 'pickupEnabled', label: 'Pickup Enabled' },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-[#1A1A1A]">{toggle.label}</p>
                <button
                  onClick={() => handleToggle(toggle.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[toggle.key as keyof typeof settings]
                      ? 'bg-[#22C55E]'
                      : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings[toggle.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Preparation Time */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[#1A1A1A]">Preparation Time</p>
              <p className="text-lg font-bold text-[#B91C1C]">{settings.prepTime} min</p>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={settings.prepTime}
              onChange={(e) => setSettings({ ...settings, prepTime: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Weekly Schedule</h2>
        <div className="space-y-3">
          {schedule.map((day, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-24">
                <p className="font-semibold text-[#1A1A1A]">{day.day}</p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={(e) => handleScheduleChange(idx, 'closed', e.target.checked)}
                  className="h-4 w-4 rounded accent-[#B91C1C]"
                />
                <span className="text-sm text-[#6B7280]">Closed</span>
              </label>

              {!day.closed && (
                <>
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => handleScheduleChange(idx, 'open', e.target.value)}
                    className="px-3 py-1 border border-[#E5E7EB] rounded text-sm"
                  />
                  <span className="text-[#6B7280]">to</span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => handleScheduleChange(idx, 'close', e.target.value)}
                    className="px-3 py-1 border border-[#E5E7EB] rounded text-sm"
                  />
                </>
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
            { key: 'soundNotifications', label: 'Sound Notifications' },
            { key: 'browserNotifications', label: 'Browser Notifications' },
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-[#1A1A1A]">{notif.label}</p>
              <button
                onClick={() => handleToggle(notif.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings[notif.key as keyof typeof settings]
                    ? 'bg-[#22C55E]'
                    : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings[notif.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Mode */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[#1A1A1A]">Dark Mode</p>
          <button
            onClick={() => handleToggle('darkMode')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.darkMode ? 'bg-[#22C55E]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save Bar */}
      <div className="sticky bottom-4 mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white/95 backdrop-blur px-5 py-4 shadow-lg">
        <p className="text-sm text-[#6B7280]">
          {saved ? (
            <span className="text-[#22C55E] font-semibold">✓ Changes saved</span>
          ) : (
            'Unsaved changes are kept locally until you save.'
          )}
        </p>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" /> {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
