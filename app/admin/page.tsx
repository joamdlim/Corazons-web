import { redirect } from 'next/navigation';

// /admin has no page — redirect to the dashboard
export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
