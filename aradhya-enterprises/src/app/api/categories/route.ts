import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, asc, count } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder));

    // Get product count per category
    const categoryCounts = await Promise.all(
      allCategories.map(async (cat) => {
        const [prodCount] = await db
          .select({ count: count() })
          .from(products)
          .where(eq(products.categorySlug, cat.slug));
        return {
          ...cat,
          productCount: prodCount?.count || 0,
        };
      })
    );

    return NextResponse.json({ success: true, categories: categoryCounts });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, icon, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const [newCat] = await db
      .insert(categories)
      .values({
        slug,
        name: name.trim(),
        description: description?.trim() || "",
        icon: icon || "Package",
        imageUrl: imageUrl || "/images/aradhya-baby-diapers.jpg",
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, category: newCat });
  } catch (error) {
    console.error("Category POST error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
