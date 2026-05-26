interface CustomerFilters {
  search?: string;
  customerType?: string;
  customerLevel?: string; 
  customerStatus?: string;
}

const customerService = {
  async getCustomers(
    page = 1, 
    pageSize = 10,
    filters: CustomerFilters = {}
  ): Promise<unknown> {
    try {
      const url = new URL('http://localhost:8081/api/customers');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', pageSize.toString());

      if (filters.search) {
        url.searchParams.append('search', filters.search);
      }
      if (filters.customerType) {
        url.searchParams.append('customerType', filters.customerType);
      }
      if (filters.customerLevel) {
        url.searchParams.append('customerLevel', filters.customerLevel);
      }
      if (filters.customerStatus) {
        url.searchParams.append('customerStatus', filters.customerStatus);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async deleteCustomer(id: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8081/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};

export default customerService;