// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { userApi } from '@/modules/user/api/user.api';

// 1. Zod Schema cho form đăng nhập
const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Nếu người dùng đã đăng nhập sẵn, tự động chuyển hướng
  useEffect(() => {
    const session = localStorage.getItem('crm_user_session');
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user.role === 'admin') {
          router.push('/crm/users');
        } else {
          // User thường chuyển hướng tới Tổng quan
          router.push('/dashboard');
        }
      } catch (e) {
        localStorage.removeItem('crm_user_session');
      }
    }
  }, [router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await userApi.login(data);
      
      // Lưu session vào localStorage
      localStorage.setItem('crm_user_session', JSON.stringify(user));
      
      toast.success(`Chào mừng trở lại, ${user.name}!`);
      
      // Chuyển hướng theo vai trò
      if (user.role === 'admin') {
        router.push('/crm/users');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      const backendError = error.response?.data;
      const msg = typeof backendError === 'string' ? backendError : 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Các hình tròn hiệu ứng nền nghệ thuật */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      {/* Card Đăng Nhập Glassmorphism */}
      <div className="w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col items-center">
        
        {/* Logo và Tiêu đề */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-3">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Đăng nhập hệ thống</h2>
          <p className="text-sm text-slate-400 mt-1">Hệ thống quản lý quan hệ khách hàng CRM</p>
        </div>

        {/* Biểu mẫu Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Trường Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Email đăng nhập
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full px-4 py-2.5 bg-slate-950 border text-slate-200 text-sm rounded-lg outline-none transition-all placeholder-slate-600 ${
                errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Trường Mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-2.5 bg-slate-950 border text-slate-200 text-sm rounded-lg outline-none transition-all placeholder-slate-600 ${
                errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.password && (
              <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Nút bấm Đăng Nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} CRM System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
