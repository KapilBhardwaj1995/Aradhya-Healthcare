import { NextResponse } from "next/server";
import { db } from "@/db";
import { customerInquiries, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const inquiries = await db
      .select()
      .from(customerInquiries)
      .orderBy(desc(customerInquiries.createdAt));

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Inquiries GET error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone number, and message are required." },
        { status: 400 }
      );
    }

    const [newInquiry] = await db
      .insert(customerInquiries)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject?.trim() || "General Customer Inquiry",
        message: message.trim(),
        status: "New",
      })
      .returning();

    return NextResponse.json({
      success: true,
      inquiry: newInquiry,
      message: "Thank you for reaching out! Our team has received your message and will contact you promptly.",
    });
  } catch (error) {
    console.error("Inquiry POST error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
