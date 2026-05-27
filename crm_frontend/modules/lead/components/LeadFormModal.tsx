import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Button } from '@/shared/components/ui/Button';
import { leadApi, Lead } from '../services/leadApi';
import { lookupApi, LookupItem } from '../services/lookupApi';

// 1. ZOD SCHEMA
const leadSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, 'Tên khách hàng phải có ít nhất 2 ký tự'),
  company: z.string().min(1, 'Vui lòng nhập tên công ty'),
  phone: z.string().regex(/^(0[35789])[0-9]{8}$/, 'Số điện thoại không hợp lệ (VD: 0981234567)'),
  email: z.string().email('Email không đúng định dạng'),
  status: z.enum(['NEW', 'CONTACTING', 'CONVERTED', 'DROPPED']),
  expectedRevenue: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().min(0, "Doanh số không được âm").optional()),
  serviceInterest: z.string().min(1, 'Vui lòng nhập sản phẩm quan tâm'),
  note: z.string().min(1, 'Vui lòng nhập ghi chú'),
  
  // BẮT BUỘC NHẬP (Đã xóa .optional())
  taxCode: z.string().min(1, 'Vui lòng nhập mã số thuế').max(20, 'Mã số thuế tối đa 20 ký tự'),
  idCard: z.string().regex(/^[0-9]{12}$/, 'CCCD phải bao gồm đúng 12 chữ số'),

  // Thêm 3 trường mới 
  provinceId: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().optional()),

  salesGroupId: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().optional()),

  sourceId: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().optional()),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const mapFormStatusToLead = (s?: LeadFormValues['status']): Lead['status'] | undefined => {
  switch (s) {
    case 'NEW': return 'NEW';
    case 'CONTACTING': return 'CONTACTING';
    case 'CONVERTED': return 'CONVERTED';
    case 'DROPPED': return 'DROPPED';
    default: return undefined;
  }
};

const mapLeadStatusToForm = (s?: Lead['status']): LeadFormValues['status'] | undefined => {
  switch (s) {
    case 'NEW': return 'NEW';
    case 'CONTACTING': return 'CONTACTING';
    case 'CONVERTED': return 'CONVERTED';
    case 'DROPPED': return 'DROPPED';
    default: return undefined;
  }
};

export const LeadFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentLead: Lead | null;
}> = ({ isOpen, onClose, onSuccess, currentLead }) => {
  
  // STATE MỚI: Dùng để ẩn/hiện vùng thông tin bảo mật
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  // Lookup data states
  const [provinces, setProvinces] = useState<LookupItem[]>([]);
  const [sources, setSources] = useState<LookupItem[]>([]);
  const [salesGroups, setSalesGroups] = useState<LookupItem[]>([]);

  // Fetch lookup data
  useEffect(() => {
    if (isOpen) {
      lookupApi.getProvinces().then(setProvinces).catch(() => setProvinces([]));
      lookupApi.getSources().then(setSources).catch(() => setSources([]));
      lookupApi.getSalesGroups().then(setSalesGroups).catch(() => setSalesGroups([]));
    }
  }, [isOpen]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<LeadFormValues, any>,
    defaultValues: {
      status: 'NEW',
      name: '',
      taxCode: '',
      idCard: '',
    },
  });

  // Reset form và trạng thái ẩn/hiện khi mở/đóng Modal
useEffect(() => {
    if (!isOpen) {
      setShowSensitiveInfo(false);
    }

    if (currentLead && isOpen) {
      reset({
        id: currentLead.id,
        name: currentLead.name || '',
        company: currentLead.company || '',
        phone: currentLead.phone || '',
        email: currentLead.email || '',
        status: mapLeadStatusToForm(currentLead.status) || 'NEW',
        expectedRevenue: currentLead.expectedRevenue ?? undefined,
        serviceInterest: currentLead.serviceInterest || '',
        note: currentLead.note || '',
        taxCode: currentLead.taxCode || '',
        idCard: currentLead.idCard || '',

        // Sửa ở đây: dùng undefined thay vì ''
        provinceId: currentLead.provinceId ?? undefined,
        salesGroupId: currentLead.salesGroupId ?? undefined,
        sourceId: currentLead.sourceId ?? undefined,
      });
    } else if (isOpen) {
      reset({
        name: '',
        company: '',
        phone: '',
        email: '',
        status: 'NEW',
        expectedRevenue: undefined,
        serviceInterest: '',
        note: '',
        taxCode: '',
        idCard: '',
        // Sửa ở đây: dùng undefined thay vì ''
        provinceId: undefined,
        salesGroupId: undefined,
        sourceId: undefined,
      });
    }
  }, [currentLead, isOpen, reset]);

  // UX TRICK: Tự động mở vùng thông tin bảo mật nếu người dùng lưu mà bị lỗi (bỏ trống)
  useEffect(() => {
    if (errors.taxCode || errors.idCard) {
      setShowSensitiveInfo(true);
    }
  }, [errors.taxCode, errors.idCard]);

const onSubmit: SubmitHandler<LeadFormValues> = async (data) => {
    try {
      const payload = {
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        status: mapFormStatusToLead(data.status) ?? 'NEW',
        
        // Ép kiểu sang Number thuần (không phải chuỗi)
        expectedRevenue: data.expectedRevenue ? Number(data.expectedRevenue) : 0,
        serviceInterest: data.serviceInterest,
        note: data.note,
        taxCode: data.taxCode || null,
        idCard: data.idCard || null,
        
        // Đảm bảo là Number hoặc null, không bao giờ gửi chuỗi "2"
        provinceId: data.provinceId ? Number(data.provinceId) : null,
        salesGroupId: data.salesGroupId ? Number(data.salesGroupId) : null,
        sourceId: data.sourceId ? Number(data.sourceId) : null,
      };

      // Debug xem JSON gửi đi đã đúng chưa
      console.log("JSON gửi lên Backend:", JSON.stringify(payload));

      if (currentLead?.id) {
        await leadApi.updateLead(currentLead.id, payload as any);
      } else {
        await leadApi.createLead(payload as any);
      }
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      alert('Lỗi 400: Kiểm tra định dạng dữ liệu!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentLead ? "Cập nhật Lead" : "Thêm mới Lead"} size="5xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        
        <div className="space-y-4 overflow-y-auto max-h-[58vh] pr-2 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Hàng 1: Họ tên, Điện thoại, Công ty */}
            <TextInput label="Họ và tên (*)" {...register('name')} error={errors.name?.message} />
            <TextInput label="Số điện thoại (*)" {...register('phone')} error={errors.phone?.message} />
            <TextInput label="Tên công ty (*)" {...register('company')} error={errors.company?.message} />

            {/* Hàng 2: Email, Trạng thái, Doanh số */}
            <TextInput label="Email (*)" type="email" {...register('email')} error={errors.email?.message} />
            
            <SelectBox 
              label="Trạng thái (*)" 
              options={[
                { label: 'Mới nhận', value: 'NEW' },
                { label: 'Đang liên hệ', value: 'CONTACTING' },
                { label: 'Đã chuyển đổi', value: 'CONVERTED' },
                { label: 'Ngừng chăm sóc', value: 'DROPPED' }
              ]} 
              {...register('status')} 
              error={errors.status?.message} 
            />

            <TextInput label="Doanh số dự kiến (*)" type="number" {...register('expectedRevenue')} error={errors.expectedRevenue?.message} />

            {/* Hàng 3: Tỉnh thành, Nguồn, Nhóm bán hàng */}
            <SelectBox 
              label="Tỉnh / Thành phố" 
              options={[
                { label: '-- Chọn Tỉnh/Thành --', value: '' },
                ...provinces.map(p => ({ label: p.name, value: String(p.id) }))
              ]} 
              {...register('provinceId')} 
              error={errors.provinceId?.message} 
            />
            
            <SelectBox 
              label="Nguồn khách" 
              options={[
                { label: '-- Chọn nguồn --', value: '' },
                ...sources.map(s => ({ label: s.name, value: String(s.id) }))
              ]} 
              {...register('sourceId')} 
              error={errors.sourceId?.message} 
            />

            <SelectBox 
              label="Nhóm bán hàng" 
              options={[
                { label: '-- Chọn nhóm --', value: '' },
                ...salesGroups.map(sg => ({ label: sg.name, value: String(sg.id) }))
              ]} 
              {...register('salesGroupId')} 
              error={errors.salesGroupId?.message} 
            />

            {/* Hàng 4: SP quan tâm & CCCD/MST toggle */}
            <div className="md:col-span-2">
              <TextInput label="Sản phẩm quan tâm (*)" {...register('serviceInterest')} error={errors.serviceInterest?.message} />
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className="w-full mt-7 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all"
              >
                {showSensitiveInfo ? "🙈 Ẩn CCCD / MST" : "👁️ Điền CCCD / MST"}
              </button>
            </div>

            {/* Vùng thông tin bảo mật */}
            {showSensitiveInfo && (
              <div className="md:col-span-3 grid grid-cols-2 gap-4 bg-amber-50/30 p-4 rounded-xl border border-amber-200/50">
                <TextInput label="Mã số thuế (*)" {...register('taxCode')} error={errors.taxCode?.message} />
                <TextInput label="Số CCCD (*)" {...register('idCard')} error={errors.idCard?.message} />
              </div>
            )}

            {/* Ghi chú */}
            <div className="md:col-span-3">
              <TextInput label="Ghi chú (*)" {...register('note')} error={errors.note?.message} />
            </div>

          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 shrink-0">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit">Lưu lại</Button>
        </div>
        
      </form>
    </Modal>
  );
};