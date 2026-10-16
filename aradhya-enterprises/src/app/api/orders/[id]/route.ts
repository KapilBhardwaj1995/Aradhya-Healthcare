import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderRequests, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const user = await getCurrentUser();

    const [order] = await db
      .select()
      .from(orderRequests)
      .where(eq(orderRequests.id, parseInt(id, 10)));

    if (!order) {
      return NextResponse.json({ error: "Order request not found" }, { status: 404 });
    }

    if (user?.role === "admin" || (user && user.id === order.userId)) {
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order request" }, { status: 500 });
  }
}

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
    const orderId = parseInt(id, 10);
    const body = await request.json();
    const { status, adminNotes } = body;

    const [existing] = await db.select().from(orderRequests).where(eq(orderRequests.id, orderId));
    if (!existing) {
      return NextResponse.json({ error: "Order request not found" }, { status: 404 });
    }

    const validStatuses = [
      "New Request",
      "Under Review",
      "Customer Contacted",
      "Confirmed",
      "Completed",
      "Cancelled",
      "Rejected",
      "On Hold",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const [updatedOrder] = await db
      .update(orderRequests)
      .set({
        status: status || existing.status,
        adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(orderRequests.id, orderId))
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      action: "ORDER_STATUS_CHANGED",
      entity: "ORDER_REQUEST",
      entityId: String(orderId),
      details: `Changed status of request ${existing.requestId} from "${existing.status}" to "${status || existing.status}". Notes: ${adminNotes || "N/A"}`,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order request updated successfully",
    });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order request" }, { status: 500 });
  }
}
