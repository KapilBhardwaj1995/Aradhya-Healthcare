import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  products,
  users,
  orderRequests,
  productionLogs,
  customerInquiries,
  auditLogs,
} from "@/db/schema";
import { eq, desc, sql, and, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Total products & active
    const allProducts = await db.select().from(products);
    const totalProducts = allProducts.length;
    const activeProducts = allProducts.filter((p) => p.isActive).length;
    const lowStockProducts = allProducts.filter(
      (p) => p.availabilityStatus === "low_stock" || p.stock <= p.minStock
    ).length;
    const totalInventoryUnits = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

    // Customers
    const customerList = await db.select().from(users).where(eq(users.role, "customer"));
    const totalCustomers = customerList.length;

    // Order requests
    const allOrders = await db.select().from(orderRequests).orderBy(desc(orderRequests.createdAt));
    const newOrderRequests = allOrders.filter((o) => o.status === "New Request").length;
    const pendingRequests = allOrders.filter(
      (o) => o.status === "New Request" || o.status === "Under Review" || o.status === "Customer Contacted"
    ).length;

    // Production today
    const todaysProductionLogs = await db
      .select()
      .from(productionLogs)
      .where(eq(productionLogs.productionDate, todayStr));
    const todaysProduction = todaysProductionLogs.reduce(
      (sum, log) => sum + (log.quantityProduced || 0),
      0
    );

    // Customer Inquiries
    const allInquiries = await db.select().from(customerInquiries);
    const newInquiries = allInquiries.filter((i) => i.status === "New").length;

    // Recent orders
    const recentOrders = allOrders.slice(0, 6);

    // Recent production logs
    const recentProduction = await db
      .select()
      .from(productionLogs)
      .orderBy(desc(productionLogs.createdAt))
      .limit(6);

    // Recent audit logs
    const recentAudit = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(8);

    return NextResponse.json({
      success: true,
      metrics: {
        totalProducts,
        activeProducts,
        totalCustomers,
        newOrderRequests,
        pendingRequests,
        todaysProduction,
        currentInventory: totalInventoryUnits,
        lowStockProducts,
        customerInquiries: newInquiries,
      },
      recentOrders,
      recentProduction,
      recentAudit,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
