'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Modal } from '@/shared/components/ui/Modal';
import { formatCurrency } from '@/shared/utils/formatters';
import axiosClient from '@/shared/api/axiosClient';
import toast from 'react-hot-toast';
import { FileText, Eye, Printer, X } from 'lucide-react';

interface QuoteDetailModalProps {
  quoteId: number;
  onClose: () => void;
}

export default function QuoteDetailModal({ quoteId, onClose }: QuoteDetailModalProps) {
  const [quoteData, setQuoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getSubtotal = () => {
    if (quoteData?.subtotal !== undefined && quoteData?.subtotal !== null) return Number(quoteData.subtotal);
    return quoteData?.items?.reduce((sum: number, item: any) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0) || 0;
  };

  const getDiscount = () => {
    if (quoteData?.discount !== undefined && quoteData?.discount !== null) return Number(quoteData.discount);
    return quoteData?.items?.reduce((sum: number, item: any) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.unitPrice || 0);
      const disc = Number(item.discountPercent || 0);
      return sum + (qty * price * (disc / 100));
    }, 0) || 0;
  };

  const getTax = () => {
    if (quoteData?.tax !== undefined && quoteData?.tax !== null) return Number(quoteData.tax);
    const sub = getSubtotal();
    const disc = getDiscount();
    return Math.round((sub - disc) * 0.1);
  };

  const getGrandTotal = () => {
    if (quoteData?.grandTotal !== undefined && quoteData?.grandTotal !== null) return Number(quoteData.grandTotal);
    const sub = getSubtotal();
    const disc = getDiscount();
    const tax = getTax();
    return sub - disc + tax;
  };


  useEffect(() => {
    const fetchQuoteDetails = async () => {
      setIsLoading(true);
      try {
        const data: any = await axiosClient.get(`/quotes/${quoteId}`);
        setQuoteData(data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết báo giá:', err);
        toast.error('⚠️ Không thể tải thông tin chi tiết báo giá!');
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuoteDetails();
  }, [quoteId]);

  const isQuoteExpired = (validUntilStr?: string) => {
    if (!validUntilStr) return false;
    const expiry = new Date(validUntilStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'draft':
        return 'bg-slate-50 text-slate-700 border border-slate-200/60';
      case 'negotiating':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'paused':
        return 'bg-sky-50 text-sky-700 border border-sky-200/60';
      case 'closed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'failed':
        return 'bg-red-50 text-red-700 border border-red-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200/60';
    }
  };


  const getStampClasses = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'closed':
        return 'border-emerald-500/80 text-emerald-500/80';
      case 'negotiating':
        return 'border-amber-500/80 text-amber-500/80';
      case 'cancelled':
      case 'failed':
        return 'border-rose-500/80 text-rose-500/80';
      case 'paused':
        return 'border-sky-500/80 text-sky-500/80';
      default:
        return 'border-slate-400/80 text-slate-400/80';
    }
  };

  const getPrintStampStyle = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'closed':
        return 'border: 4px solid #10b981; color: #10b981;';
      case 'negotiating':
        return 'border: 4px solid #f59e0b; color: #f59e0b;';
      case 'cancelled':
      case 'failed':
        return 'border: 4px solid #f43f5e; color: #f43f5e;';
      case 'paused':
        return 'border: 4px solid #0ea5e9; color: #0ea5e9;';
      default:
        return 'border: 4px solid #94a3b8; color: #94a3b8;';
    }
  };

  const translateStatus = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'draft':
        return 'Nháp';
      case 'negotiating':
        return 'Thương thảo';
      case 'paused':
        return 'Tạm dừng';
      case 'closed':
        return 'Đã chốt';
      case 'cancelled':
        return 'Hủy bỏ';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const handleExportPDF = () => {
    if (!quoteData) return;

    // Tạo một iframe ẩn để in ấn
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const itemsHtml = quoteData.items?.map((item: any, idx: number) => {
      const itemTotal = item.total !== undefined && item.total !== null ? Number(item.total) : (Number(item.quantity || 0) * Number(item.unitPrice || 0) * (1 - Number(item.discountPercent || 0) / 100));
      return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; text-align: center; font-size: 12px; color: #475569;">${idx + 1}</td>
        <td style="padding: 10px; font-size: 12px; font-weight: 500; color: #0f172a;">${item.productName || `Sản phẩm #${item.productId}`}</td>
        <td style="padding: 10px; text-align: center; font-size: 12px; color: #0f172a;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; font-size: 12px; color: #0f172a;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding: 10px; text-align: right; font-size: 12px; font-weight: 600; color: #2563eb;">${formatCurrency(itemTotal)}</td>
      </tr>
      `;
    }).join('') || `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">Không có sản phẩm nào</td></tr>`;

    const htmlContent = `
      <html>
        <head>
          <title>Bao_Gia_${quoteData.quoteNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              color: #0f172a;
              margin: 20mm 15mm;
              line-height: 1.5;
            }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .logo-cell { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 0.5px; }
            .title-cell { text-align: right; }
            .quote-title { font-size: 22px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
            .quote-number { font-size: 14px; color: #475569; font-weight: bold; margin-top: 4px; }
            
            .info-section { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .info-box { width: 50%; vertical-align: top; padding-right: 20px; }
            .info-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 6px; letter-spacing: 0.5px; }
            .info-value { font-size: 13px; font-weight: 500; color: #1e293b; line-height: 1.5; }
            
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .items-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 12px 10px; }
            
            .summary-table { width: 45%; margin-left: auto; border-collapse: collapse; margin-top: 15px; }
            .summary-table td { padding: 8px 10px; font-size: 13px; color: #334155; }
            
            .footer-section { margin-top: 60px; width: 100%; border-collapse: collapse; }
            .footer-sign { width: 50%; text-align: center; vertical-align: top; }
            .sign-label { font-size: 13px; font-weight: bold; color: #1e293b; margin-bottom: 70px; }
            .sign-placeholder { font-size: 11px; color: #94a3b8; font-style: italic; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="logo-cell">CRM SYSTEM</td>
              <td class="title-cell">
                <div class="quote-title">Báo giá Thương mại</div>
                <div class="quote-number">Mã: #${quoteData.quoteNumber}</div>
              </td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />

          <table class="info-section">
            <tr>
              <td class="info-box">
                <div class="info-label">ĐƠN VỊ LẬP BÁO GIÁ</div>
                <div class="info-value" style="font-weight: bold;">CRM Business Co., Ltd</div>
                <div class="info-value">Địa chỉ: Khu Công Nghệ Cao, Quận 9, TP. HCM</div>
                <div class="info-value">Hotline: 1900 6868 | Email: sales@crm.com</div>
              </td>
              <td class="info-box">
                <div class="info-label">KHÁCH HÀNG KHÁNH NHẬN</div>
                <div class="info-value" style="font-weight: bold; color: #2563eb;">${quoteData.customerName || 'Khách hàng liên kết'}</div>
                <div class="info-value">Ngày lập: ${quoteData.quoteDate}</div>
                <div class="info-value" style="color: ${isQuoteExpired(quoteData.validUntil) ? '#ef4444' : '#0f172a'}">
                  Hạn lực: ${quoteData.validUntil || 'Không thời hạn'} 
                  ${isQuoteExpired(quoteData.validUntil) ? ' (Đã hết hạn)' : ''}
                </div>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%; text-align: center;">STT</th>
                <th style="width: 47%; text-align: left;">Tên sản phẩm / dịch vụ</th>
                <th style="width: 15%; text-align: center;">Số lượng</th>
                <th style="width: 15%; text-align: right;">Đơn giá</th>
                <th style="width: 15%; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="color: #64748b;">Cộng tiền hàng:</td>
              <td style="text-align: right; font-weight: 500;">${formatCurrency(getSubtotal())}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Chiết khấu:</td>
              <td style="text-align: right; font-weight: 500; color: #ef4444;">-${formatCurrency(getDiscount())}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Thuế VAT (10%):</td>
              <td style="text-align: right; font-weight: 500;">${formatCurrency(getTax())}</td>
            </tr>
            <tr style="border-top: 2px solid #2563eb;">
              <td style="font-weight: bold; color: #0f172a; padding-top: 10px;">Tổng thanh toán:</td>
              <td style="text-align: right; font-weight: bold; color: #2563eb; font-size: 15px; padding-top: 10px;">${formatCurrency(getGrandTotal())}</td>
            </tr>
          </table>

          ${quoteData.note ? `
            <div style="margin-top: 35px; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #cbd5e1;">
              <div class="info-label" style="margin-bottom: 4px;">GHI CHÚ / ĐIỀU KHOẢN KÈM THEO</div>
              <div style="font-size: 12px; color: #475569; white-space: pre-line;">${quoteData.note}</div>
            </div>
          ` : ''}

          <!-- Con dấu trạng thái dạng in ấn -->
          <div style="position: absolute; right: 50px; bottom: 180px; opacity: 0.15; transform: rotate(12deg); pointer-events: none; font-family: sans-serif; font-weight: 900; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 16px; border-radius: 8px; ${getPrintStampStyle(quoteData.approvalStatus)}">
            ${translateStatus(quoteData.approvalStatus)}
          </div>

          <table class="footer-section">
            <tr>
              <td class="footer-sign">
                <div class="sign-label">Đại diện Khách hàng</div>
                <div class="sign-placeholder">(Ký, ghi rõ họ tên)</div>
              </td>
              <td class="footer-sign">
                <div class="sign-label">Đại diện Phòng Kinh doanh</div>
                <div class="sign-placeholder">(Ký, ghi rõ họ tên)</div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    toast.loading('⚡ Đang xử lý xuất tệp PDF...', { id: 'pdf-toast', duration: 1500 });
    
    printFrame.contentWindow?.focus();
    setTimeout(() => {
      printFrame.contentWindow?.print();
      document.body.removeChild(printFrame);
      toast.success('🎉 Đã xuất tài liệu PDF thành công!', { id: 'pdf-toast' });
    }, 600);
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="5xl" showDefaultHeader={false} customPadding="p-0">
      <div className="flex flex-col h-full bg-slate-50 font-sans">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Chi tiết Báo giá</h2>
              {quoteData && <p className="text-xs text-slate-500">Mã giao dịch: #{quoteData.quoteNumber}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-0.5 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          ) : quoteData ? (
            <div className="space-y-6">
              {/* Trang Báo giá A4 */}
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200/60 shadow-sm space-y-6 max-w-3xl mx-auto relative overflow-hidden">
                
                {/* Logo & Tiêu đề */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-lg font-black text-blue-600 tracking-wider">CRM SYSTEM</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Business Management Console</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Báo giá Thương mại</h3>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200/80 text-slate-600 bg-slate-50">
                      Mã: #{quoteData.quoteNumber}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-200/80" />

                {/* Thông tin 2 bên */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {/* Bên lập */}
                  <div className="space-y-1.5 p-4 bg-slate-50/50 border border-slate-200/50 rounded-lg">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">ĐƠN VỊ LẬP BÁO GIÁ</span>
                    <p className="font-bold text-slate-800">CRM Business Co., Ltd</p>
                    <p className="text-xs text-slate-500">Khu Công Nghệ Cao, Quận 9, TP. HCM</p>
                    <p className="text-xs text-slate-500">Email: sales@crm.com | Hotline: 1900 6868</p>
                  </div>

                  {/* Khách hàng */}
                  <div className="space-y-1.5 p-4 bg-slate-50/50 border border-slate-200/50 rounded-lg">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">KHÁCH HÀNG KHÁNH NHẬN</span>
                    <p className="font-bold text-blue-600">{quoteData.customerName || 'Khách hàng liên kết'}</p>
                    <p className="text-xs text-slate-500">Ngày lập: <span className="font-semibold text-slate-700">{quoteData.quoteDate}</span></p>
                    <p className="text-xs text-slate-500">
                      Hạn lực: <span className={`font-semibold ${isQuoteExpired(quoteData.validUntil) ? 'text-red-500' : 'text-slate-700'}`}>
                        {quoteData.validUntil || 'Không giới hạn'}
                      </span>
                      {isQuoteExpired(quoteData.validUntil) && <span className="text-[10px] font-bold text-red-500 ml-1">⚠️ Hết hạn</span>}
                    </p>
                  </div>
                </div>

                {/* Bảng sản phẩm */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-bold text-slate-500 text-center uppercase tracking-wider w-12">STT</th>
                        <th className="p-3 font-bold text-slate-500 uppercase tracking-wider text-left">Sản phẩm / Dịch vụ</th>
                        <th className="p-3 font-bold text-slate-500 text-center uppercase tracking-wider w-20">Số lượng</th>
                        <th className="p-3 font-bold text-slate-500 text-right uppercase tracking-wider w-32">Đơn giá</th>
                        <th className="p-3 font-bold text-slate-500 text-right uppercase tracking-wider w-32">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quoteData.items && quoteData.items.length > 0 ? (
                        quoteData.items.map((item: any, idx: number) => (
                          <tr key={item.id || item.productId || idx} className="hover:bg-slate-50/50">
                            <td className="p-3 text-slate-400 text-center font-medium">{idx + 1}</td>
                            <td className="p-3 font-medium text-slate-800">{item.productName || `Sản phẩm #${item.productId}`}</td>
                            <td className="p-3 text-slate-800 text-center font-semibold">{item.quantity}</td>
                            <td className="p-3 text-slate-600 text-right font-medium">{formatCurrency(item.unitPrice)}</td>
                            <td className="p-3 text-blue-600 text-right font-bold">{formatCurrency(item.total !== undefined && item.total !== null ? item.total : (Number(item.quantity || 0) * Number(item.unitPrice || 0) * (1 - Number(item.discountPercent || 0) / 100)))}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">Không có sản phẩm nào trong báo giá.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Phần tổng tiền */}
                <div className="w-full md:w-80 ml-auto space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span>Cộng tiền hàng:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Chiết khấu giảm giá:</span>
                    <span>-{formatCurrency(getDiscount())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế VAT (10%):</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(getTax())}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200/80 pt-2.5">
                    <span className="text-blue-600 font-bold">Tổng thanh toán:</span>
                    <span className="text-blue-600 text-base font-black">{formatCurrency(getGrandTotal())}</span>
                  </div>
                </div>

                {/* Ghi chú */}
                {quoteData.note && (
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">GHI CHÚ / ĐIỀU KHOẢN ĐÍNH KÈM</span>
                    <p className="text-xs text-slate-600 white-space-pre-line font-medium leading-relaxed">{quoteData.note}</p>
                  </div>
                )}

                {/* Trạng thái Báo giá đóng dấu */}
                <div className="absolute right-8 bottom-32 opacity-25 pointer-events-none select-none">
                  <div className={`border-4 ${getStampClasses(quoteData.approvalStatus)} font-black text-xl uppercase tracking-widest px-4 py-2 rounded-lg rotate-12`}>
                    {translateStatus(quoteData.approvalStatus)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-medium">Không thể tìm thấy thông tin báo giá.</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200/80 flex justify-between items-center gap-4">
          {quoteData && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusBadgeClass(quoteData.approvalStatus)}`}>
              Trạng thái: {translateStatus(quoteData.approvalStatus)}
            </span>
          )}
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 rounded-lg text-sm font-bold transition-all duration-150 shadow-sm"
            >
              Đóng
            </button>
            {quoteData && (
              <Button onClick={handleExportPDF} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
                <Printer className="w-4 h-4" /> Xuất PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
