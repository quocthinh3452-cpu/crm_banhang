/**
 * Customer Repository
 * Task 2.1 + Task 2.2 + Task 2.3
 */

import {
  Attachment,
  Complaint,
  Customer,
  Contact,
  InteractionLog,
  TransactionSummary,
  CustomerStatusHistory,
  CreateAttachmentInput,
  UpdateAttachmentInput,
  CreateComplaintInput,
  UpdateComplaintInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  CreateContactInput,
  UpdateContactInput,
  CreateInteractionInput,
  UpdateInteractionInput,
  CustomerListResponse,
  CustomerListParams,
} from '../domain/types';

import {
  customerApi,
  complaintApi,
  dashboardApi,
} from './customerApi';

/* =========================================
   MOCK CONTACTS - TASK 2.2
========================================= */

let mockContacts: Contact[] = [
  {
    id: 1,

    customerId: 1,

    fullName: 'Nguyễn Văn A',

    email: 'nguyenvana@abc.com',

    phone: '0901111111',

    role: 'Giám đốc',

    department: 'Kinh doanh',

    note: 'Người liên hệ chính',

    isPrimary: true,

    createdAt: '2024-01-15',
  },

  {
    id: 2,

    customerId: 1,

    fullName: 'Trần Thị B',

    email: 'tranthib@abc.com',

    phone: '0902222222',

    role: 'Kế toán',

    department: 'Tài chính',

    createdAt: '2024-01-16',
  },

  {
    id: 3,

    customerId: 2,

    fullName: 'Lê Minh C',

    email: 'leminhc@gmail.com',

    phone: '0903333333',

    role: 'Khác',

    createdAt: '2024-02-01',
  },
];

/* =========================================
   MOCK INTERACTION LOGS - TASK 2.3
========================================= */

let mockInteractions: InteractionLog[] = [
  {
    id: 1,

    customerId: 1,

    contactId: 1,

    type: 'Call',

    subject:
      'Tư vấn gói CRM doanh nghiệp',

    content:
      'Khách hàng quan tâm gói Premium.',

    interactionDate:
      '2024-04-01 09:00',

    status: 'Đã xử lý',

    createdBy: 'Admin',

    createdAt: '2024-04-01',
  },

  {
    id: 2,

    customerId: 1,

    contactId: 2,

    type: 'Meeting',

    subject:
      'Họp demo sản phẩm',

    content:
      'Demo tính năng CRM cho phòng kinh doanh.',

    interactionDate:
      '2024-04-05 14:00',

    status: 'Chờ phản hồi',

    createdBy: 'Admin',

    createdAt: '2024-04-05',
  },

  {
    id: 3,

    customerId: 2,

    type: 'Email',

    subject:
      'Gửi báo giá',

    content:
      'Đã gửi báo giá qua email.',

    interactionDate:
      '2024-04-08 10:30',

    status: 'Đã xử lý',

    createdBy: 'Admin',

    createdAt: '2024-04-08',
  },
];

/* =========================================
   MOCK ATTACHMENTS - TASK 2.4
========================================= */

let mockAttachments: Attachment[] = [
  {
    id: 1,

    customerId: 1,

    fileName: 'Proposal.pdf',

    fileUrl:
      'https://example.com/files/proposal.pdf',

    fileType: 'PDF',

    fileSize: 145000,

    uploadedBy: 'Admin',

    createdAt: '2024-04-01',
  },

  {
    id: 2,

    customerId: 1,

    fileName: 'Contract.docx',

    fileUrl:
      'https://example.com/files/contract.docx',

    fileType: 'DOCX',

    fileSize: 76000,

    uploadedBy: 'Admin',

    createdAt: '2024-04-03',
  },

  {
    id: 3,

    customerId: 2,

    fileName: 'Invoice.xlsx',

    fileUrl:
      'https://example.com/files/invoice.xlsx',

    fileType: 'XLSX',

    fileSize: 52000,

    uploadedBy: 'Admin',

    createdAt: '2024-04-10',
  },
];

/* =========================================
   MOCK COMPLAINTS - TASK 2.6
========================================= */

let mockComplaints: Complaint[] = [
  {
    id: 1,

    customerId: 1,

    title: 'Yêu cầu cập nhật hợp đồng',

    description:
      'Khách hàng muốn điều chỉnh phạm vi dịch vụ.',

    status: 'Processing',

    priority: 'High',

    createdBy: 'Admin',

    createdAt: '2024-04-02',
  },

  {
    id: 2,

    customerId: 2,

    title: 'Không nhận được hóa đơn',

    status: 'Pending',

    priority: 'Medium',

    createdBy: 'Admin',

    createdAt: '2024-04-11',
  },
];

/* =========================================
   MOCK STATUS HISTORY - TASK 2.7
========================================= */

const mockStatusHistory: CustomerStatusHistory[] = [
  {
    id: 1,

    customerId: 1,

    oldStatus: 'Đang chăm sóc',

    newStatus: 'Đang chăm sóc',

    changedBy: 'Admin',

    reason: 'Khởi tạo khách hàng',

    changedAt: '2024-01-15',
  },

  {
    id: 2,

    customerId: 2,

    oldStatus: 'Đang chăm sóc',

    newStatus: 'Đang chăm sóc',

    changedBy: 'Admin',

    reason: 'Khởi tạo khách hàng',

    changedAt: '2024-02-20',
  },
];

/* =========================================
   MOCK CUSTOMERS
========================================= */

type CustomerExtended =
  Customer & {
    attachments?: Attachment[];
    complaints?: Complaint[];
    statusHistory?: CustomerStatusHistory[];
    transactionSummary?: TransactionSummary;
  };

const mockCustomers: CustomerExtended[] = [
  {
    id: 1,

    name: 'Công ty ABC',

    email: 'abc@gmail.com',

    phone: '0912345678',

    type: 'B2B',

    tier: 'Vàng',

    status: 'Đang chăm sóc',

    budget: 50000000,

    createdAt: '2024-01-15',

    notes: 'Khách hàng doanh nghiệp',

    contacts: mockContacts.filter(
      (c) => c.customerId === 1
    ),

    interactionLogs:
      mockInteractions.filter(
        (i) =>
          i.customerId === 1
      ),

    attachments:
      mockAttachments.filter(
        (a) => a.customerId === 1
      ),

    complaints:
      mockComplaints.filter(
        (c) => c.customerId === 1
      ),

    statusHistory:
      mockStatusHistory.filter(
        (sh) => sh.customerId === 1
      ),

    transactionSummary: {
      totalContacts: mockContacts.filter(
        (c) => c.customerId === 1
      ).length,
      totalInteractions:
        mockInteractions.filter(
          (i) => i.customerId === 1
        ).length,
      totalComplaints:
        mockComplaints.filter(
          (c) => c.customerId === 1
        ).length,
      totalAttachments:
        mockAttachments.filter(
          (a) => a.customerId === 1
        ).length,
      totalRevenue: 50000000,
      lastInteractionDate:
        mockInteractions
          .filter((i) => i.customerId === 1)
          .sort(
            (a, b) =>
              Number(
                new Date(
                  b.interactionDate
                )
              ) -
              Number(
                new Date(
                  a.interactionDate
                )
              )
          )[0]?.interactionDate,
    },
  },

  {
    id: 2,

    name: 'Nguyễn Văn A',

    email: 'nguyenvana@gmail.com',

    phone: '0988888888',

    type: 'B2C',

    tier: 'Bạc',

    status: 'Đang chăm sóc',

    budget: 12000000,

    createdAt: '2024-02-20',

    contacts: mockContacts.filter(
      (c) => c.customerId === 2
    ),

    interactionLogs:
      mockInteractions.filter(
        (i) =>
          i.customerId === 2
      ),

    attachments:
      mockAttachments.filter(
        (a) => a.customerId === 2
      ),

    complaints:
      mockComplaints.filter(
        (c) => c.customerId === 2
      ),

    statusHistory:
      mockStatusHistory.filter(
        (sh) => sh.customerId === 2
      ),

    transactionSummary: {
      totalContacts: mockContacts.filter(
        (c) => c.customerId === 2
      ).length,
      totalInteractions:
        mockInteractions.filter(
          (i) => i.customerId === 2
        ).length,
      totalComplaints:
        mockComplaints.filter(
          (c) => c.customerId === 2
        ).length,
      totalAttachments:
        mockAttachments.filter(
          (a) => a.customerId === 2
        ).length,
      totalRevenue: 12000000,
      lastInteractionDate:
        mockInteractions
          .filter((i) => i.customerId === 2)
          .sort(
            (a, b) =>
              Number(
                new Date(
                  b.interactionDate
                )
              ) -
              Number(
                new Date(
                  a.interactionDate
                )
              )
          )[0]?.interactionDate,
    },
  },

  {
    id: 3,

    name: 'Trần Thị B',

    email: 'tranthib@gmail.com',

    phone: '0909999999',

    type: 'B2C',

    tier: 'Kim Cương',

    status: 'Blacklist',

    budget: 100000000,

    createdAt: '2024-03-10',

    contacts: [],

    interactionLogs: [],

    attachments:
      mockAttachments.filter(
        (a) => a.customerId === 3
      ),

    complaints:
      mockComplaints.filter(
        (c) => c.customerId === 3
      ),

    statusHistory:
      mockStatusHistory.filter(
        (sh) => sh.customerId === 3
      ),

    transactionSummary: {
      totalContacts: mockContacts.filter(
        (c) => c.customerId === 3
      ).length,
      totalInteractions:
        mockInteractions.filter(
          (i) => i.customerId === 3
        ).length,
      totalComplaints:
        mockComplaints.filter(
          (c) => c.customerId === 3
        ).length,
      totalAttachments:
        mockAttachments.filter(
          (a) => a.customerId === 3
        ).length,
      totalRevenue: 100000000,
      lastInteractionDate: undefined,
    },
  },
];

class CustomerRepository {
  /* =========================================
     CUSTOMERS
  ========================================= */

  async getCustomers(
    params?: CustomerListParams
  ): Promise<CustomerListResponse> {
    return customerApi.getCustomers(params);
  }

  async getCustomerById(
    id: string | number
  ): Promise<Customer> {
    return customerApi.getCustomerById(id);
  }

  async createCustomer(
    data: CreateCustomerInput
  ): Promise<Customer> {
    return customerApi.createCustomer(data);
  }

  async updateCustomer(
    id: string | number,
    data: UpdateCustomerInput
  ): Promise<Customer> {
    return customerApi.updateCustomer(id, data);
  }

  async deleteCustomer(
    id: string | number
  ): Promise<void> {
    await customerApi.deleteCustomer(id);
  }

  async bulkDeleteCustomers(
    ids: (string | number)[]
  ): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        customerApi.deleteCustomer(id)
      )
    );
  }

  /* =========================================
     CONTACTS - TASK 2.2
  ========================================= */

  /* =========================================
   CONTACTS API REAL DATABASE
========================================= */

async getContactsByCustomerId(
  customerId: string | number
): Promise<Contact[]> {
  return customerApi.getContactsByCustomerId(
    customerId
  );
}

async createContact(
  data: CreateContactInput
): Promise<Contact> {
  return customerApi.createContact(
    data
  );
}

async updateContact(
  id: string | number,
  data: UpdateContactInput
): Promise<Contact> {
  return customerApi.updateContact(
    id,
    data
  );
}

async deleteContact(
  id: string | number
): Promise<void> {
  return customerApi.deleteContact(
    id
  );
}

  /* =========================================
     INTERACTION LOGS - TASK 2.3
  ========================================= */

  async getInteractionsByCustomer(
  customerId:
    | string
    | number
): Promise<InteractionLog[]> {
  return customerApi.getInteractionsByCustomerId(
    customerId
  );
}

async createInteraction(
  data: CreateInteractionInput
): Promise<InteractionLog> {
  return customerApi.createInteraction(
    data
  );
}

async updateInteraction(
  id: string | number,
  data: UpdateInteractionInput
): Promise<InteractionLog> {
  return customerApi.updateInteraction(
    id,
    data
  );
}

async deleteInteraction(
  id: string | number
): Promise<void> {
  return customerApi.deleteInteraction(
    id
  );
}
async getDocumentsByCustomerId(
  customerId: string | number
) {
  return customerApi.getDocumentsByCustomerId(
    customerId
  );
}
  /* =========================================
     TASK 2.4
     ATTACHMENTS
  ========================================= */

  async getAttachmentsByCustomer(
    customerId:
      | string
      | number
  ): Promise<Attachment[]> {
    return mockAttachments.filter(
      (attachment) =>
        attachment.customerId ===
        Number(customerId)
    );
  }

  async createAttachment(
    data: CreateAttachmentInput
  ): Promise<Attachment> {
    const newAttachment: Attachment = {
      id:
        mockAttachments.length + 1,

      ...data,

      createdAt:
        new Date().toISOString(),
    };

    mockAttachments.push(
      newAttachment
    );

    return newAttachment;
  }

  async updateAttachment(
    id: string | number,
    data: UpdateAttachmentInput
  ): Promise<Attachment> {
    const index =
      mockAttachments.findIndex(
        (attachment) =>
          attachment.id === Number(id)
      );

    if (index === -1) {
      throw new Error(
        'Không tìm thấy attachment'
      );
    }

    mockAttachments[index] = {
      ...mockAttachments[index],
      ...data,
    };

    return mockAttachments[index];
  }

  async deleteAttachment(
    id: string | number
  ): Promise<void> {
    mockAttachments =
      mockAttachments.filter(
        (attachment) =>
          attachment.id !==
          Number(id)
      );
  }

  /* =========================================
     TASK 2.6
     COMPLAINTS
  ========================================= */

  async getComplaintsByCustomer(
  customerId:
    | string
    | number
): Promise<Complaint[]> {
  return complaintApi.getByCustomerId(
    Number(customerId)
  );
}

async createComplaint(
  data: CreateComplaintInput
): Promise<Complaint> {
  return complaintApi.create(data);
}

async updateComplaint(
  id: string | number,
  data: UpdateComplaintInput
): Promise<Complaint> {
  return complaintApi.update(
    Number(id),
    data
  );
}

async deleteComplaint(
  id: string | number
): Promise<void> {
  return complaintApi.delete(
    Number(id)
  );
}
  /* =========================================
     TASK 2.7
     STATUS HISTORY
  ========================================= */

  async getStatusHistoryByCustomer(
    customerId:
      | string
      | number
  ): Promise<CustomerStatusHistory[]> {
    return mockStatusHistory.filter(
      (history) =>
        history.customerId ===
        Number(customerId)
    );
  }

  /* =========================================
     TASK 2.5
     DASHBOARD
  ========================================= */
async getCustomerDashboardSummary(
  customerId:
    | string
    | number
): Promise<TransactionSummary> {

  const data =
    await dashboardApi.getByCustomerId(
      Number(customerId)
    );

  return {
    totalContacts:
      data.totalContacts ?? 0,

    totalInteractions:
      data.totalInteractions ?? 0,

    totalComplaints:
      data.totalComplaints ?? 0,

    totalAttachments:
      data.totalDocuments ?? 0,

    totalRevenue: 0,

    lastInteractionDate:
      undefined,
  };
}
}

export const customerRepository =
  new CustomerRepository();