import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'Admin Panel — Corazón Cakes',
  description: 'Admin panel for managing orders, cakes, and messages',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let middleware handle route protection
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#111111] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
