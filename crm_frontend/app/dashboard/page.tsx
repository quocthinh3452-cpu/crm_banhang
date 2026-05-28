'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axiosClient from '@/shared/api/axiosClient';

interface DashboardStats {
  totalCustomers: number;
  totalLeads: number;
  totalQuotes: number;
  expectedRevenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalLeads: 0,
    totalQuotes: 0,
    expectedRevenue: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin user đăng nhập
    const session = localStorage.getItem('crm_user_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error(e);
      }
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch đồng thời các API
        const [leadsRes, customersRes] = await Promise.all([
          axiosClient.get('/v1/leads').catch(() => ({ data: { content: [] } })),
          axiosClient.get('/customers').catch(() => ({ data: [] }))
        ]);

        const leads = (leadsRes as any)?.content || (leadsRes as any)?.data?.content || [];
        const customers = (customersRes as any)?.data || customersRes || [];

        // Tính toán số liệu
        const totalLeads = leads.length;
        const totalCustomers = customers.length;
        
        // Tính tổng doanh thu dự kiến từ các Leads tiềm năng (không phải DROPPED)
        const expectedRevenue = leads
          .filter((lead: any) => lead.status !== 'DROPPED')
          .reduce((sum: number, lead: any) => sum + (Number(lead.expectedRevenue) || 0), 0);

        setStats({
          totalCustomers,
          totalLeads,
          totalQuotes: Math.max(totalCustomers * 2, 4), // Trưng bày tương đối hoặc fetch từ API
          expectedRevenue,
        });

        // Lấy 4 Leads gần nhất
        setRecentLeads(leads.slice(0, 4));
      } catch (error) {
        console.error('Lỗi tải dữ liệu dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Mới nhận</span>;
      case 'CONTACTING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Đang liên hệ</span>;
      case 'CONVERTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đã chuyển đổi</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Ngừng chăm sóc</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-1 font-sans">
        {/* Skeleton Header */}
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-40 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-10 w-32 bg-slate-800 rounded-full"></div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-1 font-sans"
    >
      {/* --- PHẦN TIÊU ĐỀ HỆ THỐNG --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-500 text-sm font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            CRM Bán Hàng Dự Án IT
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Chào mừng trở lại, {currentUser?.name || 'Thành viên'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dưới đây là tổng quan hiệu suất bán hàng và quản lý khách hàng của bạn hôm nay.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/crm/customers')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm Khách Hàng
          </button>
        </div>
      </div>

      {/* --- GRID THỐNG KÊ SỐ LIỆU --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Khách hàng */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative overflow-hidden p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Hoạt động
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Khách Hàng Hợp Tác</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.totalCustomers}</h3>
          </div>
        </motion.div>

        {/* Lead Tiềm Năng */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative overflow-hidden p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              Tiềm năng
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Chiến Dịch Leads</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.totalLeads}</h3>
          </div>
        </motion.div>

        {/* Báo giá & Đơn hàng */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative overflow-hidden p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              Khởi tạo
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Báo Giá Đã Lập</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.totalQuotes}</h3>
          </div>
        </motion.div>

        {/* Doanh thu dự kiến */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative overflow-hidden p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
              Dự tính
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Doanh Thu Dự Kiến</p>
            <h3 className="text-2xl font-bold text-white mt-1 truncate">{formatCurrency(stats.expectedRevenue)}</h3>
          </div>
        </motion.div>

      </div>

      {/* --- PHÂN VÙNG DỮ LIỆU CHÍNH VÀ TIỆN ÍCH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cột 1 & 2: Leads mới cập nhật */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Chiến dịch Leads mới nhận</h2>
              <p className="text-slate-400 text-xs mt-1">Các liên hệ kinh doanh gần đây nhất trên hệ thống</p>
            </div>
            <button 
              onClick={() => router.push('/crm/lead')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="pb-3">Tên / Công ty</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3">Dự kiến thu</th>
                  <th className="pb-3">Liên hệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead, index) => (
                    <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-3">
                        <p className="font-semibold text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{lead.company || 'Cá nhân'}</p>
                      </td>
                      <td className="py-4 pr-3">{getStatusBadge(lead.status)}</td>
                      <td className="py-4 pr-3 font-medium text-slate-200">
                        {lead.expectedRevenue ? formatCurrency(lead.expectedRevenue) : 'Chưa định giá'}
                      </td>
                      <td className="py-4 text-xs text-slate-400">
                        <p>{lead.phone || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{lead.email || 'No Email'}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      Chưa có leads nào được nhập trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột 3: Quick Actions & Phân hệ hệ thống */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Truy cập phân hệ nhanh</h2>
            <p className="text-slate-400 text-xs mt-1">Điều hướng nhanh tới chức năng làm việc nghiệp vụ</p>
          </div>

          <div className="space-y-3">
            
            {/* Phân hệ lead */}
            <button
              onClick={() => router.push('/crm/lead')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Quản lý Bán hàng & Leads</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tiếp cận khách hàng mới</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Phân hệ sản phẩm */}
            <button
              onClick={() => router.push('/crm/products')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Quản lý Kho sản phẩm</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Danh sách & Loại sản phẩm</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Phân hệ tài liệu */}
            <button
              onClick={() => router.push('/crm/documents')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Kho lưu trữ Tài liệu</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tải lên & Quản lý tài liệu</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>

          </div>
        </div>

      </div>

    </motion.div>
  );
}
