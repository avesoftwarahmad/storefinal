/**
 * Bilingual Synonyms for Query Expansion
 * Supports English and Arabic for better search and understanding
 */

const synonyms = {
  // English synonyms
  en: {
    return_policy: ['return', 'refund', 'exchange', 'money back', 'send back', 'give back'],
    shipping: ['shipping', 'delivery', 'ship', 'deliver', 'send', 'transport'],
    order_status: ['order status', 'track order', 'where is my order', 'order tracking'],
    warranty: ['warranty', 'guarantee', 'protection plan', 'coverage'],
    product: ['product', 'item', 'goods', 'merchandise'],
    price: ['price', 'cost', 'how much', 'pricing'],
    payment: ['payment', 'pay', 'checkout', 'billing'],
    cancel: ['cancel', 'stop', 'void', 'revoke']
  },
  
  // Arabic synonyms
  ar: {
    return_policy: ['إرجاع', 'استرداد', 'استبدال', 'استرجاع'],
    shipping: ['شحن', 'توصيل', 'تسليم', 'إرسال'],
    order_status: ['حالة الطلب', 'تتبع الطلب', 'أين طلبي'],
    warranty: ['ضمان', 'كفالة'],
    product: ['منتج', 'سلعة', 'بضاعة'],
    price: ['سعر', 'ثمن', 'تكلفة'],
    payment: ['دفع', 'الدفع', 'السداد'],
    cancel: ['إلغاء', 'إلغى', 'توقف']
  }
};

/**
 * Detect if text is in Arabic
 */
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Detect language
 */
function detectLanguage(text) {
  return isArabic(text) ? 'ar' : 'en';
}

/**
 * Expand query with synonyms
 */
function expandQuery(userInput) {
  const text = String(userInput || '');
  const lang = detectLanguage(text);
  const dict = synonyms[lang];
  const additions = new Set();
  
  // Find matching synonyms
  for (const key of Object.keys(dict)) {
    for (const word of dict[key]) {
      if (text.toLowerCase().includes(word.toLowerCase())) {
        dict[key].forEach(v => additions.add(v));
        break;
      }
    }
  }
  
  // Add cross-lingual hints
  if (lang === 'ar') {
    // Add English equivalents for Arabic queries
    ['return policy', 'shipping options', 'order status'].forEach(v => additions.add(v));
  } else {
    // Add Arabic equivalents for English queries  
    ['سياسة الإرجاع', 'خيارات الشحن', 'حالة الطلب'].forEach(v => additions.add(v));
  }
  
  // Return original text plus synonyms (max 12 total)
  return [text, ...Array.from(additions)].slice(0, 12);
}

/**
 * Get synonyms for a specific term
 */
function getSynonyms(term, lang = 'en') {
  const dict = synonyms[lang];
  
  for (const [key, values] of Object.entries(dict)) {
    if (values.some(v => v.toLowerCase() === term.toLowerCase())) {
      return values;
    }
  }
  
  return [term];
}

/**
 * Normalize query for better matching
 */
function normalizeQuery(query) {
  const lang = detectLanguage(query);
  const normalized = query.toLowerCase().trim();
  
  // Remove common filler words
  const fillerWords = lang === 'ar' 
    ? ['من', 'في', 'على', 'إلى', 'عن', 'مع']
    : ['the', 'a', 'an', 'is', 'are', 'what', 'how', 'can', 'could', 'please'];
  
  let cleaned = normalized;
  fillerWords.forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), ' ');
  });
  
  return cleaned.replace(/\s+/g, ' ').trim();
}

module.exports = {
  synonyms,
  isArabic,
  detectLanguage,
  expandQuery,
  getSynonyms,
  normalizeQuery
};

