'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // State quản lý việc đóng/mở Submenu
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // State thông tin người dùng đăng nhập hiện tại
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('crm_user_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error(e);
      }
    }
  }, [pathname]);

  // Nếu là trang login, ẩn hoàn toàn Sidebar
  if (pathname === '/login') return null;

  const handleToggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_user_session');
    toast.success('Đăng xuất thành công!');
    router.push('/login');
  };

  // Hàm lọc danh mục menu dựa trên quyền của tài khoản đăng nhập
  const getFilteredMenuItems = () => {
    if (!currentUser) return [];

    // Nếu là admin, CHỈ hiển thị menu "Quản lý người dùng"
    if (currentUser.role === 'admin') {
      return [
        { name: 'Quản lý người dùng', path: '/crm/users', icon: Users }
      ];
    }

    const perms = currentUser.permissions ? currentUser.permissions.split(',') : [];
    const items = [];

    // Người dùng thường luôn có quyền truy cập trang Tổng quan (Dashboard)
    items.push({ name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard });

    // Khách hàng
    if (perms.includes('CUSTOMERS_VIEW')) {
      items.push({ name: 'Khách hàng', path: '/crm/customers', icon: Users });
    }

    // Sản phẩm & Loại sản phẩm
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

    // Tài liệu
    if (perms.includes('DOCUMENTS_VIEW')) {
      items.push({ name: 'Tài liệu', path: '/crm/documents', icon: FileText });
    }

    // Báo cáo & Cài đặt dành riêng cho Manager
    if (currentUser.role === 'manager') {
      items.push({ name: 'Báo cáo', path: '/reports', icon: BarChart3 });
      items.push({ name: 'Cài đặt', path: '/settings', icon: Settings });
    }

    return items;
  };

  const menuItems = getFilteredMenuItems();

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 font-sans select-none">
      
      {/* --- Phần Logo --- */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href={currentUser?.role === 'admin' ? '/crm/users' : '/dashboard'} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Kiểm tra xem item hiện tại có menu con không
            const hasChildren = !!item.children;
            
            // Xử lý Active state
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
            // Menu đang mở nếu nó được click hoặc có chứa link đang active
            const isOpen = openSubmenu === item.name || isActive;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  /* --- NẾU LÀ MENU CÓ CON --- */
                  <div className="space-y-1">
                    <button 
                      onClick={() => handleToggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive && !isOpen
                          ? 'bg-blue-600/10 text-blue-400' 
                          : 'hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-200' : 'text-slate-500 group-hover:text-slate-300'}`} 
                      />
                    </button>

                    {/* Mảng UI các menu con */}
                    {isOpen && (
                      <ul className="mt-1 ml-9 space-y-1 border-l border-slate-700/50 pl-3">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.path;
                          return (
                            <li key={child.path}>
                              <Link 
                                href={child.path}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                  isChildActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  /* --- NẾU LÀ MENU THƯỜNG (KHÔNG CÓ CON) --- */
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
                    
                    {/* Dấu mũi tên nhỏ xuất hiện khi active hoặc hover */}
                    {(isActive || pathname !== item.path) && (
                      <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0 text-slate-500'}`} />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- Phần Footer (Thông tin user / Đăng xuất) --- */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-800/50">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase select-none">
            {currentUser?.name ? currentUser.name.substring(0, 2) : 'US'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name || 'Đang tải...'}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser?.email || 'email@company.com'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors group cursor-pointer"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;