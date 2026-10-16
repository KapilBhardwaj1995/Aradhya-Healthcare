import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AboutClient from "./AboutClient";

export const revalidate = 0;

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <AboutClient />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
