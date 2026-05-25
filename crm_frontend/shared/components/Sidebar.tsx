'use client';

import React, { useState } from 'react'; // 1. Bổ sung useState
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown // 2. Thêm icon mũi tên thả xuống
} from 'lucide-react';

const menuItems = [
  { name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Khách hàng', path: '/crm/customers', icon: Users },
  { 
    name: 'Sản phẩm', 
    path: '/crm/products', // Lưu ý: Với menu có con, bạn có thể chuyển path này thành '#' hoặc không truyền
    icon: ShoppingCart,
    children: [
      { name: 'Danh sách sản phẩm', path: '/crm/products' },
      { name: 'Loại sản phẩm', path: '/crm/product-types' },
    ]
  },
  { name: 'Báo cáo', path: '/reports', icon: BarChart3 },
  { name: 'Cài đặt', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  
  // 3. State để quản lý việc đóng/mở Submenu. Mặc định cho phép mở menu có chứa URL hiện tại.
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleToggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

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
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@company.com</p>
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;