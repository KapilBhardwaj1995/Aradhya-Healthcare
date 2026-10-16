import { NextResponse } from "next/server";
import { db } from "@/db";
import { customerInquiries, auditLogs } from "@/db/schema";
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
    const inquiryId = parseInt(id, 10);
    const body = await request.json();
    const { status, adminReply } = body;

    const [existing] = await db
      .select()
      .from(customerInquiries)
      .where(eq(customerInquiries.id, inquiryId));
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(customerInquiries)
      .set({
        status: status || existing.status,
        adminReply: adminReply !== undefined ? adminReply : existing.adminReply,
        updatedAt: new Date(),
      })
      .where(eq(customerInquiries.id, inquiryId))
      .returning();

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: "Inquiry updated successfully",
    });
  } catch (error) {
    console.error("Inquiry PATCH error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
