'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('crm_user_session');
    if (!session) {
      router.push('/login');
    } else {
      try {
        const user = JSON.parse(session);
        if (user.role === 'admin') {
          router.push('/crm/users');
        } else {
          router.push('/dashboard');
        }
      } catch (e) {
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
