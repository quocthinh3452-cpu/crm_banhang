import '@/app/globals.css';
import Sidebar from '@/shared/components/Sidebar';
import { ToastProvider } from '@/shared/components/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <ToastProvider>
        <body className="flex h-screen bg-slate-900 text-slate-100">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header can be added here */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
              {children}
            </div>
          </main>
        </body>
      </ToastProvider>
    </html>
  );
}
