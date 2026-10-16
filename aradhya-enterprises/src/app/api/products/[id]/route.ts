import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const user = await getCurrentUser();

    let product;
    if (/^\d+$/.test(id)) {
      [product] = await db.select().from(products).where(eq(products.id, parseInt(id, 10)));
    } else {
      [product] = await db.select().from(products).where(eq(products.slug, id));
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Mask admin-only inventory & sales fields for non-admin visitors
    if (user?.role !== "admin") {
      const { stock, minStock, unitsSold, ...safeProduct } = product;
      return NextResponse.json({ success: true, product: safeProduct });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await props.params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [existing] = await db.select().from(products).where(eq(products.id, productId));
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      categorySlug,
      description,
      packSize,
      originalPrice,
      discountPercent,
      finalPrice: customFinalPrice,
      stock,
      unitsSold,
      minStock,
      sku,
      images,
      specifications,
      features,
      isFeatured,
      isActive,
      availabilityStatus,
    } = body;

    const newOrigPrice =
      originalPrice !== undefined ? parseFloat(originalPrice) : parseFloat(existing.originalPrice);
    const newDiscount =
      discountPercent !== undefined
        ? Math.min(100, Math.max(0, parseInt(discountPercent, 10) || 0))
        : existing.discountPercent;

    let finalPriceNum: string;
    if (customFinalPrice !== undefined && discountPercent === undefined) {
      finalPriceNum = parseFloat(customFinalPrice).toFixed(2);
    } else {
      finalPriceNum = (newOrigPrice - (newOrigPrice * newDiscount) / 100).toFixed(2);
    }

    const stockNum = stock !== undefined ? parseInt(stock, 10) : existing.stock;
    const unitsSoldNum = unitsSold !== undefined ? parseInt(unitsSold, 10) : existing.unitsSold;
    const minStockNum = minStock !== undefined ? parseInt(minStock, 10) : existing.minStock;

    let computedStatus = availabilityStatus || existing.availabilityStatus;
    if (stock !== undefined) {
      if (stockNum <= 0) {
        computedStatus = "out_of_stock";
      } else if (stockNum <= minStockNum) {
        computedStatus = "low_stock";
      } else if (computedStatus === "out_of_stock") {
        computedStatus = "available";
      }
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
        name: name !== undefined ? name.trim() : existing.name,
        categorySlug: categorySlug !== undefined ? categorySlug : existing.categorySlug,
        description: description !== undefined ? description.trim() : existing.description,
        packSize: packSize !== undefined ? packSize.trim() : existing.packSize,
        sku: sku !== undefined ? sku.trim() : existing.sku,
        originalPrice: newOrigPrice.toFixed(2),
        discountPercent: newDiscount,
        finalPrice: finalPriceNum,
        stock: stockNum,
        unitsSold: unitsSoldNum,
        minStock: minStockNum,
        availabilityStatus: computedStatus,
        images: images !== undefined ? (typeof images === "string" ? images : JSON.stringify(images)) : existing.images,
        specifications:
          specifications !== undefined
            ? typeof specifications === "string"
              ? specifications
              : JSON.stringify(specifications)
            : existing.specifications,
        features:
          features !== undefined
            ? typeof features === "string"
              ? features
              : JSON.stringify(features)
            : existing.features,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    // Audit changes
    const priceChanged = parseFloat(existing.originalPrice) !== newOrigPrice || existing.finalPrice !== finalPriceNum;
    const nameChanged = existing.name !== updatedProduct.name;
    const stockChanged = existing.stock !== stockNum;
    const salesChanged = existing.unitsSold !== unitsSoldNum;

    let auditDetail = `Admin updated product #${productId} (${updatedProduct.name}).`;
    if (nameChanged) auditDetail += ` Name changed: "${existing.name}" -> "${updatedProduct.name}".`;
    if (priceChanged) auditDetail += ` Final Price: ₹${existing.finalPrice} -> ₹${finalPriceNum}.`;
    if (stockChanged) auditDetail += ` Stock: ${existing.stock} -> ${stockNum}.`;
    if (salesChanged) auditDetail += ` Sales: ${existing.unitsSold} -> ${unitsSoldNum}.`;

    await db.insert(auditLogs).values({
      action: "PRODUCT_UPDATED",
      entity: "PRODUCT",
      entityId: String(productId),
      details: auditDetail,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully! Changes are immediately live.",
    });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await props.params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [existing] = await db.select().from(products).where(eq(products.id, productId));
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));

    await db.insert(auditLogs).values({
      action: "PRODUCT_DELETED",
      entity: "PRODUCT",
      entityId: String(productId),
      details: `Permanently deleted product "${existing.name}" (SKU: ${existing.sku})`,
      performedBy: user.name,
    });

    return NextResponse.json({
      success: true,
      message: `Product "${existing.name}" was permanently deleted.`,
    });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
