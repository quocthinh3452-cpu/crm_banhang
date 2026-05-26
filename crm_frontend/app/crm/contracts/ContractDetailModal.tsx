'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { formatCurrency } from '@/shared/utils/formatters';
import toast from 'react-hot-toast';
import { FileText, Printer, X } from 'lucide-react';

interface ContractDetailModalProps {
  contract: any;
  onClose: () => void;
}

export default function ContractDetailModal({ contract, onClose }: ContractDetailModalProps) {
  if (!contract) return null;

  const isExpired = (expiryDateStr?: string) => {
    if (!expiryDateStr) return false;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  const isExpiringSoon = (expiryDateStr?: string) => {
    if (!expiryDateStr) return false;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const getStatusBadgeClass = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'bg-orange-50 text-orange-700 border border-orange-200/60';
    }
    
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'expired':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200/60';
    }
  };


  const getStampClasses = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'border-orange-500/80 text-orange-500/80';
    }
    switch (status) {
      case 'active':
        return 'border-emerald-500/80 text-emerald-500/80';
      case 'expired':
        return 'border-amber-500/80 text-amber-500/80';
      case 'cancelled':
        return 'border-rose-500/80 text-rose-500/80';
      default:
        return 'border-slate-400/80 text-slate-400/80';
    }
  };

  const getPrintStampStyle = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'border: 4px solid #f97316; color: #f97316;';
    }
    switch (status) {
      case 'active':
        return 'border: 4px solid #10b981; color: #10b981;';
      case 'expired':
        return 'border: 4px solid #f59e0b; color: #f59e0b;';
      case 'cancelled':
        return 'border: 4px solid #f43f5e; color: #f43f5e;';
      default:
        return 'border: 4px solid #94a3b8; color: #94a3b8;';
    }
  };

  const translateStatus = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'Sắp hết hạn ⚠️';
    }
    
    switch (status) {
      case 'active':
        return 'Kích hoạt';
      case 'expired':
        return 'Hết hạn';
      case 'cancelled':
        return 'Hủy bỏ';
      default:
        return status;
    }
  };

  const handleExportPDF = () => {
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

    const htmlContent = `
      <html>
        <head>
          <title>Hop_Dong_${contract.contractNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              color: #0f172a;
              margin: 20mm 15mm;
              line-height: 1.6;
              font-size: 13px;
            }
            .national-header { text-align: center; margin-bottom: 25px; }
            .national-title { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
            .national-subtitle { font-size: 12px; font-weight: bold; margin-bottom: 8px; }
            .divider { width: 160px; height: 1px; background-color: #000; margin: 0 auto; }
            
            .contract-header { text-align: center; margin-top: 25px; margin-bottom: 30px; }
            .contract-title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
            .contract-number { font-size: 12px; font-style: italic; color: #475569; }

            .basis-section { font-style: italic; font-size: 12px; margin-bottom: 20px; color: #334155; line-height: 1.4; }
            .date-intro { margin-bottom: 15px; }
            
            .party-title { font-size: 13px; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; }
            .party-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .party-table td { padding: 4px 0; vertical-align: top; }
            
            .article-title { font-size: 13px; font-weight: bold; text-transform: uppercase; margin-top: 25px; margin-bottom: 6px; }
            .article-content { padding-left: 15px; margin-bottom: 10px; }
            
            .note-box { background: #f8fafc; border-left: 3px solid #cbd5e1; padding: 10px 15px; margin-top: 15px; font-size: 12px; }
            
            .signature-table { width: 100%; margin-top: 50px; border-collapse: collapse; }
            .signature-cell { width: 50%; text-align: center; vertical-align: top; }
            .signature-label { font-size: 13px; font-weight: bold; text-transform: uppercase; margin-bottom: 70px; }
            .signature-name { font-weight: bold; font-size: 13px; }
            .signature-sub { font-size: 11px; color: #94a3b8; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="national-header">
            <div class="national-title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="national-subtitle">Độc lập - Tự do - Hạnh phúc</div>
            <div class="divider"></div>
          </div>

          <div class="contract-header">
            <div class="contract-title">HỢP ĐỒNG KINH DOANH THƯƠNG MẠI</div>
            <div class="contract-number">Số: ${contract.contractNumber}</div>
          </div>

          <div class="basis-section">
            - Căn cứ Bộ luật Dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam hiện hành;<br/>
            - Căn cứ Luật Thương mại nước Cộng hòa xã hội chủ nghĩa Việt Nam hiện hành;<br/>
            - Căn cứ nhu cầu và khả năng thực tế của hai bên.
          </div>

          <div class="date-intro">
            Hôm nay, ngày ${contract.signDate || '...'} tại văn phòng công ty CRM System, chúng tôi gồm các bên ký kết dưới đây:
          </div>

          <div class="party-title">BÊN A: BÊN BÁN / CUNG CẤP DỊCH VỤ</div>
          <table class="party-table">
            <tr>
              <td style="width: 15%;"><strong>Tên đơn vị:</strong></td>
              <td style="width: 35%;">CRM Business Co., Ltd</td>
              <td style="width: 15%;"><strong>Người đại diện:</strong></td>
              <td style="width: 35%;">${contract.managerName || 'Phòng Kinh doanh'}</td>
            </tr>
            <tr>
              <td><strong>Địa chỉ:</strong></td>
              <td>Khu Công Nghệ Cao, Quận 9, TP. HCM</td>
              <td><strong>Hotline:</strong></td>
              <td>1900 6868</td>
            </tr>
          </table>

          <div class="party-title">BÊN B: BÊN MUA HÀNG / SỬ DỤNG DỊCH VỤ</div>
          <table class="party-table">
            <tr>
              <td style="width: 15%;"><strong>Tên khách hàng:</strong></td>
              <td colspan="3"><strong>${contract.customerName || `Khách hàng #${contract.customerId}`}</strong></td>
            </tr>
            <tr>
              <td><strong>Địa chỉ:</strong></td>
              <td>Đang cập nhật</td>
              <td><strong>Điện thoại:</strong></td>
              <td>Đang cập nhật</td>
            </tr>
            <tr>
              <td><strong>Mã số thuế:</strong></td>
              <td>Đang cập nhật</td>
              <td><strong>Đại diện pháp luật:</strong></td>
              <td>Đại diện pháp luật</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 25px 0;" />

          <div class="article-title">ĐIỀU 1: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN</div>
          <div class="article-content">
            1.1. Tổng giá trị Hợp đồng thương mại này được thống nhất là: <strong>${formatCurrency(contract.value)}</strong> VNĐ (Đã bao gồm các loại thuế, chiết khấu và phí liên quan).<br/>
            1.2. Phương thức thanh toán: Thanh toán qua hình thức chuyển khoản ngân hàng hoặc tiền mặt theo thỏa thuận phù hợp với quy định.
          </div>

          <div class="article-title">ĐIỀU 2: THỜI HẠN VÀ HIỆU LỰC HỢP ĐỒNG</div>
          <div class="article-content">
            2.1. Ngày ký kết: Hợp đồng được ký chính thức vào ngày <strong>${contract.signDate || 'Chưa cập nhật'}</strong>.<br/>
            2.2. Thời hạn hiệu lực: Hợp đồng bắt đầu từ ngày ký đến ngày <strong>${contract.expiryDate || 'Vô thời hạn'}</strong>.<br/>
            2.3. Hợp đồng được thành lập thành 02 bản có giá trị pháp lý tương đương, mỗi bên giữ 01 bản.
          </div>

          ${contract.note ? `
            <div class="article-title">ĐIỀU 3: ĐIỀU KHOẢN KHÁC / GHI CHÚ BỔ SUNG</div>
            <div class="note-box">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; color: #475569;">GHI CHÚ KÈM THEO:</div>
              <div style="white-space: pre-line;">${contract.note}</div>
            </div>
          ` : ''}

          <!-- Con dấu trạng thái dạng in ấn hợp đồng -->
          <div style="position: absolute; right: 80px; bottom: 220px; opacity: 0.15; transform: rotate(12deg); pointer-events: none; font-family: sans-serif; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 16px; border-radius: 8px; ${getPrintStampStyle(contract.status, contract.expiryDate)}">
            ${translateStatus(contract.status, contract.expiryDate)}
          </div>

          <table class="signature-table">
            <tr>
              <td class="signature-cell">
                <div class="signature-label">ĐẠI DIỆN BÊN A</div>
                <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
                <div style="height: 60px;"></div>
                <div class="signature-name">${contract.managerName || 'Đại diện Bên A'}</div>
              </td>
              <td class="signature-cell">
                <div class="signature-label">ĐẠI DIỆN BÊN B</div>
                <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
                <div style="height: 60px;"></div>
                <div class="signature-name">${contract.customerName || 'Đại diện Bên B'}</div>
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
              <h2 className="text-base font-bold text-slate-900">Chi tiết Hợp đồng</h2>
              <p className="text-xs text-slate-500">Mã giao dịch: #{contract.contractNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
          <div className="bg-white p-8 md:p-12 rounded-xl border border-slate-200/60 shadow-sm space-y-6 max-w-3xl mx-auto relative overflow-hidden text-slate-800 text-sm leading-relaxed">
            
            {/* Quốc hiệu tiêu ngữ */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base uppercase tracking-wide">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
              <h4 className="font-semibold text-sm">Độc lập - Tự do - Hạnh phúc</h4>
              <div className="w-40 h-[1px] bg-slate-400 mx-auto mt-2"></div>
            </div>

            <div className="text-center pt-4">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">HỢP ĐỒNG KINH DOANH THƯƠNG MẠI</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Số: {contract.contractNumber}</p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="italic text-xs text-slate-500">
                - Căn cứ Bộ luật Dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam hiện hành;<br />
                - Căn cứ Luật Thương mại nước Cộng hòa xã hội chủ nghĩa Việt Nam hiện hành;<br />
                - Căn cứ nhu cầu và khả năng thực tế của hai bên.
              </p>

              <p className="text-xs text-slate-600">
                Hôm nay, ngày {contract.signDate || '...'} tại văn phòng công ty CRM System, chúng tôi gồm các bên:
              </p>

              {/* BÊN A */}
              <div className="space-y-1">
                <h4 className="font-bold uppercase text-xs text-slate-900 tracking-wide">BÊN A: BÊN BÁN / CUNG CẤP DỊCH VỤ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 pl-4 border-l border-slate-200">
                  <div><strong>Tên đơn vị:</strong> CRM Business Co., Ltd</div>
                  <div><strong>Đại diện:</strong> {contract.managerName || 'Phòng Kinh doanh'}</div>
                  <div><strong>Địa chỉ:</strong> Khu Công Nghệ Cao, Quận 9, TP. HCM</div>
                  <div><strong>Hotline:</strong> 1900 6868</div>
                </div>
              </div>

              {/* BÊN B */}
              <div className="space-y-1 pt-2">
                <h4 className="font-bold uppercase text-xs text-slate-900 tracking-wide">BÊN B: BÊN MUA HÀNG / SỬ DỤNG DỊCH VỤ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 pl-4 border-l border-slate-200">
                  <div className="md:col-span-2"><strong>Tên khách hàng:</strong> <span className="font-bold text-blue-600">{contract.customerName || `Khách hàng #${contract.customerId}`}</span></div>
                  <div><strong>Mã số thuế/CMND:</strong> Đang cập nhật</div>
                  <div><strong>Đại diện pháp luật:</strong> Đại diện pháp luật</div>
                  <div><strong>Số điện thoại:</strong> Đang cập nhật</div>
                </div>
              </div>

              {/* ĐIỀU KHOẢN */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">ĐIỀU 1: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN</h4>
                  <div className="text-xs text-slate-600 pl-4 space-y-1 mt-1">
                    <p>1.1. Tổng giá trị hợp đồng là: <strong className="text-blue-600">{formatCurrency(contract.value)}</strong> VNĐ (Đã bao gồm các loại thuế, chiết khấu và phí liên quan).</p>
                    <p>1.2. Phương thức thanh toán: Chuyển khoản ngân hàng hoặc tiền mặt theo đúng quy định pháp luật.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">ĐIỀU 2: THỜI HẠN VÀ TRẠNG THÁI HIỆU LỰC</h4>
                  <div className="text-xs text-slate-600 pl-4 space-y-1 mt-1">
                    <p>2.1. Ngày ký kết: <strong>{contract.signDate || 'Chưa cập nhật'}</strong></p>
                    <p>2.2. Thời hạn hiệu lực: Hợp đồng có hiệu lực đến ngày <strong>{contract.expiryDate || 'Vô thời hạn'}</strong></p>
                    <p>
                      2.3. Trạng thái CRM: {' '}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(contract.status, contract.expiryDate)}`}>
                        {translateStatus(contract.status, contract.expiryDate)}
                      </span>
                    </p>
                  </div>
                </div>

                {contract.note && (
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">ĐIỀU 3: CÁC ĐIỀU KHOẢN BỔ SUNG / GHI CHÚ</h4>
                    <p className="text-xs text-slate-600 pl-4 mt-1 white-space-pre-line leading-relaxed font-medium bg-slate-50 p-2.5 rounded border-l-2 border-slate-300">
                      {contract.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Con dấu trạng thái trên bản Preview */}
              <div className="absolute right-12 bottom-36 opacity-25 pointer-events-none select-none">
                <div className={`border-4 ${getStampClasses(contract.status, contract.expiryDate)} font-black text-lg uppercase tracking-widest px-4 py-1.5 rounded-lg rotate-12`}>
                  {translateStatus(contract.status, contract.expiryDate)}
                </div>
              </div>

              {/* Chữ ký */}
              <div className="grid grid-cols-2 text-center pt-8 gap-4 border-t border-slate-100 mt-6">
                <div>
                  <h5 className="font-bold text-xs uppercase text-slate-900">ĐẠI DIỆN BÊN A</h5>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</p>
                  <div className="h-16"></div>
                  <p className="text-xs font-semibold text-slate-700">{contract.managerName || 'Đại diện Bên A'}</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase text-slate-900">ĐẠI DIỆN BÊN B</h5>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</p>
                  <div className="h-16"></div>
                  <p className="text-xs font-semibold text-slate-700">{contract.customerName || 'Đại diện Bên B'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200/80 flex justify-between items-center gap-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusBadgeClass(contract.status, contract.expiryDate)}`}>
            Trạng thái: {translateStatus(contract.status, contract.expiryDate)}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 rounded-lg text-sm font-bold transition-all duration-150 shadow-sm"
            >
              Đóng
            </button>
            <Button onClick={handleExportPDF} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
              <Printer className="w-4 h-4" /> Xuất PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
