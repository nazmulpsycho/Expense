const CATEGORIES = [
  "Food", "Groceries", "Transport", "Fuel", "Rent", "Utilities", "Internet", "Mobile Bill",
  "Education", "Books", "Health", "Medicine", "Insurance", "Entertainment", "Movies", "Streaming",
  "Shopping", "Clothing", "Electronics", "Travel", "Hotel", "Gifts", "Charity", "Family",
  "Kids", "Pets", "Investment", "Savings", "Business", "Miscellaneous"
];

// keyword -> [category, confidence boost]
const KEYWORD_MAP = [
  { keywords: ["kfc", "mcdonald", "mcdonalds", "burger", "pizza", "pizzahut", "dominos", "domino", "subway", "chipotle", "wendy", "wendys", "starbucks", "caf", "cafe", "restaurant", "dinner", "lunch", "breakfast", "food", "snack", "chicken", "fried", "coffee", "teatime", "bubble tea", "buko", "jollibee", "foodpanda", "ubereats", "grubhub"], category: "Food", boost: 0.5 },
  { keywords: ["grocery", "groceries", "supermarket", "market", "walmart", "target", "carrefour", "costco", "aldi", "jeepney", "sari sari", "grocer", "dry goods", "rice", "vegetables", "produce", "provisions"], category: "Groceries", boost: 0.5 },
  { keywords: ["uber", "grab", "lyft", "taxi", "transport", "jeepney", "tricycle", "bus", "subway", "metro", "train", "commute", "transit", "cargo", "shipping", "delivery fee", "logistics", "fare"], category: "Transport", boost: 0.5 },
  { keywords: ["petrol", "gasoline", "gas", "fuel", "diesel", "lpg", "cng", "charging", "ev charging", "refuel"], category: "Fuel", boost: 0.6 },
  { keywords: ["rent", "housing", "lease", "rental", "homemate", "board"], category: "Rent", boost: 0.6 },
  { keywords: ["utility", "utilities", "water bill", "water", "electric", "electricity", "meralco", "power", "sewage", "trash", "waste"], category: "Utilities", boost: 0.5 },
  { keywords: ["internet", "broadband", "wifi", "dsl", "fibre", "fiber", "isp", "data plan", "mobile data"], category: "Internet", boost: 0.5 },
  { keywords: ["mobile", "phone bill", "cellphone", "sim", "prepaid", "postpaid", "smart", "globe", "telco", "calls", "messaging plan", "load"], category: "Mobile Bill", boost: 0.5 },
  { keywords: ["education", "school", "tuition", "class", "course", "training", "seminar", "workshop", "e learning", "elearning", "onlinecourse", "udemy", "skillshare", "lesson"], category: "Education", boost: 0.5 },
  { keywords: ["book", "books", "textbook", "ebook", "kindle", "nook", "novel", "reading"], category: "Books", boost: 0.5 },
  { keywords: ["health", "clinic", "hospital", "medical", "checkup", "doctor", "dental", "therapy", "fitness", "gym", "spa", "wellness", "vitamin", "healthcare"], category: "Health", boost: 0.5 },
  { keywords: ["medicine", "meds", "medication", "pharmacy", "drugstore", "paracetamol", "antibiotic", "prescription", "pharma"], category: "Medicine", boost: 0.6 },
  { keywords: ["insurance", "premium", "policy", "health insurance", "life insurance", "car insurance", "vehicle insurance", "insure"], category: "Insurance", boost: 0.6 },
  { keywords: ["entertainment", "fun", "leisure", "recreation", "karaoke", "bowling", "arcade", "amusement", "theme park", "event", "concert", "festival"], category: "Entertainment", boost: 0.4 },
  { keywords: ["movie", "movies", "cinema", "film", "netflix", "disney+", "disney plus", "hbo", "prime video", "cinema ticket", "theater", "theatre", "imax"], category: "Movies", boost: 0.6 },
  { keywords: ["streaming", "netflix", "disney", "hbo", "hulu", "prime", "spotify", "apple music", "youtube premium", "music streaming", "video streaming"], category: "Streaming", boost: 0.6 },
  { keywords: ["daraz", "shopee", "lazada", "amazon", "eBay", "mall", "store", "online shopping", "online purchase", "ecommerce", "buy", "order", "shopping", "purchase", "cart"], category: "Shopping", boost: 0.45 },
  { keywords: ["clothing", "clothes", "apparel", "fashion", "shirt", "pants", "jeans", "dress", "shoe", "shoes", "sneaker", "footwear", "wear", "outfit", "boutique"], category: "Clothing", boost: 0.5 },
  { keywords: ["electronics", "gadget", "gadgets", "laptop", "computer", "phone", "smartphone", "tablet", "tv", "television", "headphone", "earphone", "camera", "console", "ps5", "playstation", "xbox", "nintendo", "accessory"], category: "Electronics", boost: 0.5 },
  { keywords: ["travel", "trip", "vacation", "tour", "flight", "plane", "airfare", "airplane", "airline", "hotel", "lodging", "booking", "accommodation", "tourism", "airbnb", "cruise", "passport", "visa fee"], category: "Travel", boost: 0.45 },
  { keywords: ["hotel", "inn", "motel", "hostel", "lodging", "resort", "accommodation", "stay", "airbnb", "booking.com", "hotels.com"], category: "Hotel", boost: 0.6 },
  { keywords: ["gift", "gifts", "present", "pasalubong", "congratulation", "birthday", "anniversary", "wedding", "token", "donation gift"], category: "Gifts", boost: 0.5 },
  { keywords: ["charity", "donate", "donation", "philanthropy", "help", "give", "alms", "tithe", " 모금 "], category: "Charity", boost: 0.6 },
  { keywords: ["family", "relative", "relative expense", "cousin", "niece", "nephew", "sibling", "parent", "uncle", "aunt", "family support", "remittance"], category: "Family", boost: 0.5 },
  { keywords: ["kids", "child", "children", "baby", "infant", "toddler", "school kid", "pediatric", "toy", "kids clothing", "nursery"], category: "Kids", boost: 0.5 },
  { keywords: ["pet", "pets", "dog", "cat", "fish", "bird", "vet", "pet food", "petcare", "grooming", "vaccination", "kennel"], category: "Pets", boost: 0.6 },
  { keywords: ["invest", "investment", "stocks", "stock", "shares", "equity", "mutual fund", "index fund", "bond", "crypto", "bitcoin", "ethereum", "roi", "brokerage", "tdameritrade", "binance", "coinbase"], category: "Investment", boost: 0.6 },
  { keywords: ["savings", "deposit", "save", "bank transfer to savings", "savings account", "piggy bank", "bisnes"], category: "Savings", boost: 0.5 },
  { keywords: ["business", "office", "software", "saas", "subscription", "web hosting", "domain", "ads", "marketing", "freelance tax", "equipment", "supplies", "inventory", "payroll"], category: "Business", boost: 0.45 },
  { keywords: ["misc", "miscellaneous", "other", "fee", "service charge", "bank charge", "penalty", "fine", "unspecified", "personal"], category: "Miscellaneous", boost: 0.3 },
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text) {
  return normalize(text).split(" ").filter(Boolean);
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function fuzzyScore(token, keyword) {
  const t = token.length, k = keyword.length;
  if (t === 0 || k === 0) return 0;
  if (t > k && k >= 4 && t >= 4) {
    const ratio = 1 - levenshtein(token.slice(0, k), keyword) / k;
    if (ratio > 0.6) return ratio;
  }
  if (t < k && t >= 4 && k >= 4) {
    const ratio = 1 - levenshtein(token, keyword.slice(0, t)) / t;
    if (ratio > 0.6) return ratio;
  }
  return token === keyword ? 1 : 0;
}

/**
 * Categorize an expense name (and optional note) using keyword + fuzzy matching.
 * Returns { category, confidence, matchedKeyword }.
 */
export function categorize(expenseName, note = "") {
  const text = `${expenseName} ${note}`.trim();
  if (!text) return { category: "Miscellaneous", confidence: 0, matchedKeyword: null };

  const tokens = tokenize(text);
  const scores = new Map();

  // Direct keyword hits + fuzzy hits
  for (const token of tokens) {
    for (const entry of KEYWORD_MAP) {
      let best = 0;
      for (const kw of entry.keywords) {
        const s = fuzzyScore(token, kw);
        if (s > best) best = s;
      }
      if (best > 0) {
        const prev = scores.get(entry.category) || 0;
        const score = prev + best * entry.boost;
        scores.set(entry.category, Math.min(score, 1));
      }
    }
  }

  let bestCategory = "Miscellaneous";
  let bestScore = 0;
  let bestKeyword = null;

  // Track matched keyword for best category
  for (const token of tokens) {
    for (const entry of KEYWORD_MAP) {
      if (entry.category !== bestCategory) continue;
      for (const kw of entry.keywords) {
        if (token.includes(kw) || fuzzyScore(token, kw) >= 0.6) {
          bestKeyword = kw;
          break;
        }
      }
      if (bestKeyword) break;
    }
    if (bestKeyword) break;
  }

  for (const [category, score] of scores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  // Confidence: strong if >0.3, medium 0.15-0.3, low below
  let confidence = 0;
  if (bestScore >= 0.5) confidence = 0.9;
  else if (bestScore >= 0.3) confidence = 0.7;
  else if (bestScore >= 0.15) confidence = 0.45;
  else if (bestScore > 0) confidence = 0.25;

  return { category: bestCategory, confidence, matchedKeyword: bestKeyword };
}

export function getCategories() {
  return CATEGORIES.slice();
}

export function isStrongSignal(confidence) {
  return confidence >= 0.7;
}
