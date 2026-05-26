import axiosClient from '@/shared/api/axiosClient';

const BASE_ROUTE = '/v1/leads';

// 1. THÊM: Định nghĩa interface cho cấu trúc phân trang trả về từ Spring Boot
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

export interface Lead {
  id?: number;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  expectedRevenue?: number;
  taxCode?: string;
  idCard?: string;
  provinceId?: number;
  sourceId?: number;
  salesGroupId?: number;
  assignedTo?: number;
  serviceInterest?: string;
  
  // Giá trị status khớp với Java enum LeadStatus: NEW, CONTACTING, CONVERTED, DROPPED
  status: 'NEW' | 'CONTACTING' | 'CONVERTED' | 'DROPPED' ;
  
  note?: string;
  createdAt?: string;
  updatedAt?: string;

}
export interface LeadLog {
  id?: number;
  leadId: number;
  action: string;
  note: string;
  createdAt?: string;
  createdBy?: number;
}
export const leadApi = {
  // 2. SỬA: Đổi kiểu trả về từ Promise<Lead[]> thành Promise<PageResponse<Lead>>
  getAllLeads: async (params: { keyword?: string; status?: string; page?: number }): Promise<any> => {
    const response = await axiosClient.get(BASE_ROUTE, { params });
    return response; 
  },
  
  getLeadById: (id: number): Promise<Lead> => {
    return axiosClient.get(`${BASE_ROUTE}/${id}`);
  },
  
  // 1. Sửa lại: Không dùng /api và không .data
  getLeadLogs: (leadId: number): Promise<LeadLog[]> => {
    return axiosClient.get(`${BASE_ROUTE}/${leadId}/logs`);
  },
  
  // 2. Sửa lại: Không dùng /api và không .data
  createLeadLog: (leadId: number, log: Partial<LeadLog>): Promise<LeadLog> => {
    return axiosClient.post(`${BASE_ROUTE}/${leadId}/logs`, log);
  },
  updateLeadLog: (leadId: number, logId: number, log: Partial<LeadLog>): Promise<LeadLog> => {
    return axiosClient.put(`${BASE_ROUTE}/${leadId}/logs/${logId}`, log);
  },
  // Xóa log
  deleteLeadLog: (leadId: number, logId: number): Promise<void> => {
    return axiosClient.delete(`${BASE_ROUTE}/${leadId}/logs/${logId}`);
  },
  createLead: (data: Lead): Promise<Lead> => {
    return axiosClient.post(BASE_ROUTE, data);
  },
  
  updateLead: (id: number, data: Lead): Promise<Lead> => {
    return axiosClient.put(`${BASE_ROUTE}/${id}`, data);
  },
  
  deleteLead: (id: number): Promise<void> => {
    return axiosClient.delete(`${BASE_ROUTE}/${id}`);
  }
};