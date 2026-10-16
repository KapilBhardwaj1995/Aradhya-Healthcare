import { NextResponse } from "next/server";
import { db } from "@/db";
import { companySettings, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const allSettings = await db.select().from(companySettings);
    const settingsMap: Record<string, string> = {
      whatsapp_number: "+919000012345",
      contact_phone: "+91 90000 12345 (demo number)",
      toll_free: "1800 000 0000 (demo)",
      contact_email: "care@aradhayaenterprises.in",
      wholesale_email: "distributors@aradhayaenterprises.in",
      contact_address: "Aradhaya Enterprises, District Shamli, Uttar Pradesh, India",
      announcement_banner: "Care for Every Little Need • District Shamli, UP • Direct Inquiries",
      company_tagline: "Care for Every Little Need",
    };

    allSettings.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await request.json(); // key-value pairs

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        const [existing] = await db
          .select()
          .from(companySettings)
          .where(eq(companySettings.key, key));

        if (existing) {
          await db
            .update(companySettings)
            .set({ value, updatedAt: new Date() })
            .where(eq(companySettings.key, key));
        } else {
          await db.insert(companySettings).values({ key, value });
        }
      }
    }

    await db.insert(auditLogs).values({
      action: "SETTINGS_UPDATED",
      entity: "SETTINGS",
      details: `Admin ${user.name} updated company settings (WhatsApp / contact info).`,
      performedBy: user.name,
    });

    return NextResponse.json({ success: true, message: "Settings saved successfully!" });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
