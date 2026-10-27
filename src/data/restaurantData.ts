export interface MenuItem {
  id: string;
  name: string;
  category:
    | 'buffet'
    | 'north-indian'
    | 'pan-asian-mexican'
    | 'continental'
    | 'desserts';
  categoryLabel: string;
  price: number;
  unitLabel: string;
  description: string;
  jainAvailable: boolean;
  isSignature: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spiced' | 'Sweet';
  serves: string;
  artworkTheme:
    | 'buffet-spread'
    | 'paneer-tikka'
    | 'dal-bukhara'
    | 'kofta-royal'
    | 'sizzler-asian'
    | 'mexican-fiesta'
    | 'woodfired-pizza'
    | 'pasta-truffle'
    | 'gulab-kunafa'
    | 'chaat-counter';
}

export interface BanquetPackage {
  id: string;
  tierIndex: string;
  name: string;
  pricePerPlate: number;
  minGuests: number;
  maxGuests: number;
  subtitle: string;
  includedSummary: string;
  courses: string[];
  hallFeatures: string[];
}

export interface BanquetAddon {
  id: string;
  name: string;
  price: number;
  billingType: 'flat' | 'per-guest';
  description: string;
}

export interface GuestReview {
  id: string;
  guestName: string;
  occasion: string;
  location: string;
  visitDate: string;
  rating: string;
  quote: string;
  outcomeHighlight: string;
}

export const RESTAURANT_INFO = {
  name: 'Thaath Maath',
  fullTitle: 'Thaath Maath — A Pure Veg MultiCuisine Restaurant & Banquet',
  tagline: '100% Pure Vegetarian Multi-Cuisine Dining, 100+ Item Unlimited Buffet & Grand Banquet Hall in Nikol, Ahmedabad',
  addressLine1: '3rd Floor, Hilltown Plaza, Near Amar Jawan Circle',
  addressLine2: 'Cross Road, Sardar Patel Ring Road, Nikol',
  cityStatePin: 'Ahmedabad, Gujarat 380049',
  fullAddress:
    '3rd Floor, Hilltown Plaza, Cross Road, Near Amar Jawan Circle, Sardar Patel Ring Road, Nikol, Ahmedabad, Gujarat 380049',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Thaath+Maath+A+Pure+Veg+MultiCuisine+Restaurant+%26+Banquet+Hilltown+Plaza+Nikol+Ahmedabad',
  googleKnowledgeGraphUrl:
    'https://www.google.com/search?kgmid=/g/11vq0zjpmc&q=Thaath+Maath+I+A+Pure+Veg+MultiCuisine+Restaurant+%26+Banquet',
  phonePrimary: '+91 97248 52137',
  phoneBanquet: '+91 97248 52137',
  whatsappNumber: '919724852137',
  whatsappDisplay: '+91 97248 52137',
  email: 'reservations@thaathmaathnikol.in',
  lunchHours: '11:30 AM – 3:00 PM',
  dinnerHours: '7:00 PM – 11:00 PM',
  costForTwo: '₹1,250 for two (approx.)',
  ratingScore: '4.4',
  reviewCount: '1,280+',
  banquetCapacity: '50 to 350 Guests',
  dietaryCompliance: '100% Pure Vegetarian · Dedicated Jain Kitchen Counter',
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'tm-buffet-weekday',
    name: 'Thaath Maath Grand Unlimited Buffet (Lunch)',
    category: 'buffet',
    categoryLabel: 'Grand Buffet & Live Counters',
    price: 549,
    unitLabel: 'per adult',
    description:
      'Over 85+ pure vegetarian delicacies featuring 3 soups, 6 sizzling starters, live chaat & dosa counters, North Indian curries, assorted tandoori breads, continental bakes, and 8 hot & cold desserts.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Medium',
    serves: '1 Adult · Unlimited',
    artworkTheme: 'buffet-spread',
  },
  {
    id: 'tm-buffet-dinner',
    name: 'Royal Gala Dinner Buffet & 7 Live Stations',
    category: 'buffet',
    categoryLabel: 'Grand Buffet & Live Counters',
    price: 649,
    unitLabel: 'per adult',
    description:
      'Our flagship 100+ item evening spread with live wood-fired pizza, Mexican taco & nacho bar, Pan-Asian dim sum steamer, tawa chaat, smoky tandoor grill, main course handis, and live jalebi-rabdi counter.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Medium',
    serves: '1 Adult · Unlimited',
    artworkTheme: 'chaat-counter',
  },
  {
    id: 'tm-paneer-angara',
    name: 'Paneer Tikka Angara Lababdar',
    category: 'north-indian',
    categoryLabel: 'North Indian Royal',
    price: 385,
    unitLabel: 'per portion',
    description:
      'Charcoal-smoked malai cottage cheese cubes simmered in a velvety heirloom tomato, roasted cashew, and Kashmiri chilli gravy finished with churned white butter.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Spiced',
    serves: 'Serves 2–3',
    artworkTheme: 'paneer-tikka',
  },
  {
    id: 'tm-dal-bukhara',
    name: '24-Hour Slow Simmered Dal Thaath Maath',
    category: 'north-indian',
    categoryLabel: 'North Indian Royal',
    price: 320,
    unitLabel: 'per portion',
    description:
      'Whole black lentils slow-cooked overnight on charcoal embers with ginger juliennes, fresh cream, and kasturi methi. Served with artisanal garlic lachha paratha.',
    jainAvailable: false,
    isSignature: true,
    spiceLevel: 'Mild',
    serves: 'Serves 2–3',
    artworkTheme: 'dal-bukhara',
  },
  {
    id: 'tm-kaju-kofta',
    name: 'Shahi Kaju Cheese Kofta Nazakat',
    category: 'north-indian',
    categoryLabel: 'North Indian Royal',
    price: 410,
    unitLabel: 'per portion',
    description:
      'Golden-fried saffron and roasted cashew dumplings stuffed with aged cheddar and khoya, served in a fragrant cardamom-infused golden gravy.',
    jainAvailable: true,
    isSignature: false,
    spiceLevel: 'Mild',
    serves: 'Serves 2–3',
    artworkTheme: 'kofta-royal',
  },
  {
    id: 'tm-oriental-sizzler',
    name: 'Sizzling Schezwan Cottage Cheese & Exotic Greens Platter',
    category: 'pan-asian-mexican',
    categoryLabel: 'Pan-Asian & Mexican',
    price: 495,
    unitLabel: 'per sizzler',
    description:
      'Cast-iron sizzler layered with burnt garlic hakka noodles, crispy lotus stem, wok-tossed water chestnuts, bell peppers, and house-fermented chilli bean glaze.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Spiced',
    serves: 'Serves 2',
    artworkTheme: 'sizzler-asian',
  },
  {
    id: 'tm-mexican-enchilada',
    name: 'Charred Corn & Pinto Bean Queso Enchiladas',
    category: 'pan-asian-mexican',
    categoryLabel: 'Pan-Asian & Mexican',
    price: 425,
    unitLabel: 'per platter',
    description:
      'Hand-rolled corn tortillas filled with roasted sweet corn, jalapeños, and bell peppers, baked under smoked chipotle tomato sauce and accompanied by house tortilla chips.',
    jainAvailable: true,
    isSignature: false,
    spiceLevel: 'Medium',
    serves: 'Serves 2',
    artworkTheme: 'mexican-fiesta',
  },
  {
    id: 'tm-woodfired-pizza',
    name: 'Artisanal Burrata, Sun-Dried Tomato & Pesto Pizza',
    category: 'continental',
    categoryLabel: 'Continental & Wood-Fired',
    price: 460,
    unitLabel: '10-inch hand-stretched',
    description:
      '48-hour cold-fermented sourdough crust topped with San Marzano tomato passata, fresh basil pesto drizzle, roasted zucchini, black olives, and creamy bocconcini.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Mild',
    serves: '6 Slices · Serves 2',
    artworkTheme: 'woodfired-pizza',
  },
  {
    id: 'tm-truffle-pasta',
    name: 'Tortellini Al Funghi & Roasted Almond Alfredo',
    category: 'continental',
    categoryLabel: 'Continental & Wood-Fired',
    price: 395,
    unitLabel: 'per bowl',
    description:
      'Handmade pasta parcels tossed in a silky parmesan cream reduction with thyme-roasted button mushrooms, sun-dried tomatoes, and toasted garlic brioche.',
    jainAvailable: true,
    isSignature: false,
    spiceLevel: 'Mild',
    serves: 'Serves 1–2',
    artworkTheme: 'pasta-truffle',
  },
  {
    id: 'tm-saffron-kunafa',
    name: 'Baked Pistachio Kunafa with Kesar Rabdi & Rose Petals',
    category: 'desserts',
    categoryLabel: 'Artisanal Desserts',
    price: 290,
    unitLabel: 'per serving',
    description:
      'Crisp golden kataifi pastry layered with sweet cream cheese, soaked in saffron-cardamom syrup, and crowned with chilled Gujarati kesar rabdi and Iranian pistachios.',
    jainAvailable: true,
    isSignature: true,
    spiceLevel: 'Sweet',
    serves: 'Serves 2',
    artworkTheme: 'gulab-kunafa',
  },
];

export const BANQUET_PACKAGES: BanquetPackage[] = [
  {
    id: 'pkg-silver',
    tierIndex: '01. Silver Celebration Package',
    name: 'Classic Family Feast',
    pricePerPlate: 549,
    minGuests: 50,
    maxGuests: 150,
    subtitle: 'Designed for birthday celebrations, baby showers, and society get-togethers.',
    includedSummary: '2 Welcome Drinks · 2 Soups · 3 Starters · 4 Main Courses · 2 Desserts',
    courses: [
      '2 Seasonal Fruit Mocktails & Roasted Papad Bar',
      '2 Hot Soups (Cream of Tomato Basil & Manchow with Crispy Noodles)',
      '3 Starters (Hara Bhara Kabab, Crispy Corn Chilli Pepper, Mini Spring Rolls)',
      '3 North Indian Subzis (Paneer Butter Masala, Veg Jaipuri, Mix Veg Tawa) + Dal Tadka',
      'Assorted Tandoori Roti, Butter Naan, Jeera Rice & Boondi Raita',
      'Hot Gulab Jamun with Vanilla Ice Cream & Fresh Cut Salad Counter',
    ],
    hallFeatures: [
      '3 Hours Dedicated AC Banquet Hall Access at Hilltown Plaza',
      'Standard Table Linen & Buffet Chafing Setup',
      'Separate Jain Food Preparation Counter on Request',
    ],
  },
  {
    id: 'pkg-gold',
    tierIndex: '02. Gold Multi-Cuisine Package',
    name: 'Grand Multi-Cuisine Gala',
    pricePerPlate: 699,
    minGuests: 80,
    maxGuests: 250,
    subtitle: 'Ideal for ring ceremonies, milestone anniversaries, and corporate dinners.',
    includedSummary: '3 Mocktails · 3 Soups · 5 Starters · 2 Live Counters · 5 Mains · 3 Desserts',
    courses: [
      '3 Artisanal Mocktails + Live Chaat & Pani Puri Station',
      '3 Soups (Mexican Tortilla, Lemon Coriander, Roasted Almond Broccoli)',
      '5 Starters (Paneer Tikka Angara, Cheese Corn Balls, Veg Manchurian Dry, Mexican Tacos, Crispy Chilli Potato)',
      'Live Italian Pasta Counter & Live South Indian Mini Uttapam Station',
      '4 Royal Main Courses (Paneer Lababdar, Kaju Masala, Veg Kolhapuri, Baked Macaroni) + Dal Makhani',
      'Dum Veg Biryani, Lachha Paratha, Garlic Naan, Kulcha & 6-Bowl Salad Bar',
      'Live Jalebi with Kesar Rabdi, Chocolate Walnut Brownie & Seasonal Ice Cream',
    ],
    hallFeatures: [
      '4 Hours Exclusive Grand Banquet Hall & Lounge Access',
      'Complimentary Basic Stage Backdrop & Podium Microphone',
      'Dedicated Banquet Captain & Valet Parking Assistance at SP Ring Road',
    ],
  },
  {
    id: 'pkg-royal',
    tierIndex: '03. Royal Thaath Maath Signature',
    name: 'Maharaja Wedding & Reception Feast',
    pricePerPlate: 899,
    minGuests: 100,
    maxGuests: 350,
    subtitle: 'Full-scale luxury hospitality for wedding receptions, sangeet nights, and grand conventions.',
    includedSummary: '4 Mocktails · 4 Soups · 7 Starters · 4 Live Counters · 6 Mains · 5 Desserts',
    courses: [
      '4 Signature Mocktail Bar + Dry Fruit Welcome Thandai',
      '4 Gourmet Soups + 8-Variety Artisanal Mezze, Hummus & Lavash Platter',
      '7 Starters including Smoky Tandoori Platter, Oriental Dim Sums & Cheese Fondue Skewers',
      '4 Live Stations (Wood-Fired Pizza, Mexican Quesadilla, Delhi Tawa Chaat, Sizzling Wok)',
      '6 Signature Mains (Shahi Kaju Kofta, Paneer Angara, Exotic Thai Green Curry, Undhiyu / Seasonal Gujarati Special, Dal Bukhara, Kadhi Pakoda)',
      'Hyderabadi Sofiyani Biryani, Assorted Stuffed Kulchas, Rumali Roti & Papad Churi',
      '5 Royal Desserts (Baked Pistachio Kunafa, Moong Dal Halwa, Sitaphal Basundi, Hot Gulab Jamun, Belgian Gelato)',
    ],
    hallFeatures: [
      '5 Hours Full-Floor Banquet & Private Bridal/VIP Green Room Access',
      'Custom Floral Entrance Arch, Crystal Chandelier Lighting & Sound Console',
      'Dedicated Pure Jain Kitchen Line & Priority Table Service for Senior Guests',
    ],
  },
];

export const BANQUET_ADDONS: BanquetAddon[] = [
  {
    id: 'addon-floral',
    name: 'Custom Stage Floral Backdrop & Marigold Entry Arch',
    price: 12500,
    billingType: 'flat',
    description: 'Fresh rose, hydrangea, and traditional marigold stage styling with couple/family nameplate.',
  },
  {
    id: 'addon-jain-counter',
    name: 'Dedicated Separate Jain Live Counter & Utensil Line',
    price: 0,
    billingType: 'flat',
    description: 'Complimentary segregated Jain preparation zone with zero root vegetables.',
  },
  {
    id: 'addon-mocktail-bar',
    name: 'Interactive Molecular Mocktail & Fresh Fruit Bar',
    price: 85,
    billingType: 'per-guest',
    description: 'Bartender-hosted counter serving smoked berry coolers, kala khatta mojitos, and fresh juices.',
  },
  {
    id: 'addon-dj-sound',
    name: 'Professional Acoustic Sound System, Wireless Mics & Warm Uplighting',
    price: 8000,
    billingType: 'flat',
    description: 'Full PA setup with 2 cordless microphones, stage spotlights, and celebration playlist curation.',
  },
];

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: 'rev-1',
    guestName: 'Harshadbhai & Kavita Patel',
    occasion: 'Daughter’s Ring Ceremony Banquet (180 Guests)',
    location: 'Nikol, Ahmedabad',
    visitDate: 'September 2026',
    rating: '4.9 / 5.0',
    quote:
      'Before booking Thaath Maath at Hilltown Plaza, we worried about managing both a separate Jain counter for elders and live Mexican/Italian stations for the younger cousins. Their banquet team set up a dedicated Jain line and kept all 7 live counters hot for 180 guests without a single queue.',
    outcomeHighlight: '180 Guests Served · Zero Wait at Live Counters · 100% Pure Veg & Jain Verified',
  },
  {
    id: 'rev-2',
    guestName: 'Dr. Mehul Shah',
    occasion: 'Sunday Family Dinner Buffet (14 Family Members)',
    location: 'Vastral & SP Ring Road, Ahmedabad',
    visitDate: 'October 2026',
    rating: '4.6 / 5.0',
    quote:
      'Most buffets along SP Ring Road serve cold starters after 9 PM. At Thaath Maath, the live wood-fired pizza, tawa chaat, and Paneer Tikka Angara were replenished fresh every 10 minutes. At ₹1,250 for two, the 100+ item spread is unmatched in East Ahmedabad.',
    outcomeHighlight: '100+ Buffet Items Sampled · Fresh Table Replenishment · Ample Hilltown Plaza Parking',
  },
  {
    id: 'rev-3',
    guestName: 'Priyanka Desai, HR Lead',
    occasion: 'Annual Corporate Festive Dinner (95 Employees)',
    location: 'Odhav Industrial Estate, Ahmedabad',
    visitDate: 'October 2026',
    rating: '4.8 / 5.0',
    quote:
      'We hosted our 95-member festive dinner in the Gold Multi-Cuisine Banquet Hall. Having direct access off Sardar Patel Ring Road near Amar Jawan Circle made commuting easy for the entire team, and the baked pistachio kunafa with kesar rabdi was the highlight of the night.',
    outcomeHighlight: '95 Corporate Guests · ₹699/Plate Gold Package · Seamless Audio & Stage Setup',
  },
];
