// Default content migrated from the previously hardcoded site data.
// Used to seed MongoDB on first run so the website looks exactly the same.

export interface ProductDoc {
  productId: number
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
}

export interface TestimonialDoc {
  name: string
  text: string
  rating: number
  active: boolean
  sortOrder: number
}

export const defaultProducts: ProductDoc[] = [
  {
    productId: 7,
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
  },
  {
    productId: 9,
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
  },
  {
    productId: 10,
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
  },
  {
    productId: 8,
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
  },
  {
    productId: 89,
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
  },
  {
    productId: 1,
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
  },
  {
    productId: 2,
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
  },
  {
    productId: 3,
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
  },
  {
    productId: 4,
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
  },
  {
    productId: 5,
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
