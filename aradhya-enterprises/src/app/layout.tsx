import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "ARADHAYA Enterprises | Care for Every Little Need | District Shamli, UP",
  description:
    "Manufacturer of premium Aradhya SoftCare Baby Diapers, Sanitary Pads, Panty Liners, and Maternity Maxi Pads. Aradhaya Enterprises, District Shamli, Uttar Pradesh, India.",
  keywords: [
    "Aradhaya Enterprises",
    "Aradhya SoftCare",
    "District Shamli",
    "Uttar Pradesh",
    "Baby Diapers",
    "Sanitary Pads",
    "Maternity Pads",
    "Panty Liners",
    "Feminine Hygiene",
  ],
  openGraph: {
    title: "ARADHAYA Enterprises - Care for Every Little Need",
    description:
      "Aradhya SoftCare baby care and feminine hygiene essentials with direct order request system. District Shamli, UP.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
