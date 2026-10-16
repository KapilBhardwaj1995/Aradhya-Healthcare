import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"), // 'admin' | 'employee' | 'customer'
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull(),
  description: text("description").notNull(),
  packSize: text("pack_size").notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  finalPrice: numeric("final_price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  unitsSold: integer("units_sold").notNull().default(0),
  minStock: integer("min_stock").notNull().default(10),
  availabilityStatus: text("availability_status").notNull().default("available"), // 'available' | 'low_stock' | 'out_of_stock' | 'inactive'
  images: text("images").notNull(), // JSON array of string URLs
  specifications: text("specifications"), // JSON object of specs
  features: text("features"), // JSON array of bullet features
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderRequests = pgTable("order_requests", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").notNull().unique(), // e.g. AS-2026-000125
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerAddress: text("customer_address").notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  productPackSize: text("product_pack_size").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  totalEstimate: numeric("total_estimate", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: text("status").notNull().default("New Request"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productionLogs = pgTable("production_logs", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => users.id),
  employeeName: text("employee_name").notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  productionDate: text("production_date").notNull(), // YYYY-MM-DD
  quantityProduced: integer("quantity_produced").notNull(),
  remarks: text("remarks"),
  isApproved: boolean("is_approved").default(false).notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  inventoryUpdated: boolean("inventory_updated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customerInquiries = pgTable("customer_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("New"), // 'New' | 'In Progress' | 'Resolved'
  adminReply: text("admin_reply"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: text("details"),
  performedBy: text("performed_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orderRequests: many(orderRequests),
  productionLogs: many(productionLogs),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderRequests: many(orderRequests),
  productionLogs: many(productionLogs),
}));
