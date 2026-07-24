// Default content migrated from the previously hardcoded site data.
// Used to seed MongoDB on first run so the website looks exactly the same.

export interface ProductFeature {
  title: string
  desc: string
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface ProductDoc {
  productId: number
  /** URL segment used by /product/[slug] */
  slug: string
  name: string
  category: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  discount: number
  featured: boolean
  active: boolean
  sortOrder: number

  /* ---- Product detail page content (all editable from the admin panel) ---- */
  /** One-line hook shown under the product title */
  tagline: string
  /** 1-2 sentence summary used on the detail page and for SEO */
  shortDescription: string
  /** Full description. Blank lines separate paragraphs. */
  longDescription: string
  /** Bullet list of results/benefits */
  benefits: string[]
  /** Titled feature or key-ingredient cards */
  features: ProductFeature[]
  /** Ordered how-to-use steps */
  howToUse: string[]
  /** Comma separated ingredient list */
  ingredients: string
  /** Extra images shown in the detail page thumbnail gallery */
  gallery: string[]
  /** Per-product frequently asked questions */
  faqs: ProductFaq[]
  /** Net weight / volume, e.g. "2 x 50g" */
  size: string
  /** Suitable skin types */
  skinType: string
}

/** Fields that only exist on the detail page — used to fill gaps on older documents. */
export const productDetailDefaults = {
  tagline: '',
  shortDescription: '',
  longDescription: '',
  benefits: [] as string[],
  features: [] as ProductFeature[],
  howToUse: [] as string[],
  ingredients: '',
  gallery: [] as string[],
  faqs: [] as ProductFaq[],
  size: '',
  skinType: 'All skin types',
}

export const defaultProducts: ProductDoc[] = [
  {
    productId: 7,
    slug: 'soft-and-glow-hand-and-foot-beauty-cream',
    name: 'Soft & Glow Hand & Foot Beauty Cream',
    category: 'HAND & FOOT CARE',
    price: 899,
    originalPrice: 1099,
    image: '/clour.jpg',
    rating: 4.9,
    reviews: 1245,
    discount: 18,
    featured: true,
    active: true,
    sortOrder: 1,
    tagline: 'Rescue cream for dry, tired hands and cracked heels',
    shortDescription:
      'A rich, fast-absorbing cream that softens rough hands and cracked heels while gently brightening dull, sun-exposed skin.',
    longDescription:
      'Hands and feet take the most punishment of any skin on your body — detergents, dishwashing, sun exposure and constant friction leave them rough, dark and dry. Soft & Glow is formulated specifically for these tougher areas, with a higher concentration of shea butter and glycerin than a regular body cream so it repairs without feeling greasy.\n\nThe cream melts into skin within seconds, sealing in moisture with a breathable barrier that survives hand washing. Used morning and night, it visibly softens callused heels in about a week and gradually evens out the darkened patches around knuckles, elbows and ankles.',
    benefits: [
      'Softens cracked heels and rough palms within 7 days',
      'Fades dark knuckles, elbows and ankles over time',
      'Deeply hydrates for up to 24 hours without stickiness',
      'Repairs the skin barrier damaged by soaps and detergents',
      'Absorbs fast so you can get straight back to work',
    ],
    features: [
      {
        title: 'Shea Butter',
        desc: 'A heavyweight emollient that fills in cracks and restores flexibility to hardened, callused skin.',
      },
      {
        title: 'Glycerin & Urea Blend',
        desc: 'Pulls moisture into the skin and gently loosens dead surface cells so heels feel smooth, not sanded.',
      },
      {
        title: 'Vitamin E',
        desc: 'Antioxidant protection that calms redness and helps repair sun and friction damage.',
      },
      {
        title: 'Non-Greasy Finish',
        desc: 'A lightweight silicone-free base that sinks in fast, so it will not slip on your phone or your steering wheel.',
      },
    ],
    howToUse: [
      'Wash and pat hands or feet dry — slightly damp skin absorbs best.',
      'Squeeze a pea-sized amount for hands, a coin-sized amount per foot.',
      'Massage in circular motions, paying extra attention to knuckles, cuticles and heels.',
      'For cracked heels, apply a thicker layer at night and wear cotton socks.',
      'Reapply after every hand wash for the fastest results.',
    ],
    ingredients:
      'Aqua, Shea Butter, Glycerin, Urea, Cetearyl Alcohol, Sweet Almond Oil, Tocopheryl Acetate (Vitamin E), Allantoin, Panthenol, Fragrance',
    gallery: ['/clour.jpg'],
    faqs: [
      {
        question: 'How long before I see softer heels?',
        answer:
          'Most customers notice a real difference in 5 to 7 nights when they apply a thick layer before bed and wear socks. Severely cracked heels can take two to three weeks.',
      },
      {
        question: 'Will it make my hands feel oily?',
        answer:
          'No. The base is deliberately light and absorbs in under a minute, which is why it is safe to use during the workday.',
      },
      {
        question: 'Can I use it on my elbows and knees?',
        answer:
          'Yes. Elbows, knees and ankles respond very well to this cream because it was designed for thicker, drier skin.',
      },
    ],
    size: '100g jar',
    skinType: 'All skin types, especially very dry and rough skin',
  },
  {
    productId: 9,
    slug: 'beauty-cream-and-bright-complexion-serum-pack',
    name: 'Beauty Cream & Bright Complexion Serum',
    category: '5-DAY CHALLENGE PACK',
    price: 2799,
    originalPrice: 3299,
    image: '/com.png',
    rating: 4.95,
    reviews: 3120,
    discount: 15,
    featured: true,
    active: true,
    sortOrder: 2,
    tagline: 'Our best-selling duo — visible results in five days',
    shortDescription:
      'The complete brightening routine: our signature Beauty Cream paired with the Bright Complexion Serum, packaged as a five-day challenge with a day-by-day plan.',
    longDescription:
      'This is the pack our customers keep coming back for. The Bright Complexion Serum goes on first and does the heavy lifting — Vitamin C and pearl extract work at the pigment level to interrupt melanin build-up. The Beauty Cream then locks everything in with avocado and milk extracts, so the treatment keeps working overnight instead of evaporating off your skin.\n\nWe call it the 5-Day Challenge because that is genuinely how long it takes to see the first change: a brighter, more even tone and a noticeable softening of dark patches. Keep going for four to six weeks and stubborn pigmentation, acne marks and sun damage continue to fade. The pack includes a simple printed routine card so you know exactly what to do each morning and night.',
    benefits: [
      'Visibly brighter, more even tone in as little as 5 days',
      'Fades dark spots, acne marks and melasma with continued use',
      'Serum plus cream together penetrate deeper than either alone',
      'Smooths texture and reduces the look of large pores',
      'Saves Rs. 500 compared to buying both products separately',
    ],
    features: [
      {
        title: 'Two-Step System',
        desc: 'Serum treats, cream seals. Layering them means the active ingredients stay on your skin all night instead of drying off.',
      },
      {
        title: 'Vitamin C + Pearl Extract',
        desc: 'The serum blocks the enzyme that triggers excess melanin, which is what actually fades a dark spot rather than just covering it.',
      },
      {
        title: 'Avocado & Milk Complex',
        desc: 'The cream restores the fatty acids and lactic acid your skin needs to stay soft while it brightens.',
      },
      {
        title: '5-Day Routine Card',
        desc: 'A printed day-by-day guide so you use the right amount at the right time and do not waste product.',
      },
    ],
    howToUse: [
      'Cleanse with a gentle face wash and pat dry.',
      'Morning and night: apply 3 to 4 drops of the Bright Complexion Serum to your whole face and neck.',
      'Wait 60 seconds for the serum to absorb fully.',
      'Apply a pea-sized amount of Beauty Cream over the top, avoiding the eye area.',
      'Always finish with sunscreen during the day — brightening results reverse without it.',
      'Repeat every day for the full 5-day challenge, then continue for lasting results.',
    ],
    ingredients:
      'Serum: Aqua, Sodium Ascorbyl Phosphate (Vitamin C), Pearl Powder Extract, Niacinamide, Glycerin, Sodium Hyaluronate, Licorice Root Extract. Cream: Aqua, Persea Gratissima (Avocado) Oil, Milk Protein Extract, Glycerin, Cetearyl Alcohol, Tocopheryl Acetate, Allantoin, Fragrance',
    gallery: ['/com.png', '/product-package.jpg', '/serum.jpg'],
    faqs: [
      {
        question: 'Is five days really enough to see a difference?',
        answer:
          'You will see brighter, more even-looking skin in five days. Deep pigmentation and old acne marks take four to six weeks of consistent use to fade properly.',
      },
      {
        question: 'Which goes on first, the serum or the cream?',
        answer:
          'Always the serum. It is thinner and needs direct contact with your skin. The cream goes on top to seal it in.',
      },
      {
        question: 'Can I use this if I have sensitive skin?',
        answer:
          'Yes, but start with once a day at night for the first week. Patch test behind your ear first if you react easily to new products.',
      },
      {
        question: 'Do I need sunscreen with this?',
        answer:
          'Absolutely. Brightening actives make your skin more sun-reactive, and without SPF the pigmentation you just faded will come straight back.',
      },
    ],
    size: 'Serum 30ml + Cream 30g',
    skinType: 'All skin types — normal, dry, oily and combination',
  },
  {
    productId: 10,
    slug: 'bright-complexion-serum',
    name: 'Bright Complexion Serum',
    category: 'VITAMIN C & PEARL EXTRACT',
    price: 1599,
    originalPrice: 1899,
    image: '/foutrh.jpg',
    rating: 4.91,
    reviews: 1876,
    discount: 16,
    featured: true,
    active: true,
    sortOrder: 3,
    tagline: 'Lightweight Vitamin C serum for dark spots and dullness',
    shortDescription:
      'A fast-absorbing brightening serum with stabilised Vitamin C, pearl extract and niacinamide that targets dark spots, acne marks and uneven tone.',
    longDescription:
      'Most brightening products sit on the surface and simply reflect light. This serum works underneath. Stabilised Vitamin C and niacinamide interrupt the melanin pathway that creates dark spots in the first place, while pearl extract — a traditional Asian brightening ingredient rich in amino acids and minerals — improves clarity and gives skin that lit-from-within finish.\n\nThe texture is deliberately watery-light so it disappears in seconds and layers under cream, sunscreen or makeup without pilling. It is also alcohol-free and non-comedogenic, which makes it safe for oily and breakout-prone skin that usually cannot tolerate brightening treatments.',
    benefits: [
      'Fades dark spots, sun damage and post-acne marks',
      'Brightens overall dullness for a clearer complexion',
      'Reduces the look of enlarged pores and rough texture',
      'Hydrates with hyaluronic acid instead of drying skin out',
      'Absorbs in seconds and layers cleanly under makeup',
    ],
    features: [
      {
        title: 'Stabilised Vitamin C',
        desc: 'Sodium Ascorbyl Phosphate — a gentler, more stable form of Vitamin C that does not oxidise and sting like pure ascorbic acid.',
      },
      {
        title: 'Pearl Powder Extract',
        desc: 'Rich in conchiolin protein and trace minerals, traditionally used across Asia to bring clarity and luminosity to dull skin.',
      },
      {
        title: 'Niacinamide',
        desc: 'Blocks pigment transfer to the skin surface, tightens pores and strengthens the barrier at the same time.',
      },
      {
        title: 'Hyaluronic Acid',
        desc: 'Holds water in the upper layers so brightening never comes at the cost of dry, tight-feeling skin.',
      },
    ],
    howToUse: [
      'Use on clean, dry skin morning and night.',
      'Dispense 3 to 4 drops onto your fingertips.',
      'Press gently over the face and neck — do not rub hard.',
      'Wait a minute, then follow with moisturiser.',
      'In the morning, always finish with SPF 30 or higher.',
    ],
    ingredients:
      'Aqua, Sodium Ascorbyl Phosphate (Vitamin C), Niacinamide, Pearl Powder Extract, Glycerin, Sodium Hyaluronate, Panthenol, Licorice Root Extract, Allantoin, Phenoxyethanol',
    gallery: ['/foutrh.jpg', '/serum.jpg', '/about-serum.jpg'],
    faqs: [
      {
        question: 'Will this serum sting or cause peeling?',
        answer:
          'It should not. We use Sodium Ascorbyl Phosphate rather than pure ascorbic acid precisely because it delivers brightening without the tingling and flaking.',
      },
      {
        question: 'Can I use it with my existing moisturiser?',
        answer:
          'Yes. Apply the serum first, let it absorb for a minute, then use any moisturiser you already like.',
      },
      {
        question: 'How long does one bottle last?',
        answer:
          'Using 3 to 4 drops twice a day, a 30ml bottle lasts roughly six to eight weeks.',
      },
      {
        question: 'Is it safe for oily and acne-prone skin?',
        answer:
          'Yes. It is oil-free, alcohol-free and non-comedogenic, and the niacinamide actively helps with oil control and post-acne marks.',
      },
    ],
    size: '30ml bottle with dropper',
    skinType: 'All skin types including oily and acne-prone',
  },
  {
    productId: 8,
    slug: 'bright-complexion-cream-with-serum',
    name: 'Bright Complexion Cream with Serum',
    category: 'COMPLEXION DUO SET',
    price: 2499,
    originalPrice: 2899,
    image: '/bri.png',
    rating: 4.93,
    reviews: 2087,
    discount: 14,
    featured: true,
    active: true,
    sortOrder: 4,
    tagline: 'Day cream and night serum matched to work together',
    shortDescription:
      'A coordinated duo — a nourishing brightening cream for daytime and a concentrated serum for night — so your skin gets the right treatment at the right time.',
    longDescription:
      'Your skin does different things at different hours. During the day it needs protection and hydration; at night it repairs and renews. This set gives you a product for each: a richer Bright Complexion Cream that shields and evens tone through the day, and the concentrated serum that does the deep pigment work while you sleep.\n\nBecause both products are built on the same brightening complex, they reinforce each other instead of competing. Customers with melasma and stubborn cheek pigmentation tend to prefer this set over a single product, because the round-the-clock approach keeps melanin production suppressed rather than letting it bounce back between applications.',
    benefits: [
      'Round-the-clock brightening — treats by night, protects by day',
      'Targets melasma, sun spots and uneven patches',
      'Cream provides lasting hydration for dry or mature skin',
      'Improves firmness and smoothness alongside tone',
      'Better value than buying each product on its own',
    ],
    features: [
      {
        title: 'Day Cream',
        desc: 'A cushioned, non-greasy cream with avocado oil and Vitamin E that hydrates for hours and creates a smooth base for makeup.',
      },
      {
        title: 'Night Serum',
        desc: 'A higher concentration of Vitamin C and niacinamide, used overnight when your skin is most receptive to actives.',
      },
      {
        title: 'Shared Brightening Complex',
        desc: 'Both formulas use the same core actives, so the treatment is continuous instead of stopping and starting.',
      },
      {
        title: 'Fragrance-Light Formula',
        desc: 'Only a trace of fragrance, keeping the set comfortable for people who find scented skincare irritating.',
      },
    ],
    howToUse: [
      'Morning: cleanse, apply Bright Complexion Cream to face and neck, then sunscreen.',
      'Night: cleanse thoroughly to remove sunscreen and makeup.',
      'Apply 3 to 4 drops of serum and press into skin.',
      'Optionally layer a thin coat of the cream on top if your skin feels dry.',
      'Use every day — consistency matters far more than quantity.',
    ],
    ingredients:
      'Cream: Aqua, Persea Gratissima (Avocado) Oil, Glycerin, Niacinamide, Cetearyl Alcohol, Tocopheryl Acetate, Allantoin, Fragrance. Serum: Aqua, Sodium Ascorbyl Phosphate, Niacinamide, Pearl Powder Extract, Sodium Hyaluronate, Licorice Root Extract',
    gallery: ['/bri.png', '/serum.jpg', '/product-package.jpg'],
    faqs: [
      {
        question: 'How is this different from the 5-Day Challenge Pack?',
        answer:
          'The 5-Day Pack is built around a short intensive routine with our signature Beauty Cream. This set pairs a richer daytime cream with the night serum, which suits dry and mature skin better for long-term use.',
      },
      {
        question: 'Can I use the cream at night too?',
        answer:
          'Yes. Apply the serum first and then a thin layer of cream on top if your skin feels tight or dry overnight.',
      },
      {
        question: 'Will it help with melasma?',
        answer:
          'It helps fade melasma over six to twelve weeks, but only if you wear sunscreen daily. Melasma is driven by sun and heat exposure and will return without protection.',
      },
    ],
    size: 'Cream 50g + Serum 30ml',
    skinType: 'Normal, dry and mature skin',
  },
  {
    productId: 89,
    slug: 'bright-complexion-face-wash',
    name: 'Bright Complexion Face Wash',
    category: 'COMPLEXION DUO SET',
    price: 2499,
    originalPrice: 2899,
    image: '/face-wash-product.jpg',
    rating: 4.93,
    reviews: 2087,
    discount: 14,
    featured: true,
    active: true,
    sortOrder: 5,
    tagline: 'Brightening cleanser that never strips your skin',
    shortDescription:
      'A creamy, low-foam cleanser with Vitamin C and mild fruit acids that lifts dirt, sunscreen and oil while gradually brightening your complexion.',
    longDescription:
      'A cleanser has only a minute on your skin, so it has to be efficient without being harsh. This one uses a sulphate-free, pH-balanced base that dissolves sunscreen, pollution and excess oil in a single wash, then leaves behind glycerin and panthenol so your face feels comfortable rather than squeaky.\n\nMild fruit acids gently loosen the dull layer of dead cells that makes skin look grey and rough, while Vitamin C begins the brightening work that your serum finishes. Because it does not strip your barrier, you can use it twice a day indefinitely without the tightness and rebound oiliness that harsh face washes cause.',
    benefits: [
      'Removes sunscreen, makeup and oil in one wash',
      'Gently exfoliates dullness with mild fruit acids',
      'Leaves skin soft and comfortable, never tight',
      'Reduces blackheads and congestion over time',
      'Sulphate-free and pH balanced for daily use',
    ],
    features: [
      {
        title: 'Sulphate-Free Base',
        desc: 'Cleans thoroughly without SLS, so your skin barrier stays intact and does not overproduce oil in response.',
      },
      {
        title: 'Vitamin C',
        desc: 'Starts the brightening process at the cleansing stage and helps prevent new pigmentation from settling in.',
      },
      {
        title: 'Mild Fruit Acids',
        desc: 'A low dose of AHAs that loosen dead surface cells, which is what makes skin look instantly clearer.',
      },
      {
        title: 'Glycerin & Panthenol',
        desc: 'Humectants left behind on the skin so it feels cushioned instead of stripped after rinsing.',
      },
    ],
    howToUse: [
      'Wet your face with lukewarm water.',
      'Massage a coin-sized amount into a light lather for 30 to 60 seconds.',
      'Focus on the nose, chin and hairline where oil collects.',
      'Rinse thoroughly and pat dry with a clean towel.',
      'Follow immediately with serum and moisturiser while skin is still slightly damp.',
    ],
    ingredients:
      'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Sodium Ascorbyl Phosphate, Glycolic Acid, Panthenol, Allantoin, Citrus Extract, Phenoxyethanol',
    gallery: ['/face-wash-product.jpg', '/face-wash-single.jpg', '/face-wash-pink.jpg'],
    faqs: [
      {
        question: 'Can I use this twice a day?',
        answer:
          'Yes. It is pH balanced and sulphate-free, so morning and night use is fine for most skin types.',
      },
      {
        question: 'Does it remove waterproof makeup?',
        answer:
          'It removes most makeup and sunscreen. For waterproof mascara or long-wear foundation, use a cleansing oil or balm first, then this as a second cleanse.',
      },
      {
        question: 'It barely foams — is that normal?',
        answer:
          'Yes, and it is intentional. Heavy foam usually means harsh sulphates. This lathers lightly while still cleaning completely.',
      },
    ],
    size: '150ml tube',
    skinType: 'All skin types including sensitive',
  },
  {
    productId: 1,
    slug: 'whitening-body-lotion-pack',
    name: 'Whitening Body Lotion Pack',
    category: 'COMPLETE BODY CARE',
    price: 2070,
    originalPrice: 2300,
    image: '/fifth.png',
    rating: 4.95,
    reviews: 1434,
    discount: 10,
    featured: true,
    active: true,
    sortOrder: 6,
    tagline: 'Full-body brightening from neck to toe',
    shortDescription:
      'A multi-bottle lotion pack that evens out tan lines, dark knees and elbows while keeping the whole body soft for a full 24 hours.',
    longDescription:
      'Facial skincare gets all the attention, but uneven tone on arms, legs, neck and back is what most people actually notice in photographs. This pack gives you enough product to treat your entire body consistently — which is the only way body brightening ever works.\n\nThe lotion combines niacinamide and licorice root extract to fade tan lines and hyperpigmentation with a lightweight emulsion that absorbs in under a minute, so you can dress straight after applying. Shea butter and almond oil handle the hydration side, gradually smoothing the bumpy, dry texture on upper arms and shins.',
    benefits: [
      'Evens out tan lines, dark knees, elbows and underarms',
      'Brightens the neck and chest where sun damage shows most',
      'Softens rough, bumpy skin on arms and shins',
      '24-hour hydration in a lotion that absorbs in under a minute',
      'Multi-bottle pack sized for consistent daily full-body use',
    ],
    features: [
      {
        title: 'Niacinamide',
        desc: 'The most reliable brightening ingredient for body skin — it fades pigmentation while strengthening the barrier.',
      },
      {
        title: 'Licorice Root Extract',
        desc: 'A botanical melanin inhibitor that is gentle enough for large surface areas and delicate spots like underarms.',
      },
      {
        title: 'Shea Butter & Almond Oil',
        desc: 'Restores softness to dry legs and arms without the heavy, sticky feel of a body butter.',
      },
      {
        title: 'Fast-Absorbing Emulsion',
        desc: 'Sinks in quickly so you can get dressed immediately without staining clothes.',
      },
    ],
    howToUse: [
      'Apply within three minutes of showering, while skin is still damp.',
      'Use long upward strokes over legs, arms, neck and chest.',
      'Massage extra product into knees, elbows, ankles and underarms.',
      'Use twice daily — after your morning shower and before bed — for the fastest change.',
      'Apply sunscreen to exposed areas during the day to protect your progress.',
    ],
    ingredients:
      'Aqua, Glycerin, Niacinamide, Shea Butter, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Cetearyl Alcohol, Licorice Root Extract, Tocopheryl Acetate, Allantoin, Fragrance',
    gallery: ['/fifth.png', '/lotion-pack.jpg'],
    faqs: [
      {
        question: 'How long until my tan lines fade?',
        answer:
          'Expect three to four weeks of twice-daily use for tan lines, and six to eight weeks for long-standing dark knees and elbows.',
      },
      {
        question: 'Is it safe on underarms?',
        answer:
          'Yes. Avoid applying immediately after shaving or waxing — wait a day so the skin is not irritated.',
      },
      {
        question: 'Can I use it on my face?',
        answer:
          'We do not recommend it. Body lotion is richer than facial skincare and can clog facial pores. Use the Bright Complexion Serum instead.',
      },
    ],
    size: 'Multi-bottle pack, 3 x 200ml',
    skinType: 'All body skin types',
  },
  {
    productId: 2,
    slug: 'urgent-whitening-serum',
    name: 'Urgent Whitening Serum',
    category: 'ADVANCED SERUM TREATMENT',
    price: 1499,
    originalPrice: 1699,
    image: '/comsix.png',
    rating: 4.95,
    reviews: 9243,
    discount: 12,
    featured: true,
    active: true,
    sortOrder: 7,
    tagline: 'Our most-reviewed serum — for events, shoots and deadlines',
    shortDescription:
      'A high-strength brightening serum built for fast visible results before a wedding, shoot or event, with over 9,000 customer reviews behind it.',
    longDescription:
      'Urgent Whitening Serum is our most-purchased product, and it earns that position because of the timeline. Where a standard brightening serum takes a month to show change, this one is dosed higher and combines an immediate optical effect with genuine pigment correction, so your skin looks clearer within days while the deeper fading continues underneath.\n\nAlpha arbutin and a boosted Vitamin C concentration suppress melanin at the source. Niacinamide tightens pores and calms redness so the surface actually looks smoother, not just paler. It is our recommendation for anyone with a wedding, shoot or event on the calendar — start two to three weeks out for the best result, though even a few days of use makes a difference.',
    benefits: [
      'Visible brightening within the first few days of use',
      'Fades dark spots, acne marks and dullness at the source',
      'Tightens the look of pores and calms redness',
      'Non-sticky finish that sits perfectly under makeup',
      'Backed by more than 9,000 customer reviews',
    ],
    features: [
      {
        title: 'Alpha Arbutin',
        desc: 'A powerful, well-tolerated melanin inhibitor considered one of the most effective spot-fading actives available without a prescription.',
      },
      {
        title: 'Boosted Vitamin C',
        desc: 'A higher concentration than our standard serum, for people who want results on a deadline.',
      },
      {
        title: 'Niacinamide',
        desc: 'Refines texture, controls oil and reduces redness so brightness reads as clarity rather than flatness.',
      },
      {
        title: 'Makeup-Ready Finish',
        desc: 'Dries down completely with no tackiness, so foundation and concealer will not pill or slide.',
      },
    ],
    howToUse: [
      'Start with clean, dry skin morning and night.',
      'Apply 3 to 4 drops and press over face, neck and any dark patches.',
      'If your skin is sensitive, begin with night use only for the first three days.',
      'Follow with moisturiser to lock the serum in.',
      'Daytime sunscreen is essential — without it results will reverse.',
    ],
    ingredients:
      'Aqua, Sodium Ascorbyl Phosphate (Vitamin C), Alpha Arbutin, Niacinamide, Glycerin, Sodium Hyaluronate, Panthenol, Licorice Root Extract, Allantoin, Phenoxyethanol',
    gallery: ['/comsix.png', '/serum.jpg', '/about-serum.jpg'],
    faqs: [
      {
        question: 'How far in advance of an event should I start?',
        answer:
          'Two to three weeks gives the best result. If your event is sooner, even five to seven days of twice-daily use produces a noticeable difference.',
      },
      {
        question: 'How is this different from the Bright Complexion Serum?',
        answer:
          'This one is stronger and adds alpha arbutin for faster spot fading. The Bright Complexion Serum is gentler and better for long-term everyday maintenance.',
      },
      {
        question: 'Can I use it with the Beauty Cream?',
        answer:
          'Yes, and we recommend it. Serum first, cream on top to seal it in.',
      },
      {
        question: 'Is it suitable for sensitive skin?',
        answer:
          'Start at night only, every other day, for the first week. Patch test behind your ear if you react easily to actives.',
      },
    ],
    size: '30ml bottle with dropper',
    skinType: 'All skin types — introduce gradually if sensitive',
  },
  {
    productId: 3,
    slug: 'bright-complexion-beauty-face-wash',
    name: 'Bright Complexion Beauty Face Wash',
    category: 'GENTLE CLEANSING',
    price: 799,
    originalPrice: 899,
    image: '/face-wash-pink.jpg',
    rating: 4.95,
    reviews: 6665,
    discount: 11,
    featured: true,
    active: true,
    sortOrder: 8,
    tagline: 'The everyday cleanser thousands start their routine with',
    shortDescription:
      'A gentle daily face wash that clears oil, dirt and pollution without stripping — the perfect first step before serum and cream.',
    longDescription:
      'Everything else in your routine works better on properly cleansed skin. This face wash is built to be the reliable everyday option: a soft, creamy lather that clears the day off your face without leaving it tight, flaky or reactive.\n\nIt is free of sulphates, alcohol and drying detergents, and pH balanced to sit close to your skin\'s natural 5.5. That matters because a high-pH cleanser damages your barrier and triggers rebound oiliness a few hours later. With over 6,600 reviews it is the product our customers restock most often, usually alongside a serum.',
    benefits: [
      'Clears oil, dirt and pollution without over-drying',
      'Maintains your natural pH so skin stays balanced',
      'Reduces breakouts and blackheads with regular use',
      'Leaves skin soft and prepped for serum absorption',
      'Gentle enough for morning and night, every day',
    ],
    features: [
      {
        title: 'pH Balanced 5.5',
        desc: 'Matched to your skin\'s natural acidity so cleansing does not compromise your barrier.',
      },
      {
        title: 'Sulphate-Free Lather',
        desc: 'A soft, creamy foam from mild coconut-derived surfactants instead of harsh SLS.',
      },
      {
        title: 'Aloe Vera & Chamomile',
        desc: 'Soothing botanicals that calm redness and irritation while you cleanse.',
      },
      {
        title: 'Vitamin B5',
        desc: 'Panthenol left behind on the skin to keep it hydrated and comfortable after rinsing.',
      },
    ],
    howToUse: [
      'Wet your face with lukewarm — not hot — water.',
      'Work a small amount into a lather in your palms first.',
      'Massage over your face for 30 seconds, avoiding the eyes.',
      'Rinse well and pat dry.',
      'Apply serum and moisturiser while skin is still slightly damp.',
    ],
    ingredients:
      'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Aloe Barbadensis Leaf Juice, Chamomilla Recutita Extract, Panthenol (Vitamin B5), Allantoin, Phenoxyethanol',
    gallery: ['/face-wash-pink.jpg', '/face-wash-single.jpg', '/face-wash-cream.jpg'],
    faqs: [
      {
        question: 'Is this suitable for oily, acne-prone skin?',
        answer:
          'Yes. Because it does not strip your barrier, your skin is less likely to overproduce oil later in the day, which helps with breakouts.',
      },
      {
        question: 'How is it different from the Bright Complexion Face Wash?',
        answer:
          'This one is a pure gentle cleanser. The Bright Complexion Face Wash adds Vitamin C and mild fruit acids for extra brightening and exfoliation.',
      },
      {
        question: 'Can I use it on my body?',
        answer:
          'You can, though it is more economical to use our Natural Moisture Care Beauty Soap for the body.',
      },
    ],
    size: '150ml tube',
    skinType: 'All skin types including sensitive and acne-prone',
  },
  {
    productId: 4,
    slug: 'natural-moisture-care-beauty-soap',
    name: 'Natural Moisture Care Beauty Soap',
    category: 'LUXURIOUS SOAP SET',
    price: 1299,
    originalPrice: 1499,
    image: '/soap-pack.jpg',
    rating: 4.88,
    reviews: 3421,
    discount: 13,
    featured: true,
    active: true,
    sortOrder: 9,
    tagline: 'Cream-enriched beauty bars that do not dry you out',
    shortDescription:
      'A multi-bar set of moisturising beauty soaps with milk cream and glycerin that cleanse the body gently while brightening and softening skin.',
    longDescription:
      'Ordinary soap is alkaline and it takes your skin\'s natural oils with it, which is why your legs itch and your arms feel tight after a shower. These bars are superfatted and cream-enriched, meaning a portion of the moisturising oils is left unsaponified so they deposit onto your skin as you wash.\n\nMilk cream provides lactic acid for gentle, gradual brightening, while glycerin and coconut oil handle hydration. The bars are triple-milled so they hold their shape and last far longer than soft supermarket soap. The set is sized so you can keep bars in the bathroom, the kitchen and a travel bag at once.',
    benefits: [
      'Cleanses without the tight, itchy feeling ordinary soap leaves',
      'Milk cream and lactic acid gently brighten body skin',
      'Leaves a soft, moisturised finish straight out of the shower',
      'Triple-milled bars last significantly longer',
      'Multi-bar set for the bathroom, kitchen and travel',
    ],
    features: [
      {
        title: 'Milk Cream',
        desc: 'A natural source of lactic acid that softens and gradually brightens skin without irritation.',
      },
      {
        title: 'Superfatted Formula',
        desc: 'Extra moisturising oils are left in the bar so they transfer to your skin instead of washing away.',
      },
      {
        title: 'Glycerin & Coconut Oil',
        desc: 'Draws water into the skin and creates a soft, creamy lather that rinses clean.',
      },
      {
        title: 'Triple-Milled Bar',
        desc: 'Denser and harder than standard soap, so it does not turn to mush and lasts much longer.',
      },
    ],
    howToUse: [
      'Wet the bar and work up a lather in your hands or on a loofah.',
      'Massage over the body, paying attention to elbows, knees and ankles.',
      'Rinse thoroughly with lukewarm water.',
      'Pat dry and apply body lotion within three minutes to lock in moisture.',
      'Store the bar on a draining dish between uses so it lasts longer.',
    ],
    ingredients:
      'Sodium Palmate, Sodium Palm Kernelate, Aqua, Milk Cream, Glycerin, Cocos Nucifera (Coconut) Oil, Tocopheryl Acetate, Titanium Dioxide, Fragrance',
    gallery: ['/soap-pack.jpg', '/beauty-soap.jpg'],
    faqs: [
      {
        question: 'Can I use these bars on my face?',
        answer:
          'We recommend a dedicated face wash instead. Even a gentle soap bar has a higher pH than facial skin prefers.',
      },
      {
        question: 'How many bars are in the set?',
        answer:
          'The set contains four full-size 100g bars.',
      },
      {
        question: 'Will it help with dark elbows and knees?',
        answer:
          'It helps gradually thanks to the lactic acid, but pair it with the Whitening Body Lotion Pack for a visibly faster result.',
      },
    ],
    size: '4 x 100g bars',
    skinType: 'All skin types, especially dry body skin',
  },
  {
    productId: 5,
    slug: 'beauty-cream-and-face-wash-combo',
    name: 'Beauty Cream & Face Wash Combo',
    category: 'COMPLETE SKINCARE SET',
    price: 1899,
    originalPrice: 2199,
    image: '/face-wash-cream.jpg',
    rating: 4.92,
    reviews: 2156,
    discount: 14,
    featured: true,
    active: true,
    sortOrder: 10,
    tagline: 'The simplest complete routine — cleanse, then treat',
    shortDescription:
      'Our signature Beauty Cream paired with the gentle Beauty Face Wash: a two-product routine that covers everything a beginner needs.',
    longDescription:
      'If you are starting skincare from scratch, or you simply want something you will actually keep up with, this is the set to buy. Two products, two steps, morning and night. The face wash clears oil, sunscreen and pollution without stripping; the Beauty Cream then brightens and nourishes with avocado and milk extracts.\n\nUsing a matched cleanser and cream matters more than people expect. A harsh cleanser undoes what a good cream is trying to do, because a damaged barrier cannot hold on to actives or moisture. These two are formulated to work as a pair, which is why this combo has become our most popular starter set.',
    benefits: [
      'A complete morning and night routine in just two steps',
      'Brightens tone and fades dark spots with consistent use',
      'Keeps skin hydrated and comfortable, never tight',
      'Cleanser and cream formulated to work as a matched pair',
      'Ideal starter set at a lower price than buying separately',
    ],
    features: [
      {
        title: 'Signature Beauty Cream',
        desc: 'Avocado oil and milk extract to brighten, soften and nourish morning and night.',
      },
      {
        title: 'Gentle Beauty Face Wash',
        desc: 'A pH-balanced, sulphate-free cleanser that preps skin so the cream can absorb properly.',
      },
      {
        title: 'Two-Step Simplicity',
        desc: 'No complicated layering. Two products you will actually use every day, which is what produces results.',
      },
      {
        title: 'Suits Every Skin Type',
        desc: 'Light enough for oily skin, nourishing enough for dry — a genuinely universal pairing.',
      },
    ],
    howToUse: [
      'Morning: wash your face, pat dry, apply a pea-sized amount of Beauty Cream, then sunscreen.',
      'Night: wash thoroughly to remove sunscreen and makeup.',
      'Apply Beauty Cream to your face and neck, avoiding the eye area.',
      'Use both products every day — results come from consistency, not quantity.',
      'Add the Bright Complexion Serum between the two steps when you want faster progress.',
    ],
    ingredients:
      'Cream: Aqua, Persea Gratissima (Avocado) Oil, Milk Protein Extract, Glycerin, Cetearyl Alcohol, Niacinamide, Tocopheryl Acetate, Allantoin, Fragrance. Face Wash: Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol',
    gallery: ['/face-wash-cream.jpg', '/face-wash-single.jpg', '/comsix.png'],
    faqs: [
      {
        question: 'Is this a good set for a complete beginner?',
        answer:
          'It is our top recommendation for beginners. Two steps, twice a day, nothing to overthink.',
      },
      {
        question: 'Do I still need a serum?',
        answer:
          'Not to start. Once you are comfortable with the routine, adding the Bright Complexion Serum between cleansing and cream speeds up brightening noticeably.',
      },
      {
        question: 'How long will the set last?',
        answer:
          'With twice-daily use, roughly six to eight weeks.',
      },
    ],
    size: 'Cream 30g + Face Wash 150ml',
    skinType: 'All skin types',
  },
]

export const defaultTestimonials: TestimonialDoc[] = [
  {
    name: 'Ayesha Khan',
    text: 'This cream transformed my skin completely. After just two weeks, my complexion looks brighter and my skin feels incredibly soft and hydrated.',
    rating: 5,
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Fatima Ahmed',
    text: 'I love how lightweight yet effective this product is. The luxurious feel and amazing results make it worth every penny.',
    rating: 5,
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Maria Malik',
    text: "Best skincare investment I've made. The quality is premium, and you can feel the difference in your skin immediately.",
    rating: 5,
    active: true,
    sortOrder: 3,
  },
]

export interface TestimonialDoc {
  name: string
  text: string
  rating: number
  active: boolean
  sortOrder: number
}

export interface SiteSettings {
  hero: {
    title: string
    description: string
    image: string
    buttonText: string
    buttonLink: string
  }
  homeSections: {
    featuredEyebrow: string
    featuredTitle: string
    featuredSubtitle: string
    testimonialsEyebrow: string
    testimonialsTitle: string
    testimonialsSubtitle: string
    ctaTitle: string
    ctaSubtitle: string
    ctaButtonText: string
    ctaButtonLink: string
  }
  promoBanner: {
    enabled: boolean
    title: string
    message: string
    offerText: string
    image: string
    buttonText: string
    buttonLink: string
    durationSeconds: number
  }
  shopPage: {
    eyebrow: string
    title: string
    subtitle: string
  }
  aboutPage: {
    heroEyebrow: string
    heroTitle: string
    missionTitle: string
    missionText: string
    whyChooseTitle: string
    whyChoosePoints: string[]
    valuesTitle: string
    values: { title: string; desc: string }[]
    visionTitle: string
    visionParagraphs: string[]
  }
  contactPage: {
    heroEyebrow: string
    heroTitle: string
    heroSubtitle: string
    infoTitle: string
    infoSubtitle: string
    email: string
    phone: string
    address: string
  }
  footer: {
    email: string
    instagramUrl: string
    facebookUrl: string
    copyrightText: string
  }
  whatsapp: {
    phoneNumber: string
  }
  checkout: {
    shippingCost: number
  }
  seo: {
    siteTitle: string
    siteDescription: string
  }
}

export const defaultSettings: SiteSettings = {
  hero: {
    title: 'Color White Beauty Cream',
    description:
      'Color White Beauty Cream is a skin brightening cream that helps to reduce dark spots and uneven skin tone. Infused with natural avocado and milk, it nourishes and moisturizes the skin for a radiant complexion.',
    image: '/hero-img.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  homeSections: {
    featuredEyebrow: 'Our Collection',
    featuredTitle: 'Featured Products',
    featuredSubtitle:
      'Carefully curated skincare solutions designed to transform your routine and elevate your natural beauty.',
    testimonialsEyebrow: 'Loved by thousands',
    testimonialsTitle: 'Customer Reviews',
    testimonialsSubtitle:
      'See what our customers are saying about their experience with Color White Beauty.',
    ctaTitle: 'Ready to Transform Your Skin?',
    ctaSubtitle:
      'Join thousands of satisfied customers who have discovered the luxury of premium skincare.',
    ctaButtonText: 'Explore Full Collection',
    ctaButtonLink: '/shop',
  },
  promoBanner: {
    enabled: true,
    title: 'Welcome to Color White Beauty!',
    message: 'Free Shipping on orders above Rs. 2000.',
    offerText: 'Special Offer Inside!',
    image: '/hero-img.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    durationSeconds: 5,
  },
  shopPage: {
    eyebrow: 'Discover',
    title: 'Our *Complete* Collection',
    subtitle:
      'Explore our full range of premium skincare products, each crafted to deliver visible results.',
  },
  aboutPage: {
    heroEyebrow: 'Our Story',
    heroTitle: 'About *Color White* Beauty',
    missionTitle: 'Our Mission',
    missionText:
      "At Color White Beauty, we believe that true luxury is about quality, authenticity, and results. Our mission is to provide premium skincare solutions that combine nature's finest ingredients with modern beauty science.",
    whyChooseTitle: 'Why Choose Us',
    whyChoosePoints: [
      'Carefully selected, premium natural ingredients',
      'Dermatologically tested and proven effective',
      'Cruelty-free and ethically sourced',
      'Scientifically formulated for all skin types',
      'Luxury packaging with exceptional quality',
    ],
    valuesTitle: 'Our Values',
    values: [
      {
        title: 'Premium Quality',
        desc: 'Every product is crafted with meticulous attention to detail, ensuring the highest standards of excellence.',
      },
      {
        title: 'Natural Excellence',
        desc: 'We source the finest natural ingredients from around the world, combined with cutting-edge formulation.',
      },
      {
        title: 'Customer First',
        desc: 'Your satisfaction is our priority. We stand behind every product with our commitment to quality.',
      },
    ],
    visionTitle: 'Our Vision',
    visionParagraphs: [
      "We envision a world where premium skincare is accessible to everyone who desires it. By combining luxury with affordability, we're revolutionizing the beauty industry and empowering individuals to feel confident in their own skin.",
      'Each product in our collection is a promise—a promise of quality, efficacy, and the transformative power of self-care.',
    ],
  },
  contactPage: {
    heroEyebrow: "Let's Connect",
    heroTitle: "We'd Love to *Hear* From You",
    heroSubtitle:
      "Have questions about our products? Need personalized recommendations? We're here to help and would love to connect with you.",
    infoTitle: 'Contact Information',
    infoSubtitle:
      'Reach out through your preferred channel. Our team responds quickly and is always happy to assist.',
    email: 'Sm9626157@gmail.com',
    phone: '+92 300 7222669',
    address: '10-H Afghani Road, Samanabad, Lahore, 54000, Punjab, Pakistan',
  },
  footer: {
    email: 'colorwhitecosmetics@gmail.com',
    instagramUrl: 'https://www.instagram.com/colorwhitecosmetics/',
    facebookUrl: 'https://web.facebook.com/ColorWhiteBeautyCream',
    copyrightText: 'Copyright © 2026 Color White Beauty',
  },
  whatsapp: {
    phoneNumber: '+923404476857',
  },
  checkout: {
    shippingCost: 200,
  },
  seo: {
    siteTitle: 'Color White Beauty | Premium Skincare Collection',
    siteDescription:
      'Discover luxury skincare products by Color White Beauty. Premium creams, serums, and treatments crafted for radiant skin. Shop now!',
  },
}
