import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    brand_tagline: "SHOP. SCAN. PAY. GO.",
    brand_sub: "NO MORE WAITING IN LONG QUEUES.",
    nav_home: "Home",
    nav_how_it_works: "How It Works",
    nav_products: "Products",
    nav_features: "Features",
    nav_scanner: "Scan Items",
    nav_cart: "My Cart",
    nav_orders: "Order History",
    nav_admin: "Admin Portal",
    nav_signin: "Sign In",
    nav_get_started: "Get Started",
    nav_signout: "Sign Out",
    btn_start_shopping: "START SHOPPING",
    btn_explore: "EXPLORE HOW IT WORKS",
    btn_scan_now: "START SCANNING",
    btn_add_to_cart: "ADD TO CART",
    btn_checkout: "PROCEED TO CHECKOUT",
    btn_pay_now: "PAY NOW",
    btn_view_receipt: "VIEW DIGITAL RECEIPT",
    status_in_stock: "In Stock",
    status_low_stock: "Low Stock",
    status_out_of_stock: "Out of Stock",
    scanner_title: "Smart Barcode Scanner",
    scanner_subtitle: "Align barcode inside the viewfinder or enter manually",
    scanner_manual_placeholder: "Enter 13-digit barcode number...",
    cart_empty_title: "Your cart is empty",
    cart_empty_sub: "Scan barcodes or browse products to begin your checkout journey",
    admin_dashboard_title: "Supermarket Operations Hub",
    stat_revenue: "Total Revenue",
    stat_orders: "Total Orders",
    stat_products: "Total SKUs",
    stat_customers: "Active Customers",
    receipt_title: "TAX INVOICE / CASH MEMO",
    receipt_tagline: "Thank you for shopping at QuickCheckout!",
  },
  hi: {
    brand_tagline: "खरीदें. स्कैन करें. भुगतान करें. निकलें.",
    brand_sub: "लंबी कतारों में अब इंतज़ार नहीं.",
    nav_home: "होम",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_products: "उत्पाद",
    nav_features: "विशेषताएं",
    nav_scanner: "स्कैन करें",
    nav_cart: "मेरी कार्ट",
    nav_orders: "ऑर्डर इतिहास",
    nav_admin: "एडमिन पोर्टल",
    nav_signin: "साइन इन",
    nav_get_started: "शुरू करें",
    nav_signout: "लॉग आउट",
    btn_start_shopping: "खरीदारी शुरू करें",
    btn_explore: "प्रक्रिया समझें",
    btn_scan_now: "स्कैनिंग शुरू करें",
    btn_add_to_cart: "कार्ट में जोड़ें",
    btn_checkout: "चेकआउट की ओर बढ़ें",
    btn_pay_now: "अभी भुगतान करें",
    btn_view_receipt: "डिजिटल रसीद देखें",
    status_in_stock: "उपलब्ध (In Stock)",
    status_low_stock: "सीमित स्टॉक (Low Stock)",
    status_out_of_stock: "स्टॉक समाप्त (Out of Stock)",
    scanner_title: "स्मार्ट बारकोड स्कैनर",
    scanner_subtitle: "बारकोड को कैमरे के सामने रखें या मैन्युअल दर्ज करें",
    scanner_manual_placeholder: "13 अंकों का बारकोड नंबर दर्ज करें...",
    cart_empty_title: "आपकी कार्ट खाली है",
    cart_empty_sub: "खरीदारी शुरू करने के लिए बारकोड स्कैन करें या उत्पाद चुनें",
    admin_dashboard_title: "सुपरमार्केट ऑपरेशंस हब",
    stat_revenue: "कुल राजस्व",
    stat_orders: "कुल ऑर्डर्स",
    stat_products: "कुल उत्पाद",
    stat_customers: "सक्रिय ग्राहक",
    receipt_title: "टैक्स इनवॉइस / डिजिटल रसीद",
    receipt_tagline: "QuickCheckout पर खरीदारी के लिए धन्यवाद!",
  }
};

const ThemeLanguageContext = createContext();

export const ThemeLanguageProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('qc_theme');
    return saved === 'dark' ? 'light' : (saved || 'light');
  });
  const [lang, setLang] = useState(() => localStorage.getItem('qc_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('qc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('qc_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, lang, toggleTheme, toggleLang, setLang, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => useContext(ThemeLanguageContext);
