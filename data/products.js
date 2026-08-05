/* ============================================================
   KIRANZA — PRODUCT DATA
   16 products across 7 Gen Z aesthetic categories
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: "Butterfly Clip Set",
    price: 299,
    category: "Y2K",
    badge: "viral",
    badgeLabel: "🔥 Viral",
    image: "assets/images/products/p1.jpg",
    description: "Channel your inner Y2K princess with this iridescent butterfly clip set. Scatter them all over for full 2000s drama — or rock the classic half-up look.",
    tags: ["Accessories", "Hair", "Y2K"],
    images: ["assets/images/products/p1.jpg", "assets/images/products/p1b.jpg"]
  },
  {
    id: 2,
    name: "Dark Academia Journal",
    price: 599,
    category: "Dark Academia",
    badge: "new",
    badgeLabel: "✨ New",
    image: "assets/images/products/p2.jpg",
    description: "A leather-bound journal with aged cream pages and botanical pressed flower motifs on the cover. Perfect for poetry, study notes, or your deepest thoughts.",
    tags: ["Stationery", "Writing", "Dark Academia"],
    images: ["assets/images/products/p2.jpg"]
  },
  {
    id: 3,
    name: "Coquette Satin Bow Headband",
    price: 249,
    category: "Coquette",
    badge: "viral",
    badgeLabel: "🔥 Viral",
    image: "assets/images/products/p3.jpg",
    description: "Soft satin bow headband in blush pink. The ultimate coquette era accessory — wear it every day, everywhere, with everything.",
    tags: ["Accessories", "Hair", "Coquette"],
    images: ["assets/images/products/p3.jpg"]
  },
  {
    id: 4,
    name: "Indie Enamel Pin Set",
    price: 199,
    category: "Indie/Alt",
    badge: "new",
    badgeLabel: "✨ New",
    image: "assets/images/products/p4.jpg",
    description: "Set of 6 indie enamel pins with hand-drawn illustrations — mushrooms, stars, tiny books, and more. Add them to your denim jacket, tote bag, or backpack.",
    tags: ["Accessories", "Pins", "Indie"],
    images: ["assets/images/products/p4.jpg"]
  },
  {
    id: 5,
    name: "Oversized Logo Hoodie",
    price: 1299,
    category: "Streetwear",
    badge: "limited",
    badgeLabel: "⚡ Limited",
    image: "assets/images/products/p5.jpg",
    description: "Premium 400gsm heavyweight cotton hoodie with embroidered chest logo. Drops in limited quantities — once it's gone, it's gone.",
    tags: ["Clothing", "Hoodie", "Streetwear"],
    images: ["assets/images/products/p5.jpg"]
  },
  {
    id: 6,
    name: "Minimal Chain Necklace",
    price: 499,
    category: "Clean Girl",
    badge: "new",
    badgeLabel: "✨ New",
    image: "assets/images/products/p6.jpg",
    description: "Dainty gold-tone layered chain necklace — the clean girl aesthetic staple. Stack it, wear it solo, or layer it with the pearl choker.",
    tags: ["Jewelry", "Accessories", "Clean Girl"],
    images: ["assets/images/products/p6.jpg"]
  },
  {
    id: 7,
    name: "Wildflower Ceramic Mug",
    price: 399,
    category: "Cottagecore",
    badge: "",
    badgeLabel: "",
    image: "assets/images/products/p7.jpg",
    description: "Hand-painted ceramic mug with wildflower motifs and an earthy, off-white glaze. Makes your morning coffee feel like a cottagecore dream.",
    tags: ["Home", "Mug", "Cottagecore"],
    images: ["assets/images/products/p7.jpg"]
  },
  {
    id: 8,
    name: "Y2K Mini Shoulder Bag",
    price: 999,
    category: "Y2K",
    badge: "viral",
    badgeLabel: "🔥 Viral",
    image: "assets/images/products/p8.jpg",
    description: "Tiny PU leather shoulder bag with chunky silver chain strap and iridescent panels. Fits your phone, cards, and lip gloss — just like 2003.",
    tags: ["Bags", "Accessories", "Y2K"],
    images: ["assets/images/products/p8.jpg"]
  },
  {
    id: 9,
    name: "Dark Amber Candle",
    price: 699,
    category: "Dark Academia",
    badge: "new",
    badgeLabel: "✨ New",
    image: "assets/images/products/p9.jpg",
    description: "Hand-poured soy wax candle with dark amber, old books, and sandalwood notes. Burns for 45 hours. Light it when you study, read, or just exist beautifully.",
    tags: ["Home", "Candle", "Dark Academia"],
    images: ["assets/images/products/p9.jpg"]
  },
  {
    id: 10,
    name: "Pearl Hair Clip Set",
    price: 349,
    category: "Coquette",
    badge: "",
    badgeLabel: "",
    image: "assets/images/products/p10.jpg",
    description: "Set of 4 pearl-embellished hair clips in cream and rose gold. Delicate, dreamy, and totally coquette.",
    tags: ["Accessories", "Hair", "Coquette"],
    images: ["assets/images/products/p10.jpg"]
  },
  {
    id: 11,
    name: "Washed Denim Tote",
    price: 799,
    category: "Indie/Alt",
    badge: "viral",
    badgeLabel: "🔥 Viral",
    image: "assets/images/products/p11.jpg",
    description: "Heavy-duty washed denim tote with raw hem and vintage patch details. The indie kid's carry-all for books, records, and everything in between.",
    tags: ["Bags", "Accessories", "Indie"],
    images: ["assets/images/products/p11.jpg"]
  },
  {
    id: 12,
    name: "Structured Logo Cap",
    price: 599,
    category: "Streetwear",
    badge: "",
    badgeLabel: "",
    image: "assets/images/products/p12.jpg",
    description: "6-panel structured cap with tonal embroidered logo detail on the front. Clean, minimal, and built to elevate any street-style fit.",
    tags: ["Accessories", "Headwear", "Streetwear"],
    images: ["assets/images/products/p12.jpg"]
  },
  {
    id: 13,
    name: "Glass Skin Serum Trio",
    price: 1099,
    category: "Clean Girl",
    badge: "limited",
    badgeLabel: "⚡ Limited",
    image: "assets/images/products/p13.jpg",
    description: "Trio of minimalist skincare serums in frosted glass bottles — hyaluronic acid, vitamin C, and niacinamide. Your glass skin routine, simplified.",
    tags: ["Skincare", "Beauty", "Clean Girl"],
    images: ["assets/images/products/p13.jpg"]
  },
  {
    id: 14,
    name: "Woven Rattan Basket",
    price: 849,
    category: "Cottagecore",
    badge: "new",
    badgeLabel: "✨ New",
    image: "assets/images/products/p14.jpg",
    description: "Handwoven natural rattan basket with dried flower accents — perfect for room decor, storage, or aesthetic picnic vibes.",
    tags: ["Home", "Decor", "Cottagecore"],
    images: ["assets/images/products/p14.jpg"]
  },
  {
    id: 15,
    name: "Platform Chunky Sneakers",
    price: 2499,
    category: "Y2K",
    badge: "limited",
    badgeLabel: "⚡ Limited",
    image: "assets/images/products/p15.jpg",
    description: "Chunky platform sneakers with iridescent shimmer overlays and a 5cm ultra-thick rubber sole. Y2K-inspired silhouette that commands attention.",
    tags: ["Footwear", "Shoes", "Y2K"],
    images: ["assets/images/products/p15.jpg"]
  },
  {
    id: 16,
    name: "Round Tortoiseshell Frames",
    price: 449,
    category: "Dark Academia",
    badge: "",
    badgeLabel: "",
    image: "assets/images/products/p16.jpg",
    description: "Tortoiseshell round frames with clear non-prescription lenses. A cornerstone of the dark academia look — bookshops, libraries, and candlelit cafes await.",
    tags: ["Accessories", "Eyewear", "Dark Academia"],
    images: ["assets/images/products/p16.jpg"]
  }
];

const AESTHETICS = [
  { id: "all",            label: "All Vibes",       emoji: "✦" },
  { id: "Y2K",           label: "Y2K",              emoji: "💿" },
  { id: "Dark Academia", label: "Dark Academia",    emoji: "📚" },
  { id: "Coquette",      label: "Coquette",         emoji: "🎀" },
  { id: "Indie/Alt",     label: "Indie / Alt",      emoji: "📌" },
  { id: "Streetwear",    label: "Streetwear",       emoji: "🧢" },
  { id: "Clean Girl",    label: "Clean Girl",       emoji: "✨" },
  { id: "Cottagecore",   label: "Cottagecore",      emoji: "🌿" },
];

const LOOKBOOKS = [
  {
    id: 1,
    title: "Y2K Revival",
    aesthetic: "Y2K",
    tag: "The 2000s are back",
    description: "Butterfly clips, mini bags, platform kicks. Everything iridescent, everything extra.",
    image: "assets/images/lookbook/lb1.jpg",
    products: [1, 8, 15]
  },
  {
    id: 2,
    title: "Dark Academia",
    aesthetic: "Dark Academia",
    tag: "Autumn, always",
    description: "Leather journals, amber candlelight, tortoiseshell frames. Study beautifully.",
    image: "assets/images/lookbook/lb2.jpg",
    products: [2, 9, 16]
  },
  {
    id: 3,
    title: "Coquette Core",
    aesthetic: "Coquette",
    tag: "Soft & dreamy",
    description: "Satin bows, pearl clips, and everything blush pink. Be impossibly feminine.",
    image: "assets/images/lookbook/lb3.jpg",
    products: [3, 10]
  },
  {
    id: 4,
    title: "Clean Girl Edit",
    aesthetic: "Clean Girl",
    tag: "Effortlessly you",
    description: "Minimal jewelry, glass-skin serums. Looking put-together while doing nothing.",
    image: "assets/images/lookbook/lb4.jpg",
    products: [6, 13]
  }
];
