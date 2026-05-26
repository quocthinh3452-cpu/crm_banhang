/**
 * Domain Types - Customer, Contact & Interaction Logs
 */

/* =========================
   CUSTOMER
========================= */

export type CustomerType =
  | 'B2B'
  | 'B2C';

export type CustomerTier =
  | 'Bạc'
  | 'Vàng'
  | 'Kim Cương';

export type CustomerStatus =
  | 'Đang chăm sóc'
  | 'Ngừng'
  | 'Blacklist';

export interface Customer {
  id: string | number;

  customerCode?: string;

  name: string;

  email: string;

  phone?: string;

  type: CustomerType;

  tier: CustomerTier;

  status: CustomerStatus;

  budget?: number;

  address?: string;

  notes?: string;

  createdAt?: string;

  /**
   * Task 2.2
   * Danh sách contacts
   */
  contacts?: Contact[];

  /**
   * Task 2.3
   * Interaction logs
   */
  interactionLogs?: InteractionLog[];
}

export interface CreateCustomerInput {
  name: string;

  email: string;

  phone?: string;

  type: CustomerType;

  tier: CustomerTier;

  status: CustomerStatus;

  budget?: number;

  address?: string;

  notes?: string;
}

export interface UpdateCustomerInput
  extends Partial<CreateCustomerInput> {
  id: string | number;
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CustomerListParams {
  page?: number;

  pageSize?: number;

  search?: string;

  type?: CustomerType;

  tier?: CustomerTier;

  status?: CustomerStatus;

  sortBy?:
    | 'name'
    | 'type'
    | 'tier';

  sortOrder?:
    | 'asc'
    | 'desc';
}

export interface PaginationInfo {
  page: number;

  pageSize: number;

  total: number;

  totalPages: number;
}

/* =========================
   CONTACTS - TASK 2.2
========================= */

export type ContactRole =
  | 'Giám đốc'
  | 'Kế toán'
  | 'Nhân viên mua hàng'
  | 'Nhân viên kỹ thuật'
  | 'Khác';

export interface Contact {
  id: string | number;

  /**
   * FK -> Customer
   */
  customerId: string | number;

  fullName: string;

  email?: string;

  phone?: string;

  role: ContactRole;

  department?: string;

  note?: string;

  isPrimary?: boolean;

  createdAt?: string;
}

export interface CreateContactInput {
  customerId: string | number;

  fullName: string;

  email?: string;

  phone?: string;

  role: ContactRole;

  department?: string;

  note?: string;

  isPrimary?: boolean;
}

export interface UpdateContactInput
  extends Partial<CreateContactInput> {
  id: string | number;
}

/* =========================
   INTERACTION LOGS - TASK 2.3
========================= */

export type InteractionType =
  | 'Call'
  | 'Email'
  | 'Meeting';

export type InteractionStatus =
  | 'Đã xử lý'
  | 'Chờ phản hồi'
  | 'Thất bại';

export interface InteractionLog {
  id: string | number;

  /**
   * FK -> Customer
   */
  customerId: string | number;

  /**
   * FK -> Contact (optional)
   */
  contactId?: string | number;

  type: InteractionType;

  subject: string;

  content?: string;

  interactionDate: string;

  status: InteractionStatus;

  createdBy?: string;

  createdAt?: string;
}

export interface CreateInteractionInput {
  customerId: string | number;

  contactId?: string | number;

  type: InteractionType;

  subject: string;

  content?: string;

  interactionDate: string;

  status: InteractionStatus;

  createdBy?: string;
}

export interface UpdateInteractionInput
  extends Partial<CreateInteractionInput> {
  id: string | number;
}
/* =========================
   ATTACHMENTS - TASK 2.4
========================= */

export type AttachmentType =
  | 'PDF'
  | 'DOCX'
  | 'XLSX'
  | 'IMAGE'
  | 'OTHER';

export interface Attachment {
  id: string | number;

  /**
   * FK -> Customer
   */
  customerId: string | number;

  fileName: string;

  fileUrl: string;

  fileType: AttachmentType;

  fileSize?: number;

  uploadedBy?: string;

  createdAt?: string;
}

export interface CreateAttachmentInput {
  customerId: string | number;

  fileName: string;

  fileUrl: string;

  fileType: AttachmentType;

  fileSize?: number;

  uploadedBy?: string;
}

export interface UpdateAttachmentInput
  extends Partial<CreateAttachmentInput> {
  id: string | number;
}

/* =========================
   DASHBOARD - TASK 2.5
========================= */

export interface TransactionSummary {
  totalContacts: number;

  totalInteractions: number;

  totalComplaints: number;

  totalAttachments: number;

  totalRevenue?: number;

  lastInteractionDate?: string;
}

/* =========================
   COMPLAINTS - TASK 2.6
========================= */

export type ComplaintStatus =
  | 'Pending'
  | 'Processing'
  | 'Resolved'
  | 'Rejected';

export type ComplaintPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export interface Complaint {
  id: string | number;

  /**
   * FK -> Customer
   */
  customerId: string | number;

  title: string;

  description?: string;

  status: ComplaintStatus;

  priority: ComplaintPriority;

  createdBy?: string;

  resolvedBy?: string;

  resolvedAt?: string;

  createdAt?: string;
}

export interface CreateComplaintInput {
  customerId: string | number;

  title: string;

  description?: string;

  status: ComplaintStatus;

  priority: ComplaintPriority;

  createdBy?: string;
}

export interface UpdateComplaintInput
  extends Partial<CreateComplaintInput> {
  id: string | number;
}

/* =========================
   CUSTOMER STATUS HISTORY
   TASK 2.7
========================= */

export interface CustomerStatusHistory {
  id: string | number;

  customerId: string | number;

  oldStatus: CustomerStatus;

  newStatus: CustomerStatus;

  changedBy?: string;

  reason?: string;

  changedAt?: string;
}