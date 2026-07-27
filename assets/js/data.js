// Boomer's Gaming Cafe - Shared Content Data Configuration

const IMAGES = {
  pcLounge: "assets/images/boomers_pc_lounge.jpg",
  cafeFood: "assets/images/cafe-background.jpg",
  racingSim: "assets/images/boomers_racing_sim.jpg",
  vrLounge: "assets/images/boomers_vr_lounge.jpg",
  logo: "assets/images/logo.png"
};

const BRANCHES = {
  PUNE: {
    id: "pune",
    name: "Pune",
    location: "Viman Nagar",
    specs: {
      gpu: "NVIDIA RTX 4070 SUPER",
      cpu: "AMD Ryzen 7 9700X",
      ram: "32 GB DDR5 5200MHz",
      storage: "1TB Gen4 NVMe SSD",
      monitor: "240Hz refresh rate"
    }
  },
  COIMBATORE: {
    id: "coimbatore",
    name: "Coimbatore",
    location: "RS Puram",
    specs: {
      gpu: "NVIDIA RTX 3070",
      cpu: "AMD Ryzen 5 5600X",
      ram: "16 GB DDR4 3600MHz",
      storage: "512GB NVMe SSD",
      monitor: "180Hz refresh rate"
    }
  }
};

const ZONES = {
  PC: { id: "pc", name: "PC Arena", icon: "🎮", color: "#efbd4e" },
  CONSOLE: { id: "console", name: "Console Lounge", icon: "📺", color: "#ffbb54" },
  VIP: { id: "vip", name: "VIP Squad Room", icon: "👑", color: "#ad8cff" },
  RACING: { id: "racing", name: "Racing Simulator", icon: "🏎️", color: "#ad8cff" }
};

const GAMES_DATA = [
  {
    id: "valorant",
    name: "VALORANT",
    category: "Tactical FPS",
    players: 18,
    stations: 8,
    waitTime: "4 mins",
    setup: "RTX 4070 SUPER / 240Hz",
    copy: "Precision, pressure, and the cleanest tactical shots in the room.",
    image: "assets/images/Valorant_cover.jpg",
    accent: "#ff4f70",
    rating: 5,
    tag: "Popular"
  },
  {
    id: "eafc",
    name: "EA FC 25",
    category: "Sports Simulator",
    players: 11,
    stations: 5,
    waitTime: "2 mins",
    setup: "PS5 / 4K OLED TV",
    copy: "Crowd noise, console rivalry, and one more match before closing.",
    image: "assets/images/fc.webp",
    accent: "#e1a350",
    rating: 5,
    tag: "Classic"
  },
  {
    id: "cs2",
    name: "CS2",
    category: "Competitive FPS",
    players: 14,
    stations: 6,
    waitTime: "3 mins",
    setup: "RTX 4070 SUPER / 240Hz",
    copy: "Fast calls, perfect utility, and a team that never tilts.",
    image: "assets/images/cs2.jpeg",
    accent: "#6bcfff",
    rating: 5,
    tag: "Top Played"
  },
  {
    id: "racing",
    name: "SIM RACING",
    category: "Sim Racing",
    players: 7,
    stations: 3,
    waitTime: "5 mins",
    setup: "Logitech G29 / G923 Cockpit",
    copy: "Full throttle, force feedback, and professional bucket seat racing.",
    image: "assets/images/boomers_racing_sim.jpg",
    accent: "#ad8cff",
    rating: 5,
    tag: "Immersive"
  }
];

const STATIONS_DATA = [
  // Coimbatore Stations
  { id: 1, name: "Station 01", branch: "coimbatore", zone: "pc", gpu: "RTX 3070", monitor: "180Hz", price: 100, status: "available", game: "Valorant" },
  { id: 2, name: "Station 02", branch: "coimbatore", zone: "pc", gpu: "RTX 3070", monitor: "180Hz", price: 100, status: "busy", game: "CS2" },
  { id: 3, name: "Station 03", branch: "coimbatore", zone: "pc", gpu: "RTX 3070", monitor: "180Hz", price: 100, status: "available", game: "Valorant" },
  { id: 4, name: "Station 04", branch: "coimbatore", zone: "pc", gpu: "RTX 3070", monitor: "180Hz", price: 100, status: "available", game: "CS2" },
  { id: 5, name: "Station 11", branch: "coimbatore", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 120, status: "available", game: "EA FC 25" },
  { id: 6, name: "Station 12", branch: "coimbatore", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 120, status: "busy", game: "Tekken 8" },
  { id: 7, name: "Station 13", branch: "coimbatore", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 120, status: "available", game: "EA FC 25" },
  { id: 8, name: "Station 21", branch: "coimbatore", zone: "vip", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 250, status: "busy", game: "Valorant" },
  { id: 9, name: "Station 22", branch: "coimbatore", zone: "vip", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 250, status: "available", game: "Dota 2" },
  { id: 10, name: "Station 31", branch: "coimbatore", zone: "racing", gpu: "Logitech G29 Setup", monitor: "Ultra-Wide", price: 150, status: "available", game: "Racing" },
  { id: 11, name: "Station 32", branch: "coimbatore", zone: "racing", gpu: "Logitech G29 Setup", monitor: "Ultra-Wide", price: 150, status: "available", game: "Racing" },

  // Pune Stations
  { id: 101, name: "Station 01", branch: "pune", zone: "pc", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 120, status: "available", game: "Valorant" },
  { id: 102, name: "Station 02", branch: "pune", zone: "pc", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 120, status: "busy", game: "CS2" },
  { id: 103, name: "Station 03", branch: "pune", zone: "pc", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 120, status: "busy", game: "CS2" },
  { id: 104, name: "Station 04", branch: "pune", zone: "pc", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 120, status: "available", game: "Dota 2" },
  { id: 105, name: "Station 11", branch: "pune", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 150, status: "available", game: "EA FC 25" },
  { id: 106, name: "Station 12", branch: "pune", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 150, status: "available", game: "Tekken 8" },
  { id: 107, name: "Station 13", branch: "pune", zone: "console", gpu: "PS5", monitor: "4K OLED", price: 150, status: "busy", game: "EA FC 25" },
  { id: 108, name: "Station 14", branch: "pune", zone: "console", gpu: "PS VR2", monitor: "4K Headset", price: 200, status: "available", game: "VR Worlds" },
  { id: 109, name: "Station 21", branch: "pune", zone: "vip", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 300, status: "busy", game: "Valorant" },
  { id: 110, name: "Station 22", branch: "pune", zone: "vip", gpu: "RTX 4070 SUPER", monitor: "240Hz", price: 300, status: "available", game: "Valorant" },
  { id: 111, name: "Station 31", branch: "pune", zone: "racing", gpu: "Logitech G923 Pro", monitor: "Triple Screen", price: 200, status: "available", game: "Racing" }
];

const POWER_UP_MENU = {
  "xp-starters": [
    { id: "f-1", name: "French Fries", price: 165, desc: "Golden, crispy potato fries with a soft and fluffy inside", popularity: "Classic", prep: "5 min", isVeg: true, calories: "290 kcal", rating: "4.6", spice: 0, ingredients: ["Premium Potatoes", "Sea Salt", "Refined Vegetable Oil"], image: "assets/images/frenchfries.jpeg" },
    { id: "f-2", name: "Signature Cheese Fries", price: 245, desc: "Crispy peri peri fries loaded with in house cheese sauce", popularity: "Bestseller", prep: "8 min", isVeg: true, calories: "390 kcal", rating: "4.9", spice: 1, ingredients: ["Potatoes", "Peri Peri Spices", "Cheddar Cheese Sauce", "Chives"], image: "assets/images/cheesefries.jpeg" },
    { id: "f-3", name: "Cheese Garlic Toast", price: 185, desc: "Crispy, buttery toast topped with melted cheese & garlic kick", popularity: "Popular", prep: "6 min", isVeg: true, calories: "310 kcal", rating: "4.7", spice: 0, ingredients: ["Artisanal Bread", "Fresh Garlic Butter", "Mozzarella Cheese", "Oregano"], image: "assets/images/cheesegarlictoast.jpeg" },
    { id: "f-4", name: "Loaded Nachos", price: 275, desc: "Crispy nachos topped with melted cheese, corn and fresh olives", popularity: "Popular", prep: "7 min", isVeg: true, calories: "420 kcal", rating: "4.8", spice: 1, ingredients: ["Maize Nacho Chips", "Cheese Dip", "Sweet Corn", "Black Olives", "Jalapenos"], image: "assets/images/loaded_nachos.jpeg" },
    { id: "f-5", name: "Peri Peri French Fries", price: 195, desc: "Crispy golden fries tossed in a fiery peri peri spice mix", popularity: "Spicy Deal", prep: "5 min", isVeg: true, calories: "305 kcal", rating: "4.6", spice: 2, ingredients: ["Potatoes", "Chili Pepper Powder", "Smoked Paprika", "Oregano"], image: "assets/images/periperi_frenchfries.jpeg" },
    { id: "f-6", name: "Paneer Popcorn", price: 345, desc: "Crunchy bite-sized paneer cubes coated in crispy seasoning", popularity: "Quick Munch", prep: "8 min", isVeg: true, calories: "380 kcal", rating: "4.7", spice: 1, ingredients: ["Fresh Paneer Cubes", "Breadcrumbs Batter", "Desi Spice Seasoning"], image: "assets/images/panner_popcorn.jpeg" },
    { id: "f-7", name: "Paneer Satay", price: 375, desc: "Grilled skewers of marinated paneer, served with peanut sauce", popularity: "Must Try", prep: "10 min", isVeg: true, calories: "360 kcal", rating: "4.9", spice: 2, ingredients: ["Paneer Skewers", "Ginger Garlic Marinade", "Spicy Peanut Satay Dip"], image: "assets/images/paneer_satay.jpeg" }
  ],
  "tactical-starters": [
    { id: "f-8", name: "Chicken Popcorn", price: 275, desc: "Crunchy bite-sized chicken cubes coated in spicy crispy batter", popularity: "Popular", prep: "7 min", isVeg: false, calories: "340 kcal", rating: "4.8", spice: 1, ingredients: ["Chicken Breast Cubes", "BGC Seasoning Mix", "Tempura Batter"], image: "assets/images/food-wrap.png" },
    { id: "f-9", name: "Korean Fried Chicken", price: 305, desc: "Crispy chicken tenders coated in a sweet and sticky glaze", popularity: "Bestseller", prep: "9 min", isVeg: false, calories: "450 kcal", rating: "4.9", spice: 2, ingredients: ["Chicken Tenders", "Gochujang Paste", "Sesame Seeds", "Honey Glaze"], image: "assets/images/food-wrap.png" },
    { id: "f-10", name: "Chicken Cheese Fries", price: 285, desc: "Crispy fries smothered in cheese sauce and chicken bites", popularity: "Heavy Loadout", prep: "8 min", isVeg: false, calories: "490 kcal", rating: "4.8", spice: 1, ingredients: ["Potatoes", "Shredded Roast Chicken", "Cheddar Melt", "Jalapeno Slices"], image: "assets/images/food-wrap.png" },
    { id: "f-11", name: "Bang Bang Chicken Skewers", price: 315, desc: "Golden crispy chicken coated in sweet chili bang bang sauce", popularity: "Staff Pick", prep: "9 min", isVeg: false, calories: "380 kcal", rating: "4.7", spice: 2, ingredients: ["Chicken Breast Skewers", "Bang Bang Cream Sauce", "Green Onion Garnish"], image: "assets/images/food-wrap.png" },
    { id: "f-12", name: "Honey Chilli Chicken", price: 335, desc: "Tender chicken chunks tossed in sticky, sweet & spicy sauce", popularity: "Sweet & Spicy", prep: "8 min", isVeg: false, calories: "410 kcal", rating: "4.6", spice: 1, ingredients: ["Crispy Fried Chicken", "Wild Honey", "Red Chili Flakes", "Capsicum Mix"], image: "assets/images/food-wrap.png" },
    { id: "f-13", name: "Buffalo Chicken", price: 325, desc: "Golden chicken pieces coated in zesty hot buffalo sauce", popularity: "Tangy Kick", prep: "8 min", isVeg: false, calories: "390 kcal", rating: "4.7", spice: 2, ingredients: ["Chicken Breast", "Zesty Buffalo Hot Sauce", "Butter Emulsion", "Celery Salt"], image: "assets/images/food-wrap.png" },
    { id: "f-14", name: "Dragon Chicken", price: 355, desc: "Spicy, saucy chicken tenders with irresistible crunch", popularity: "Must Try", prep: "9 min", isVeg: false, calories: "430 kcal", rating: "4.9", spice: 3, ingredients: ["Slivered Chicken", "Cashews", "Red Chili Paste", "Soy Sauce Dressing"], image: "assets/images/food-wrap.png" },
    { id: "f-15", name: "BGC's OG Platter", price: 485, desc: "Generous serving of crispy golden fried chicken items", popularity: "Squad Value", prep: "12 min", isVeg: false, calories: "820 kcal", rating: "4.9", spice: 2, ingredients: ["Chicken Popcorn", "Korean Tenders", "Bang Bang Skewers", "Assorted House Dips"], image: "assets/images/food-wrap.png" }
  ],
  "pasta": [
    { id: "f-16", name: "All'Arrabbiata", price: 275, desc: "Penne pasta tossed in a spicy garlic tomato sauce with parmesan", popularity: "Classic", prep: "10 min", isVeg: true, calories: "360 kcal", rating: "4.6", spice: 2, ingredients: ["Penne Pasta", "San Marzano Tomatoes", "Garlic Oil", "Chili Flakes", "Parmesan"], image: "assets/images/food-toast.png" },
    { id: "f-17", name: "Creamy Alfredo", price: 345, desc: "Pasta tossed in a rich, creamy white butter parmesan sauce", popularity: "Popular", prep: "12 min", isVeg: true, calories: "580 kcal", rating: "4.8", spice: 0, ingredients: ["Penne Pasta", "Fresh Heavy Cream", "Salted Butter", "Parmigiano-Reggiano", "Parsley"], image: "assets/images/food-toast.png" },
    { id: "f-18", name: "Mac & Cheese", price: 305, desc: "Classic cheesy macaroni baked until golden and bubbly", popularity: "Comfort Food", prep: "11 min", isVeg: true, calories: "620 kcal", rating: "4.7", spice: 0, ingredients: ["Elbow Macaroni", "Cheddar Cheese Sauce", "Breadcrumbs crust", "Mozzarella Melt"], image: "assets/images/food-toast.png" },
    { id: "f-19", name: "OG Pink Pasta", price: 375, desc: "Pasta tossed in creamy tomato-cream sauce with spice hints", popularity: "Top Order", prep: "11 min", isVeg: true, calories: "480 kcal", rating: "4.8", spice: 1, ingredients: ["Penne", "Alfredo Base", "Arrabbiata Red Base", "Italian Herb Seasoning"], image: "assets/images/food-toast.png" },
    { id: "f-20", name: "Lasagne", price: 395, desc: "Baked pasta sheet layers with savory sauce and gooey cheese", popularity: "Must Try", prep: "15 min", isVeg: true, calories: "650 kcal", rating: "4.9", spice: 1, ingredients: ["Lasagne Sheets", "Minced Veggie Ragout", "Béchamel Cream", "Mozzarella Bake"], image: "assets/images/food-toast.png" }
  ],
  "sandwich": [
    { id: "f-21", name: "Toast and Egg", price: 185, desc: "Spicy masala omelette tucked in a crispy buttery toast", popularity: "Gamer Breakfast", prep: "6 min", isVeg: false, calories: "280 kcal", rating: "4.6", spice: 1, ingredients: ["Double Eggs", "Green Chilies", "Red Onion", "Buttered Sliced Bread"], image: "assets/images/food-toast.png" },
    { id: "f-22", name: "Mustard Egg", price: 315, desc: "Creamy mustard, spiced boiled egg layered in soft toasted bread", popularity: "Popular", prep: "7 min", isVeg: false, calories: "320 kcal", rating: "4.7", spice: 1, ingredients: ["Boiled Egg Salad", "English Mustard Mayo", "Lettuce Leaf", "Wheat Bread"], image: "assets/images/food-toast.png" },
    { id: "f-23", name: "Grilled Garden", price: 285, desc: "Veggies sauteed and stuffed in hot butter-grilled toast", popularity: "Light & Clean", prep: "7 min", isVeg: true, calories: "240 kcal", rating: "4.6", spice: 0, ingredients: ["Zucchini", "Bell Peppers", "Sweet Corn", "Herb Spread", "Buttered Toast"], image: "assets/images/food-toast.png" },
    { id: "f-24", name: "Cheese Pull Chicken", price: 365, desc: "Sauteed chicken in peri peri spice, cheese & lettuce toast", popularity: "Bestseller", prep: "9 min", isVeg: false, calories: "460 kcal", rating: "4.8", spice: 2, ingredients: ["Diced Roast Chicken", "Peri Peri Dressing", "Triple Mozzarella Blend"], image: "assets/images/food-toast.png" },
    { id: "f-25", name: "Grilled Chicken & Cheese", price: 295, desc: "Perfectly grilled chicken breast slice, cheese & lettuce toast", popularity: "Protein Pack", prep: "8 min", isVeg: false, calories: "380 kcal", rating: "4.7", spice: 1, ingredients: ["Grilled Chicken Fillet", "Processed Cheese Slice", "Garlic Mayo", "Romaine Lettuce"], image: "assets/images/food-toast.png" },
    { id: "f-26", name: "Tandoori Paneer", price: 355, desc: "Smoky, spiced paneer cubes with fresh veggies in toast", popularity: "Desi Taste", prep: "8 min", isVeg: true, calories: "440 kcal", rating: "4.8", spice: 2, ingredients: ["Tandoori Paneer Cubes", "Capsicum & Onion slices", "Mint Chutney spread"], image: "assets/images/food-toast.png" },
    { id: "f-27", name: "BGC's OG Chicken Club", price: 385, desc: "Layered chicken, lettuce, cheese, fried egg in triple bread", popularity: "Must Try", prep: "10 min", isVeg: false, calories: "590 kcal", rating: "4.9", spice: 1, ingredients: ["Pulled Chicken Mayo", "Sunny-Side Fried Egg", "Cheddar Slice", "Iceberg Lettuce", "Triple Bread Layer"], image: "assets/images/food-toast.png" }
  ],
  "burger": [
    { id: "f-28", name: "Spicy Veg", price: 235, desc: "Crispy spiced veg patty, cheese and house sauce in buttered buns", popularity: "Classic", prep: "8 min", isVeg: true, calories: "410 kcal", rating: "4.7", spice: 2, ingredients: ["Mixed Veg Patty", "Liquid Cheddar Cheese", "Zesty Spicy Sauce", "Toasted Bun"], image: "assets/images/food-burger.png" },
    { id: "f-29", name: "Smash Chicken", price: 305, desc: "Juicy smashed chicken patty grilled, lettuce & sauce in soft buns", popularity: "Bestseller", prep: "9 min", isVeg: false, calories: "490 kcal", rating: "4.8", spice: 1, ingredients: ["Minced Chicken Patty", "Gouda Melt", "House Burger Mayonnaise", "Tomato Slice"], image: "assets/images/food-burger.png" },
    { id: "f-30", name: "Dynnamite Chicken", price: 275, desc: "Crispy chicken patty with fiery dynamite sauce and melting cheese", popularity: "Spicy Pick", prep: "9 min", isVeg: false, calories: "510 kcal", rating: "4.7", spice: 3, ingredients: ["Crispy Fried Chicken Breast", "Sriracha Dynamite Glaze", "Double Cheese", "Gherkins"], image: "assets/images/food-burger.png" },
    { id: "f-31", name: "Crispy Paneer", price: 325, desc: "Golden fried paneer patty, crunchy veggies & creamy desi sauce", popularity: "Indulgent", prep: "8 min", isVeg: true, calories: "540 kcal", rating: "4.8", spice: 1, ingredients: ["Panko Crusted Paneer Block", "Tandoori Dressing", "Onion Rings", "Toasted Sesame Buns"], image: "assets/images/food-burger.png" },
    { id: "f-32", name: "BGC's OG Big Fat", price: 345, desc: "Double juicy chicken patty stacked with double cheese and veggies", popularity: "Must Try", prep: "12 min", isVeg: false, calories: "790 kcal", rating: "4.9", spice: 2, ingredients: ["Two Grilled Smash Patties", "Two Cheddar Slices", "Caramelized Red Onion", "BGC secret relish"], image: "assets/images/food-burger.png" }
  ],
  "wrap": [
    { id: "f-33", name: "Roasted Vegetable", price: 285, desc: "Soft tortilla stuffed with smoky roasted veggies & house sauce", popularity: "Vegan Friendly", prep: "7 min", isVeg: true, calories: "290 kcal", rating: "4.6", spice: 1, ingredients: ["Tortilla Wrap", "Grilled Bell Peppers", "Sweet Corn", "Hummus Spread"], image: "assets/images/food-wrap.png" },
    { id: "f-34", name: "Paneer Pizza Wrap", price: 345, desc: "Soft tortilla loaded with pizza sauce, paneer and mozzarella", popularity: "Kids Choice", prep: "8 min", isVeg: true, calories: "440 kcal", rating: "4.7", spice: 1, ingredients: ["Tortilla", "Pizza Marinara Sauce", "Diced Paneer", "Italian Herbs", "Mozzarella Melt"], image: "assets/images/food-wrap.png" },
    { id: "f-35", name: "Kolkata Egg Roll", price: 275, desc: "Fluffy spiced eggs cooked on griddle, onion and lime rolled in paratha", popularity: "Street Taste", prep: "6 min", isVeg: false, calories: "350 kcal", rating: "4.8", spice: 2, ingredients: ["Double Eggs griddle bake", "Flaky Laccha Paratha", "Sautéed Red Onion", "Green Chili Lime splash"], image: "assets/images/food-wrap.png" },
    { id: "f-36", name: "Grilled Chicken Wrap", price: 325, desc: "Tender grilled chicken chunks, veggies and cream sauce in wrap", popularity: "Healthy Choice", prep: "8 min", isVeg: false, calories: "390 kcal", rating: "4.7", spice: 1, ingredients: ["Seasoned Chicken Breast", "Sour Cream", "Shredded Cabbage & Carrot", "Tortilla wrap"], image: "assets/images/food-wrap.png" },
    { id: "f-37", name: "Chicken Pizza Wrap", price: 355, desc: "Soft tortilla loaded with cheesy pizza base, chicken and herbs", popularity: "Bestseller", prep: "9 min", isVeg: false, calories: "480 kcal", rating: "4.8", spice: 1, ingredients: ["Tortilla", "Pizza Sauce", "Tender Roast Chicken", "Mozzarella Blend", "Oregano Dust"], image: "assets/images/food-wrap.png" },
    { id: "f-38", name: "BGC's OG Quesedilla", price: 375, desc: "Double toasted wrap packed with roasted chicken, cheese and peppers", popularity: "Must Try", prep: "10 min", isVeg: false, calories: "520 kcal", rating: "4.9", spice: 2, ingredients: ["Flour Tortillas", "Spiced Fajita Chicken", "Sweet Bell Peppers", "Double Pepper Jack Cheese"], image: "assets/images/food-wrap.png" }
  ],
  "maggi": [
    { id: "f-39", name: "OG Classic Maggi", price: 135, desc: "The iconic 2-minute noodle cooked with original spices", popularity: "Midnight Fuel", prep: "4 min", isVeg: true, calories: "260 kcal", rating: "4.8", spice: 1, ingredients: ["Maggi Noodle Cake", "Original Tastemaker masala", "Fresh coriander splash"], image: "assets/images/food-toast.png" },
    { id: "f-40", name: "Egg Maggi", price: 185, desc: "Soft Maggi noodles tossed with scrambled egg bits and spices", popularity: "Protein Kick", prep: "5 min", isVeg: false, calories: "340 kcal", rating: "4.7", spice: 1, ingredients: ["Maggi Noodles", "Masala mix", "Scrambled Eggs", "Spring Onion greens"], image: "assets/images/food-toast.png" },
    { id: "f-41", name: "Tandoori Maggi", price: 175, desc: "Smoky tandoori-spiced Maggi with rich creamy gravy twist", popularity: "Spicy & Rich", prep: "5 min", isVeg: true, calories: "320 kcal", rating: "4.7", spice: 2, ingredients: ["Maggi Noodles", "Tandoori spice blend", "Fresh cream", "Onion drops"], image: "assets/images/food-toast.png" },
    { id: "f-42", name: "Chicken Maggi", price: 225, desc: "Classic Maggi noodles tossed with chicken breast shreds", popularity: "Bestseller", prep: "6 min", isVeg: false, calories: "390 kcal", rating: "4.8", spice: 1, ingredients: ["Maggi Noodles", "Tastemaker", "Shredded Boiled Chicken", "Mixed Peas & Corn"], image: "assets/images/food-toast.png" },
    { id: "f-43", name: "Cheese Maggi", price: 155, desc: "Soft Maggi noodles smothered in melted double processed cheese", popularity: "Must Try", prep: "5 min", isVeg: true, calories: "380 kcal", rating: "4.9", spice: 1, ingredients: ["Maggi Noodles", "Cheese slices", "Grated Processed Cheese", "Mixed Herbs"], image: "assets/images/food-toast.png" },
    { id: "f-44", name: "Spicy Korean Maggi", price: 205, desc: "Fiery Korean chili oil paste noodles with melted cheese topping", popularity: "Extremely Spicy", prep: "5 min", isVeg: true, calories: "370 kcal", rating: "4.8", spice: 3, ingredients: ["Maggi Noodles", "BGC Korean Hot Sauce", "Cheese Slices", "Chili flakes"], image: "assets/images/food-toast.png" }
  ],
  "popcorn": [
    { id: "f-45", name: "Butter Salted", price: 135, desc: "Classic popcorn tossed in rich butter and salt", popularity: "Standard", prep: "3 min", isVeg: true, calories: "180 kcal", rating: "4.6", spice: 0, ingredients: ["Corn Kernels", "Butter Fat", "Premium Sea Salt"], image: "assets/images/food-wrap.png" },
    { id: "f-46", name: "Cheddar Cheese", price: 165, desc: "Crispy hot popcorn coated in cheese seasoning", popularity: "Must Try", prep: "3 min", isVeg: true, calories: "230 kcal", rating: "4.9", spice: 0, ingredients: ["Corn Kernels", "Cheddar Cheese Dusting"], image: "assets/images/food-wrap.png" },
    { id: "f-47", name: "Sour Cream and Onion", price: 155, desc: "Light popcorn tossed in sour cream and onion powder", popularity: "Staff Favorite", prep: "3 min", isVeg: true, calories: "210 kcal", rating: "4.7", spice: 0, ingredients: ["Corn", "Dehydrated Cream powder", "Onion seasoning"], image: "assets/images/food-wrap.png" },
    { id: "f-48", name: "Peri Peri Popcorn", price: 145, desc: "Crispy popcorn tossed in hot peri peri spices", popularity: "Spicy Pop", prep: "3 min", isVeg: true, calories: "205 kcal", rating: "4.8", spice: 2, ingredients: ["Corn", "Peri Peri Spice Mix", "Smoked Paprika"], image: "assets/images/food-wrap.png" },
    { id: "f-49", name: "Butter Onion", price: 165, desc: "Popcorn coated in rich butter and sweet onion flavor", popularity: "Savory Snack", prep: "3 min", isVeg: true, calories: "220 kcal", rating: "4.6", spice: 0, ingredients: ["Corn Kernels", "Butter fat", "Onion spice powder"], image: "assets/images/food-wrap.png" },
    { id: "f-50", name: "Tomato Cheese", price: 155, desc: "Popcorn tossed in tangy tomato and cheese flavors", popularity: "Tangy Pick", prep: "3 min", isVeg: true, calories: "215 kcal", rating: "4.6", spice: 1, ingredients: ["Corn", "Dehydrated Tomato paste powder", "Cheese mix"], image: "assets/images/food-wrap.png" }
  ],
  "milkshake": [
    { id: "f-51", name: "Vanilla Milkshake", price: 175, desc: "Creamy, smooth vanilla-flavoured milkshake", popularity: "Standard", prep: "4 min", isVeg: true, calories: "320 kcal", rating: "4.5", spice: 0, ingredients: ["Double Tone Milk", "Vanilla Ice Cream", "Vanilla Pod Extract"], image: "assets/images/food-burger.png" },
    { id: "f-52", name: "Cadbury Shake", price: 245, desc: "Rich Cadbury chocolate ice cream blended with milk", popularity: "Chocolate Fix", prep: "5 min", isVeg: true, calories: "460 kcal", rating: "4.8", spice: 0, ingredients: ["Cadbury Cocoa Powders", "Chocolate Fudge", "Full Cream Milk"], image: "assets/images/food-burger.png" },
    { id: "f-53", name: "Oreo Shake", price: 225, desc: "Milkshake blended with crushed Oreo cookies & fudge", popularity: "Bestseller", prep: "5 min", isVeg: true, calories: "490 kcal", rating: "4.8", spice: 0, ingredients: ["Oreo Biscuits", "Creamy Milk", "Chocolate Syrup", "Vanilla Scoop"], image: "assets/images/food-burger.png" },
    { id: "f-54", name: "Biscoff Shake", price: 255, desc: "Milkshake infused with Lotus Biscoff biscuit spread", popularity: "Gourmet Shake", prep: "6 min", isVeg: true, calories: "530 kcal", rating: "4.9", spice: 0, ingredients: ["Lotus Biscoff spread", "Crushed Biscoff Biscuits", "Milk", "Rich Cream"], image: "assets/images/food-burger.png" },
    { id: "f-55", name: "Kitkat Shake", price: 285, desc: "Thickshake blended with crunchy Kitkat pieces", popularity: "Classic", prep: "5 min", isVeg: true, calories: "480 kcal", rating: "4.7", spice: 0, ingredients: ["KitKat Bars", "Milk", "Chocolate Ice Cream", "Whip Cream topping"], image: "assets/images/food-burger.png" },
    { id: "f-56", name: "Nutella Oreo Shake", price: 325, desc: "Thickshake combining rich Nutella and Oreo cookies", popularity: "Must Try", prep: "6 min", isVeg: true, calories: "610 kcal", rating: "4.9", spice: 0, ingredients: ["Nutella Hazelnut Spread", "Oreo Biscuits", "Thick Milk base", "Chocolate sauce"], image: "assets/images/food-burger.png" }
  ],
  "hot-beverages": [
    { id: "f-57", name: "Black Coffee", price: 45, desc: "Bold, aromatic, and full-bodied coffee served pure", popularity: "Focus Shot", prep: "2 min", isVeg: true, calories: "5 kcal", rating: "4.6", spice: 0, ingredients: ["Arabica Coffee Beans", "Hot Water"], image: "assets/images/food-toast.png" },
    { id: "f-58", name: "Black Tea", price: 45, desc: "Strong, aromatic black tea brewed to perfection", popularity: "Standard", prep: "2 min", isVeg: true, calories: "3 kcal", rating: "4.5", spice: 0, ingredients: ["Assam Black Tea Leaves", "Water"], image: "assets/images/food-toast.png" },
    { id: "f-59", name: "Milk Coffee", price: 65, desc: "Smooth coffee blended with fresh hot milk", popularity: "Morning Cue", prep: "3 min", isVeg: true, calories: "80 kcal", rating: "4.6", spice: 0, ingredients: ["Espresso Shot", "Steamed Milk", "Optional Sugar"], image: "assets/images/food-toast.png" },
    { id: "f-60", name: "Chai", price: 55, desc: "Fragrant spiced milk tea brewed with masala spices", popularity: "Desi Fuel", prep: "4 min", isVeg: true, calories: "90 kcal", rating: "4.8", spice: 0, ingredients: ["Tea dust", "Steamed Milk", "Cardamom", "Ginger", "Clove"], image: "assets/images/food-toast.png" },
    { id: "f-61", name: "Hot Chocolate", price: 145, desc: "Rich, velvety chocolate drink served warm & creamy", popularity: "Must Try", prep: "4 min", isVeg: true, calories: "290 kcal", rating: "4.9", spice: 0, ingredients: ["Dutch Cocoa Powder", "Warm Milk", "Chocolate Ganache", "Marshmallow hint"], image: "assets/images/food-toast.png" },
    { id: "f-62", name: "Lemon Tea", price: 45, desc: "Refreshing black tea infused with fresh lemon juice", popularity: "Light & Clear", prep: "2 min", isVeg: true, calories: "15 kcal", rating: "4.6", spice: 0, ingredients: ["Black Tea", "Fresh Lemon juice", "Honey drops"], image: "assets/images/food-toast.png" }
  ],
  "cold-beverages": [
    { id: "f-63", name: "Lemon Juice", price: 65, desc: "Freshly squeezed lemon water served iced & sweet", popularity: "Refresher", prep: "2 min", isVeg: true, calories: "45 kcal", rating: "4.6", spice: 0, ingredients: ["Fresh Lemon", "Chilled Water", "Sugar Syrup", "Mint Leaf"], image: "assets/images/food-wrap.png" },
    { id: "f-64", name: "Cold Coffee", price: 175, desc: "Chilled, creamy coffee blended with milk & vanilla scoop", popularity: "Must Try", prep: "4 min", isVeg: true, calories: "280 kcal", rating: "4.9", spice: 0, ingredients: ["Espresso", "Chilled Milk", "Vanilla Ice Cream", "Sugar"], image: "assets/images/food-wrap.png" },
    { id: "f-65", name: "Lemon Soda", price: 75, desc: "Tangy lemon juice mixed with sparkling soda water", popularity: "Fizzy Refresher", prep: "2 min", isVeg: true, calories: "55 kcal", rating: "4.7", spice: 0, ingredients: ["Lemon extract", "Club Soda", "Ice Cubes", "Black Salt"], image: "assets/images/food-wrap.png" },
    { id: "f-66", name: "Coke", price: 55, desc: "Classic Coca Cola served chilled in can", popularity: "Standard", prep: "1 min", isVeg: true, calories: "140 kcal", rating: "4.5", spice: 0, ingredients: ["Carbonated Coke Can"], image: "assets/images/food-wrap.png" },
    { id: "f-67", name: "Sprite", price: 55, desc: "Crisp lemon-lime soda served ice cold", popularity: "Standard", prep: "1 min", isVeg: true, calories: "135 kcal", rating: "4.5", spice: 0, ingredients: ["Carbonated Sprite Can"], image: "assets/images/food-wrap.png" },
    { id: "f-68", name: "Red Bull", price: 135, desc: "Energizing carbonated energy drink to boost focus", popularity: "Energy Boost", prep: "1 min", isVeg: true, calories: "110 kcal", rating: "4.8", spice: 0, ingredients: ["Chilled Red Bull Can"], image: "assets/images/food-wrap.png" }
  ],
  "mocktails": [
    { id: "f-69", name: "Virjin Mojito", price: 175, desc: "Sparkling soda with fresh mint, lime slices & sugar", popularity: "Popular", prep: "3 min", isVeg: true, calories: "110 kcal", rating: "4.7", spice: 0, ingredients: ["Fresh Mint leaves", "Lime wedges", "Chilled Soda", "Sugar syrup"], image: "assets/images/food-wrap.png" },
    { id: "f-70", name: "Blue Curacao", price: 195, desc: "Chilled mocktail with sweet orange curacao flavor & soda", popularity: "Blue Drink", prep: "3 min", isVeg: true, calories: "130 kcal", rating: "4.7", spice: 0, ingredients: ["Blue Curacao syrup", "Lime juice", "Sprite soda", "Ice"], image: "assets/images/food-wrap.png" },
    { id: "f-71", name: "Pina Colada", price: 225, desc: "Refreshing coconut milk & pineapple mocktail blended with ice", popularity: "Tropical Pick", prep: "5 min", isVeg: true, calories: "260 kcal", rating: "4.8", spice: 0, ingredients: ["Coconut Cream", "Pineapple juice", "Crushed Ice", "Sugar"], image: "assets/images/food-wrap.png" },
    { id: "f-72", name: "Brazilian Sunday", price: 185, desc: "Exotic tropical fruit juice mix, sparkling soda and mint", popularity: "Exotic Twist", prep: "4 min", isVeg: true, calories: "140 kcal", rating: "4.7", spice: 0, ingredients: ["Mango pulp", "Passion Fruit extract", "Club Soda", "Mint"], image: "assets/images/food-wrap.png" },
    { id: "f-73", name: "Paleo Blueberry", price: 205, desc: "Antioxidant rich blueberry blend with soda & lemon juice", popularity: "Must Try", prep: "4 min", isVeg: true, calories: "150 kcal", rating: "4.9", spice: 0, ingredients: ["Wild Blueberry puree", "Fresh Lemon extract", "Chilled Soda", "Mint garnish"], image: "assets/images/food-wrap.png" },
    { id: "f-74", name: "Mango Magic", price: 215, desc: "Rich sweet Alphonso mango pulp blended with ice and fizz", popularity: "Summer Vibe", prep: "4 min", isVeg: true, calories: "180 kcal", rating: "4.8", spice: 0, ingredients: ["Alphonso Mango pulp", "Fizzy Soda", "Ice crush", "Lime splash"], image: "assets/images/food-wrap.png" }
  ],
  "squad-combos": [
    { id: "f-75", name: "Duo Queue Pack", price: 399, desc: "2 Soft Drinks + 1 Loaded French Fries + 1 Classic Sandwich. Save ₹100", popularity: "Save 20%", prep: "12 min", isVeg: false, calories: "850 kcal", rating: "4.7", spice: 1, ingredients: ["2 Coca Cola Cans", "1 Loaded Nachos/Fries", "1 Chicken Club Sandwich"], image: "assets/images/food-burger.png" },
    { id: "f-76", name: "5v5 Lan Party Box", price: 999, desc: "5 Potion Mojitos + 2 Large Burgers + 2 Loaded Fries. Save ₹310", popularity: "Squad Value", prep: "20 min", isVeg: false, calories: "2400 kcal", rating: "4.9", spice: 2, ingredients: ["5 Virgin Mojitos", "2 BGC OG Big Fat Burgers", "2 Large Signature Cheese Fries"], image: "assets/images/food-burger.png" }
  ]
};

const FOOD_GAMING_BUNDLES = [
  { id: "bundle-1", name: "Solo Grinder Bundle", price: 349, originalPrice: 440, desc: "2 Hours PC Gaming + 1 Burger + 1 Soft Drink.", badge: "🔥 Popular", discount: "Save ₹91" },
  { id: "bundle-2", name: "Console Co-Op Combo", price: 499, originalPrice: 620, desc: "2 Hours PS5 Lounge + 1 Loaded Nachos + 2 Drinks.", badge: "⚡ Best Seller", discount: "Save ₹121" },
  { id: "bundle-3", name: "Pro Racer Pack", price: 449, originalPrice: 550, desc: "2 Hours Sim Racing Simulator + 1 Wrap + 1 Red Bull.", badge: "🏎️ Pro Racer", discount: "Save ₹101" }
];

const CALENDAR_EVENTS = [
  { day: "05", month: "Aug", title: "Valorant Campus Cup", type: "5v5 Custom", branch: "Pune", status: "Open" },
  { day: "12", month: "Aug", title: "BGMI Squad Showdown", type: "Squad Battle", branch: "Coimbatore", status: "Open" },
  { day: "19", month: "Aug", title: "EA FC 25 Kick-Off", type: "1v1 Tournament", branch: "Pune", status: "Filling Fast" },
  { day: "26", month: "Aug", title: "College Cup Open", type: "Main Bracket", branch: "Both Branches", status: "Open" }
];

const LIVE_SCHEDULE = [
  { time: "06:00 PM", event: "CS2 Community Queue", details: "Casual mixed matchmaking" },
  { time: "07:00 PM", event: "Valorant Ranked Rush", details: "Competitive stack lobby drops" },
  { time: "08:00 PM", event: "EA FC 25 Lounge Cup", details: "King of the Hill tournament kick off" },
  { time: "09:00 PM", event: "BGMI Custom Rooms", details: "Local squad drop-in matches" }
];

const GOOGLE_REVIEWS = [
  { text: "The setups are absolutely unreal. 240Hz screens and zero lag make competitive play an absolute joy here.", author: "Rohan S.", rating: 5, date: "2 days ago" },
  { text: "Booked the VIP room for my squad's weekend tournament run. Service was top notch, burgers were epic.", author: "Ananya D.", rating: 5, date: "1 week ago" },
  { text: "Best sim-racing setup in Pune. The force feedback wheel makes a massive difference.", author: "Kabir M.", rating: 5, date: "3 days ago" },
  { text: "Incredibly clean setups, great community energy, and the Mana Mojitos are fantastic. Highly recommend Boomer's!", author: "Siddharth K.", rating: 5, date: "1 month ago" }
];
