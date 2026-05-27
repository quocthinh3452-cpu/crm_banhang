// shared/components/AuthGuard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, LogOut, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [denialReason, setDenialReason] = useState<string>('');

  const checkAuth = () => {
    // 1. Nếu là trang login, bỏ qua tất cả kiểm tra
    if (pathname === '/login') {
      setIsAuthenticated(true);
      setHasPermission(true);
      return;
    }

    const session = localStorage.getItem('crm_user_session');

    // 2. Chưa đăng nhập
    if (!session) {
      setIsAuthenticated(false);
      setHasPermission(false);
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(session);
      setCurrentUser(user);
      setIsAuthenticated(true);

      // 3. XỬ LÝ PHÂN QUYỀN CHO TÀI KHOẢN ADMIN
      if (user.role === 'admin') {
        // Admin được toàn quyền truy cập tất cả các trang hệ thống
        setHasPermission(true);
        return;
      }

      // 4. XỬ LÝ PHÂN QUYỀN CHO TÀI KHOẢN USER THƯỜNG
      if (user.role !== 'admin') {
        // Tài khoản thường tuyệt đối không được vào trang quản lý người dùng
        if (pathname === '/crm/users') {
          setHasPermission(false);
          setDenialReason('Bạn không có quyền truy cập chức năng Quản lý người dùng. Vui lòng liên hệ Admin.');
          return;
        }

        // Tách chuỗi quyền
        const userPerms = user.permissions ? user.permissions.split(',') : [];

        // Kiểm tra quyền theo từng trang cụ thể
        if (pathname === '/crm/products') {
          if (!userPerms.includes('PRODUCTS_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Danh sách Sản phẩm. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/product-types') {
          if (!userPerms.includes('PRODUCT_TYPES_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Danh mục Loại sản phẩm. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/documents') {
          if (!userPerms.includes('DOCUMENTS_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Phân hệ Tài liệu. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/customers') {
          if (!userPerms.includes('CUSTOMERS_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Danh sách Khách hàng. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/lead') {
          if (!userPerms.includes('LEADS_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Phân hệ Quản lý Lead. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/quotes') {
          if (!userPerms.includes('QUOTES_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Phân hệ Quản lý Báo giá. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }

        if (pathname === '/crm/contracts') {
          if (!userPerms.includes('CONTRACTS_VIEW')) {
            setHasPermission(false);
            setDenialReason('Tài khoản của bạn không có quyền xem Phân hệ Quản lý Hợp đồng. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        }
      }

      // Mặc định cho phép truy cập nếu không thuộc các trường hợp chặn trên
      setHasPermission(true);

    } catch (e) {
      localStorage.removeItem('crm_user_session');
      setIsAuthenticated(false);
      setHasPermission(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('crm_user_session');
    toast.success('Đăng xuất thành công!');
    router.push('/login');
  };

  // Đang kiểm tra trạng thái đăng nhập
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Đang tải cấu hình bảo mật...</p>
        </div>
      </div>
    );
  }

  // 1. Trường hợp chưa đăng nhập và không phải trang login (sẽ được useEffect redirect, hiển thị loading rỗng)
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  // 2. Trang Login hoặc có quyền truy cập đầy đủ
  if (hasPermission) {
    return <>{children}</>;
  }

  // 3. MÀN HÌNH BÁO LỖI PHÂN QUYỀN (ACCESS DENIED) SANG TRỌNG
  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] p-6">
      <div className="max-w-md w-full p-8 bg-white border border-gray-100 shadow-xl rounded-2xl flex flex-col items-center text-center transition-all duration-300">
        
        {/* Biểu tượng cảnh báo màu đỏ nhẹ */}
        <div className="w-16 h-16 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Từ chối truy cập!</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {denialReason || 'Tài khoản của bạn không được cấp quyền truy cập chức năng này.'}
        </p>

        {/* Các lựa chọn hành động nhanh */}
        <div className="w-full space-y-2.5">
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => router.push('/crm/users')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              Đi tới Quản lý người dùng
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                // Điều hướng thành viên về trang đầu tiên họ có quyền xem
                const perms = currentUser?.permissions ? currentUser.permissions.split(',') : [];
                if (perms.includes('PRODUCTS_VIEW')) {
                  router.push('/crm/products');
                } else if (perms.includes('DOCUMENTS_VIEW')) {
                  router.push('/crm/documents');
                } else if (perms.includes('CUSTOMERS_VIEW')) {
                  router.push('/crm/customers');
                } else if (perms.includes('LEADS_VIEW')) {
                  router.push('/crm/lead');
                } else if (perms.includes('QUOTES_VIEW')) {
                  router.push('/crm/quotes');
                } else if (perms.includes('CONTRACTS_VIEW')) {
                  router.push('/crm/contracts');
                } else {
                  router.push('/dashboard');
                }
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Trở về Trang được cấp quyền
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất tài khoản
          </button>
        </div>

      </div>
    </div>
  );
}
