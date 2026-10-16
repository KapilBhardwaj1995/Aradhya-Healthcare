import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, orderRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const customerUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "customer"))
      .orderBy(desc(users.createdAt));

    // Attach order counts
    const customersWithOrders = await Promise.all(
      customerUsers.map(async (cust) => {
        const orders = await db
          .select()
          .from(orderRequests)
          .where(eq(orderRequests.userId, cust.id));
        return {
          ...cust,
          orderCount: orders.length,
          lastOrderDate: orders[0]?.createdAt || null,
        };
      })
    );

    return NextResponse.json({ success: true, customers: customersWithOrders });
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
