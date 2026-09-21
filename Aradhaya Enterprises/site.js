/* Aradhaya Enterprises — vanilla JS layer (no framework, no build needed)
   Public UI renders only: image, name, price, category.
   Stock / sales / low-stock data lives in memory and is rendered ONLY
   inside the PIN-authenticated Admin Console. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LOW_AT = 500;
const LS_KEY = "ae-overrides-v1";
const CATS = ["diapers", "pads", "liners", "maternity"];

/* ---------------- base catalogue (public fields + admin-only fields) ---------------- */
const BASE = [
  { id: "dp-s72", sku: "AH-DP-S72", cat: "diapers", name: "Baby Diapers – Tape Style S", badge: "72 Tabs • S · 4–8 kg", price: 649, mrp: 899, img: "https://images.pexels.com/photos/8909759/pexels-photo-8909759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 48720, sold: 14820 },
  { id: "dp-m62", sku: "AH-DP-M62", cat: "diapers", name: "Baby Pants M", badge: "62 Pants • M · 7–12 kg", price: 699, mrp: 949, img: "https://images.pexels.com/photos/5215559/pexels-photo-5215559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 31200, sold: 22140 },
  { id: "dp-l56", sku: "AH-DP-L56", cat: "diapers", name: "UltraDry L Pants", badge: "56 Pants • L · 9–14 kg", price: 729, mrp: 999, img: "https://images.pexels.com/photos/6393189/pexels-photo-6393189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 410, sold: 9370 },
  { id: "dp-xl48", sku: "AH-DP-XL48", cat: "diapers", name: "Premium XL Pants", badge: "48 Pants • XL · 12–17 kg", price: 799, mrp: 1099, img: "https://images.pexels.com/photos/14620499/pexels-photo-14620499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 18841, sold: 6120 },
  { id: "dp-xxl40", sku: "AH-DP-XXL40", cat: "diapers", name: "XXL Junior Pants", badge: "40 Pants • XXL · 15–25 kg", price: 849, mrp: 1149, img: "https://images.pexels.com/photos/5215539/pexels-photo-5215539.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 9715, sold: 4120 },
  { id: "sp-u30", sku: "AH-SP-U30", cat: "pads", name: "Ultra Thins – XL", badge: "30 Pads • 280mm", price: 299, mrp: 399, img: "https://images.pexels.com/photos/7692269/pexels-photo-7692269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 35840, sold: 18450 },
  { id: "sp-n18", sku: "AH-SP-N18", cat: "pads", name: "Night Long – XXL", badge: "18 Pads • 360mm", price: 279, mrp: 349, img: "https://images.pexels.com/photos/7692271/pexels-photo-7692271.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 12190, sold: 9410 },
  { id: "sp-h10", sku: "AH-SP-H10", cat: "pads", name: "Maxi Heavy Flow – XXXL", badge: "10 Pads • 420mm", price: 189, mrp: 249, img: "https://images.pexels.com/photos/7692457/pexels-photo-7692457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 220, sold: 5210 },
  { id: "pl-40", sku: "AH-PL-40", cat: "liners", name: "Daily Panty Liners", badge: "40 Liners • 155mm", price: 149, mrp: 199, img: "https://images.pexels.com/photos/7692473/pexels-photo-7692473.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 14120, sold: 4830 },
  { id: "pl-a20", sku: "AH-PL-A20", cat: "liners", name: "Active Liners Long", badge: "20 Liners • 180mm", price: 129, mrp: 169, img: "https://images.pexels.com/photos/7692333/pexels-photo-7692333.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 8230, sold: 2114 },
  { id: "mt-xl10", sku: "AH-MT-XL10", cat: "maternity", name: "Maternity Pads XL", badge: "10 Pads • 410mm", price: 349, mrp: 449, img: "https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 6220, sold: 3980 },
  { id: "mt-n8", sku: "AH-MT-N8", cat: "maternity", name: "Maternity Night Plus", badge: "8 Pads • 450mm", price: 299, mrp: 399, img: "https://images.pexels.com/photos/4504005/pexels-photo-4504005.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", stock: 3388, sold: 2675 },
];

/* ---------------- state + persistence ---------------- */
let overrides = {};
try { overrides = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { overrides = {}; }
const persist = () => localStorage.setItem(LS_KEY, JSON.stringify(overrides));

const state = new Map();
BASE.forEach((b) => state.set(b.id, { ...b, ...(overrides[b.id] || {}) }));

function setOverride(id, patch) {
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  persist();
}

/* ---------------- i18n ---------------- */
const I18N = {
  en: {
    "top.est": "Est. 2018", "top.iso": "ISO 22716 GMP", "top.made": "Made in Shamli, Uttar Pradesh",
    "nav.products": "Products", "nav.about": "Our story", "nav.contact": "Contact", "nav.admin": "Admin",
    "footer.tagline": "Baby & Women Care",
    "hero.badge": "Gentle care for what matters most", "hero.title1": "Aradhaya Enterprises", "hero.title2": "Baby & Women Care",
    "hero.caption": "happy baby in diaper. 12-hr dry. 0% fragrance.",
    "hero.para": "Pediatrician-tested baby diapers and dermatologically safe sanitary care, made in our own ISO-certified unit in Shamli, Uttar Pradesh.",
    "hero.cta1": "View products", "hero.cta2": "Contact us",
    "hero.check1": "12-hr dry comfort", "hero.check2": "0% chlorine bleach", "hero.check3": "ISO 22716 certified", "hero.check4": "COD Pan-India",
    "hero.catKicker": "Our range", "hero.catTitle": "Shop by category", "hero.skus": "SKUs", "hero.from": "from",
    "hero.catNote": "Ships across India, COD available",
    "inv.note": "Care line: +91 90000 12345 · Toll free 1800 000 0000",
    m1: "0% chlorine bleach", m2: "Pediatrician tested", m3: "pH 4.5 balanced topsheet", m4: "12-hr dry comfort",
    m5: "Dermatologically safe", m6: "COD Pan-India", m7: "Made in Shamli, UP",
    "prod.title": "Products", "prod.sub": "Every product with image, name, price and category.", "prod.search": "Search products…",
    "prod.all": "All", "prod.empty": "No products match your search.", "prod.clear": "Clear filters",
    "prod.enquire": "Enquire", "prod.save": "save", "prod.mrp": "MRP", "prod.units": "units",
    "cat.diapers": "Baby Diapers", "cat.pads": "Sanitary Pads", "cat.liners": "Panty Liners", "cat.maternity": "Maternity Pads",
    "desc.dp-s72": "Pediatrician co-designed tape diapers with CloudSoft core, wetness indicator and 0% fragrance.",
    "desc.dp-m62": "All-night pant diapers with 360° cottony waist and 5 sec absorb channels.",
    "desc.dp-l56": "Overnight pants with Night Lock™ and aloe liner – dermat tested.",
    "desc.dp-xl48": "Premium XL with 3D air pockets, thinner core, faster absorbency.",
    "desc.dp-xxl40": "Potty training toddler pants, easy tear sides, 12h night protection.",
    "desc.sp-u30": "Ultra-thin 2mm pad with CottonFeel™ top sheet, pH 4.5, 0% perfume.",
    "desc.sp-n18": "Heavy flow night pad, 360° leak protection, 8-hr lock.",
    "desc.sp-h10": "420mm maxi night pad with clinical cotton top.",
    "desc.pl-40": "Everyday 1mm breathable liner for discharge, individually wrapped.",
    "desc.pl-a20": "Active-fit long liner with odor control layer.",
    "desc.mt-xl10": "Hospital-grade postpartum pads, ultra soft cotton, sterile individually packed.",
    "desc.mt-n8": "450mm ultra-long pads for first postpartum nights.",
    "about.kicker": "Since 2018", "about.title": "Made in Shamli. Trusted across India.",
    "about.p1": "Aradhaya Enterprises began in 2018 as a two-line diaper unit in District Shamli, Uttar Pradesh. Today our ISO 22716 GMP-certified facility runs four lines — baby diapers, sanitary pads, panty liners and maternity pads — with an in-house lab that tests every batch for absorbency, leak-back and skin safety.",
    "about.p2": "We keep the formulation honest: 0% chlorine bleach and 0% fragrance in the baby line, pH 4.5 balanced topsheets for women's care, and FSC-sourced pulp throughout. Twelve SKUs ship to pharmacies, hospitals and homes across India — cash on delivery included.",
    "about.imgCap": "Line 3 assembly — CloudSoft™ core laying, Shamli unit.",
    "about.pt1t": "ISO 22716 GMP unit", "about.pt1d": "Hygiene-grade manufacturing with batch-level QC records and metal-free packing halls.",
    "about.pt2t": "In-house absorbency lab", "about.pt2d": "Every batch tested for 12-hr dryness, leak-back and wetness-indicator accuracy.",
    "about.pt3t": "Honest formulations", "about.pt3d": "0% chlorine bleach, 0% fragrance in the baby line; pH 4.5 topsheets for women's care.",
    "about.pt4t": "Pan-India distribution", "about.pt4d": "1,400+ pharmacy counters, 38 hospital suppliers and doorstep COD across 19,000 pincodes.",
    "about.tl": "Milestones",
    "about.tl1t": "First tape diaper line", "about.tl1d": "Unit commissioned in Shamli with 2 SKUs and a six-person crew.",
    "about.tl2t": "Women's care launch", "about.tl2d": "Sanitary pad & panty liner line added with pH-balanced topsheets.",
    "about.tl3t": "ISO 22716 certified", "about.tl3d": "GMP certification; in-house absorbency lab goes live.",
    "about.tl4t": "1 crore units sold", "about.tl4d": "Lifetime sales cross 1,00,00,000 units across India.",
    "about.tl5t": "12 SKUs, 4 categories", "about.tl5d": "Maternity range completes the basket; Aradhaya Enterprises serves 19,000 pincodes.",
    "contact.title": "Contact Aradhaya Enterprises", "contact.sub": "Reach us in under 12 minutes",
    "contact.name": "Your name *", "contact.mobile": "Mobile number *", "contact.email": "Email (optional)", "contact.message": "Message *",
    "contact.send": "Send inquiry", "contact.note": "Your inquiry reaches our care team directly. Care line: +91 90000 12345 (9am–9pm IST).",
    "contact.sentTitle": "Inquiry received", "contact.sentBody": "Our care team will reply in under 12 minutes (9am–9pm IST). Reference:",
    "contact.again": "Send another inquiry", "contact.errName": "Please enter your name",
    "contact.errMobile": "Enter a valid 10-digit mobile number", "contact.errMsg": "Please write a short message",
    "contact.infoTitle": "Contact information", "contact.phoneNote": "(demo number)", "contact.toll": "Toll free 1800 000 0000 (demo)",
    "contact.wholesale": "Wholesale:", "contact.address": "Aradhaya Enterprises, District Shamli, Uttar Pradesh, India",
    "contact.emailBtn": "Email", "contact.callBtn": "Call",
    "contact.dealerTitle": "Dealer / hospital inquiries",
    "contact.dealerBody": "We supply maternity hospital packs and pharmacy chains across India. MOQ 200 packs. Share your GST & city — our trade team replies in 1 business day.",
    "contact.drafted": "Inquiry drafted for",
    "footer.blurb": "Baby diapers, sanitary pads, panty liners and maternity pads — manufactured in Shamli, Uttar Pradesh and shipped across India.",
    "footer.links": "Explore", "footer.contactT": "Reach us", "footer.rights": "© 2026 Aradhaya Enterprises. All rights reserved.",
    "footer.tag": "ISO 22716 · Est. 2018 · Made in Shamli, Uttar Pradesh",
    "admin.title": "Admin console", "admin.sub": "Authenticated access: manage products, stock & sales. Changes publish to the website instantly.",
    "admin.pin": "Admin PIN", "admin.pinPh": "Enter 4-digit PIN", "admin.hint": "Demo PIN: 2018", "admin.unlock": "Unlock",
    "admin.wrong": "Incorrect PIN — try 2018", "admin.product": "Product", "admin.reset": "Reset defaults",
    "admin.tabProducts": "Manage Products", "admin.tabStock": "Stock & Sales",
    "admin.edit": "Edit", "admin.cancel": "Cancel", "admin.save": "Save changes", "admin.editing": "Editing",
    "admin.fName": "Product name", "admin.fPrice": "Price (₹)", "admin.fImage": "Image URL", "admin.fCat": "Category",
    "admin.fStock": "Stock", "admin.fSold": "Sold", "admin.saved": "Changes saved & published",
    "admin.fStockFull": "Stock quantity", "admin.fSoldFull": "Units sold",
    "inv.live": "Live inventory", "inv.title": "Stock & Sales", "inv.productsLive": "Products live", "inv.categories": "categories",
    "inv.available": "Units available", "inv.warehouse": "warehouse stock", "inv.sold": "Units sold", "inv.lifetime": "lifetime",
    "inv.low": "Low stock SKUs", "inv.auto": "auto-alerted",
    "stock.sellThrough": "Sell-through", "stock.availLegend": "Units available", "stock.soldLegend": "Units sold",
    "stock.alertsTitle": "Low stock alerts", "stock.alertsSub": "Any SKU below 500 units raises an auto-restock request to production.",
    "stock.restock": "Restock queued", "stock.healthy": "All other SKUs are above reorder level.",
  },
  hi: {
    "top.est": "स्था. 2018", "top.iso": "ISO 22716 GMP", "top.made": "शामली, उत्तर प्रदेश में निर्मित",
    "nav.products": "उत्पाद", "nav.about": "हमारी कहानी", "nav.contact": "संपर्क", "nav.admin": "एडमिन",
    "footer.tagline": "बेबी एंड वूमेन केयर",
    "hero.badge": "सबसे ज़रूरी के लिए कोमल देखभाल", "hero.title1": "Aradhaya Enterprises", "hero.title2": "बेबी एंड वूमेन केयर",
    "hero.caption": "डायपर में खुश शिशु। 12 घंटे सूखा। 0% फ़्रेगरेंस।",
    "hero.para": "पीडियाट्रिशियन-टेस्टेड बेबी डायपर और डर्मेटोलॉजिकली सुरक्षित सैनिटरी केयर, शामली, उत्तर प्रदेश के हमारे अपने ISO-प्रमाणित यूनिट में निर्मित।",
    "hero.cta1": "उत्पाद देखें", "hero.cta2": "संपर्क करें",
    "hero.check1": "12 घंटे सूखा आराम", "hero.check2": "0% क्लोरीन ब्लीच", "hero.check3": "ISO 22716 प्रमाणित", "hero.check4": "पूरे भारत में COD",
    "hero.catKicker": "हमारी रेंज", "hero.catTitle": "श्रेणी अनुसार खरीदें", "hero.skus": "SKU", "hero.from": "से शुरू",
    "hero.catNote": "पूरे भारत में शिपिंग, COD उपलब्ध",
    "inv.note": "केयर लाइन: +91 90000 12345 · टोल फ्री 1800 000 0000",
    m1: "0% क्लोरीन ब्लीच", m2: "पीडियाट्रिशियन टेस्टेड", m3: "pH 4.5 बैलेंस्ड टॉपशीट", m4: "12 घंटे सूखा आराम",
    m5: "डर्मेटोलॉजिकली सुरक्षित", m6: "पूरे भारत में COD", m7: "शामली, यूपी में निर्मित",
    "prod.title": "उत्पाद", "prod.sub": "प्रत्येक उत्पाद छवि, नाम, मूल्य और श्रेणी के साथ।", "prod.search": "उत्पाद खोजें…",
    "prod.all": "सभी", "prod.empty": "आपकी खोज से कोई उत्पाद मेल नहीं खाता।", "prod.clear": "फ़िल्टर हटाएँ",
    "prod.enquire": "पूछताछ", "prod.save": "बचत", "prod.mrp": "MRP", "prod.units": "यूनिट",
    "cat.diapers": "बेबी डायपर", "cat.pads": "सैनिटरी पैड", "cat.liners": "पैंटी लाइनर", "cat.maternity": "मैटर्निटी पैड",
    "desc.dp-s72": "क्लाउडसॉफ्ट कोर, वेटनेस इंडिकेटर और 0% फ़्रेगरेंस के साथ पीडियाट्रिशियन-को-डिज़ाइन्ड टेप डायपर।",
    "desc.dp-m62": "360° कॉटनी कमर और 5 सेकंड एब्सॉर्ब चैनल वाले ऑल-नाइट पैंट डायपर।",
    "desc.dp-l56": "नाइट लॉक™ और एलो लाइनर वाले ओवरनाइट पैंट्स – डर्मेट टेस्टेड।",
    "desc.dp-xl48": "3D एयर पॉकेट, पतले कोर और तेज़ अवशोषण के साथ प्रीमियम XL।",
    "desc.dp-xxl40": "पॉटी ट्रेनिंग टॉडलर पैंट्स, ईज़ी-टियर साइड, 12 घंटे नाइट प्रोटेक्शन।",
    "desc.sp-u30": "कॉटनफील™ टॉप शीट, pH 4.5, 0% परफ्यूम वाला अल्ट्रा-थिन 2mm पैड।",
    "desc.sp-n18": "हेवी फ्लो नाइट पैड, 360° लीक प्रोटेक्शन, 8 घंटे लॉक।",
    "desc.sp-h10": "क्लिनिकल कॉटन टॉप वाला 420mm मैक्सी नाइट पैड।",
    "desc.pl-40": "डिस्चार्ज के लिए रोज़मर्रा का 1mm ब्रीदेबल लाइनर, अलग-अलग पैक।",
    "desc.pl-a20": "ओडर कंट्रोल लेयर के साथ एक्टिव-फिट लॉन्ग लाइनर।",
    "desc.mt-xl10": "हॉस्पिटल-ग्रेड पोस्टपार्टम पैड, अल्ट्रा सॉफ्ट कॉटन, स्टराइल अलग पैकिंग।",
    "desc.mt-n8": "पहली पोस्टपार्टम रातों के लिए 450mm अल्ट्रा-लॉन्ग पैड।",
    "about.kicker": "2018 से", "about.title": "शामली में निर्मित। पूरे भारत में भरोसेमंद।",
    "about.p1": "अराधय एंटरप्राइजेज की शुरुआत 2018 में ज़िला शामली, उत्तर प्रदेश की दो-लाइन डायपर यूनिट के रूप में हुई। आज हमारी ISO 22716 GMP-प्रमाणित सुविधा में चार लाइनें चलती हैं — बेबी डायपर, सैनिटरी पैड, पैंटी लाइनर और मैटर्निटी पैड — और इन-हाउस लैब हर बैच की अवशोषण, लीक-बैक और स्किन सेफ्टी जाँचती है।",
    "about.p2": "हम फ़ॉर्मूलेशन ईमानदार रखते हैं: बेबी लाइन में 0% क्लोरीन ब्लीच और 0% फ़्रेगरेंस, वूमेन केयर के लिए pH 4.5 बैलेंस्ड टॉपशीट, और हर जगह FSC-सोर्स्ड पल्प। बारह SKU पूरे भारत में फार्मेसी, अस्पतालों और घरों तक पहुँचते हैं — कैश ऑन डिलीवरी सहित।",
    "about.imgCap": "लाइन 3 असेंबली — CloudSoft™ कोर लेइंग, शामली यूनिट।",
    "about.pt1t": "ISO 22716 GMP यूनिट", "about.pt1d": "बैच-स्तर QC रिकॉर्ड और मेटल-फ्री पैकिंग हॉल के साथ हाइजीन-ग्रेड उत्पादन।",
    "about.pt2t": "इन-हाउस अवशोषण लैब", "about.pt2d": "हर बैच की 12 घंटे की ड्राइनेस, लीक-बैक और वेटनेस-इंडिकेटर सटीकता के लिए जाँच।",
    "about.pt3t": "ईमानदार फ़ॉर्मूलेशन", "about.pt3d": "बेबी लाइन में 0% क्लोरीन ब्लीच, 0% फ़्रेगरेंस; वूमेन केयर के लिए pH 4.5 टॉपशीट।",
    "about.pt4t": "पूरे भारत में वितरण", "about.pt4d": "1,400+ फार्मेसी काउंटर, 38 अस्पताल सप्लायर और 19,000 पिनकोड पर डोरस्टेप COD।",
    "about.tl": "मील के पत्थर",
    "about.tl1t": "पहली टेप डायपर लाइन", "about.tl1d": "शामली में 2 SKU और छह लोगों की टीम के साथ यूनिट शुरू।",
    "about.tl2t": "वूमेन केयर लॉन्च", "about.tl2d": "pH-बैलेंस्ड टॉपशीट के साथ सैनिटरी पैड और पैंटी लाइनर लाइन।",
    "about.tl3t": "ISO 22716 प्रमाणित", "about.tl3d": "GMP प्रमाणन; इन-हाउस अवशोषण लैब शुरू।",
    "about.tl4t": "1 करोड़ यूनिट बिकीं", "about.tl4d": "लाइफटाइम बिक्री पूरे भारत में 1,00,00,000 यूनिट पार।",
    "about.tl5t": "12 SKU, 4 श्रेणियाँ", "about.tl5d": "मैटर्निटी रेंज के साथ बास्केट पूर्ण; Aradhaya Enterprises 19,000 पिनकोड की सेवा करता है।",
    "contact.title": "Aradhaya Enterprises से संपर्क करें", "contact.sub": "12 मिनट से कम में हमसे जुड़ें",
    "contact.name": "आपका नाम *", "contact.mobile": "मोबाइल नंबर *", "contact.email": "ईमेल (वैकल्पिक)", "contact.message": "संदेश *",
    "contact.send": "पूछताछ भेजें", "contact.note": "आपकी पूछताछ सीधे हमारी केयर टीम तक पहुँचती है। केयर लाइन: +91 90000 12345 (सुबह 9–रात 9 IST)।",
    "contact.sentTitle": "पूछताछ प्राप्त हुई", "contact.sentBody": "हमारी केयर टीम 12 मिनट से कम में जवाब देगी (सुबह 9–रात 9 IST)। संदर्भ:",
    "contact.again": "एक और पूछताछ भेजें", "contact.errName": "कृपया अपना नाम दर्ज करें",
    "contact.errMobile": "मान्य 10-अंकीय मोबाइल नंबर दर्ज करें", "contact.errMsg": "कृपया छोटा संदेश लिखें",
    "contact.infoTitle": "संपर्क जानकारी", "contact.phoneNote": "(डेमो नंबर)", "contact.toll": "टोल फ्री 1800 000 0000 (डेमो)",
    "contact.wholesale": "थोक विक्री:", "contact.address": "अराधय एंटरप्राइजेज, ज़िला शामली, उत्तर प्रदेश, भारत",
    "contact.emailBtn": "ईमेल", "contact.callBtn": "कॉल",
    "contact.dealerTitle": "डीलर / अस्पताल पूछताछ",
    "contact.dealerBody": "हम पूरे भारत में मैटर्निटी हॉस्पिटल पैक और फार्मेसी चेन की आपूर्ति करते हैं। MOQ 200 पैक। अपना GST और शहर साझा करें — हमारी ट्रेड टीम 1 कार्यदिवस में जवाब देती है।",
    "contact.drafted": "पूछताछ तैयार की गई:",
    "footer.blurb": "बेबी डायपर, सैनिटरी पैड, पैंटी लाइनर और मैटर्निटी पैड — शामली, उत्तर प्रदेश में निर्मित और पूरे भारत में भेजे जाते हैं।",
    "footer.links": "देखें", "footer.contactT": "हमसे जुड़ें", "footer.rights": "© 2026 अराधय एंटरप्राइजेज. सर्वाधिकार सुरक्षित।",
    "footer.tag": "ISO 22716 · स्था. 2018 · शामली, उत्तर प्रदेश में निर्मित",
    "admin.title": "एडमिन कंसोल", "admin.sub": "प्रमाणित पहुँच: उत्पाद, स्टॉक और बिक्री प्रबंधित करें। परिवर्तन तुरंत वेबसाइट पर प्रकाशित होते हैं।",
    "admin.pin": "एडमिन PIN", "admin.pinPh": "4-अंकीय PIN दर्ज करें", "admin.hint": "डेमो PIN: 2018", "admin.unlock": "अनलॉक",
    "admin.wrong": "गलत PIN — 2018 आज़माएँ", "admin.product": "उत्पाद", "admin.reset": "डिफ़ॉल्ट रीसेट",
    "admin.tabProducts": "उत्पाद प्रबंधन", "admin.tabStock": "स्टॉक और बिक्री",
    "admin.edit": "एडिट", "admin.cancel": "रद्द करें", "admin.save": "परिवर्तन सहेजें", "admin.editing": "संपादन:",
    "admin.fName": "उत्पाद का नाम", "admin.fPrice": "मूल्य (₹)", "admin.fImage": "छवि URL", "admin.fCat": "श्रेणी",
    "admin.fStock": "स्टॉक", "admin.fSold": "बिक्री", "admin.saved": "परिवर्तन सहेजे और प्रकाशित",
    "admin.fStockFull": "स्टॉक मात्रा", "admin.fSoldFull": "बिकी यूनिट",
    "inv.live": "लाइव इन्वेंटरी", "inv.title": "स्टॉक और बिक्री", "inv.productsLive": "लाइव उत्पाद", "inv.categories": "श्रेणियाँ",
    "inv.available": "उपलब्ध यूनिट", "inv.warehouse": "वेयरहाउस स्टॉक", "inv.sold": "बिकी यूनिट", "inv.lifetime": "लाइफटाइम",
    "inv.low": "लो स्टॉक SKU", "inv.auto": "ऑटो-अलर्ट",
    "stock.sellThrough": "सेल-थ्रू", "stock.availLegend": "उपलब्ध यूनिट", "stock.soldLegend": "बिकी यूनिट",
    "stock.alertsTitle": "लो स्टॉक अलर्ट", "stock.alertsSub": "500 यूनिट से कम वाला हर SKU उत्पादन को ऑटो-रेस्टॉक अनुरोध भेजता है।",
    "stock.restock": "रेस्टॉक कतार में", "stock.healthy": "बाकी सभी SKU रीऑर्डर लेवल से ऊपर हैं।",
  },
};

let lang = localStorage.getItem("ae-lang") === "hi" ? "hi" : "en";
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const catLabel = (id) => t(`cat.${id}`);

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $("#langEn").classList.toggle("active", lang === "en");
  $("#langHi").classList.toggle("active", lang === "hi");
  $$("#eCat option").forEach((o) => { o.textContent = catLabel(o.value); });
  if (adminUnlocked) { buildRows(); renderDash(); adminTotals(); }
  if (draftProduct) showDraftNote(draftProduct);
}

/* ---------------- public rendering ---------------- */
function patchCard(s) {
  const el = $(`.card[data-id="${s.id}"]`);
  if (!el) return;
  el.dataset.cat = s.cat;
  el.querySelector(".pname").textContent = s.name;
  el.querySelector(".js-enquire").dataset.name = s.name;
  el.querySelector(".price").textContent = `₹${fmt(s.price)}`;
  const save = s.mrp - s.price;
  const saveEl = el.querySelector(".save");
  if (saveEl) {
    saveEl.classList.toggle("hidden", save <= 0);
    const jsSave = saveEl.querySelector(".js-save");
    if (jsSave) jsSave.textContent = `₹${fmt(save)}`;
  }
  const img = el.querySelector(".card-media img");
  img.src = s.img;
  const catEl = el.querySelector(".cat");
  catEl.dataset.i18n = `cat.${s.cat}`;
  catEl.textContent = catLabel(s.cat);
  el.dataset.search = `${s.name} ${s.badge} ${I18N.en[`cat.${s.cat}`]} ${I18N.hi[`cat.${s.cat}`]}`.toLowerCase();
}

function updateCounts() {
  const counts = { all: state.size };
  CATS.forEach((c) => (counts[c] = 0));
  const mins = {};
  state.forEach((s) => {
    counts[s.cat] = (counts[s.cat] || 0) + 1;
    mins[s.cat] = Math.min(mins[s.cat] ?? Infinity, s.price);
  });
  $$("[data-cat-count]").forEach((el) => { el.textContent = counts[el.dataset.catCount] ?? 0; });
  $$("[data-cat-from]").forEach((el) => { el.textContent = `₹${fmt(mins[el.dataset.catFrom] || 0)}`; });
}

const patchAll = () => state.forEach(patchCard);

/* ---------------- filtering ---------------- */
let activeCat = "all";
function applyFilter() {
  const q = ($("#searchInput").value || "").trim().toLowerCase();
  let visible = 0;
  $$(".card").forEach((c) => {
    const okCat = activeCat === "all" || c.dataset.cat === activeCat;
    const okQ = !q || c.dataset.search.includes(q) || c.querySelector(".pname").textContent.toLowerCase().includes(q);
    const show = okCat && okQ;
    c.style.display = show ? "" : "none";
    if (show) visible += 1;
  });
  $("#emptyState").classList.toggle("hidden", visible > 0);
}
function setCategory(cat) {
  activeCat = cat;
  $$("#chips .chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === cat));
  applyFilter();
}

/* ---------------- enquiry + contact form ---------------- */
let draftProduct = null;
function showDraftNote(name) {
  const note = $("#draftNote");
  note.textContent = `${t("contact.drafted")} ${name}`;
  note.classList.remove("hidden");
}
function enquire(name, sku) {
  const msg =
    lang === "hi"
      ? `नमस्ते अराधय टीम, मुझे ${name} (SKU ${sku}) के बारे में पूछताछ करनी है। कृपया मेरे शहर के लिए थोक मूल्य और डिलीवरी समय बताएँ।`
      : `Hello Aradhaya team, I would like to enquire about ${name} (SKU ${sku}). Please share bulk pricing and delivery time for my city.`;
  $("#fMessage").value = msg;
  $("#successBox").classList.add("hidden");
  $("#contactForm").classList.remove("hidden");
  draftProduct = name;
  showDraftNote(name);
  const card = $("#formCard");
  card.classList.remove("flash-ring");
  void card.offsetWidth;
  card.classList.add("flash-ring");
  document.getElementById("contact").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  setTimeout(() => $("#fMessage").focus({ preventScroll: true }), reduced ? 0 : 450);
}

function initForm() {
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fName"), mobile = $("#fMobile"), message = $("#fMessage");
    let ok = true;
    const mark = (input, errId, valid) => {
      input.classList.toggle("invalid", !valid);
      $(errId).classList.toggle("hidden", valid);
      if (!valid) ok = false;
    };
    mark(name, "#errName", name.value.trim().length >= 2);
    mark(mobile, "#errMobile", /^[6-9]\d{9}$/.test(mobile.value.replace(/\s/g, "")));
    mark(message, "#errMsg", message.value.trim().length >= 8);
    if (!ok) return;
    $("#refId").textContent = `AE-${String(Date.now()).slice(-6)}`;
    form.classList.add("hidden");
    $("#successBox").classList.remove("hidden");
    draftProduct = null;
    $("#draftNote").classList.add("hidden");
    name.value = mobile.value = message.value = $("#fEmail").value = "";
  });
  $("#againBtn").addEventListener("click", () => {
    $("#successBox").classList.add("hidden");
    form.classList.remove("hidden");
  });
}

/* ---------------- admin console ---------------- */
let adminUnlocked = false;
let editingId = null;

function totals() {
  let stock = 0, sold = 0, low = 0;
  state.forEach((s) => { stock += s.stock; sold += s.sold; if (s.stock < LOW_AT) low += 1; });
  return { stock, sold, low };
}

function buildRows() {
  const tbody = $("#adminRows");
  tbody.innerHTML = "";
  state.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td><span class="row-line"><img class="thumb" src="${s.img}" alt="" /><span><b>${s.name}</b><span class="mono">SKU ${s.sku}</span></span></span></td>` +
      `<td>${catLabel(s.cat)}</td>` +
      `<td class="num">₹${fmt(s.price)}</td>` +
      `<td class="num">${fmt(s.stock)}</td>` +
      `<td class="num">${fmt(s.sold)}</td>` +
      `<td class="num"><button class="btn btn-clay js-edit" type="button" data-id="${s.id}">${t("admin.edit")}</button></td>`;
    tbody.appendChild(tr);
  });
  $$(".js-edit", tbody).forEach((b) => b.addEventListener("click", () => openEditor(b.dataset.id)));
}

function openEditor(id) {
  const s = state.get(id);
  editingId = id;
  $("#editName").textContent = s.name;
  $("#eName").value = s.name;
  $("#ePrice").value = s.price;
  $("#eImage").value = s.img;
  $("#eCat").value = s.cat;
  $("#eStock").value = s.stock;
  $("#eSold").value = s.sold;
  $("#saveNote").classList.add("hidden");
  $("#editForm").classList.remove("hidden");
  $("#eName").focus();
}

function saveEditor(e) {
  e.preventDefault();
  if (!editingId) return;
  const s = state.get(editingId);
  const patch = {
    name: $("#eName").value.trim() || s.name,
    price: Math.max(0, parseInt($("#ePrice").value.replace(/\D/g, ""), 10) || 0),
    img: $("#eImage").value.trim() || s.img,
    cat: $("#eCat").value,
    stock: Math.max(0, parseInt($("#eStock").value.replace(/\D/g, ""), 10) || 0),
    sold: Math.max(0, parseInt($("#eSold").value.replace(/\D/g, ""), 10) || 0),
  };
  Object.assign(s, patch);
  setOverride(s.id, patch);
  patchCard(s);
  updateCounts();
  applyFilter();
  buildRows();
  renderDash();
  adminTotals();
  $("#editName").textContent = s.name;
  const note = $("#saveNote");
  note.classList.remove("hidden");
  setTimeout(() => note.classList.add("hidden"), 2200);
}

function renderDash() {
  const { stock, sold, low } = totals();
  const sell = ((sold / (sold + stock)) * 100).toFixed(1);
  $("#dashStats").innerHTML = `
    <div class="tile tile-peach"><p class="tile-label">${t("inv.productsLive")}</p><p class="tile-value">${state.size}</p><p class="tile-sub">4 ${t("inv.categories")}</p></div>
    <div class="tile tile-leaf"><p class="tile-label">${t("inv.available")}</p><p class="tile-value leaf-t">${fmt(stock)}</p><p class="tile-sub">${t("inv.warehouse")}</p></div>
    <div class="tile tile-parch"><p class="tile-label">${t("inv.sold")}</p><p class="tile-value rust-t">${fmt(sold)}</p><p class="tile-sub">${t("inv.lifetime")}</p></div>
    <div class="tile tile-alert"><p class="tile-label">${t("inv.low")}</p><p class="tile-value alert-t">${low}</p><p class="tile-sub">${t("inv.auto")}</p></div>
    <div class="tile tile-peach wide"><p class="tile-label">${t("stock.sellThrough")}</p><p class="tile-value">${sell}%</p><p class="tile-sub">${t("stock.soldLegend")} / (${t("stock.soldLegend")} + ${t("stock.availLegend")})</p></div>`;

  const sums = CATS.map((c) => {
    let a = 0, b = 0;
    state.forEach((s) => { if (s.cat === c) { a += s.stock; b += s.sold; } });
    return { c, a, b };
  });
  const max = Math.max(...sums.map((x) => x.a), 1);
  $("#dashBars").innerHTML =
    `<div class="legend"><span><i class="sw sw-sand"></i>${t("stock.availLegend")}</span><span><i class="sw sw-rust"></i>${t("stock.soldLegend")}</span></div>` +
    sums
      .map(
        (x) => `<div class="bar-row">
          <div class="bar-top"><p class="bar-name">${catLabel(x.c)}</p><p class="bar-nums">${fmt(x.a)} · ${fmt(x.b)}</p></div>
          <div class="bar-track"><div class="bar-fill sand" style="width:${(x.a / max) * 100}%"></div></div>
          <div class="bar-track"><div class="bar-fill rust" style="width:${(x.b / max) * 100}%"></div></div>
        </div>`
      )
      .join("");

  const lows = [...state.values()].filter((s) => s.stock < LOW_AT);
  $("#dashAlerts").innerHTML =
    `<p class="kicker alert-kicker">${t("stock.alertsTitle")}</p><p class="panel-sub">${t("stock.alertsSub")}</p>` +
    (lows.length
      ? `<ul class="alert-list">` +
        lows
          .map(
            (s) => `<li class="alert-item">
              <div class="alert-top"><p>${s.name}<span class="mono">SKU ${s.sku}</span></p><p class="alert-num">${fmt(s.stock)}</p></div>
              <div class="alert-bottom"><span>${t("prod.units")}</span><span class="restock-pill"><span class="pulse-dot"></span>${t("stock.restock")}</span></div>
            </li>`
          )
          .join("") +
        `</ul>`
      : `<p class="alert-ok"><span class="tick">✓</span>${t("stock.healthy")}</p>`);
}

function adminTotals() {
  const { stock, sold } = totals();
  $("#adminTotals").innerHTML =
    `${t("stock.availLegend")}: <b class="leaf-t">${fmt(stock)}</b> · ${t("stock.soldLegend")}: <b class="rust-t">${fmt(sold)}</b>`;
}

function initAdmin() {
  const modal = $("#adminModal");
  const open = () => { modal.classList.remove("hidden"); setTimeout(() => $("#pinInput").focus(), 50); };
  const close = () => modal.classList.add("hidden");
  $("#adminOpen").addEventListener("click", open);
  $("#adminOpenMobile").addEventListener("click", () => { $("#drawer").classList.remove("open"); open(); });
  $("#adminClose").addEventListener("click", close);
  $("#adminCloseBtn").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  $("#pinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#pinInput").value.trim() === "2018") {
      adminUnlocked = true;
      $("#pinForm").classList.add("hidden");
      $("#pinErr").classList.add("hidden");
      $("#adminBody").classList.remove("hidden");
      buildRows(); renderDash(); adminTotals();
    } else {
      $("#pinErr").classList.remove("hidden");
      const panel = $("#modalPanel");
      panel.classList.remove("shake");
      void panel.offsetWidth;
      panel.classList.add("shake");
    }
  });

  $("#tabProductsBtn").addEventListener("click", () => {
    $("#tabProductsBtn").classList.add("active");
    $("#tabStockBtn").classList.remove("active");
    $("#panelProducts").classList.remove("hidden");
    $("#panelStock").classList.add("hidden");
  });
  $("#tabStockBtn").addEventListener("click", () => {
    $("#tabStockBtn").classList.add("active");
    $("#tabProductsBtn").classList.remove("active");
    $("#panelStock").classList.remove("hidden");
    $("#panelProducts").classList.add("hidden");
    renderDash();
  });

  $("#editForm").addEventListener("submit", saveEditor);
  $("#editCancel").addEventListener("click", () => {
    editingId = null;
    $("#editForm").classList.add("hidden");
  });

  $("#resetBtn").addEventListener("click", () => {
    overrides = {};
    localStorage.removeItem(LS_KEY);
    BASE.forEach((b) => state.set(b.id, { ...b }));
    patchAll(); updateCounts(); applyFilter();
    if (adminUnlocked) { buildRows(); renderDash(); adminTotals(); if (editingId) openEditor(editingId); }
  });
}

/* ---------------- motion ---------------- */
function initMotion() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  $$(".reveal").forEach((el) => (reduced ? el.classList.add("is-in") : io.observe(el)));
}

/* ---------------- boot ---------------- */
function init() {
  patchAll();
  updateCounts();
  applyLang();
  initMotion();
  applyFilter();
  initForm();
  initAdmin();

  $("#searchInput").addEventListener("input", applyFilter);
  $$("#chips .chip").forEach((chip) => chip.addEventListener("click", () => setCategory(chip.dataset.cat)));
  $("#clearFilters").addEventListener("click", () => { $("#searchInput").value = ""; setCategory("all"); });
  $$(".cat-row").forEach((btn) =>
    btn.addEventListener("click", () => {
      setCategory(btn.dataset.cat);
      document.getElementById("products").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    })
  );
  $$(".js-enquire").forEach((btn) => btn.addEventListener("click", () => enquire(btn.dataset.name, btn.dataset.sku)));

  $("#langEn").addEventListener("click", () => { lang = "en"; localStorage.setItem("ae-lang", lang); applyLang(); });
  $("#langHi").addEventListener("click", () => { lang = "hi"; localStorage.setItem("ae-lang", lang); applyLang(); });

  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const drawer = $("#drawer");
  $("#menuBtn").addEventListener("click", () => {
    const openNow = drawer.classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(openNow));
  });
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => drawer.classList.remove("open")));
}

init();
