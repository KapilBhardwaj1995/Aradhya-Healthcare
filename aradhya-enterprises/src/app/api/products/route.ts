import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, auditLogs } from "@/db/schema";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const discountOnly = searchParams.get("discountOnly") === "true";
    const sort = searchParams.get("sort") || "popular"; // 'price_asc' | 'price_desc' | 'newest' | 'popular'
    const includeInactive = searchParams.get("includeInactive") === "true";

    const conditions = [];

    if (!includeInactive) {
      conditions.push(eq(products.isActive, true));
    }

    if (category && category !== "all") {
      conditions.push(eq(products.categorySlug, category));
    }

    if (discountOnly) {
      conditions.push(gte(products.discountPercent, 1));
    }

    if (minPrice) {
      conditions.push(gte(products.finalPrice, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(products.finalPrice, maxPrice));
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        sql`(LOWER(${products.name}) LIKE ${q} OR LOWER(${products.sku}) LIKE ${q} OR LOWER(${products.description}) LIKE ${q})`
      );
    }

    let orderByClause = desc(products.isFeatured);
    if (sort === "price_asc") {
      orderByClause = asc(products.finalPrice);
    } else if (sort === "price_desc") {
      orderByClause = desc(products.finalPrice);
    } else if (sort === "newest") {
      orderByClause = desc(products.createdAt);
    } else if (sort === "popular") {
      orderByClause = desc(products.isFeatured);
    }

    const query = db.select().from(products);
    const allProducts =
      conditions.length > 0
        ? await query.where(and(...conditions)).orderBy(orderByClause)
        : await query.orderBy(orderByClause);

    // If requester is not an admin, sanitize out internal stock, minStock, and unitsSold
    if (user?.role !== "admin") {
      const safeProducts = allProducts.map((p) => {
        const { stock, minStock, unitsSold, ...safe } = p;
        return safe;
      });
      return NextResponse.json({
        success: true,
        count: safeProducts.length,
        products: safeProducts,
      });
    }

    return NextResponse.json({
      success: true,
      count: allProducts.length,
      products: allProducts,
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      categorySlug,
      description,
      packSize,
      originalPrice,
      discountPercent = 0,
      stock = 0,
      unitsSold = 0,
      minStock = 10,
      sku,
      images,
      specifications,
      features,
      isFeatured = false,
      availabilityStatus,
    } = body;

    if (!name || !categorySlug || !description || !packSize || !originalPrice || !sku) {
      return NextResponse.json(
        { error: "Please fill in all required product fields (Name, Category, Description, Pack Size, Price, SKU)." },
        { status: 400 }
      );
    }

    const origPriceNum = parseFloat(originalPrice);
    const discNum = Math.min(100, Math.max(0, parseInt(discountPercent, 10) || 0));

    if (isNaN(origPriceNum) || origPriceNum <= 0) {
      return NextResponse.json({ error: "Original price must be a positive number." }, { status: 400 });
    }

    const finalPriceNum = (origPriceNum - (origPriceNum * discNum) / 100).toFixed(2);

    let status = availabilityStatus || "available";
    const stockNum = parseInt(stock, 10) || 0;
    const unitsSoldNum = parseInt(unitsSold, 10) || 0;
    const minStockNum = parseInt(minStock, 10) || 10;
    if (stockNum <= 0) {
      status = "out_of_stock";
    } else if (stockNum <= minStockNum) {
      status = "low_stock";
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const [newProduct] = await db
      .insert(products)
      .values({
        slug,
        sku: sku.trim(),
        name: name.trim(),
        categorySlug,
        description: description.trim(),
        packSize: packSize.trim(),
        originalPrice: origPriceNum.toFixed(2),
        discountPercent: discNum,
        finalPrice: finalPriceNum,
        stock: stockNum,
        unitsSold: unitsSoldNum,
        minStock: minStockNum,
        availabilityStatus: status,
        images: typeof images === "string" ? images : JSON.stringify(images || ["/images/aradhya-baby-diapers.jpg"]),
        specifications: typeof specifications === "string" ? specifications : JSON.stringify(specifications || {}),
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        isFeatured: Boolean(isFeatured),
        isActive: true,
      })
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      action: "PRODUCT_CREATED",
      entity: "PRODUCT",
      entityId: String(newProduct.id),
      details: `Created product "${newProduct.name}" (SKU: ${newProduct.sku}) at price ₹${origPriceNum} with ${discNum}% discount.`,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Product created successfully!",
    });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create product" },
      { status: 500 }
    );
  }
}
