import React from "react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProductManagerClient from "./ProductManagerClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return <ProductManagerClient initialProducts={allProducts} />;
}
