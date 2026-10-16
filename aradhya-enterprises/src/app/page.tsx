import React from "react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomeClient from "./HomeClient";

export const revalidate = 0; // Dynamic data for instant admin updates

async function getHomeData() {
  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true));

  const featuredProducts = await db
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
    .orderBy(desc(products.isFeatured), desc(products.createdAt))
    .limit(8);

  return {
    categories: allCategories,
    products: featuredProducts,
  };
}

export default async function HomePage() {
  const { categories: categoryList, products: productList } = await getHomeData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <HomeClient categories={categoryList} products={productList} />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
