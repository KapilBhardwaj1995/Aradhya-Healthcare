import { NextResponse } from "next/server";
import { db } from "@/db";
import { productionLogs, orderRequests, products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const allProduction = await db.select().from(productionLogs).orderBy(desc(productionLogs.productionDate));
    const allOrders = await db.select().from(orderRequests).orderBy(desc(orderRequests.createdAt));
    const allProducts = await db.select().from(products);

    // 1. Product-wise production
    const productProductionMap: Record<string, { name: string; totalProduced: number; approvedCount: number }> = {};
    allProduction.forEach((log) => {
      if (!productProductionMap[log.productName]) {
        productProductionMap[log.productName] = {
          name: log.productName,
          totalProduced: 0,
          approvedCount: 0,
        };
      }
      productProductionMap[log.productName].totalProduced += log.quantityProduced;
      if (log.isApproved) {
        productProductionMap[log.productName].approvedCount += log.quantityProduced;
      }
    });

    // 2. Date-wise production
    const dateProductionMap: Record<string, number> = {};
    allProduction.forEach((log) => {
      dateProductionMap[log.productionDate] = (dateProductionMap[log.productionDate] || 0) + log.quantityProduced;
    });

    // 3. Order requests by status
    const ordersByStatus: Record<string, number> = {};
    allOrders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    // 4. Most requested products
    const productOrderMap: Record<string, { name: string; requestCount: number; totalQuantity: number; estimatedValue: number }> = {};
    allOrders.forEach((o) => {
      if (!productOrderMap[o.productName]) {
        productOrderMap[o.productName] = {
          name: o.productName,
          requestCount: 0,
          totalQuantity: 0,
          estimatedValue: 0,
        };
      }
      productOrderMap[o.productName].requestCount += 1;
      productOrderMap[o.productName].totalQuantity += o.quantity;
      productOrderMap[o.productName].estimatedValue += parseFloat(o.totalEstimate) || 0;
    });

    return NextResponse.json({
      success: true,
      productWiseProduction: Object.values(productProductionMap),
      dailyProduction: Object.entries(dateProductionMap)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => b.date.localeCompare(a.date)),
      ordersByStatus,
      productOrderStats: Object.values(productOrderMap),
      totalOrders: allOrders.length,
      totalProductionUnits: allProduction.reduce((acc, p) => acc + p.quantityProduced, 0),
    });
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 });
  }
}
