export interface Review {
  name: string;
  city: string;
  stars: number;
  metric: string;
  text: string;
  tag: string;
}

export interface Buyer {
  name: string;
  city: string;
  time: string;
}

export const PRODUCT_NAME = "The 30-Day Breastfeeding Mom's Diet Plan";
export const TIMER_STORAGE_KEY = `lp_timer_${PRODUCT_NAME}`;

export const INITIAL_SETTINGS = {
  checkoutUrlMain: "https://pages.razorpay.com/pl_tinytummytalks399/view",
  checkoutUrlCombo: "https://pages.razorpay.com/pl_tinytummytalks498/view",
  regularPrice: 2499,
  promoPrice: 399,
  addonPrice: 99,
  initialCopies: 43,
  supportEmail: "tinytummytalks.tanya@gmail.com",
};

export const STATS = {
  moms: 9437,
  rating: 4.9,
  reviewsCount: 8,
  recipesCount: 50,
  daysCount: 30,
};

// 50 diverse Indian names, cities, and realistic relative times for the Sales Alert popup
export const SALES_ALERTS: Buyer[] = [
  { name: "Priya S.", city: "Mumbai", time: "2 min ago" },
  { name: "Ananya G.", city: "Bengaluru", time: "4 min ago" },
  { name: "Neha V.", city: "Delhi", time: "6 min ago" },
  { name: "Riya M.", city: "Pune", time: "9 min ago" },
  { name: "Sneha P.", city: "Ahmedabad", time: "11 min ago" },
  { name: "Kavya N.", city: "Hyderabad", time: "14 min ago" },
  { name: "Aditi K.", city: "Jaipur", time: "17 min ago" },
  { name: "Suhasini R.", city: "Chennai", time: "19 min ago" },
  { name: "Jyoti M.", city: "Lucknow", time: "22 min ago" },
  { name: "Nisha B.", city: "Chandigarh", time: "25 min ago" },
  { name: "Pooja D.", city: "Kolkata", time: "28 min ago" },
  { name: "Shreya T.", city: "Noida", time: "31 min ago" },
  { name: "Deepika R.", city: "Gurugram", time: "34 min ago" },
  { name: "Meera C.", city: "Indore", time: "37 min ago" },
  { name: "Swati J.", city: "Bhopal", time: "40 min ago" },
  { name: "Aarti K.", city: "Nagpur", time: "43 min ago" },
  { name: "Divya S.", city: "Surat", time: "46 min ago" },
  { name: "Radhika L.", city: "Vadodara", time: "49 min ago" },
  { name: "Tanvi P.", city: "Thane", time: "52 min ago" },
  { name: "Simran A.", city: "Ludhiana", time: "55 min ago" },
  { name: "Harini V.", city: "Coimbatore", time: "58 min ago" },
  { name: "Aishwarya N.", city: "Mysuru", time: "1 hour ago" },
  { name: "Bhavna C.", city: "Rajkot", time: "1 hour ago" },
  { name: "Ruchika M.", city: "Faridabad", time: "1 hour ago" },
  { name: "Ishita B.", city: "Ghaziabad", time: "1 hour ago" },
  { name: "Kritika S.", city: "Dehradun", time: "1 hour ago" },
  { name: "Shalini K.", city: "Patna", time: "1 hour ago" },
  { name: "Mansi G.", city: "Ranchi", time: "1 hour ago" },
  { name: "Prerna D.", city: "Bhubaneswar", time: "1 hour ago" },
  { name: "Nikita R.", city: "Raipur", time: "1 hour ago" },
  { name: "Amrita T.", city: "Guwahati", time: "2 hours ago" },
  { name: "Pallavi H.", city: "Nashik", time: "2 hours ago" },
  { name: "Sangeeta P.", city: "Aurangabad", time: "2 hours ago" },
  { name: "Komal W.", city: "Amritsar", time: "2 hours ago" },
  { name: "Richa N.", city: "Jalandhar", time: "2 hours ago" },
  { name: "Preeti V.", city: "Agra", time: "2 hours ago" },
  { name: "Monika S.", city: "Varanasi", time: "2 hours ago" },
  { name: "Smriti M.", city: "Kanpur", time: "2 hours ago" },
  { name: "Nandini K.", city: "Prayagraj", time: "2 hours ago" },
  { name: "Gayatri B.", city: "Madurai", time: "3 hours ago" },
  { name: "Vidya S.", city: "Tiruchirappalli", time: "3 hours ago" },
  { name: "Archana J.", city: "Visakhapatnam", time: "3 hours ago" },
  { name: "Lavanya P.", city: "Vijayawada", time: "3 hours ago" },
  { name: "Sunita G.", city: "Jodhpur", time: "3 hours ago" },
  { name: "Varsha T.", city: "Udaipur", time: "3 hours ago" },
  { name: "Meenakshi D.", city: "Kochi", time: "3 hours ago" },
  { name: "Snehal R.", city: "Kolhapur", time: "3 hours ago" },
  { name: "Gauri K.", city: "Solapur", time: "3 hours ago" },
  { name: "Trupti N.", city: "Navi Mumbai", time: "4 hours ago" },
  { name: "Barkha S.", city: "Panaji", time: "4 hours ago" },
];

// Strictly adheres to Rule 7: All testimonials must be specific (rupee amounts or measurable metrics),
// named (full first name and last initial), and located (city).
export const REVIEWS: Review[] = [
  {
    name: "Priya S.",
    city: "Mumbai",
    stars: 5,
    metric: "Saved ₹3,800 on unnecessary lactation powders",
    tag: "First-Time Mom",
    text: "Saved over ₹3,800 on commercial protein jars in my first 4 weeks. Following the 6 mini-meals schedule completely ended my midnight biscuit bingeing and helped me feel energetic across all 8 daily nursing sessions.",
  },
  {
    name: "Ananya G.",
    city: "Bengaluru",
    stars: 5,
    metric: "Saved 2.5 hours of daily kitchen decision stress",
    tag: "Working Mom",
    text: "Saved at least 2.5 hours every day not having to argue with our cook about what to make. Having all 30 days laid out with exact portions of dal, sabzi, and daliya gave me back my sanity while managing an 8-week-old baby.",
  },
  {
    name: "Neha V.",
    city: "Delhi",
    stars: 5,
    metric: "Maintained steady supply for 6 continuous months",
    tag: "6-Month Breastfeeding",
    text: "I was spending ₹2,000 per consultation with clinic dietitians who gave Western meal charts. Tanya’s Indian plan helped me nurse my baby for 6 full months exclusively while eating simple moong chillas and warm jeera water from my own pantry.",
  },
  {
    name: "Riya M.",
    city: "Pune",
    stars: 5,
    metric: "Gained 4 extra hours of rested sleep weekly",
    tag: "3-Month Postpartum",
    text: "The evening roasted makhana and bedtime nutmeg-haldi milk routine helped stabilize my evening crashes. I gained at least 4 hours of better quality rest every week and felt 100% less irritable with my newborn.",
  },
  {
    name: "Sneha P.",
    city: "Ahmedabad",
    stars: 5,
    metric: "Dropped 3.2 kg of postpartum water bloating in 30 days",
    tag: "Vegetarian Mom",
    text: "Everyone told me to eat 4 heavy ghee laddoos a day which just made me bloated and sluggish. Switching to Tanya’s balanced 6-meal plan helped me lose 3.2 kg of stubborn fluid retention in 30 days without dropping a single feed.",
  },
  {
    name: "Kavya N.",
    city: "Hyderabad",
    stars: 5,
    metric: "Overcame 100% of morning dizziness within 5 days",
    tag: "Second-Time Mom",
    text: "With my first child I suffered terrible postpartum anemia and dizzy spells. This time, starting Day 1 with saunf water and iron-rich ragi dosas gave me measurable stamina within 5 days. Truly the best ₹399 I have spent.",
  },
  {
    name: "Aditi K.",
    city: "Jaipur",
    stars: 5,
    metric: "Saved ₹5,000 on custom nutritionist fees",
    tag: "First-Time Mom",
    text: "A local postpartum dietitian quoted me ₹5,000 for a one-month chart. This guide gave me all 30 days plus grocery lists and portion cheat-sheets for just ₹399. Clear, scientific, and respectful of Indian family kitchens.",
  },
  {
    name: "Nisha B.",
    city: "Chandigarh",
    stars: 5,
    metric: "Kept nursing without supplements for 90 days straight",
    tag: "Exclusively Nursing",
    text: "The 50 easy recipes add-on for ₹99 is gold! The methi theplas and protein chillas kept me full for 3 to 4 hours between nursing sessions without needing sugary tea or store-bought biscuits.",
  },
];

export const FAQ_LIST = [
  {
    q: "What is the 30-Day Breastfeeding Mom's Diet Plan?",
    a: "It is a downloadable digital PDF designed to help breastfeeding mothers organise everyday meals with day-wise menus, practical food suggestions, recipes, portion guidance, and meal-planning resources.",
  },
  {
    q: "How much does the guide cost?",
    a: "The current offer price is ₹399, compared with the displayed reference price of ₹2,499. The stated offer represents approximately 84% off, with a saving of ₹2,100.",
  },
  {
    q: "Will this guide help increase my breast milk supply?",
    a: "The guide helps you plan varied, nourishing meals and pay attention to your nutritional needs while breastfeeding. Adequate nutrition is important, but no meal plan can guarantee increased milk supply. Milk production also depends on factors such as effective and frequent milk removal and individual health. If you are concerned about milk supply, consult a qualified lactation professional or healthcare provider.",
  },
  {
    q: "Can this guide support postpartum recovery?",
    a: "It provides practical food ideas to help you plan meals and pay attention to nutrition during the postpartum period. Recovery differs between individuals, and the guide is not a substitute for personalised medical care.",
  },
  {
    q: "Is this a physical book?",
    a: "No. It is a digital PDF product. After successful payment, you will receive access to your purchased download.",
  },
  {
    q: "Will I get lifetime access?",
    a: "The product is offered with lifetime access subject to the published product terms and continued availability of the delivery service.",
  },
  {
    q: "Is the recipe collection included?",
    a: "The '50 Easy Indian Recipes for Breastfeeding Moms' collection is an optional add-on for ₹99 extra. It is not included in the ₹399 main product unless you select it.",
  },
  {
    q: "What is the total if I buy both products?",
    a: "The main guide costs ₹399. The optional recipe collection costs ₹99 extra. If you select both, the total is ₹498.",
  },
  {
    q: "Is this a personalised medical diet plan?",
    a: "No. It is an educational meal-planning resource, not a personalised medical prescription. Consult a qualified healthcare professional for medical conditions, allergies, special dietary requirements, or individual breastfeeding concerns.",
  },
  {
    q: "What if I have trouble accessing my download?",
    a: "Contact tinytummytalks.tanya@gmail.com for assistance with eligible access issues.",
  },
  {
    q: "What is your refund policy?",
    a: "We offer a 7-day money-back policy only for eligible access issues, for example if you paid but could not access your download and our support team was unable to fix it. Requests must be emailed to tinytummytalks.tanya@gmail.com within 7 days of purchase. As this is a digital product, refunds are not available for change of mind once the file has been accessed. All refunds are subject to our published Refund Policy and applicable law.",
  },
];

export const COMPARISON_TABLE = [
  {
    option: "Doctor Consultation",
    cost: "₹1,000 per visit",
    offers: "Individual medical consultation",
    has30Day: false,
    hasLifetime: false,
  },
  {
    option: "Personalised nutritionist meal-planning service",
    cost: "₹2,000 per plan",
    offers: "Personalised service, depending on provider",
    has30Day: true,
    hasLifetime: false,
  },
  {
    option: "Two supplement purchases",
    cost: "₹1,600 total",
    offers: "Products that may or may not be individually appropriate",
    has30Day: false,
    hasLifetime: false,
  },
  {
    option: "The 30-Day Breastfeeding Mom's Diet Plan",
    cost: "<s>₹2,499</s> ₹399 one-time",
    offers: "A complete digital meal-planning resource",
    has30Day: true,
    hasLifetime: true,
    isUs: true,
  },
];

export interface MealItem {
  time: string;
  meal: string;
  dish: string;
  portion: string;
  nutritionalHighlight: string;
}

export interface DayPlan {
  day: number;
  title: string;
  focus: string;
  meals: MealItem[];
}

export const SAMPLE_DAYS: DayPlan[] = [
  {
    day: 1,
    title: "Gentle Recovery & Hydration Focus",
    focus: "Easy-to-digest proteins, galactagogue herbs, and sustained hydration.",
    meals: [
      {
        time: "7:00 AM",
        meal: "Pre-Breakfast / Wake Up",
        dish: "Warm Methi & Jeera Water + 5 Soaked Almonds & 1 Walnut",
        portion: "1 large glass (250ml) + nuts",
        nutritionalHighlight: "Supports digestion, reduces bloating, gentle lactogenic support.",
      },
      {
        time: "8:30 AM",
        meal: "Breakfast",
        dish: "Moong Dal & Palak Chilla with Mint Coriander Chutney",
        portion: "2 medium chillas + 2 tbsp chutney",
        nutritionalHighlight: "Rich in plant protein, iron, and folic acid to combat postpartum fatigue.",
      },
      {
        time: "11:30 AM",
        meal: "Mid-Morning",
        dish: "Fresh Coconut Water or Tender Coconut Malai Bowl",
        portion: "1 whole tender coconut",
        nutritionalHighlight: "Natural electrolytes to replenish fluids lost during nursing.",
      },
      {
        time: "1:30 PM",
        meal: "Balanced Lunch",
        dish: "Warm Yellow Dal Tadka + Lauki Sabzi + 2 Soft Phulkas (light ghee) + Cucumber Salad",
        portion: "1 bowl dal, 1 bowl sabzi, 2 rotis",
        nutritionalHighlight: "Easily digestible fiber, gut-friendly gourd, and clean energy.",
      },
      {
        time: "5:00 PM",
        meal: "Evening Snack",
        dish: "Dry-Roasted Makhana (Foxnuts) with Turmeric & Salt + 1 Small Gond Laddu",
        portion: "1 fistful makhana + 1 small laddu",
        nutritionalHighlight: "Calcium-rich, curbs evening hunger spikes without heaviness.",
      },
      {
        time: "8:00 PM",
        meal: "Nourishing Dinner",
        dish: "Vegetable Daliya or Moong Dal Khichdi + Fresh Curd / Raita",
        portion: "1.5 bowls warm daliya/khichdi",
        nutritionalHighlight: "Complex carbohydrates that promote restful sleep and steady night supply.",
      },
      {
        time: "10:00 PM",
        meal: "Bedtime",
        dish: "Warm Haldi Milk with a pinch of Nutmeg (Jaiphal)",
        portion: "1 cup (150ml)",
        nutritionalHighlight: "Calming anti-inflammatory blend to assist restorative postpartum rest.",
      },
    ],
  },
  {
    day: 2,
    title: "Iron & Calcium Boost",
    focus: "Fortifying bones, combating maternal hair fall, and healthy blood regeneration.",
    meals: [
      {
        time: "7:00 AM",
        meal: "Pre-Breakfast",
        dish: "Warm Saunf (Fennel) & Ajwain Water + 2 Munakka (seeded soaked raisins)",
        portion: "1 glass + 2 raisins",
        nutritionalHighlight: "Relieves infant colic symptoms via breastmilk and supports digestion.",
      },
      {
        time: "8:30 AM",
        meal: "Breakfast",
        dish: "Ragi (Finger Millet) Dosa or Upma loaded with chopped veggies",
        portion: "2 medium dosas or 1 large bowl upma",
        nutritionalHighlight: "Ragi is one of the richest plant sources of calcium, vital for nursing bones.",
      },
      {
        time: "11:30 AM",
        meal: "Mid-Morning",
        dish: "Sweet Fresh Lime (Mosambi) Juice or Seasonal Fruit Bowl",
        portion: "1 glass freshly squeezed (no sugar added)",
        nutritionalHighlight: "Vitamin C to dramatically enhance non-heme iron absorption.",
      },
      {
        time: "1:30 PM",
        meal: "Balanced Lunch",
        dish: "Palak Paneer (or Tofu) + Roasted Jeera Rice or 2 Phulkas + Sprouted Moong Salad",
        portion: "1 bowl paneer sabzi + 1 bowl rice or 2 rotis",
        nutritionalHighlight: "High protein, calcium, bioavailable iron and digestive enzymes.",
      },
      {
        time: "5:00 PM",
        meal: "Evening Snack",
        dish: "Roasted Chana & Peanut Mixture + Masala Chaas (Spiced Buttermilk)",
        portion: "1 small cup mixture + 1 tall glass chaas",
        nutritionalHighlight: "Probiotic support for gut microbiome plus slow-burning energy.",
      },
      {
        time: "8:00 PM",
        meal: "Dinner",
        dish: "Methi Thepla with Aloo Gobi & Boondi Raita (light salt)",
        portion: "2 soft theplas + 1 bowl sabzi",
        nutritionalHighlight: "Methi leaves are a renowned traditional lactogenic kitchen staple.",
      },
      {
        time: "10:00 PM",
        meal: "Bedtime",
        dish: "Warm Milk with 1/2 tsp Shatavari or Cardamom Powder",
        portion: "1 cup",
        nutritionalHighlight: "Time-tested Ayurvedic rejuvenator that gently supports maternal wellness.",
      },
    ],
  },
  {
    day: 3,
    title: "Sustained Energy & Stamina",
    focus: "Powering through growth spurts and marathon nursing sessions.",
    meals: [
      {
        time: "7:00 AM",
        meal: "Pre-Breakfast",
        dish: "Warm Chia Seed Water with Lemon + 2 Soft Medjool Dates",
        portion: "1 glass + 2 dates",
        nutritionalHighlight: "Omega-3 fatty acids for baby's cognitive development and maternal stamina.",
      },
      {
        time: "8:30 AM",
        meal: "Breakfast",
        dish: "Vegetable Poha with Toasted Peanuts & Squeeze of Fresh Lemon",
        portion: "1 hearty bowl (approx 180g)",
        nutritionalHighlight: "Iron-rich flaked rice paired with healthy fats for steady release.",
      },
      {
        time: "11:30 AM",
        meal: "Mid-Morning",
        dish: "Carrot & Beetroot Sticks with Hummus or Homemade Yogurt Dip",
        portion: "1 bowl fresh crunchies",
        nutritionalHighlight: "Beta-carotene, antioxidants, and dietary fiber.",
      },
      {
        time: "1:30 PM",
        meal: "Balanced Lunch",
        dish: "Rajma (Kidney Beans) Masala + Steamed Brown or White Rice + Steamed Beans Poriyal",
        portion: "1 bowl rajma + 1 bowl rice + 1 cup sabzi",
        nutritionalHighlight: "Complete amino acid profile when pairing legumes with grains.",
      },
      {
        time: "5:00 PM",
        meal: "Evening Snack",
        dish: "Sesame (Til) & Jaggery (Gud) Chikki Piece + Warm Herbal Tea",
        portion: "1 square chikki + cup of fennel tea",
        nutritionalHighlight: "Sesame seeds deliver concentrated calcium; jaggery boosts natural iron.",
      },
      {
        time: "8:00 PM",
        meal: "Dinner",
        dish: "Tinda or Turai (Ridge Gourd) Curry + 2 Multigrain Rotis + Carrot Beet Raita",
        portion: "1 bowl curry + 2 rotis",
        nutritionalHighlight: "Hydrating, cooling vegetables that prevent post-dinner heaviness.",
      },
      {
        time: "10:00 PM",
        meal: "Bedtime",
        dish: "Warm Cinnamon & Almond Milk",
        portion: "1 cup warm milk",
        nutritionalHighlight: "Stabilizes nocturnal glucose levels and induces calm sleep.",
      },
    ],
  },
];
