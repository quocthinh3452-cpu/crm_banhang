import '@/app/globals.css';
import Sidebar from '@/shared/components/Sidebar';
import { ToastProvider } from '@/shared/components/Toast';
import { Toaster } from 'react-hot-toast';
import AuthGuard from '@/shared/components/AuthGuard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <ToastProvider>
        <body className="flex h-screen bg-gray-50 text-gray-900">
          <AuthGuard>
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Có thể thêm Header ở đây */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </main>
          </AuthGuard>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </body>
      </ToastProvider>
    </html>
  );
}
