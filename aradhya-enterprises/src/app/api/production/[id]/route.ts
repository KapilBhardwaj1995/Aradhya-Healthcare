import { NextResponse } from "next/server";
import { db } from "@/db";
import { productionLogs, products, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await props.params;
    const logId = parseInt(id, 10);
    const body = await request.json();
    const { isApproved, updateInventory } = body;

    const [log] = await db
      .select()
      .from(productionLogs)
      .where(eq(productionLogs.id, logId));
    if (!log) {
      return NextResponse.json({ error: "Production log not found" }, { status: 404 });
    }

    let inventoryUpdated = log.inventoryUpdated;

    // If Admin chooses to approve and update inventory stock
    if (isApproved && updateInventory && !log.inventoryUpdated && log.productId) {
      const [prod] = await db.select().from(products).where(eq(products.id, log.productId));
      if (prod) {
        const newStock = prod.stock + log.quantityProduced;
        let newStatus = prod.availabilityStatus;
        if (newStock > prod.minStock) {
          newStatus = "available";
        } else if (newStock > 0) {
          newStatus = "low_stock";
        }

        await db
          .update(products)
          .set({
            stock: newStock,
            availabilityStatus: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(products.id, prod.id));

        inventoryUpdated = true;

        await db.insert(auditLogs).values({
          action: "INVENTORY_SYNCED_PRODUCTION",
          entity: "PRODUCT",
          entityId: String(prod.id),
          details: `Added ${log.quantityProduced} units from approved Production #${logId} to stock. New stock: ${newStock}.`,
          performedBy: user.name,
        });
      }
    }

    const [updatedLog] = await db
      .update(productionLogs)
      .set({
        isApproved: Boolean(isApproved),
        approvedBy: isApproved ? user.name : null,
        approvedAt: isApproved ? new Date() : null,
        inventoryUpdated,
      })
      .where(eq(productionLogs.id, logId))
      .returning();

    return NextResponse.json({
      success: true,
      log: updatedLog,
      message: isApproved
        ? `Production log approved${inventoryUpdated ? " and stock updated!" : "!"}`
        : "Production log updated.",
    });
  } catch (error) {
    console.error("Production approval error:", error);
    return NextResponse.json({ error: "Failed to update production log" }, { status: 500 });
  }
}
