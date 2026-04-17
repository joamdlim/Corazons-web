'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Cakes', href: '/admin/cakes', icon: Cake },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#6a8a5b]/30">
          <Image src="/logo.png" alt="Admin Logo" fill className="object-cover" />
        </div>
        {!collapsed && (
          <span
            className="text-white font-semibold text-base"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Admin Panel
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              id={`admin-nav-${label.toLowerCase()}`}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group min-h-[44px] ${
                active
                  ? 'bg-[#6a8a5b]/20 text-[#6a8a5b] border border-[#6a8a5b]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#6a8a5b]' : ''}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {active && <ChevronRight className="w-4 h-4 text-[#6a8a5b]" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          title={collapsed ? 'Sign Out' : undefined}
          id="admin-signout-btn"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 min-h-[44px] ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        id="admin-mobile-menu-btn"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1a1a1a] border border-white/20 rounded-xl flex items-center justify-center text-white hover:border-[#6a8a5b]/50 transition-colors"
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] border-r border-white/10 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar — icon-only on md, full on lg+ */}
      <aside className="hidden lg:flex flex-col w-20 xl:w-64 bg-[#1a1a1a] border-r border-white/10 flex-shrink-0 sticky top-0 h-screen">
        <div className="xl:hidden">
          <NavContent collapsed={true} />
        </div>
        <div className="hidden xl:flex flex-col h-full">
          <NavContent collapsed={false} />
        </div>
      </aside>
    </>
  );
}
