/* ============================================================
 * SHARED TYPES — Amit Furniture Admin
 * These mirror the database schema and API responses.
 * ============================================================ */

export type UserStatus = "active" | "inactive" | "suspended";
export type EnquiryStatus =
  | "new"
  | "contacted"
  | "followup"
  | "quoted"
  | "negotiation"
  | "approved"
  | "rejected"
  | "completed"
  | "archived";
export type Priority = "low" | "medium" | "high" | "urgent";
export type QuotationStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "negotiation"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";
export type ProjectStatus =
  | "planning"
  | "design"
  | "measurement"
  | "procurement"
  | "manufacturing"
  | "installation"
  | "completed"
  | "cancelled";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "partial" | "paid" | "failed" | "refunded";
export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "partial"
  | "overdue"
  | "cancelled";
export type CommunicationType =
  | "phone"
  | "email"
  | "whatsapp"
  | "sms"
  | "visit"
  | "note";
export type DocumentCategory =
  | "quotation"
  | "invoice"
  | "receipt"
  | "design"
  | "measurement"
  | "agreement"
  | "project_image"
  | "customer_attachment"
  | "other";
export type CalendarEventType =
  | "visit"
  | "measurement"
  | "followup"
  | "meeting"
  | "installation"
  | "deadline"
  | "payment_reminder"
  | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roleId: string;
  roleName: string;
  status: UserStatus;
  avatarUrl: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  alternatePhone?: string | null;
  preferredContact?: string | null;
  company?: string | null;
  source?: string | null;
  totalBusinessValue?: string;
  notes?: string | null;
  createdAt: string;
  address?: Address | null;
}

export interface Enquiry {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  service: string;
  category?: string | null;
  requirement: string;
  description?: string | null;
  dimensions?: string | null;
  material?: string | null;
  designPreference?: string | null;
  budget?: string | null;
  expectedCompletion?: string | null;
  additionalNotes?: string | null;
  status: EnquiryStatus;
  priority: Priority;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  followUpDate?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id?: string;
  name: string;
  description?: string | null;
  quantity: string;
  unit?: string;
  unitPrice: string;
  discount?: string;
  taxRate?: string;
  total: string;
}

export interface Quotation {
  id: string;
  number: string;
  enquiryId?: string | null;
  customerId: string;
  customerName: string;
  projectName?: string | null;
  subtotal: string;
  discount?: string;
  taxRate?: string;
  taxAmount?: string;
  total: string;
  validityDays?: number;
  validUntil?: string | null;
  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  notes?: string | null;
  termsAndConditions?: string | null;
  status: QuotationStatus;
  createdBy?: string | null;
  createdAt: string;
  sentAt?: string | null;
  acceptedAt?: string | null;
  items?: QuotationItem[];
}

export interface Project {
  id: string;
  number: string;
  name: string;
  customerId: string;
  customerName: string;
  quotationId?: string | null;
  enquiryId?: string | null;
  type?: string | null;
  location?: string | null;
  description?: string | null;
  requirements?: string | null;
  measurements?: string | null;
  designNotes?: string | null;
  value?: string;
  startDate?: string | null;
  expectedCompletion?: string | null;
  actualCompletion?: string | null;
  status: ProjectStatus;
  progress: number;
  assignedManagerId?: string | null;
  assignedManagerName?: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  enquiryId?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  completedAt?: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  projectId?: string | null;
  projectName?: string | null;
  invoiceId?: string | null;
  amount: string;
  method: string;
  referenceNumber?: string | null;
  paymentDate: string;
  status: PaymentStatus;
  notes?: string | null;
  receivedBy?: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  projectId?: string | null;
  projectName?: string | null;
  quotationId?: string | null;
  subtotal?: string;
  discount?: string;
  taxRate?: string;
  taxAmount?: string;
  total: string;
  amountPaid?: string;
  dueDate?: string | null;
  status: InvoiceStatus;
  notes?: string | null;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  type?: CalendarEventType;
  customerId?: string | null;
  customerName?: string | null;
  projectId?: string | null;
  enquiryId?: string | null;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  allDay?: boolean;
}

export interface Communication {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  enquiryId?: string | null;
  projectId?: string | null;
  staffId?: string | null;
  staffName?: string | null;
  type: CommunicationType;
  direction?: string;
  subject?: string | null;
  summary?: string | null;
  content?: string | null;
  occurredAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string | null;
  category: DocumentCategory;
  customerId?: string | null;
  projectId?: string | null;
  enquiryId?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  description?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message?: string | null;
  type?: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  newEnquiries: number;
  pendingQuotes: number;
  activeProjects: number;
  todaysTasks: number;
  newCustomers: number;
  outstanding: number;
}

/* ============================================================
 * API Response envelope
 * ============================================================ */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
