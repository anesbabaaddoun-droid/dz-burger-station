'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard, Package, Phone, UtensilsCrossed, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { OrderNotifier } from '@/components/order-notifier';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Orders', href: '/admin/orders', icon: Package, exact: false },
  { label: 'AI Calls', href: '/admin/ai-calls', icon: Phone, exact: false },
  { label: 'Menu', href: '/admin/menu', icon: UtensilsCrossed, exact: false },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, exact: false },
  { label: 'Settings', href: '/admin/settings', icon: SettingsIcon, exact: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
        setChecked(true);
        if (pathname === '/admin/login') {
          router.replace('/admin');
        }
      } else {
        setChecked(true);
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        }
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('adminTheme', next ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`admin-panel ${darkMode ? 'admin-dark' : ''}`}>
      <div className="flex h-screen bg-[#FAFAFA] text-[#1A1A1A] transition-colors duration-300 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed sm:relative inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60'
            } sm:translate-x-0 ${sidebarOpen ? 'sm:w-60' : 'sm:w-20'
            } bg-white border-r border-[#E5E7EB] transition-all duration-300 overflow-y-auto flex flex-col shadow-sm`}
        >
          <div className="h-20 flex items-center justify-center border-b border-[#E5E7EB] px-3 gap-3">
            <BrandLogo size="sm" />
            {sidebarOpen && (
              <div className="leading-tight">
                <p className="font-bold text-[#1A1A1A] text-sm">Crisp Quick</p>
                <p className="text-[10px] uppercase tracking-wider text-[#6B7280]">Admin Panel</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-[#B91C1C] text-white shadow-md shadow-[#B91C1C]/20'
                        : 'text-[#6B7280] hover:bg-gray-100 hover:translate-x-0.5'
                      }`}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5E7EB]">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              {sidebarOpen && <span className="font-semibold text-sm">Collapse</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-20 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <BrandLogo size="sm" />
                <div>
                  <p className="font-bold text-[#1A1A1A]">Crisp Quick</p>
                  <p className="text-xs text-[#6B7280]">Admin Panel</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 hover:bg-gray-100 rounded-full text-[#6B7280] transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="flex items-center gap-4 pl-4 border-l border-[#E5E7EB]">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{userEmail}</p>
                  <p className="text-xs text-[#6B7280]">Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-red-50 rounded-full text-[#B91C1C] transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      <OrderNotifier />
    </div>
  );
}