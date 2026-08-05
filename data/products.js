/* ============================================================
   Kikifinds — PRODUCT DATA
   16 products · 7 Gen Z aesthetics · sizes · REVIEWS
   ============================================================ */

/* eslint-disable no-unused-vars */
const AESTHETICS = {
  'Y2K':           { label: 'Y2K',           emoji: '💿', description: 'Iridescent chaos. Butterfly clips, platform everything, and maximum nostalgia for the 2000s.' },
  'Dark Academia': { label: 'Dark Academia', emoji: '📚', description: 'Eternal autumn. Leather journals, candlelight, tortoiseshell, and the smell of old books.' },
  'Coquette':      { label: 'Coquette',      emoji: '🎀', description: 'Impossibly feminine. Satin bows, pearl clips, blush tones, and soft romantic energy.' },
  'Streetwear':    { label: 'Streetwear',    emoji: '🧢', description: 'Raw and urban. Oversized silhouettes, bold graphics, and city-forged confidence.' },
  'Clean Girl':    { label: 'Clean Girl',    emoji: '✨', description: 'Effortless minimalism. Glass skin, dainty gold, and the art of looking like you woke up perfect.' },
  'Cottagecore':   { label: 'Cottagecore',   emoji: '🌿', description: 'Slow and warm. Wildflowers, wicker baskets, herbal teas, and a life in soft focus.' },
  'Indie/Alt':     { label: 'Indie/Alt',     emoji: '📌', description: 'Anti-algorithm. Thrifted finds, band tees, pin badges, and the coolest record you never heard.' },
};

const PRODUCTS = [
  {
    id: 1, name: 'Iridescent Butterfly Clip Set', category: 'Y2K',
    price: 449, originalPrice: 599, badge: 'hot', badgeLabel: '🔥 Hot',
    image: 'assets/images/products/p1.jpg',
    description: 'A set of 6 holographic butterfly clips that caught a time machine from 2002. Clip them anywhere — hair, bags, jackets. Maximum iridescence guaranteed.',
    tags: ['hair accessories', 'Y2K', 'iridescent', 'butterfly', 'clips', 'holographic'],
  },
  {
    id: 2, name: 'Botanical Pressed Flower Journal', category: 'Dark Academia',
    price: 699, badge: 'new', badgeLabel: '✦ New',
    image: 'assets/images/products/p2.jpg',
    description: 'Dark leather cover with real pressed botanicals embedded in resin. 200 cream-tinted ruled pages. The kind of journal that makes you feel like you\'re writing something important.',
    tags: ['journal', 'dark academia', 'stationery', 'leather', 'botanical', 'writing'],
  },
  {
    id: 3, name: 'Satin Bow Headband', category: 'Coquette',
    price: 349, badge: 'new', badgeLabel: '✦ New',
    image: 'assets/images/products/p3.jpg',
    description: 'Double-layer satin bow on a flexible padded headband. Blush pink that photographs beautifully in every lighting. The ultimate coquette statement piece.',
    tags: ['headband', 'coquette', 'satin', 'bow', 'hair accessory', 'blush'],
    sizes: ['XS/S', 'M/L'],
  },
  {
    id: 4, name: 'Enamel Pin Set Vol. 1', category: 'Indie/Alt',
    price: 299, badge: null,
    image: 'assets/images/products/p4.jpg',
    description: 'Eight hard enamel pins with indie aesthetics — cassette tapes, mushrooms, moons, and a tiny bumblebee. Pin them on your denim, canvas bag, or anywhere you want personality.',
    tags: ['pins', 'indie', 'enamel', 'accessories', 'alt', 'badges', 'cassette'],
  },
  {
    id: 5, name: 'Heavyweight Drop-Shoulder Hoodie', category: 'Streetwear',
    price: 1299, originalPrice: 1599, badge: 'sale', badgeLabel: '→ Sale',
    image: 'assets/images/products/p5.jpg',
    description: '400gsm fleece. Drop shoulder cut. Tonal embroidered Kikifinds mark on the chest. The kind of hoodie that becomes your most-worn item within a week.',
    tags: ['hoodie', 'streetwear', 'oversized', 'fleece', 'heavyweight', 'embroidered'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 6, name: 'Dainty Satellite Chain Necklace', category: 'Clean Girl',
    price: 549, badge: null,
    image: 'assets/images/products/p6.jpg',
    description: '18K gold-plated satellite chain, 42cm with a 5cm extender. Tarnish-resistant and nickel-free. Layer it, go solo, or gift it to your cleanest friend.',
    tags: ['necklace', 'gold', 'clean girl', 'minimal', 'jewellery', 'chain', 'satellite'],
  },
  {
    id: 7, name: 'Wildflower Fluted Mug', category: 'Cottagecore',
    price: 399, badge: 'new', badgeLabel: '✦ New',
    image: 'assets/images/products/p7.jpg',
    description: 'Hand-poured stoneware in warm cream with a delicate wildflower sprig. Fluted base, generous 320ml volume. Made for slow mornings with herbal tea.',
    tags: ['mug', 'cottagecore', 'stoneware', 'ceramic', 'tea', 'kitchen', 'wildflower'],
  },
  {
    id: 8, name: 'Holographic Mini Shoulder Bag', category: 'Y2K',
    price: 899, badge: 'hot', badgeLabel: '🔥 Hot',
    image: 'assets/images/products/p8.jpg',
    description: 'That-bag energy. Holographic PU exterior, silver chain strap, magnetic clasp. Fits your phone, lip gloss, and all your Y2K-era main character moments.',
    tags: ['bag', 'Y2K', 'holographic', 'mini bag', 'chain', 'shoulder bag'],
  },
  {
    id: 9, name: 'Amber Soy Candle — Dark Woods', category: 'Dark Academia',
    price: 599, badge: null,
    image: 'assets/images/products/p9.jpg',
    description: 'Hand-poured soy wax in a dark amber glass vessel. Scented with sandalwood, oakmoss, and a hint of old books. 45-hour burn time. Includes a cotton wick and a lid.',
    tags: ['candle', 'dark academia', 'soy', 'sandalwood', 'amber', 'fragrance', 'home'],
  },
  {
    id: 10, name: 'Pearl Cluster Hair Clip Duo', category: 'Coquette',
    price: 279, badge: null,
    image: 'assets/images/products/p10.jpg',
    description: 'Two oversized clips adorned with creamy faux pearls in a cluster arrangement. Goes with everything and somehow also goes with nothing — in the best way.',
    tags: ['hair clip', 'coquette', 'pearl', 'accessories', 'hair', 'barrette'],
  },
  {
    id: 11, name: 'Washed Canvas Tote Bag', category: 'Indie/Alt',
    price: 649, badge: null,
    image: 'assets/images/products/p11.jpg',
    description: 'Pre-washed 12oz canvas for that perfectly worn look. Interior zip pocket. Carry your thrift haul, record finds, and a paperback you\'ve been meaning to start.',
    tags: ['tote bag', 'indie', 'canvas', 'alt', 'bag', 'shoulder', 'market'],
  },
  {
    id: 12, name: 'Six-Panel Structured Cap', category: 'Streetwear',
    price: 549, badge: null,
    image: 'assets/images/products/p12.jpg',
    description: 'Wool-blend six panel with a metal adjuster back. Low-profile embroidered ✦ on the front panel. The kind of cap that goes with literally everything in your rotation.',
    tags: ['cap', 'streetwear', 'hat', 'structured', 'baseball cap', 'wool'],
    sizes: ['One Size'],
  },
  {
    id: 13, name: 'Glass Skin Serum Trio', category: 'Clean Girl',
    price: 1199, badge: 'new', badgeLabel: '✦ New',
    image: 'assets/images/products/p13.jpg',
    description: 'Three 15ml serums in frosted glass bottles — hyaluronic acid, niacinamide, and vitamin C. The entire Clean Girl routine in a compact, travel-friendly set.',
    tags: ['serum', 'clean girl', 'skincare', 'glass skin', 'beauty', 'hyaluronic', 'vitamin c'],
  },
  {
    id: 14, name: 'Wicker Storage Basket', category: 'Cottagecore',
    price: 799, badge: null,
    image: 'assets/images/products/p14.jpg',
    description: 'Hand-woven seagrass basket with a cotton rope handle. 30cm × 20cm. Stack your dried flowers, crochet yarn, or plant a trailing pothos inside.',
    tags: ['basket', 'cottagecore', 'wicker', 'storage', 'seagrass', 'home', 'handmade'],
  },
  {
    id: 15, name: 'Chunky Platform Sneakers', category: 'Y2K',
    price: 2499, originalPrice: 2999, badge: 'sale', badgeLabel: '→ Sale',
    image: 'assets/images/products/p15.jpg',
    description: 'Extra thick midsole, iridescent lace eyelets, retro toe-box. The kind of shoe that adds 5cm and 10x the aesthetic to any outfit.',
    tags: ['sneakers', 'Y2K', 'platform', 'shoes', 'chunky', 'footwear', 'iridescent'],
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 16, name: 'Tortoiseshell Round Glasses', category: 'Dark Academia',
    price: 899, badge: null,
    image: 'assets/images/products/p16.jpg',
    description: 'Acetate frames in warm tortoiseshell, round lenses, spring hinges. Available with or without prescription. You don\'t have to be a scholar. You just have to look like one.',
    tags: ['glasses', 'dark academia', 'tortoiseshell', 'eyewear', 'round', 'frames'],
  },
];

/* ── Reviews data ─────────────────────────────────────────── */
const REVIEWS = {
  1: [
    { name: 'Priya K.',   rating: 5, text: 'Absolutely obsessed! These are even more iridescent in person. Wore them on my bag and hair and got stopped twice.', date: '2 days ago' },
    { name: 'Isha T.',    rating: 5, text: 'Quality is insane for the price. The holographic effect is gorgeous in sunlight.',                                       date: '1 week ago' },
    { name: 'Zara M.',    rating: 4, text: 'Love 5 out of 6. One had a slightly bent wing but honestly still cute. Will order again.',                               date: '2 weeks ago' },
  ],
  2: [
    { name: 'Meera S.',   rating: 5, text: 'The pressed flowers are real and perfect. This is the most beautiful journal I\'ve ever owned.',                         date: '3 days ago' },
    { name: 'Ananya R.',  rating: 5, text: 'Writing in this makes everything feel more meaningful. Heavy, quality leather, lovely cream pages.',                      date: '5 days ago' },
    { name: 'Pallavi G.', rating: 4, text: 'Gorgeous — wish the pages were unruled too but a minor thing. Dark academia perfection.',                                date: '3 weeks ago' },
  ],
  3: [
    { name: 'Riya D.',    rating: 5, text: 'Wore this to a brunch and got 4 compliments in 2 hours. The satin is dreamy.',                                           date: '1 day ago' },
    { name: 'Sana W.',    rating: 5, text: 'So coquette, so perfect. It stays in place all day too which is rare for headbands.',                                    date: '1 week ago' },
    { name: 'Tara J.',    rating: 4, text: 'Beautiful piece! Could use a slightly bigger bow but love the blush colour.',                                             date: '2 weeks ago' },
  ],
  4: [
    { name: 'Lena P.',    rating: 5, text: 'The quality of each pin is incredible. The bumblebee is my favourite. Already ordered Volume 2 (when please??)',         date: '4 days ago' },
    { name: 'Noor A.',    rating: 5, text: 'I put the cassette tape on my denim jacket and the mushroom on my bag. Both getting stopped daily.',                     date: '1 week ago' },
    { name: 'Cass O.',    rating: 4, text: 'Great set, colours are vibrant. One pin has a tiny bubble but overall still looks great.',                               date: '3 weeks ago' },
  ],
  5: [
    { name: 'Dev S.',     rating: 5, text: 'This hoodie is HEAVY in the best way. The embroidery is clean, the fit is perfect. Wearing it every day.',               date: '6 days ago' },
    { name: 'Aryan K.',   rating: 5, text: 'Finally a hoodie that doesn\'t pill after 3 washes. The weight is perfect for winter.',                                  date: '2 weeks ago' },
    { name: 'Tanveer M.', rating: 5, text: 'Worth every rupee. Chunky feel, premium fabric. Got mine in L and the oversized drop works perfectly.',                  date: '3 weeks ago' },
  ],
  6: [
    { name: 'Aarav B.',   rating: 5, text: 'Delicate and perfect. Layered it with a longer chain and the combo is everything.',                                      date: '2 days ago' },
    { name: 'Kavya N.',   rating: 5, text: 'Not tarnished at all after 2 weeks of daily wear. Quality is better than similar items I\'ve paid more for.',           date: '1 week ago' },
    { name: 'Pooja T.',   rating: 4, text: 'Beautiful chain, exactly as described. The clasp could be slightly stronger but the look is 10/10.',                    date: '2 weeks ago' },
  ],
  7: [
    { name: 'Fern H.',    rating: 5, text: 'This mug is everything. The wildflower sprig detail is painted so beautifully. My morning tea tastes better now.',       date: '1 day ago' },
    { name: 'Bela S.',    rating: 5, text: 'Sturdy, thick walls, keeps tea warm for ages. The cream glaze is gorgeous. Already ordered 2 more as gifts.',            date: '5 days ago' },
    { name: 'Aditi R.',   rating: 5, text: 'Perfect cottage kitchen vibe. The fluted base is so elegant. Cannot recommend enough.',                                  date: '10 days ago' },
  ],
  8: [
    { name: 'Naina V.',   rating: 5, text: 'Fits my phone, earbuds, cards and lip gloss. The holographic is BLINDING in the sun. Perfect Y2K bag.',                 date: '3 days ago' },
    { name: 'Preet K.',   rating: 4, text: 'Chain is slightly shorter than I expected but the bag itself is absolutely stunning.',                                   date: '1 week ago' },
    { name: 'Dia M.',     rating: 5, text: 'Y2K dreams. Got so many questions about where I got it. People stop me in the street.',                                  date: '2 weeks ago' },
  ],
  9: [
    { name: 'Trisha G.',  rating: 5, text: 'The sandalwood note is incredible. Not overpowering. It fills the room slowly and beautifully.',                         date: '4 days ago' },
    { name: 'Rhea D.',    rating: 5, text: 'Burn time is accurate — still going strong on day 12. The amber glass looks amazing with the candle lit.',               date: '1 week ago' },
    { name: 'Nia B.',     rating: 4, text: 'Gorgeous scent, clean burn. Wish the vessel was slightly taller but the fragrance is perfect.',                          date: '3 weeks ago' },
  ],
  10: [
    { name: 'Elara P.',   rating: 5, text: 'These clips are so pretty! The pearl clusters look luxe but stay in all day.',                                           date: '2 days ago' },
    { name: 'Siona K.',   rating: 5, text: 'Perfect for the coquette era. Wore with a low bun and got 3 compliments at work.',                                       date: '6 days ago' },
    { name: 'Yara J.',    rating: 4, text: 'Beautiful quality, the pearls feel solid. One clip is slightly tighter than the other but both work.',                   date: '2 weeks ago' },
  ],
  11: [
    { name: 'Leo C.',     rating: 5, text: 'The pre-washed finish is perfect — looks worn-in from day one. Carried my entire record haul home in it.',               date: '5 days ago' },
    { name: 'Veda N.',    rating: 4, text: 'Sturdy canvas, great size. The inside pocket is really useful. Strap could be slightly longer.',                         date: '1 week ago' },
    { name: 'Kian M.',    rating: 5, text: 'The most aesthetic bag for the farmers market or the record store. Functional and beautiful.',                            date: '2 weeks ago' },
  ],
  12: [
    { name: 'Rami S.',    rating: 5, text: 'Structured but not stiff. The wool blend is so soft. Fits my big head too which is a win.',                             date: '3 days ago' },
    { name: 'Jai K.',     rating: 5, text: 'Clean, minimal, goes with everything. The metal adjuster is premium. No plastic nonsense.',                              date: '1 week ago' },
    { name: 'Pavi D.',    rating: 5, text: 'The ✦ embroidery is so subtle and so perfect. This is my new everyday cap.',                                            date: '2 weeks ago' },
  ],
  13: [
    { name: 'Hira T.',    rating: 5, text: 'My skin has never looked better. The hyaluronic + niacinamide combo is everything. Glass skin is real.',                date: '1 day ago' },
    { name: 'Diya R.',    rating: 5, text: 'Travel size is perfect. The frosted bottles look stunning on my vanity. Clean girl moment achieved.',                    date: '4 days ago' },
    { name: 'Sara M.',    rating: 4, text: 'Great quality serums. Vitamin C smells slightly different from others I\'ve tried but skin is glowing.',                 date: '2 weeks ago' },
  ],
  14: [
    { name: 'Iris W.',    rating: 5, text: 'Exactly what my room needed. Used it as a plant holder with some trailing ivy — looks magical.',                         date: '2 days ago' },
    { name: 'Sage L.',    rating: 5, text: 'The weave is so tight and the rope handle is really durable. Beautiful and functional.',                                  date: '1 week ago' },
    { name: 'Rose P.',    rating: 4, text: 'Lovely basket. Slightly smaller than I imagined but works perfectly for yarn storage.',                                   date: '3 weeks ago' },
  ],
  15: [
    { name: 'Ayla S.',    rating: 5, text: 'These are SO good. The platform is thick without being heavy. Wore them all day and my feet were fine.',                 date: '3 days ago' },
    { name: 'Mia K.',     rating: 5, text: 'Everything about these screams Y2K. The iridescent lace holes are so extra and I love it.',                              date: '1 week ago' },
    { name: 'Zoe T.',     rating: 4, text: 'Great shoes, run slightly narrow. Size up by half if you\'re in between.',                                               date: '2 weeks ago' },
  ],
  16: [
    { name: 'Aria D.',    rating: 5, text: 'These are the most flattering round frames I\'ve tried. The tortoiseshell colour is warm and perfect.',                  date: '4 days ago' },
    { name: 'Eli B.',     rating: 5, text: 'Solid acetate, spring hinges actually work. Wore these to my book club and was immediately accepted.',                   date: '1 week ago' },
    { name: 'Sam K.',     rating: 4, text: 'Really beautiful frames. Got mine as non-prescription and they\'re a statement piece all on their own.',                  date: '2 weeks ago' },
  ],
};
