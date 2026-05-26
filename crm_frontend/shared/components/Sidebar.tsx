'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, 
  Users, 
  FileText,
  FileSignature,
  ShoppingCart,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 1. Tách cấu hình menu ra một mảng riêng để dễ quản lý và phân quyền sau này
const menuItems = [
  { name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Khách hàng', path: '/crm/customers', icon: Users },
  { name: 'Bán hàng', path: '/sales', icon: ShoppingCart },
  { name: 'Báo cáo', path: '/reports', icon: BarChart3 },
  { name: 'Cài đặt', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State xử lý lỗi giao diện nhấp nháy (Hydration) đặc trưng của Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem('crm_user_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error('Lỗi khi đọc session:', e);
      }
    }
  }, [pathname]);

  if (pathname === '/login') return null;

  const handleToggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_user_session');
    toast.success('Đăng xuất thành công!');
    router.push('/login');
  };

  // Tối ưu Logic: Xử lý toàn bộ dữ liệu Menu tại đây để tránh hardcode dư thừa bên ngoài
  const getFilteredMenuItems = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'admin') {
      return [
        { name: 'Quản lý người dùng', path: '/crm/users', icon: Users }
      ];
    }

    const perms = currentUser.permissions ? currentUser.permissions.split(',') : [];
    const items = [];

    // Mặc định luôn có Tổng quan
    items.push({ name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard });

    // Các menu phân quyền
    if (perms.includes('CUSTOMERS_VIEW')) {
      items.push({ name: 'Khách hàng', path: '/crm/customers', icon: Users });
    }

    // Đã bổ sung các chức năng mới từ mảng khai báo cũ của bạn
    if (perms.includes('QUOTES_VIEW')) {
      items.push({ name: 'Quản lý báo giá', path: '/crm/quotes', icon: FileText });
    }
    if (perms.includes('CONTRACTS_VIEW')) {
      items.push({ name: 'Quản lý hợp đồng', path: '/crm/contracts', icon: FileSignature });
    }

    const showProducts = perms.includes('PRODUCTS_VIEW');
    const showProductTypes = perms.includes('PRODUCT_TYPES_VIEW');
    if (showProducts || showProductTypes) {
      const productChildren = [];
      if (showProducts) {
        productChildren.push({ name: 'Danh sách sản phẩm', path: '/crm/products' });
      }
      if (showProductTypes) {
        productChildren.push({ name: 'Loại sản phẩm', path: '/crm/product-types' });
      }
      items.push({
        name: 'Sản phẩm',
        path: '/crm/products',
        icon: ShoppingCart,
        children: productChildren
      });
    }

    if (perms.includes('DOCUMENTS_VIEW')) {
      items.push({ name: 'Tài liệu', path: '/crm/documents', icon: FileText });
    }

    // Quyền của riêng Manager
    if (currentUser.role === 'manager') {
      items.push({ name: 'Báo cáo', path: '/reports', icon: BarChart3 });
      items.push({ name: 'Cài đặt', path: '/settings', icon: Settings });
    }

    return items;
  };

  const finalMenuItems = getFilteredMenuItems();

  // Đợi Client render xong mới hiển thị UI chính xác (Fix Hydration Error)
  if (!isMounted) return <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800"></aside>;

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 font-sans">

      {/* --- Phần Logo --- */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <span className="font-bold text-xl text-white tracking-wide">CRM System</span>
        </Link>
      </div>

      {/* --- Phần Menu Navigation --- */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
          Menu chính
        </div>
        <ul className="space-y-1.5">
          {finalMenuItems.map((item, index) => {
            const Icon = item.icon || LayoutDashboard;
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

            return (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  
                  {(isActive || pathname !== item.path) && (
                    <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0 text-slate-500'}`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- Phần Footer --- */}
      <div className="p-4 border-t border-slate-800">
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
               {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser?.name || 'Tài khoản'}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.role || 'Nhân viên'}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-200 group cursor-pointer"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;