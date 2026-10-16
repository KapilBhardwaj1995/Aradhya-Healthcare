import { NextResponse } from "next/server";
import { db } from "@/db";
import { productionLogs, products, auditLogs } from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "employee")) {
      return NextResponse.json({ error: "Unauthorized: Access restricted to authorized staff" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const productId = searchParams.get("productId");

    // Admin can see all; Employee only sees their own production logs
    let conditions = [];
    if (user.role === "employee") {
      conditions.push(eq(productionLogs.employeeId, user.id));
    }

    if (productId) {
      conditions.push(eq(productionLogs.productId, parseInt(productId, 10)));
    }

    if (startDate) {
      conditions.push(gte(productionLogs.productionDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(productionLogs.productionDate, endDate));
    }

    const query = db.select().from(productionLogs);
    const logs =
      conditions.length > 0
        ? await query.where(and(...conditions)).orderBy(desc(productionLogs.productionDate), desc(productionLogs.createdAt))
        : await query.orderBy(desc(productionLogs.productionDate), desc(productionLogs.createdAt));

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Production GET error:", error);
    return NextResponse.json({ error: "Failed to fetch production logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "employee" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized: Only employees and admin can submit production entries" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, productionDate, quantityProduced, remarks } = body;

    if (!productId || !productionDate || !quantityProduced) {
      return NextResponse.json(
        { error: "Product, production date, and quantity produced are required." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantityProduced, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: "Quantity produced must be a positive number." }, { status: 400 });
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(productId, 10)));
    if (!product) {
      return NextResponse.json({ error: "Invalid product selected." }, { status: 404 });
    }

    const [newLog] = await db
      .insert(productionLogs)
      .values({
        employeeId: user.id,
        employeeName: user.name,
        productId: product.id,
        productName: product.name,
        productionDate: productionDate.trim(),
        quantityProduced: qty,
        remarks: remarks?.trim() || null,
        isApproved: false,
        inventoryUpdated: false,
      })
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      action: "PRODUCTION_ENTERED",
      entity: "PRODUCTION",
      entityId: String(newLog.id),
      details: `${user.name} logged production of ${qty} units for ${product.name} on ${productionDate}.`,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      log: newLog,
      message: "Production entry submitted successfully! Pending Admin verification and inventory sync.",
    });
  } catch (error) {
    console.error("Production POST error:", error);
    return NextResponse.json({ error: "Failed to submit production record" }, { status: 500 });
  }
}
