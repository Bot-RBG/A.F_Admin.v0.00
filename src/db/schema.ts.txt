import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  date,
  pgEnum,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

/* ============================================================
 * ENUMS
 * ============================================================ */

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "followup",
  "quoted",
  "negotiation",
  "approved",
  "rejected",
  "completed",
  "archived",
]);

export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const quotationStatusEnum = pgEnum("quotation_status", [
  "draft",
  "sent",
  "viewed",
  "negotiation",
  "accepted",
  "rejected",
  "expired",
  "cancelled",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "design",
  "measurement",
  "procurement",
  "manufacturing",
  "installation",
  "completed",
  "cancelled",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "partial",
  "paid",
  "failed",
  "refunded",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "partial",
  "overdue",
  "cancelled",
]);

export const communicationTypeEnum = pgEnum("communication_type", [
  "phone",
  "email",
  "whatsapp",
  "sms",
  "visit",
  "note",
]);

export const documentCategoryEnum = pgEnum("document_category", [
  "quotation",
  "invoice",
  "receipt",
  "design",
  "measurement",
  "agreement",
  "project_image",
  "customer_attachment",
  "other",
]);

export const calendarEventTypeEnum = pgEnum("calendar_event_type", [
  "visit",
  "measurement",
  "followup",
  "meeting",
  "installation",
  "deadline",
  "payment_reminder",
  "other",
]);

/* ============================================================
 * USERS & ROLES
 * ============================================================ */

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    status: userStatusEnum("status").notNull().default("active"),
    twoFactorEnabled: boolean("two_factor_enabled").default(false),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_role_idx").on(t.roleId),
  ]
);

/* ============================================================
 * CUSTOMERS
 * ============================================================ */

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone").notNull(),
    alternatePhone: text("alternate_phone"),
    preferredContact: text("preferred_contact"), // phone / email / whatsapp
    company: text("company"),
    notes: text("notes"),
    source: text("source"), // website / referral / walk-in
    totalBusinessValue: numeric("total_business_value", {
      precision: 12,
      scale: 2,
    }).default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("customers_name_idx").on(t.name),
    index("customers_phone_idx").on(t.phone),
    index("customers_email_idx").on(t.email),
  ]
);

export const customerAddresses = pgTable("customer_addresses", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("home"), // home / office / site
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  district: text("district"),
  state: text("state"),
  pincode: text("pincode"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * ENQUIRIES
 * ============================================================ */

export const enquiries = pgTable(
  "enquiries",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(), // AF-E-2026-0001
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    service: text("service").notNull(),
    category: text("category"), // furniture / repair / construction
    requirement: text("requirement").notNull(),
    description: text("description"),
    dimensions: text("dimensions"),
    material: text("material"),
    designPreference: text("design_preference"),
    budget: numeric("budget", { precision: 12, scale: 2 }),
    expectedCompletion: date("expected_completion"),
    additionalNotes: text("additional_notes"),
    status: enquiryStatusEnum("status").notNull().default("new"),
    priority: priorityEnum("priority").notNull().default("medium"),
    assignedUserId: text("assigned_user_id").references(() => users.id),
    followUpDate: date("follow_up_date"),
    source: text("source").default("website"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("enquiries_number_idx").on(t.number),
    index("enquiries_customer_idx").on(t.customerId),
    index("enquiries_status_idx").on(t.status),
    index("enquiries_assigned_idx").on(t.assignedUserId),
    index("enquiries_created_idx").on(t.createdAt),
  ]
);

export const enquiryAttachments = pgTable("enquiry_attachments", {
  id: text("id").primaryKey(),
  enquiryId: text("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedBy: text("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const enquiryNotes = pgTable("enquiry_notes", {
  id: text("id").primaryKey(),
  enquiryId: text("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * QUOTATIONS
 * ============================================================ */

export const quotations = pgTable(
  "quotations",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(), // AF-Q-2026-0001
    enquiryId: text("enquiry_id").references(() => enquiries.id),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    projectName: text("project_name"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    validityDays: integer("validity_days").default(15),
    validUntil: date("valid_until"),
    paymentTerms: text("payment_terms"),
    deliveryTerms: text("delivery_terms"),
    notes: text("notes"),
    termsAndConditions: text("terms_and_conditions"),
    status: quotationStatusEnum("status").notNull().default("draft"),
    createdBy: text("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("quotations_number_idx").on(t.number),
    index("quotations_customer_idx").on(t.customerId),
    index("quotations_enquiry_idx").on(t.enquiryId),
    index("quotations_status_idx").on(t.status),
  ]
);

export const quotationItems = pgTable("quotation_items", {
  id: text("id").primaryKey(),
  quotationId: text("quotation_id")
    .notNull()
    .references(() => quotations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  quantity: numeric("quantity", { precision: 10, scale: 2 })
    .notNull()
    .default("1"),
  unit: text("unit").default("piece"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0),
});

/* ============================================================
 * PROJECTS
 * ============================================================ */

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(), // AF-P-2026-0001
    name: text("name").notNull(),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    quotationId: text("quotation_id").references(() => quotations.id),
    enquiryId: text("enquiry_id").references(() => enquiries.id),
    type: text("type"), // custom_furniture / repair / construction etc
    location: text("location"),
    description: text("description"),
    requirements: text("requirements"),
    measurements: text("measurements"),
    designNotes: text("design_notes"),
    value: numeric("value", { precision: 12, scale: 2 }).default("0"),
    startDate: date("start_date"),
    expectedCompletion: date("expected_completion"),
    actualCompletion: date("actual_completion"),
    status: projectStatusEnum("status").notNull().default("planning"),
    progress: integer("progress").default(0), // 0-100
    assignedManagerId: text("assigned_manager_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("projects_number_idx").on(t.number),
    index("projects_customer_idx").on(t.customerId),
    index("projects_status_idx").on(t.status),
  ]
);

export const projectTasks = pgTable("project_tasks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  customerId: text("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  description: text("description"),
  assignedUserId: text("assigned_user_id").references(() => users.id),
  dueDate: date("due_date"),
  priority: priorityEnum("priority").notNull().default("medium"),
  status: taskStatusEnum("status").notNull().default("pending"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").default("member"), // manager / member / worker
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectMaterials = pgTable("project_materials", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("0"),
  unit: text("unit").default("piece"),
  unitCost: numeric("unit_cost", { precision: 12, scale: 2 }).default("0"),
  totalCost: numeric("total_cost", { precision: 12, scale: 2 }).default("0"),
  supplier: text("supplier"),
  status: text("status").default("pending"), // pending / ordered / received
});

/* ============================================================
 * PAYMENTS & INVOICES
 * ============================================================ */

export const invoices = pgTable(
  "invoices",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(), // AF-INV-2026-0001
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    projectId: text("project_id").references(() => projects.id),
    quotationId: text("quotation_id").references(() => quotations.id),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default("0"),
    dueDate: date("due_date"),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    notes: text("notes"),
    createdBy: text("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("invoices_number_idx").on(t.number),
    index("invoices_customer_idx").on(t.customerId),
    index("invoices_project_idx").on(t.projectId),
    index("invoices_status_idx").on(t.status),
  ]
);

export const invoiceItems = pgTable("invoice_items", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
});

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(), // AF-PAY-2026-0001
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    projectId: text("project_id").references(() => projects.id),
    invoiceId: text("invoice_id").references(() => invoices.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    method: text("method").default("cash"), // cash / upi / bank / card / cheque
    referenceNumber: text("reference_number"),
    paymentDate: date("payment_date").notNull(),
    status: paymentStatusEnum("status").notNull().default("paid"),
    notes: text("notes"),
    receivedBy: text("received_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("payments_number_idx").on(t.number),
    index("payments_customer_idx").on(t.customerId),
    index("payments_project_idx").on(t.projectId),
    index("payments_invoice_idx").on(t.invoiceId),
  ]
);

/* ============================================================
 * DOCUMENTS
 * ============================================================ */

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  category: documentCategoryEnum("category").default("other"),
  customerId: text("customer_id").references(() => customers.id),
  projectId: text("project_id").references(() => projects.id),
  enquiryId: text("enquiry_id").references(() => enquiries.id),
  uploadedBy: text("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* ============================================================
 * COMMUNICATIONS
 * ============================================================ */

export const communications = pgTable("communications", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id),
  enquiryId: text("enquiry_id").references(() => enquiries.id),
  projectId: text("project_id").references(() => projects.id),
  staffId: text("staff_id").references(() => users.id),
  type: communicationTypeEnum("type").notNull(),
  direction: text("direction").default("outbound"), // inbound / outbound
  subject: text("subject"),
  summary: text("summary"),
  content: text("content"),
  occurredAt: timestamp("occurred_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * CALENDAR EVENTS
 * ============================================================ */

export const calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: calendarEventTypeEnum("type").default("other"),
  customerId: text("customer_id").references(() => customers.id),
  projectId: text("project_id").references(() => projects.id),
  enquiryId: text("enquiry_id").references(() => enquiries.id),
  assignedUserId: text("assigned_user_id").references(() => users.id),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  location: text("location"),
  allDay: boolean("all_day").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * SERVICES (CMS)
 * ============================================================ */

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // furniture / repair / construction
  shortDescription: text("short_description"),
  description: text("description"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  status: text("status").default("published"), // published / draft / archived
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * GALLERY
 * ============================================================ */

export const galleryItems = pgTable("gallery_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("furniture"), // furniture / before_after / workshop / installation
  imageUrl: text("image_url").notNull(),
  projectId: text("project_id").references(() => projects.id),
  location: text("location"),
  takenAt: date("taken_at"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * TESTIMONIALS, FAQS, ANNOUNCEMENTS
 * ============================================================ */

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerId: text("customer_id").references(() => customers.id),
  rating: integer("rating").default(5),
  content: text("content").notNull(),
  projectType: text("project_type"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").default("general"),
  displayOrder: integer("display_order").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("info"), // info / offer / warning
  active: boolean("active").default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ============================================================
 * NOTIFICATIONS & ACTIVITY LOG
 * ============================================================ */

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message"),
  type: text("type").default("info"), // info / success / warning / error
  link: text("link"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    action: text("action").notNull(),
    resourceType: text("resource_type"), // customer / enquiry / quotation etc
    resourceId: text("resource_id"),
    description: text("description"),
    metadata: jsonb("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("activity_logs_user_idx").on(t.userId),
    index("activity_logs_resource_idx").on(t.resourceType, t.resourceId),
    index("activity_logs_created_idx").on(t.createdAt),
  ]
);

/* ============================================================
 * SETTINGS
 * ============================================================ */

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
