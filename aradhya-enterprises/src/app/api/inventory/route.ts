import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const inventoryItems = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        categorySlug: products.categorySlug,
        packSize: products.packSize,
        stock: products.stock,
        minStock: products.minStock,
        availabilityStatus: products.availabilityStatus,
        originalPrice: products.originalPrice,
        discountPercent: products.discountPercent,
        finalPrice: products.finalPrice,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .orderBy(desc(products.stock));

    return NextResponse.json({ success: true, inventory: inventoryItems });
  } catch (error) {
    console.error("Inventory GET error:", error);
    return NextResponse.json({ error: "Failed to load inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, adjustmentType, quantity, minStock, markOutOfStock } = body;

    const [prod] = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(productId, 10)));
    if (!prod) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let newStock = prod.stock;
    let newStatus = prod.availabilityStatus;
    let newMinStock = minStock !== undefined ? parseInt(minStock, 10) : prod.minStock;

    if (markOutOfStock) {
      newStock = 0;
      newStatus = "out_of_stock";
    } else if (adjustmentType === "add") {
      newStock += parseInt(quantity, 10) || 0;
    } else if (adjustmentType === "subtract") {
      newStock = Math.max(0, newStock - (parseInt(quantity, 10) || 0));
    } else if (adjustmentType === "set") {
      newStock = Math.max(0, parseInt(quantity, 10) || 0);
    }

    if (!markOutOfStock) {
      if (newStock <= 0) {
        newStatus = "out_of_stock";
      } else if (newStock <= newMinStock) {
        newStatus = "low_stock";
      } else {
        newStatus = "available";
      }
    }

    const [updatedProd] = await db
      .update(products)
      .set({
        stock: newStock,
        minStock: newMinStock,
        availabilityStatus: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(products.id, prod.id))
      .returning();

    await db.insert(auditLogs).values({
      action: "STOCK_ADJUSTED",
      entity: "PRODUCT",
      entityId: String(prod.id),
      details: `Stock for "${prod.name}" adjusted from ${prod.stock} to ${newStock} (${newStatus}). Min stock: ${newMinStock}.`,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      product: updatedProd,
      message: `Stock for "${prod.name}" successfully updated to ${newStock}.`,
    });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
