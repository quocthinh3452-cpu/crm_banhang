import axiosClient from '@/shared/api/axiosClient';

export interface LookupItem {
  id: number;
  name: string;
}

const LOOKUP_ROUTE = '/v1/lookup';

export const lookupApi = {
  /**
   * Lấy danh sách tỉnh/thành phố
   */
  getProvinces: async (): Promise<LookupItem[]> => {
    const response = await axiosClient.get(`${LOOKUP_ROUTE}/provinces`);
    return response as any;
  },

  /**
   * Lấy danh sách nguồn khách hàng
   */
  getSources: async (): Promise<LookupItem[]> => {
    const response = await axiosClient.get(`${LOOKUP_ROUTE}/sources`);
    return response as any;
  },

  /**
   * Lấy danh sách nhóm bán hàng
   */
  getSalesGroups: async (): Promise<LookupItem[]> => {
    const response = await axiosClient.get(`${LOOKUP_ROUTE}/sales-groups`);
    return response as any;
  },
};
