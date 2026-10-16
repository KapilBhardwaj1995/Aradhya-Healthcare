import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderRequests, products, auditLogs, companySettings } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

function generateRequestId(): string {
  const year = new Date().getFullYear();
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `AS-${year}-${randomSixDigits}`;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const requestId = searchParams.get("requestId");
    const phone = searchParams.get("phone");

    // Guest lookup by requestId + phone
    if (requestId && phone) {
      const [order] = await db
        .select()
        .from(orderRequests)
        .where(
          and(
            eq(orderRequests.requestId, requestId.trim()),
            eq(orderRequests.customerPhone, phone.trim())
          )
        );
      if (!order) {
        return NextResponse.json({ error: "Order request not found with provided details" }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    // If Admin: can view all
    if (user && user.role === "admin") {
      let query = db.select().from(orderRequests);
      const orders = status && status !== "all"
        ? await query.where(eq(orderRequests.status, status)).orderBy(desc(orderRequests.createdAt))
        : await query.orderBy(desc(orderRequests.createdAt));
      return NextResponse.json({ success: true, orders });
    }

    // If logged in customer: only view own orders
    if (user) {
      const orders = await db
        .select()
        .from(orderRequests)
        .where(eq(orderRequests.userId, user.id))
        .orderBy(desc(orderRequests.createdAt));
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      productId,
      quantity = 1,
      message,
    } = body;

    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !productId) {
      return NextResponse.json(
        { error: "Please provide all required fields (Name, Phone, Email, Address, Product)." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return NextResponse.json({ error: "Please enter a valid quantity of at least 1." }, { status: 400 });
    }

    // Fetch product
    const [prod] = await db.select().from(products).where(eq(products.id, parseInt(productId, 10)));
    if (!prod) {
      return NextResponse.json({ error: "Selected product does not exist." }, { status: 404 });
    }

    if (prod.availabilityStatus === "out_of_stock") {
      return NextResponse.json(
        { error: `Sorry, "${prod.name}" is currently Out of Stock. Order requests are disabled for this item.` },
        { status: 400 }
      );
    }

    const unitPrice = parseFloat(prod.finalPrice);
    const totalEstimate = (unitPrice * qty).toFixed(2);
    const requestId = generateRequestId();

    const [newOrder] = await db
      .insert(orderRequests)
      .values({
        requestId,
        userId: user ? user.id : null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerAddress: customerAddress.trim(),
        productId: prod.id,
        productName: prod.name,
        productPackSize: prod.packSize,
        quantity: qty,
        unitPrice: prod.finalPrice,
        discountPercent: prod.discountPercent,
        totalEstimate,
        message: message ? message.trim() : null,
        status: "New Request",
      })
      .returning();

    // Fetch whatsapp number
    const [waSetting] = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.key, "whatsapp_number"));
    const whatsappNumber = waSetting?.value || "+919876543210";

    const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Hello Aradhaya Enterprises! I have submitted an Order Request for ${qty}x ${prod.name} (${prod.packSize}). My Request ID is ${requestId}. Looking forward to your call/confirmation!`
    );
    const whatsappUrl = `https://wa.me/${cleanWa}?text=${waText}`;

    return NextResponse.json({
      success: true,
      requestId,
      order: newOrder,
      whatsappUrl,
      message:
        "Thank you for your request. Our team will contact you shortly to confirm availability and further processing.",
    });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ error: "Failed to submit order request. Please try again." }, { status: 500 });
  }
}
