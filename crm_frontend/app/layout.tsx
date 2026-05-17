import '@/app/globals.css';
import Sidebar from '@/shared/components/Sidebar';
import { ToastProvider } from '@/shared/components/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <ToastProvider>
        <body className="flex h-screen bg-gray-50 text-gray-900">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Có thể thêm Header ở đây */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </main>
        </body>
      </ToastProvider>
    </html>
  );
}
