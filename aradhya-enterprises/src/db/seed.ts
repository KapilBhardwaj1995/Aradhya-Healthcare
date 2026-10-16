import { db } from "./index";
import {
  users,
  categories,
  products,
  orderRequests,
  productionLogs,
  customerInquiries,
  companySettings,
  auditLogs,
} from "./schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  // Check if categories already seeded
  const existingCategories = await db.select().from(categories);
  if (existingCategories.length > 0) {
    return { message: "Database already seeded", count: existingCategories.length };
  }

  // 1. Seed Company Settings
  await db.insert(companySettings).values([
    {
      key: "whatsapp_number",
      value: "+919000012345",
    },
    {
      key: "contact_phone",
      value: "+91 90000 12345 (demo number)",
    },
    {
      key: "toll_free",
      value: "1800 000 0000 (demo)",
    },
    {
      key: "contact_email",
      value: "care@aradhayaenterprises.in",
    },
    {
      key: "wholesale_email",
      value: "distributors@aradhayaenterprises.in",
    },
    {
      key: "contact_address",
      value: "Aradhaya Enterprises, District Shamli, Uttar Pradesh, India",
    },
    {
      key: "announcement_banner",
      value: "Care for Every Little Need | Aradhaya SoftCare Baby & Feminine Essentials | District Shamli, UP",
    },
    {
      key: "company_tagline",
      value: "Care for Every Little Need",
    },
    {
      key: "low_stock_threshold",
      value: "25",
    },
  ]);

  // 2. Seed Users
  const [adminUser, employeeUser, customerUser] = await db
    .insert(users)
    .values([
      {
        name: "Aradhya Administrator",
        email: "admin@aradhyacare.com",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        phone: "+91 98765 43210",
        address: "Headquarters, Industrial Zone, Pune, Maharashtra",
      },
      {
        name: "Priya Sharma (Production)",
        email: "employee@aradhyacare.com",
        passwordHash: hashPassword("employee123"),
        role: "employee",
        phone: "+91 98765 43211",
        address: "Unit 3 Production Plant, Pune, Maharashtra",
      },
      {
        name: "Ananya Deshmukh",
        email: "customer@example.com",
        passwordHash: hashPassword("customer123"),
        role: "customer",
        phone: "+91 98765 11223",
        address: "Flat 402, Lotus Residency, Baner, Pune, Maharashtra 411045",
      },
    ])
    .returning();

  // 3. Seed Categories
  await db.insert(categories).values([
    {
      slug: "baby-diapers",
      name: "Baby Diapers",
      description: "Ultra-absorbent, hypoallergenic, feather-soft baby diapers engineered for gentle 12-hour leak-lock protection.",
      icon: "Baby",
      imageUrl: "/images/aradhya-baby-diapers.jpg",
      sortOrder: 1,
      isActive: true,
    },
    {
      slug: "sanitary-pads",
      name: "Sanitary Pads",
      description: "Cottony soft, ultra-thin breathable sanitary pads with active gel absorption and odor neutralizing lock.",
      icon: "Sparkles",
      imageUrl: "/images/aradhya-sanitary-pads.jpg",
      sortOrder: 2,
      isActive: true,
    },
    {
      slug: "panty-liners",
      name: "Panty Liners",
      description: "Feather-light, ultra-breathable daily liners for all-day freshness and daily intimate hygiene confidence.",
      icon: "Flower2",
      imageUrl: "/images/aradhya-panty-liners.jpg",
      sortOrder: 3,
      isActive: true,
    },
    {
      slug: "maternity-pads",
      name: "Maternity Pads",
      description: "Hospital-grade heavy flow postpartum pads with ultra-cushioned comfort, 3D side leak guards, and high softness.",
      icon: "HeartHandshake",
      imageUrl: "/images/aradhya-maternity-pads.jpg",
      sortOrder: 4,
      isActive: true,
    },
  ]);

  // 4. Seed Products
  const seedProducts = [
    {
      slug: "baby-diapers-newborn-nb",
      sku: "AS-BD-NB-30",
      name: "Aradhya SoftCare Baby Diapers - Newborn (NB)",
      categorySlug: "baby-diapers",
      description: "Specially formulated for delicate newborn skin under 5 kg. Features an umbilical cord notch, organic cotton top-sheet, 12-hour dry-weave absorbency, and breathable 3D air-channels to prevent rash and irritation.",
      packSize: "Pack of 30 Pants",
      originalPrice: "399.00",
      discountPercent: 12,
      finalPrice: "351.12",
      stock: 350,
      minStock: 40,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-baby-diapers.jpg",
        "https://images.pexels.com/photos/19773885/pexels-photo-19773885.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Baby Weight": "Up to 5 kg",
        "Absorption": "Up to 12 Hours Gel Lock",
        "Material": "Organic Cotton Blend, Chlorine-free",
        "Special Feature": "Umbilical Cord Cutout, Wetness Indicator",
        "Skin Dermatologist Tested": "Hypoallergenic, Fragrance-Free",
      }),
      features: JSON.stringify([
        "12-Hour Dry-Weave Absorption Layer",
        "Gentle Navel Protection Cut for Newborns",
        "Color-Changing Wetness Indicator Line",
        "Hypoallergenic & 100% Breathable Backsheet",
        "Double Leak-Guard Barriers",
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "baby-diapers-small-s",
      sku: "AS-BD-S-46",
      name: "Aradhya SoftCare Baby Diapers - Small (S)",
      categorySlug: "baby-diapers",
      description: "Designed for active babies weighing 4-8 kg. Crafted with super-absorbent Japanese SAP polymer, cushiony soft waistband, and wetness indicator for uninterrupted sleep and play.",
      packSize: "Pack of 46 Pants",
      originalPrice: "599.00",
      discountPercent: 15,
      finalPrice: "509.15",
      stock: 480,
      minStock: 50,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-baby-diapers.jpg",
        "https://images.pexels.com/photos/3270224/pexels-photo-3270224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Baby Weight": "4 - 8 kg",
        "Absorption": "Up to 12 Hours Dry Core",
        "Waistband": "360-Degree Cloud Elastic",
        "Chemical Free": "Paraben Free, Lotion Free",
      }),
      features: JSON.stringify([
        "360-Degree Cloud-Soft Stretchable Waistband",
        "Deep Liquid Capture Pocket for Active Crawlers",
        "Zero Harsh Chemicals & Chlorine-Free Pulp",
        "Dermatologically Approved for Sensitive Skin",
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "baby-diapers-medium-m",
      sku: "AS-BD-M-42",
      name: "Aradhya SoftCare Baby Diapers - Medium (M)",
      categorySlug: "baby-diapers",
      description: "Ideal for babies 7-12 kg exploring the world. Features flexible side cuffs, extra wide leak shields, and diamond-embossed surface for swift fluid distribution.",
      packSize: "Pack of 42 Pants",
      originalPrice: "649.00",
      discountPercent: 10,
      finalPrice: "584.10",
      stock: 220,
      minStock: 45,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-baby-diapers.jpg",
        "https://images.pexels.com/photos/7282831/pexels-photo-7282831.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Baby Weight": "7 - 12 kg",
        "Absorption": "Anti-Sagging Dual Core",
        "Air Circulation": "Micro-Porous Film",
      }),
      features: JSON.stringify([
        "Diamond-Embossed Rapid Fluid Grid",
        "Anti-Sagging Construction During Movement",
        "Odor Lock Natural Polymer",
        "Silky Smooth Leg Elastics",
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "baby-diapers-large-l",
      sku: "AS-BD-L-38",
      name: "Aradhya SoftCare Baby Diapers - Large (L)",
      categorySlug: "baby-diapers",
      description: "Engineered for active toddlers 9-14 kg. Heavy absorption core locks moisture away instantly during active play and long nighttime rests.",
      packSize: "Pack of 38 Pants",
      originalPrice: "699.00",
      discountPercent: 10,
      finalPrice: "629.10",
      stock: 12,
      minStock: 30,
      availabilityStatus: "low_stock",
      images: JSON.stringify([
        "/images/aradhya-baby-diapers.jpg",
        "https://images.pexels.com/photos/3242264/pexels-photo-3242264.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Baby Weight": "9 - 14 kg",
        "Absorption": "Maxi-Capacity Toddler Core",
      }),
      features: [
        "Heavy Toddler Night-Lock Retention",
        "Super Tear-Off Sides for Quick Change",
        "Breathable Outer Shield",
      ],
      isFeatured: false,
      isActive: true,
    },
    {
      slug: "ultra-thin-sanitary-pads-xl-plus",
      sku: "AS-SP-XL-30",
      name: "Aradhya SoftCare Ultra Thin Sanitary Pads - XL+",
      categorySlug: "sanitary-pads",
      description: "320mm Extra-Long sanitary pads crafted with 100% natural organic cotton surface, rapid-dry SAP core, and wide wings. Provides leak-free peace of mind day and night.",
      packSize: "Pack of 30 Pads (Individually Wrapped)",
      originalPrice: "349.00",
      discountPercent: 14,
      finalPrice: "300.14",
      stock: 410,
      minStock: 50,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-sanitary-pads.jpg",
        "https://images.pexels.com/photos/3737580/pexels-photo-3737580.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Length": "320 mm (Extra Long XL+)",
        "Top Sheet": "100% Organic Soft Cotton",
        "Wings": "Flexible Stay-Fast Dual Wings",
        "Flow Type": "Heavy Flow & Overnight",
        "Packaging": "Disposal Bag Included For Each Pad",
      }),
      features: JSON.stringify([
        "320mm Extra Rear Coverage for Zero Night Stains",
        "Organic Feather-Soft Breathable Cotton",
        "Anion Strip with Natural Odor Neutralizer",
        "Ultra-Thin Profile - Stays Completely Discreet",
        "100% Toxin-Free, Dioxin-Free, No Artificial Fragrance",
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "cottony-soft-sanitary-pads-regular",
      sku: "AS-SP-RG-20",
      name: "Aradhya SoftCare Cottony Soft Sanitary Pads - Regular",
      categorySlug: "sanitary-pads",
      description: "240mm regular flow sanitary pads featuring plush cotton weave, side leak guards, and ergonomic contours for everyday office, college, and home wear.",
      packSize: "Pack of 20 Pads",
      originalPrice: "219.00",
      discountPercent: 5,
      finalPrice: "208.05",
      stock: 290,
      minStock: 30,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-sanitary-pads.jpg",
        "https://images.pexels.com/photos/6682969/pexels-photo-6682969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Length": "240 mm (Regular Flow)",
        "Top Sheet": "Cotton Cushioned Weave",
        "Wings": "Contoured Adhesion Wings",
      }),
      features: JSON.stringify([
        "Instant Absorption Channels",
        "Soft Cloud Cuffs Against Chafing",
        "Anti-Bunching Lock Technology",
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "daily-fresh-panty-liners",
      sku: "AS-PL-DF-40",
      name: "Aradhya SoftCare Daily Fresh Panty Liners",
      categorySlug: "panty-liners",
      description: "Ultra-thin 155mm daily liners formulated for everyday freshness, light discharge, ovulation days, and menstrual cup backup. 100% breathable with non-irritating botanical cotton.",
      packSize: "Pack of 40 Liners",
      originalPrice: "189.00",
      discountPercent: 0,
      finalPrice: "189.00",
      stock: 0,
      minStock: 25,
      availabilityStatus: "out_of_stock",
      images: JSON.stringify([
        "/images/aradhya-panty-liners.jpg",
        "https://images.pexels.com/photos/5938274/pexels-photo-5938274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Length": "155 mm (Everyday Slim)",
        "Thickness": "Under 1 mm Micro Profile",
        "Breathability": "100% Micro-Aerated Base",
      }),
      features: JSON.stringify([
        "Barely-There Micro Thickness",
        "Gentle Botanical Cotton For Sensitive Skin",
        "Stay-Put Adhesion That Leaves No Residue",
        "All-Day Cleanliness and Spotting Confidence",
      ]),
      isFeatured: false,
      isActive: true,
    },
    {
      slug: "maternity-care-maxi-pads",
      sku: "AS-MP-MX-16",
      name: "Aradhya SoftCare Maternity Care Maxi Pads",
      categorySlug: "maternity-pads",
      description: "Hospital-grade 420mm postpartum maxi pads specially tailored for mothers recovering from childbirth. Features extra cushioning, high lochia retention, and hypoallergenic soothing touch.",
      packSize: "Pack of 16 Super Absorbent Pads",
      originalPrice: "449.00",
      discountPercent: 15,
      finalPrice: "381.65",
      stock: 175,
      minStock: 25,
      availabilityStatus: "available",
      images: JSON.stringify([
        "/images/aradhya-maternity-pads.jpg",
        "https://images.pexels.com/photos/5938275/pexels-photo-5938275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ]),
      specifications: JSON.stringify({
        "Length": "420 mm (Postpartum Maxi)",
        "Flow Grade": "Hospital Grade Heavy Lochia Flow",
        "Softness": "Velvet Cloud Extra-Thick Cushioning",
        "Side Barriers": "3D Anatomical Raised Walls",
      }),
      features: JSON.stringify([
        "420mm Extended Postpartum Coverage",
        "High-Speed Absorption for Heavy Flow & Post-Surgery",
        "Tender Cushioning to Reduce Perineal Pressure",
        "Hypoallergenic Without Synthetic Dyes or Fragrance",
        "Recommended by Gynaecologists and Maternity Nurses",
      ]),
      isFeatured: true,
      isActive: true,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(
      seedProducts.map((p) => ({
        ...p,
        features: typeof p.features === "string" ? p.features : JSON.stringify(p.features),
      }))
    )
    .returning();

  // 5. Seed Order Requests
  await db.insert(orderRequests).values([
    {
      requestId: "AS-2026-000125",
      userId: customerUser.id,
      customerName: "Ananya Deshmukh",
      customerPhone: "+91 98765 11223",
      customerEmail: "customer@example.com",
      customerAddress: "Flat 402, Lotus Residency, Baner, Pune, Maharashtra 411045",
      productId: insertedProducts[1].id,
      productName: insertedProducts[1].name,
      productPackSize: insertedProducts[1].packSize,
      quantity: 4,
      unitPrice: insertedProducts[1].finalPrice,
      discountPercent: insertedProducts[1].discountPercent,
      totalEstimate: (Number(insertedProducts[1].finalPrice) * 4).toFixed(2),
      message: "Please deliver morning time if possible. Requesting bulk discount confirmation.",
      status: "Customer Contacted",
      adminNotes: "Called customer on 12 Sep. Customer confirmed address; waiting for local batch dispatch confirmation.",
    },
    {
      requestId: "AS-2026-000128",
      userId: null,
      customerName: "Meera Joshi",
      customerPhone: "+91 98220 99881",
      customerEmail: "meera.joshi@gmail.com",
      customerAddress: "B-12, Green Acres Society, Kothrud, Pune - 411038",
      productId: insertedProducts[4].id,
      productName: insertedProducts[4].name,
      productPackSize: insertedProducts[4].packSize,
      quantity: 6,
      unitPrice: insertedProducts[4].finalPrice,
      discountPercent: insertedProducts[4].discountPercent,
      totalEstimate: (Number(insertedProducts[4].finalPrice) * 6).toFixed(2),
      message: "Urgent requirement for local community distribution.",
      status: "New Request",
      adminNotes: null,
    },
    {
      requestId: "AS-2026-000130",
      userId: null,
      customerName: "Dr. Kavita Nair (Aarogyam Clinic)",
      customerPhone: "+91 98111 22334",
      customerEmail: "contact@aarogyamclinic.in",
      customerAddress: "Aarogyam Women & Child Clinic, Shivajinagar, Pune - 411005",
      productId: insertedProducts[7].id,
      productName: insertedProducts[7].name,
      productPackSize: insertedProducts[7].packSize,
      quantity: 20,
      unitPrice: insertedProducts[7].finalPrice,
      discountPercent: insertedProducts[7].discountPercent,
      totalEstimate: (Number(insertedProducts[7].finalPrice) * 20).toFixed(2),
      message: "Monthly clinic supply request for maternity ward.",
      status: "Confirmed",
      adminNotes: "Institutional order confirmed. Direct dispatch scheduled.",
    },
  ]);

  // 6. Seed Production Logs
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  await db.insert(productionLogs).values([
    {
      employeeId: employeeUser.id,
      employeeName: employeeUser.name,
      productId: insertedProducts[0].id,
      productName: insertedProducts[0].name,
      productionDate: todayStr,
      quantityProduced: 250,
      remarks: "Batch #NB-904. Passed air-permeability and elastic tension QA.",
      isApproved: true,
      approvedBy: "Aradhya Administrator",
      approvedAt: new Date(),
      inventoryUpdated: true,
    },
    {
      employeeId: employeeUser.id,
      employeeName: employeeUser.name,
      productId: insertedProducts[1].id,
      productName: insertedProducts[1].name,
      productionDate: todayStr,
      quantityProduced: 300,
      remarks: "Batch #SM-201. Cloud waistband ultrasonic welding verified.",
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
      inventoryUpdated: false,
    },
    {
      employeeId: employeeUser.id,
      employeeName: employeeUser.name,
      productId: insertedProducts[4].id,
      productName: insertedProducts[4].name,
      productionDate: yesterday,
      quantityProduced: 500,
      remarks: "Batch #XL-818. Organic cotton surface inspection 100% clear.",
      isApproved: true,
      approvedBy: "Aradhya Administrator",
      approvedAt: new Date(Date.now() - 43200000),
      inventoryUpdated: true,
    },
  ]);

  // 7. Seed Customer Inquiries
  await db.insert(customerInquiries).values([
    {
      name: "Rohit Kulkarni",
      email: "rohit.pharmacy@gmail.com",
      phone: "+91 97654 32109",
      subject: "Wholesale dealership inquiry for Chemist Association",
      message: "We operate a chain of 14 medical stores in Pune and PCMC. Would like to stock Aradhya SoftCare baby diapers and sanitary pads. Please share catalog and trade margins.",
      status: "New",
      adminReply: null,
    },
    {
      name: "Sneha Patil",
      email: "sneha.p@outlook.com",
      phone: "+91 98901 23456",
      subject: "Maternity Pads sample request",
      message: "I am in my 8th month of pregnancy and wanted to inquire if Aradhya SoftCare Maternity pads are chlorine-free and suitable for sensitive skin. Thank you!",
      status: "Resolved",
      adminReply: "Dear Sneha, thank you for reaching out. Yes, our Maternity Care Maxi pads are 100% chlorine-free, unfragranced, and gynaecologically tested. We will be honored to assist you.",
    },
  ]);

  // 8. Seed Audit Logs
  await db.insert(auditLogs).values([
    {
      action: "SYSTEM_INITIALIZE",
      entity: "SYSTEM",
      entityId: "1",
      details: "Initial catalogue, products, categories, and company settings configured.",
      performedBy: "System Setup",
    },
  ]);

  return { message: "Database successfully seeded with realistic Aradhya SoftCare data!" };
}
