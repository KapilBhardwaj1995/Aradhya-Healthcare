import React from "react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import InventoryClient from "./InventoryClient";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      categorySlug: products.categorySlug,
      packSize: products.packSize,
      stock: products.stock,
      minStock: products.minStock,
      availabilityStatus: products.availabilityStatus,
      finalPrice: products.finalPrice,
    })
    .from(products)
    .orderBy(desc(products.stock));

  return <InventoryClient initialInventory={allProducts} />;
}
