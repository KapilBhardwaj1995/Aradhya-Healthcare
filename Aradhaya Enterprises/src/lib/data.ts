export type CatId = "diapers" | "pads" | "liners" | "maternity";
export type Lang = "en" | "hi";

export interface Product {
  id: string;
  sku: string;
  cat: CatId;
  name: string;
  badge: string;
  rating: number;
  desc: Record<Lang, string>;
  stock: number;
  sold: number;
  price: number;
  mrp: number;
  img: string;
  alt: string;
}

export const CATEGORIES: { id: CatId; label: Record<Lang, string> }[] = [
  { id: "diapers", label: { en: "Baby Diapers", hi: "बेबी डायपर" } },
  { id: "pads", label: { en: "Sanitary Pads", hi: "सैनिटरी पैड" } },
  { id: "liners", label: { en: "Panty Liners", hi: "पैंटी लाइनर" } },
  { id: "maternity", label: { en: "Maternity Pads", hi: "मैटर्निटी पैड" } },
];

export const LOW_STOCK_AT = 500;

export const PRODUCTS: Product[] = [
  {
    id: "dp-s72",
    sku: "AH-DP-S72",
    cat: "diapers",
    name: "Aradhya Baby Diapers – Tape Style S",
    badge: "72 Tabs • S · 4–8 kg",
    rating: 4.7,
    desc: {
      en: "Pediatrician co-designed tape diapers with CloudSoft core, wetness indicator and 0% fragrance.",
      hi: "क्लाउडसॉफ्ट कोर, वेटनेस इंडिकेटर और 0% फ़्रेगरेंस के साथ पीडियाट्रिशियन-को-डिज़ाइन्ड टेप डायपर।",
    },
    stock: 48720,
    sold: 14820,
    price: 649,
    mrp: 899,
    img: "https://images.pexels.com/photos/8909759/pexels-photo-8909759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Baby resting comfortably in a soft diaper",
  },
  {
    id: "dp-m62",
    sku: "AH-DP-M62",
    cat: "diapers",
    name: "Aradhya Baby Pants M",
    badge: "62 Pants • M · 7–12 kg",
    rating: 4.8,
    desc: {
      en: "All-night pant diapers with 360° cottony waist and 5 sec absorb channels.",
      hi: "360° कॉटनी कमर और 5 सेकंड एब्सॉर्ब चैनल वाले ऑल-नाइट पैंट डायपर।",
    },
    stock: 31200,
    sold: 22140,
    price: 699,
    mrp: 949,
    img: "https://images.pexels.com/photos/5215559/pexels-photo-5215559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Joyful baby in diaper stretching on a white bed",
  },
  {
    id: "dp-l56",
    sku: "AH-DP-L56",
    cat: "diapers",
    name: "Aradhya UltraDry L Pants",
    badge: "56 Pants • L · 9–14 kg",
    rating: 4.6,
    desc: {
      en: "Overnight pants with Night Lock™ and aloe liner – dermat tested.",
      hi: "नाइट लॉक™ और एलो लाइनर वाले ओवरनाइट पैंट्स – डर्मेट टेस्टेड।",
    },
    stock: 410,
    sold: 9370,
    price: 729,
    mrp: 999,
    img: "https://images.pexels.com/photos/6393189/pexels-photo-6393189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Infant in diaper lying on a soft sheet",
  },
  {
    id: "dp-xl48",
    sku: "AH-DP-XL48",
    cat: "diapers",
    name: "Aradhya Premium XL Pants",
    badge: "48 Pants • XL · 12–17 kg",
    rating: 4.7,
    desc: {
      en: "Premium XL with 3D air pockets, thinner core, faster absorbency.",
      hi: "3D एयर पॉकेट, पतले कोर और तेज़ अवशोषण के साथ प्रीमियम XL।",
    },
    stock: 18841,
    sold: 6120,
    price: 799,
    mrp: 1099,
    img: "https://images.pexels.com/photos/14620499/pexels-photo-14620499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Baby legs in a diaper on a comfortable bed",
  },
  {
    id: "dp-xxl40",
    sku: "AH-DP-XXL40",
    cat: "diapers",
    name: "Aradhya XXL Junior Pants",
    badge: "40 Pants • XXL · 15–25 kg",
    rating: 4.6,
    desc: {
      en: "Potty training toddler pants, easy tear sides, 12h night protection.",
      hi: "पॉटी ट्रेनिंग टॉडलर पैंट्स, ईज़ी-टियर साइड, 12 घंटे नाइट प्रोटेक्शन।",
    },
    stock: 9715,
    sold: 4120,
    price: 849,
    mrp: 1149,
    img: "https://images.pexels.com/photos/5215539/pexels-photo-5215539.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Toddler sitting happily on a bed wearing diaper pants",
  },
  {
    id: "sp-u30",
    sku: "AH-SP-U30",
    cat: "pads",
    name: "Aradhya Ultra Thins – XL",
    badge: "30 Pads • 280mm",
    rating: 4.9,
    desc: {
      en: "Ultra-thin 2mm pad with CottonFeel™ top sheet, pH 4.5, 0% perfume.",
      hi: "कॉटनफील™ टॉप शीट, pH 4.5, 0% परफ्यूम वाला अल्ट्रा-थिन 2mm पैड।",
    },
    stock: 35840,
    sold: 18450,
    price: 299,
    mrp: 399,
    img: "https://images.pexels.com/photos/7692269/pexels-photo-7692269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Overhead shot of sanitary pads on light pink background",
  },
  {
    id: "sp-n18",
    sku: "AH-SP-N18",
    cat: "pads",
    name: "Aradhya Night Long – XXL",
    badge: "18 Pads • 360mm",
    rating: 4.8,
    desc: {
      en: "Heavy flow night pad, 360° leak protection, 8-hr lock.",
      hi: "हेवी फ्लो नाइट पैड, 360° लीक प्रोटेक्शन, 8 घंटे लॉक।",
    },
    stock: 12190,
    sold: 9410,
    price: 279,
    mrp: 349,
    img: "https://images.pexels.com/photos/7692271/pexels-photo-7692271.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "White sanitary pads on a soft pastel pink surface",
  },
  {
    id: "sp-h10",
    sku: "AH-SP-H10",
    cat: "pads",
    name: "Aradhya Maxi Heavy Flow – XXXL",
    badge: "10 Pads • 420mm",
    rating: 4.7,
    desc: {
      en: "420mm maxi night pad with clinical cotton top.",
      hi: "क्लिनिकल कॉटन टॉप वाला 420mm मैक्सी नाइट पैड।",
    },
    stock: 220,
    sold: 5210,
    price: 189,
    mrp: 249,
    img: "https://images.pexels.com/photos/7692457/pexels-photo-7692457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Close-up of sanitary napkins on pastel pink background",
  },
  {
    id: "pl-40",
    sku: "AH-PL-40",
    cat: "liners",
    name: "Aradhya Daily Panty Liners",
    badge: "40 Liners • 155mm",
    rating: 4.5,
    desc: {
      en: "Everyday 1mm breathable liner for discharge, individually wrapped.",
      hi: "डिस्चार्ज के लिए रोज़मर्रा का 1mm ब्रीदेबल लाइनर, अलग-अलग पैक।",
    },
    stock: 14120,
    sold: 4830,
    price: 149,
    mrp: 199,
    img: "https://images.pexels.com/photos/7692473/pexels-photo-7692473.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "A thin white panty liner on pink background",
  },
  {
    id: "pl-a20",
    sku: "AH-PL-A20",
    cat: "liners",
    name: "Aradhya Active Liners Long",
    badge: "20 Liners • 180mm",
    rating: 4.4,
    desc: {
      en: "Active-fit long liner with odor control layer.",
      hi: "ओडर कंट्रोल लेयर के साथ एक्टिव-फिट लॉन्ग लाइनर।",
    },
    stock: 8230,
    sold: 2114,
    price: 129,
    mrp: 169,
    img: "https://images.pexels.com/photos/7692333/pexels-photo-7692333.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "High-angle close-up of a long liner on pink surface",
  },
  {
    id: "mt-xl10",
    sku: "AH-MT-XL10",
    cat: "maternity",
    name: "Aradhya Maternity Pads XL",
    badge: "10 Pads • 410mm",
    rating: 4.9,
    desc: {
      en: "Hospital-grade postpartum pads, ultra soft cotton, sterile individually packed.",
      hi: "हॉस्पिटल-ग्रेड पोस्टपार्टम पैड, अल्ट्रा सॉफ्ट कॉटन, स्टराइल अलग पैकिंग।",
    },
    stock: 6220,
    sold: 3980,
    price: 349,
    mrp: 449,
    img: "https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Mother gently holding newborn baby in hospital setting",
  },
  {
    id: "mt-n8",
    sku: "AH-MT-N8",
    cat: "maternity",
    name: "Aradhya Maternity Night Plus",
    badge: "8 Pads • 450mm",
    rating: 4.8,
    desc: {
      en: "450mm ultra-long pads for first postpartum nights.",
      hi: "पहली पोस्टपार्टम रातों के लिए 450mm अल्ट्रा-लॉन्ग पैड।",
    },
    stock: 3388,
    sold: 2675,
    price: 299,
    mrp: 399,
    img: "https://images.pexels.com/photos/4504005/pexels-photo-4504005.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Newborn baby peacefully sleeping on mother's chest",
  },
];

export const HERO_IMG =
  "https://images.pexels.com/photos/32386175/pexels-photo-32386175.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
export const ABOUT_IMG =
  "https://images.pexels.com/photos/6209543/pexels-photo-6209543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
export const ABOUT_IMG_2 =
  "https://images.pexels.com/photos/7692322/pexels-photo-7692322.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export const CONTACT = {
  phone: "+91 90000 12345",
  phoneHref: "tel:+919000012345",
  toll: "1800 000 0000",
  email: "care@aradhyahealthcare.in",
  wholesale: "distributors@aradhyahealthcare.in",
  address: {
    en: "Aradhya Healthcare Pvt. Ltd., District Shamli, Uttar Pradesh, India",
    hi: "अराध्या हेल्थकेयर प्रा. लि., ज़िला शामली, उत्तर प्रदेश, भारत",
  },
};

export const inr = (n: number) => new Intl.NumberFormat("en-IN").format(n);
