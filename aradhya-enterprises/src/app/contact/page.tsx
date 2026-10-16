import React from "react";
import { db } from "@/db";
import { companySettings } from "@/db/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactClient from "./ContactClient";

export const revalidate = 0;

export default async function ContactPage() {
  const allSettings = await db.select().from(companySettings);
  const settingsMap: Record<string, string> = {};
  allSettings.forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <ContactClient settings={settingsMap} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
