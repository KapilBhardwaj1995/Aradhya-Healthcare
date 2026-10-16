"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

export interface Translations {
  // Brand
  brandName: string;
  brandSub: string;
  tagline: string;
  address: string;
  phoneDemo: string;
  tollFreeDemo: string;
  emailCare: string;
  emailWholesale: string;

  // Nav
  navHome: string;
  navProducts: string;
  navBabyCare: string;
  navSanitaryPads: string;
  navPantyLiners: string;
  navMaternityCare: string;
  navAboutUs: string;
  navContactUs: string;
  navAdmin: string;
  navAdminPortal: string;
  navLogin: string;
  navRegister: string;
  navTrackRequest: string;
  navMyAccount: string;
  navSignOut: string;
  searchPlaceholder: string;
  searchBtn: string;
  bannerNotice: string;
  directModelNotice: string;

  // Hero
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroSubtitle: string;
  btnExploreProducts: string;
  btnContactUs: string;
  trustSkinSafe: string;
  trustSkinSafeSub: string;
  trustJapaneseCore: string;
  trustJapaneseCoreSub: string;
  trustDirect: string;
  trustDirectSub: string;
  heroFloatingTitle: string;
  heroFloatingSub: string;
  btnViewAll: string;

  // Categories
  secCategoriesTag: string;
  secCategoriesTitle: string;
  secCategoriesDesc: string;
  btnViewProducts: string;
  catBabyDiapers: string;
  catSanitaryPads: string;
  catPantyLiners: string;
  catMaternityPads: string;

  // Products
  secFeaturedTag: string;
  secFeaturedTitle: string;
  secFeaturedDesc: string;
  btnFullCatalog: string;
  btnDetails: string;
  btnOrderRequest: string;
  badgeDiscount: string;
  badgeSave: string;
  factoryRate: string;
  allFactoryRates: string;

  // How it works
  secProcessTag: string;
  secProcessTitle: string;
  secProcessDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Quality Standards
  secQualityTag: string;
  secQualityTitle: string;
  secQualityDesc: string;
  qualPurity1: string;
  qualPurity2: string;
  qualPurity3: string;
  statChlorine: string;
  statChlorineSub: string;
  statDryLock: string;
  statDryLockSub: string;
  statDyes: string;
  statDyesSub: string;
  statDirect: string;
  statDirectSub: string;

  // Product Filter
  filterTitle: string;
  filterCategories: string;
  filterAllCategories: string;
  filterOffers: string;
  filterDiscountOffers: string;
  filterSortBy: string;
  filterReset: string;
  sortPopular: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortDiscount: string;
  sortNewest: string;
  noProductsFound: string;
  noProductsDesc: string;
  resetAllFilters: string;

  // Product Details
  crumbHome: string;
  crumbProducts: string;
  qaTitle: string;
  qaDesc: string;
  packSizeLabel: string;
  mfgPriceLabel: string;
  descTitle: string;
  featuresTitle: string;
  specsTitle: string;
  btnWhatsappInquiry: string;
  directModelNoticeText: string;
  relatedTitle: string;
  viewMoreCat: string;

  // Order Modal
  modalTitle: string;
  modalSubmittedTitle: string;
  modalSubmittedDesc: string;
  modalQtyLabel: string;
  modalSubtotal: string;
  modalFullName: string;
  modalPhone: string;
  modalEmail: string;
  modalAddress: string;
  modalNotes: string;
  modalCancel: string;
  modalSubmitBtn: string;
  modalSubmitting: string;
  modalWhatsappBtn: string;
  modalCloseBtn: string;
  modalDirectNotice: string;

  // Contact
  contactTag: string;
  contactTitle: string;
  contactSubtitle: string;
  contactCorpTitle: string;
  contactFacilityAddr: string;
  contactDirectPhone: string;
  contactTollFree: string;
  contactCareEmail: string;
  contactWholesaleEmail: string;
  contactHours: string;
  contactHoursVal: string;
  contactChatWhatsapp: string;
  contactSendInquiry: string;
  contactSubject: string;
  contactMessage: string;
  contactSendBtn: string;
  contactSuccessTitle: string;
  contactSuccessDesc: string;
  contactWholesaleCardTitle: string;
  contactWholesaleCardDesc: string;

  // Footer
  footerAboutText: string;
  footerQuickLinks: string;
  footerProductCategories: string;
  footerDirectContact: string;
  footerCopyright: string;
  footerNotice: string;

  // WhatsApp Button
  waCare: string;
  waInquiry: string;
}

const translationsEn: Translations = {
  brandName: "ARADHAYA Enterprises",
  brandSub: "Aradhaya SoftCare",
  tagline: "Care for Every Little Need",
  address: "Aradhaya Enterprises, District Shamli, Uttar Pradesh, India",
  phoneDemo: "+91 90000 12345 (demo number)",
  tollFreeDemo: "1800 000 0000 (demo)",
  emailCare: "care@aradhayaenterprises.in",
  emailWholesale: "distributors@aradhayaenterprises.in",

  navHome: "Home",
  navProducts: "All Products",
  navBabyCare: "Baby Care",
  navSanitaryPads: "Sanitary Pads",
  navPantyLiners: "Panty Liners",
  navMaternityCare: "Maternity Care",
  navAboutUs: "About Us",
  navContactUs: "Contact Us",
  navAdmin: "Admin",
  navAdminPortal: "Admin Portal",
  navLogin: "Login",
  navRegister: "Register",
  navTrackRequest: "Track Request",
  navMyAccount: "My Account",
  navSignOut: "Sign Out",
  searchPlaceholder: "Search baby diapers, sanitary pads, SKU...",
  searchBtn: "Search",
  bannerNotice: "Care for Every Little Need • District Shamli, Uttar Pradesh • Direct Inquiries",
  directModelNotice: "Direct Order Request Model • No Delivery Partner Fees",

  heroHeadingLine1: "Care for Every",
  heroHeadingLine2: "Little Need",
  heroSubtitle:
    "Gentle, ultra-absorbent, hypoallergenic Baby Diapers and premium Women's Hygiene products crafted with medical-grade organic softness. Direct manufacturer order requests with personal confirmation and zero intermediary markup.",
  btnExploreProducts: "Explore Products",
  btnContactUs: "Contact Us",
  trustSkinSafe: "100% Skin Safe",
  trustSkinSafeSub: "Hypoallergenic",
  trustJapaneseCore: "Japanese Core",
  trustJapaneseCoreSub: "12-Hr Gel Lock",
  trustDirect: "Direct Inquiries",
  trustDirectSub: "Fast Confirmation",
  heroFloatingTitle: "Aradhaya SoftCare Line",
  heroFloatingSub: "Care for Every Little Need",
  btnViewAll: "View All",

  secCategoriesTag: "Our Specializations",
  secCategoriesTitle: "Explore Our Product Categories",
  secCategoriesDesc:
    "Dermatologist approved care essentials specifically designed for infant comfort and women's daily intimate hygiene.",
  btnViewProducts: "View Products",
  catBabyDiapers: "Baby Diapers",
  catSanitaryPads: "Sanitary Pads",
  catPantyLiners: "Panty Liners",
  catMaternityPads: "Maternity Pads",

  secFeaturedTag: "Premium Selection",
  secFeaturedTitle: "Featured Care Products",
  secFeaturedDesc:
    "Direct factory pricing with transparent original rates, discounts, and custom order requests.",
  btnFullCatalog: "View Full Catalog",
  btnDetails: "Details",
  btnOrderRequest: "Order Request",
  badgeDiscount: "OFF",
  badgeSave: "Save",
  factoryRate: "Standard Factory Rate",
  allFactoryRates: "Direct manufacturer rates",

  secProcessTag: "Simplified & Transparent",
  secProcessTitle: "How the Order Request System Works",
  secProcessDesc:
    "No online delivery third-parties or unexpected surge charges. Personalized confirmation directly from Aradhaya Enterprises.",
  step1Title: "Browse Product",
  step1Desc: "Explore baby diapers, sanitary pads, liners & maternity care with detailed specs.",
  step2Title: "Select Quantity",
  step2Desc: "Choose pack count or cases with instant discount calculation and estimated total.",
  step3Title: "Submit Request",
  step3Desc: "Enter your delivery address and receive a unique Request ID (e.g. AS-2026-000125).",
  step4Title: "Admin Contacts You",
  step4Desc: "Our care team verifies stock and coordinates direct dispatch or pickup seamlessly.",

  secQualityTag: "Purity & Medical Standards",
  secQualityTitle: "Crafted for Delicate Skin & Ultimate Hygiene Protection",
  secQualityDesc:
    "At Aradhaya Enterprises, every product batch undergoes stringent microbiological testing, dermatological screening, and high-tension leak resistance checks before being approved for distribution.",
  qualPurity1: "100% Chlorine-free, paraben-free & fragrance-neutral materials",
  qualPurity2: "Japanese Super Absorbent Polymer (SAP) with 12-hour dry lock",
  qualPurity3: "Dermatologist recommended for sensitive newborn skin & postpartum mothers",
  statChlorine: "100%",
  statChlorineSub: "Chlorine-Free Pulp",
  statDryLock: "12 Hrs",
  statDryLockSub: "Dry Protection",
  statDyes: "0%",
  statDyesSub: "Artificial Dyes",
  statDirect: "Direct",
  statDirectSub: "Factory Care",

  filterTitle: "Filters",
  filterCategories: "Categories",
  filterAllCategories: "All Categories",
  filterOffers: "Offers & Discounts",
  filterDiscountOffers: "Special Discount Offers Only",
  filterSortBy: "Sort By",
  filterReset: "Reset",
  sortPopular: "Most Popular & Featured",
  sortPriceAsc: "Price: Low to High",
  sortPriceDesc: "Price: High to Low",
  sortDiscount: "Highest Discount",
  sortNewest: "Newest Releases",
  noProductsFound: "No products found",
  noProductsDesc: "We couldn't find any products matching your current filters. Try resetting.",
  resetAllFilters: "Reset All Filters",

  crumbHome: "Home",
  crumbProducts: "Products",
  qaTitle: "Aradhaya Enterprises Quality Assurance",
  qaDesc:
    "Every unit of Aradhya SoftCare is sealed in pristine cleanroom packaging. No automated drop-shipping. Our sales team handles your order requests directly for uncompromised hygiene.",
  packSizeLabel: "Pack Size",
  mfgPriceLabel: "Direct Manufacturer Price:",
  descTitle: "Product Description",
  featuresTitle: "Key Care Features",
  specsTitle: "Technical Specifications",
  btnWhatsappInquiry: "WhatsApp Product Inquiry",
  directModelNoticeText:
    "* Direct order requests are verified by our team. No online delivery partner charges.",
  relatedTitle: "Related Care Products",
  viewMoreCat: "View More in Category →",

  modalTitle: "Submit Order Request",
  modalSubmittedTitle: "Order Request Submitted Successfully!",
  modalSubmittedDesc:
    "Thank you for your request. Our team will contact you shortly to confirm availability and further processing.",
  modalQtyLabel: "Quantity Required (Packs/Cases):",
  modalSubtotal: "Estimated Subtotal:",
  modalFullName: "Full Name",
  modalPhone: "Mobile Number",
  modalEmail: "Email Address",
  modalAddress: "Delivery Address / Clinic / Chemist Location",
  modalNotes: "Special Instructions / Notes (Optional)",
  modalCancel: "Cancel",
  modalSubmitBtn: "Submit Order Request",
  modalSubmitting: "Submitting Request...",
  modalWhatsappBtn: "Contact on WhatsApp Regarding Request",
  modalCloseBtn: "Close & Continue Browsing",
  modalDirectNotice:
    "Aradhaya Direct Contact Model: No automated delivery partner assignment. An official Aradhaya representative will contact you directly to confirm delivery timing and payment method.",

  contactTag: "Get in Touch",
  contactTitle: "We're Here to Care & Assist",
  contactSubtitle:
    "Have questions regarding Aradhya SoftCare baby diapers, sanitary pads, bulk orders, or institutional clinic supply? Speak directly with our dedicated customer care team.",
  contactCorpTitle: "Corporate & Manufacturing Facility",
  contactFacilityAddr: "Facility Address",
  contactDirectPhone: "Direct Phone",
  contactTollFree: "Toll Free Support",
  contactCareEmail: "Care Email",
  contactWholesaleEmail: "Wholesale & Distributors",
  contactHours: "Operational Hours",
  contactHoursVal: "Monday – Saturday: 9:00 AM – 7:00 PM",
  contactChatWhatsapp: "Chat Instantly on WhatsApp",
  contactSendInquiry: "Send an Inquiry to Aradhaya Care",
  contactSubject: "Subject / Category",
  contactMessage: "Message / Inquiries",
  contactSendBtn: "Send Inquiry to Aradhaya Enterprises",
  contactSuccessTitle: "Thank You for Contacting Aradhaya Enterprises!",
  contactSuccessDesc:
    "Your message has been saved in our customer desk. An executive will call or email you shortly.",
  contactWholesaleCardTitle: "Wholesale & Institutional Inquiries",
  contactWholesaleCardDesc:
    "We supply maternity clinics, pediatric hospitals, pharmacies, and NGO distribution drives across Uttar Pradesh and pan-India. For commercial trade rates or sample requests, submit the form or reach us via WhatsApp.",

  footerAboutText:
    "Aradhaya Enterprises develops and manufactures premier grade baby hygiene and women's healthcare products under the Aradhya SoftCare brand. Engineered with Japanese SAP technology and ultra-soft organic fibers.",
  footerQuickLinks: "Quick Navigation",
  footerProductCategories: "Product Categories",
  footerDirectContact: "Direct Contact",
  footerCopyright:
    "All rights reserved. Brand: Aradhya SoftCare • Aradhaya Enterprises, District Shamli, Uttar Pradesh, India.",
  footerNotice:
    "* Order Request Notice: Aradhaya Enterprises does NOT operate an automated third-party online delivery dispatch module. When you submit an Order Request, our customer care specialists directly contact you to verify your requirement, arrange custom dispatch, and ensure pristine hygiene handling.",

  waCare: "WhatsApp Care",
  waInquiry: "Direct WhatsApp Inquiry",
};

const translationsHi: Translations = {
  brandName: "आराध्या एंटरप्राइजेज",
  brandSub: "आराध्या सॉफ्टकेयर",
  tagline: "हर छोटी ज़रूरत की देखभाल",
  address: "आराध्या एंटरप्राइजेज, जिला शामली, उत्तर प्रदेश, भारत",
  phoneDemo: "+91 90000 12345 (डेमो नंबर)",
  tollFreeDemo: "1800 000 0000 (डेमो)",
  emailCare: "care@aradhayaenterprises.in",
  emailWholesale: "distributors@aradhayaenterprises.in",

  navHome: "होम",
  navProducts: "सभी उत्पाद",
  navBabyCare: "शिशु देखभाल",
  navSanitaryPads: "सेनेटरी पैड्स",
  navPantyLiners: "पैंटी लाइनर्स",
  navMaternityCare: "मातृत्व देखभाल",
  navAboutUs: "हमारे बारे में",
  navContactUs: "संपर्क करें",
  navAdmin: "एडमिन",
  navAdminPortal: "एडमिन पोर्टल",
  navLogin: "लॉगिन",
  navRegister: "पंजीकरण",
  navTrackRequest: "ऑर्डर ट्रैक करें",
  navMyAccount: "मेरा खाता",
  navSignOut: "साइन आउट",
  searchPlaceholder: "बेबी डायपर, सेनेटरी पैड, एसकेयू खोजें...",
  searchBtn: "खोजें",
  bannerNotice: "हर छोटी ज़रूरत की देखभाल • जिला शामली, उत्तर प्रदेश • सीधी पूछताछ",
  directModelNotice: "सीधा ऑर्डर अनुरोध मॉडल • कोई डिलीवरी पार्टनर शुल्क नहीं",

  heroHeadingLine1: "हर छोटी ज़रूरत की",
  heroHeadingLine2: "प्यार से देखभाल",
  heroSubtitle:
    "कोमल, अत्यधिक सोखने वाले, हाइपोएलर्जेनिक बेबी डायपर और प्रीमियम महिला स्वच्छता उत्पाद जो मेडिकल-ग्रेड ऑर्गेनिक कोमलता से तैयार किए गए हैं। बिना किसी मध्यस्थ के सीधे निर्माता से ऑर्डर अनुरोध।",
  btnExploreProducts: "उत्पाद देखें",
  btnContactUs: "संपर्क करें",
  trustSkinSafe: "100% त्वचा सुरक्षित",
  trustSkinSafeSub: "हाइपोएलर्जेनिक",
  trustJapaneseCore: "जापानी कोर",
  trustJapaneseCoreSub: "12 घंटे जेल लॉक",
  trustDirect: "सीधी पूछताछ",
  trustDirectSub: "त्वरित पुष्टि",
  heroFloatingTitle: "आराध्या सॉफ्टकेयर श्रृंखला",
  heroFloatingSub: "हर छोटी ज़रूरत की देखभाल",
  btnViewAll: "सभी देखें",

  secCategoriesTag: "हमारी विशेषज्ञता",
  secCategoriesTitle: "हमारी उत्पाद श्रेणियां देखें",
  secCategoriesDesc:
    "शिशु के आराम और महिलाओं की दैनिक व्यक्तिगत स्वच्छता के लिए विशेष रूप से डिज़ाइन की गई त्वचा विशेषज्ञ-अनुमोदित देखभाल वस्तुएं।",
  btnViewProducts: "उत्पाद देखें",
  catBabyDiapers: "बेबी डायपर",
  catSanitaryPads: "सेनेटरी पैड्स",
  catPantyLiners: "पैंटी लाइनर्स",
  catMaternityPads: "मातृत्व पैड्स",

  secFeaturedTag: "प्रीमियम चयन",
  secFeaturedTitle: "विशेष देखभाल उत्पाद",
  secFeaturedDesc:
    "पारदर्शी मूल दरों, छूटों और कस्टम ऑर्डर अनुरोधों के साथ सीधा फ़ैक्टरी मूल्य निर्धारण।",
  btnFullCatalog: "पूरा कैटलॉग देखें",
  btnDetails: "विवरण",
  btnOrderRequest: "ऑर्डर अनुरोध",
  badgeDiscount: "छूट",
  badgeSave: "बचत",
  factoryRate: "मानक फ़ैक्टरी दर",
  allFactoryRates: "सीधे निर्माता मूल्य",

  secProcessTag: "सरल और पारदर्शी",
  secProcessTitle: "ऑर्डर अनुरोध प्रणाली कैसे काम करती है",
  secProcessDesc:
    "कोई ऑनलाइन डिलीवरी तृतीय-पक्ष या अप्रत्याशित अतिरिक्त शुल्क नहीं। आराध्या एंटरप्राइजेज से सीधे व्यक्तिगत पुष्टि।",
  step1Title: "उत्पाद ब्राउज़ करें",
  step1Desc: "विस्तृत विवरण के साथ बेबी डायपर, सेनेटरी पैड, लाइनर्स और मैटरनिटी केयर देखें।",
  step2Title: "मात्रा चुनें",
  step2Desc: "त्वरित छूट गणना और अनुमानित कुल राशि के साथ पैक या कार्टन चुनें।",
  step3Title: "अनुरोध भेजें",
  step3Desc: "अपना डिलीवरी पता दर्ज करें और विशिष्ट अनुरोध संख्या (उदा. AS-2026-000125) प्राप्त करें।",
  step4Title: "एडमिन संपर्क करेगा",
  step4Desc: "हमारी टीम स्टॉक की पुष्टि करेगी और सीधे प्रेषण या पिकअप की व्यवस्था करेगी।",

  secQualityTag: "शुद्धता और चिकित्सा मानक",
  secQualityTitle: "नाजुक त्वचा और सुरक्षा के लिए निर्मित",
  secQualityDesc:
    "आराध्या एंटरप्राइजेज में, वितरण के लिए अनुमोदित होने से पहले प्रत्येक बैच कठोर सूक्ष्मजीवविज्ञानी और त्वचा परीक्षण से गुजरता है।",
  qualPurity1: "100% क्लोरीन-मुक्त, पैराबेन-मुक्त और सुगंध-तटस्थ सामग्री",
  qualPurity2: "12 घंटे ड्राई लॉक के साथ जापानी सुपर एब्जॉर्बेंट पॉलिमर (SAP)",
  qualPurity3: "संवेदनशील नवजात त्वचा और प्रसवोत्तर माताओं के लिए अनुशंसित",
  statChlorine: "100%",
  statChlorineSub: "क्लोरीन-मुक्त पल्प",
  statDryLock: "12 घंटे",
  statDryLockSub: "ड्राई सुरक्षा",
  statDyes: "0%",
  statDyesSub: "कृत्रिम रंग",
  statDirect: "सीधा",
  statDirectSub: "फ़ैक्टरी केयर",

  filterTitle: "फ़िल्टर",
  filterCategories: "श्रेणियां",
  filterAllCategories: "सभी श्रेणियां",
  filterOffers: "ऑफ़र और छूट",
  filterDiscountOffers: "केवल विशेष छूट वाले ऑफ़र",
  filterSortBy: "क्रमबद्ध करें",
  filterReset: "रीसेट",
  sortPopular: "सबसे लोकप्रिय और विशेष",
  sortPriceAsc: "मूल्य: कम से अधिक",
  sortPriceDesc: "मूल्य: अधिक से कम",
  sortDiscount: "अधिकतम छूट",
  sortNewest: "नवीनतम रिलीज़",
  noProductsFound: "कोई उत्पाद नहीं मिला",
  noProductsDesc: "आपके फ़िल्टर से मेल खाने वाला कोई उत्पाद नहीं मिला। कृपया रीसेट करें।",
  resetAllFilters: "सभी फ़िल्टर रीसेट करें",

  crumbHome: "होम",
  crumbProducts: "उत्पाद",
  qaTitle: "आराध्या एंटरप्राइजेज गुणवत्ता आश्वासन",
  qaDesc:
    "आराध्या सॉफ्टकेयर की प्रत्येक इकाई स्वच्छ पैकेजिंग में सील की गई है। कोई स्वचालित ड्रॉप-शिपिंग नहीं। हमारी बिक्री टीम स्वच्छता के लिए सीधे ऑर्डर अनुरोध संभालती है।",
  packSizeLabel: "पैक आकार",
  mfgPriceLabel: "सीधा निर्माता मूल्य:",
  descTitle: "उत्पाद विवरण",
  featuresTitle: "प्रमुख विशेषताएं",
  specsTitle: "तकनीकी विशिष्टताएं",
  btnWhatsappInquiry: "व्हाट्सएप उत्पाद पूछताछ",
  directModelNoticeText:
    "* प्रत्यक्ष ऑर्डर अनुरोधों की पुष्टि हमारी टीम द्वारा की जाती है। कोई ऑनलाइन डिलीवरी शुल्क नहीं।",
  relatedTitle: "संबंधित देखभाल उत्पाद",
  viewMoreCat: "श्रेणी में और देखें →",

  modalTitle: "ऑर्डर अनुरोध भेजें",
  modalSubmittedTitle: "ऑर्डर अनुरोध सफलतापूर्वक भेजा गया!",
  modalSubmittedDesc:
    "आपके अनुरोध के लिए धन्यवाद। हमारी टीम उपलब्धता और प्रक्रिया की पुष्टि के लिए शीघ्र ही आपसे संपर्क करेगी।",
  modalQtyLabel: "आवश्यक मात्रा (पैक/कार्टन):",
  modalSubtotal: "अनुमानित कुल:",
  modalFullName: "पूरा नाम",
  modalPhone: "मोबाइल नंबर",
  modalEmail: "ईमेल पता",
  modalAddress: "डिलीवरी पता / क्लिनिक / केमिस्ट स्थान",
  modalNotes: "विशेष निर्देश / टिप्पणियां (वैकल्पिक)",
  modalCancel: "रद्द करें",
  modalSubmitBtn: "ऑर्डर अनुरोध भेजें",
  modalSubmitting: "अनुरोध भेजा जा रहा है...",
  modalWhatsappBtn: "अनुरोध के संबंध में व्हाट्सएप पर संपर्क करें",
  modalCloseBtn: "बंद करें और ब्राउज़िंग जारी रखें",
  modalDirectNotice:
    "आराध्या सीधा संपर्क मॉडल: कोई स्वचालित डिलीवरी पार्टनर नहीं। एक अधिकृत प्रतिनिधि डिलीवरी समय और भुगतान की पुष्टि के लिए आपसे सीधे संपर्क करेगा।",

  contactTag: "संपर्क करें",
  contactTitle: "हम आपकी सहायता के लिए उपस्थित हैं",
  contactSubtitle:
    "आराध्या सॉफ्टकेयर बेबी डायपर, सेनेटरी पैड, थोक ऑर्डर या क्लिनिक आपूर्ति के बारे में प्रश्न? हमारी ग्राहक सेवा टीम से सीधे बात करें।",
  contactCorpTitle: "कॉर्पोरेट एवं विनिर्माण संयंत्र",
  contactFacilityAddr: "संयंत्र का पता",
  contactDirectPhone: "सीधा फोन",
  contactTollFree: "टोल फ्री सहायता",
  contactCareEmail: "केयर ईमेल",
  contactWholesaleEmail: "थोक एवं वितरक",
  contactHours: "कार्य समय",
  contactHoursVal: "सोमवार - शनिवार: सुबह 9:00 - शाम 7:00",
  contactChatWhatsapp: "व्हाट्सएप पर तुरंत चैट करें",
  contactSendInquiry: "आराध्या केयर को पूछताछ भेजें",
  contactSubject: "विषय / श्रेणी",
  contactMessage: "संदेश / आवश्यकता",
  contactSendBtn: "आराध्या एंटरप्राइजेज को पूछताछ भेजें",
  contactSuccessTitle: "आराध्या एंटरप्राइजेज से संपर्क करने के लिए धन्यवाद!",
  contactSuccessDesc:
    "आपका संदेश सहेज लिया गया है। हमारा प्रतिनिधि शीघ्र ही आपको कॉल या ईमेल करेगा।",
  contactWholesaleCardTitle: "थोक एवं संस्थागत पूछताछ",
  contactWholesaleCardDesc:
    "हम उत्तर प्रदेश और पूरे भारत में मैटरनिटी क्लीनिक, बाल रोग अस्पतालों, फार्मेसियों को आपूर्ति करते हैं। थोक दरों के लिए फॉर्म भरें या व्हाट्सएप पर संपर्क करें।",

  footerAboutText:
    "आराध्या एंटरप्राइजेज आराध्या सॉफ्टकेयर ब्रांड के तहत प्रीमियम शिशु स्वच्छता और महिला स्वास्थ्य उत्पादों का निर्माण करता है। जापानी एसएपी तकनीक और अल्ट्रा-सॉफ्ट ऑर्गेनिक फाइबर से निर्मित।",
  footerQuickLinks: "त्वरित नेविगेशन",
  footerProductCategories: "उत्पाद श्रेणियां",
  footerDirectContact: "सीधा संपर्क",
  footerCopyright:
    "सर्वाधिकार सुरक्षित। ब्रांड: आराध्या सॉफ्टकेयर • आराध्या एंटरप्राइजेज, जिला शामली, उत्तर प्रदेश, भारत।",
  footerNotice:
    "* ऑर्डर अनुरोध सूचना: आराध्या एंटरप्राइजेज कोई स्वचालित तृतीय-पक्ष डिलीवरी नहीं चलाता है। जब आप अनुरोध भेजते हैं, तो हमारे विशेषज्ञ सीधे आपसे संपर्क करते हैं।",

  waCare: "व्हाट्सएप सहायता",
  waInquiry: "सीधी व्हाट्सएप पूछताछ",
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translationsEn,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aradhya_lang");
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("aradhya_lang", lang);
    } catch {}
  };

  const t = language === "hi" ? translationsHi : translationsEn;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
