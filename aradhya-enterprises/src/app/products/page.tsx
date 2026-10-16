import React from "react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductsClient from "./ProductsClient";

export const revalidate = 0;

export default async function ProductsPage() {
  const allProducts = await db
    .select({
      id: products.id,
      slug: products.slug,
      sku: products.sku,
      name: products.name,
      categorySlug: products.categorySlug,
      description: products.description,
      packSize: products.packSize,
      originalPrice: products.originalPrice,
      discountPercent: products.discountPercent,
      finalPrice: products.finalPrice,
      images: products.images,
      isFeatured: products.isFeatured,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.isFeatured), desc(products.createdAt));

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <ProductsClient
          initialProducts={allProducts}
          categories={allCategories}
        />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
