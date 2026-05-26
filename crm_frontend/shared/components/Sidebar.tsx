'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  FileSignature,
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

// 1. Tách cấu hình menu ra một mảng riêng để dễ quản lý và phân quyền sau này
const menuItems = [
  { name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Khách hàng', path: '/crm/customers', icon: Users },
  { name: 'Quản lý báo giá', path: '/crm/quotes', icon: FileText },
  { name: 'Quản lý hợp đồng', path: '/crm/contracts', icon: FileSignature },
  { name: 'Bán hàng', path: '/sales', icon: ShoppingCart },
  { name: 'Báo cáo', path: '/reports', icon: BarChart3 },
  { name: 'Cài đặt', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  // Lấy đường dẫn hiện tại để xử lý trạng thái Active
  const pathname = usePathname();

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
            // Kiểm tra xem URL hiện tại có khớp với menu này không
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

            return (
              <li key={item.path}>
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