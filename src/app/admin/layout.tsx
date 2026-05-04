import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth check for admin pages (skip for login page)
  const cookieStore = cookies();
  const token = cookieStore.get('blog_admin_token')?.value;
  const session = token ? verifyToken(token) : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-apple-bg">
      {children}
    </div>
  );
}
