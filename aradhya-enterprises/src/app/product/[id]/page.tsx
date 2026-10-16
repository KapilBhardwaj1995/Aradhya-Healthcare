import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, companySettings } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductDetailsClient from "./ProductDetailsClient";

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  if (/^\d+$/.test(id)) {
    [product] = await db.select().from(products).where(eq(products.id, parseInt(id, 10)));
  } else {
    [product] = await db.select().from(products).where(eq(products.slug, id));
  }

  if (!product || !product.isActive) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.categorySlug, product.categorySlug), ne(products.id, product.id)))
    .limit(4);

  // Fetch WhatsApp number setting
  const [waSetting] = await db
    .select()
    .from(companySettings)
    .where(eq(companySettings.key, "whatsapp_number"));
  const whatsappNumber = waSetting?.value || "+919000012345";

  // Sanitize public payload: exclude stock and unitsSold
  const safeProduct = {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    categorySlug: product.categorySlug,
    description: product.description,
    packSize: product.packSize,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    finalPrice: product.finalPrice,
    images: product.images,
    specifications: product.specifications,
    features: product.features,
  };

  const safeRelated = relatedProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    categorySlug: p.categorySlug,
    description: p.description,
    packSize: p.packSize,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    finalPrice: p.finalPrice,
    images: p.images,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <ProductDetailsClient
          product={safeProduct}
          relatedProducts={safeRelated}
          whatsappNumber={whatsappNumber}
        />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
