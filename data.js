// ONE source of truth for both pages.
// Human needs (page 1) point at industry ids (page 2); page 2 derives "needs served" from the same links,
// so the two pages can never disagree.
//
// Sources (all US):
//  GDP / value added 2025 ......... BEA GDP by Industry, TVA105 "Value Added by Industry", published 2026-09-30 ($ millions)
//  Jobs 2025 ...................... BLS Current Employment Statistics, 12-month average of 2025 (thousands)
//  Firms / size / receipts ........ Census Statistics of US Businesses (SUSB) 2022, released 2025-04-10 -> data-size.js
//  Household spending ............. BLS Consumer Expenditure Survey 2024 (released 2025-12-19)
//  Nonemployer businesses ......... Census Nonemployer Statistics 2022
//  Small-business count ........... SBA Office of Advocacy, 2025 Small Business Profile

window.ATLAS = {
  GDP_2025: 30861292,          // $ millions
  JOBS_2025: 158439,           // thousands, all nonfarm payroll jobs
  PRIVATE_JOBS_2025: 134926,
  NONEMPLOYERS_2022: 29811495, // one-person / no-payroll businesses
  SMALL_BIZ_SBA_2025: 36.2,    // million, incl. nonemployers
  SMALL_BIZ_JOB_SHARE: 45.9,   // % of private-sector jobs in small (<500) businesses

  // BLS Consumer Expenditure Survey 2024 — average US household ("consumer unit")
  spending: {
    total: 78535,
    parts: [
      { label: "Housing", pct: 33.4, usd: 26266, need: "shelter", emoji: "🏠" },
      { label: "Transportation", pct: 17.0, usd: 13318, need: "mobility", emoji: "🚗" },
      { label: "Food", pct: 12.9, usd: 10169, need: "food", emoji: "🍚" },
      { label: "Insurance & pensions", pct: 12.5, need: "money", emoji: "🛡️" },
      { label: "Healthcare", pct: 7.9, usd: 6197, need: "health", emoji: "🩺" },
      { label: "Entertainment", pct: 4.6, need: "play", emoji: "🎮" },
      { label: "Cash gifts & charity", pct: 2.9, need: "belonging", emoji: "🤲" },
      { label: "Clothing", pct: 2.5, need: "clothing", emoji: "👕" },
      { label: "Education", pct: 2.0, need: "learning", emoji: "🎓" },
      { label: "Everything else", pct: 4.3, need: "hygiene", emoji: "🧴", note: "personal care, alcohol, tobacco, reading, misc." }
    ]
  },

  tiers: {
    survive: { label: "Survive", color: "red", maslow: "Physiological", blurb: "Without these the body stops." },
    safe: { label: "Be safe", color: "orange", maslow: "Safety", blurb: "Protection from harm, loss and uncertainty." },
    belong: { label: "Belong", color: "green", maslow: "Love & belonging", blurb: "Family, friends, tribe." },
    esteem: { label: "Be respected", color: "blue", maslow: "Esteem", blurb: "Status, identity, being seen." },
    grow: { label: "Grow & find meaning", color: "purple", maslow: "Self-actualisation", blurb: "Learning, creating, purpose." }
  },

  // ---------------------------------------------------------------- HUMAN NEEDS
  // items: [emoji, name, what people actually buy / use]
  // s: { industryId: strength }  3 = core industry, 2 = major, 1 = supporting
  // chain: the path a need travels from the earth to the human
  needs: [
    {
      id: "airwater", emoji: "💧", title: "Air & Water", tier: "survive", freq: "Every minute",
      why: "A human survives about 3 minutes without air and about 3 days without water. The first need of all.",
      items: [
        ["🚰", "Drinking water", "tap water, bottled water, water cans, RO / UV purifiers"],
        ["🏞️", "Water source & storage", "borewells, wells, pumps, overhead tanks, rainwater harvesting"],
        ["🚿", "Piped supply", "municipal water utility, pipes, meters, plumbing"],
        ["🚽", "Toilets & sanitation", "toilets, sewers, septic tanks, sewage treatment plants"],
        ["🌬️", "Clean air indoors", "ventilation, exhaust fans, air purifiers, HVAC filters"],
        ["😷", "Protection from pollution", "masks, emission controls, air-quality monitors"],
        ["🧊", "Cool drinks & ice", "fridges, water coolers, ice plants"]
      ],
      s: { utilities: 3, construction: 2, manufacturing: 2, government: 2, admin: 1, retail: 1 },
      chain: ["utilities", "construction", "government"],
      models: "Monthly utility bills, appliance sales + service contracts, government projects"
    },
    {
      id: "food", emoji: "🍚", title: "Food & Nutrition", tier: "survive", freq: "3× a day, for life",
      why: "About 2,000–2,500 kcal every day. 342 million Americans eat roughly 375 billion meals a year — the most repeated purchase on Earth.",
      items: [
        ["🌾", "Grains & staples", "rice, wheat, flour, bread, millets"],
        ["🥦", "Vegetables & fruit", "fresh produce, frozen, dried"],
        ["🥩", "Meat, fish & eggs", "poultry, meat, seafood, eggs"],
        ["🥛", "Dairy", "milk, curd, butter, cheese, ghee"],
        ["🫘", "Pulses, nuts & oils", "dal, beans, peanuts, cooking oil"],
        ["🧂", "Spices, salt & sugar", "masalas, sauces, condiments"],
        ["🍪", "Packaged & snack food", "biscuits, chips, ready-to-eat, frozen meals"],
        ["☕", "Drinks", "tea, coffee, juice, soft drinks, energy drinks"],
        ["🍽️", "Eating out", "restaurants, dhabas, cafés, fast food, canteens"],
        ["🛵", "Food delivery", "delivery apps, tiffin services, cloud kitchens"],
        ["🍼", "Baby food & formula", "infant formula, cereals, purées"],
        ["💊", "Supplements & special diets", "protein, vitamins, diabetic, gluten-free"],
        ["🍷", "Alcohol", "beer, wine, spirits"],
        ["🔪", "Cooking at home", "utensils, stoves, cooking gas, mixers, fridges"]
      ],
      s: { agri: 3, manufacturing: 3, wholesale: 3, retail: 3, accommodation: 3, transport: 2, information: 1, health: 1 },
      chain: ["agri", "manufacturing", "wholesale", "transport", "retail", "accommodation"],
      models: "Retail margins, restaurants, brands, delivery fees, subscriptions (milk, meal kits)"
    },
    {
      id: "sleep", emoji: "😴", title: "Sleep & Rest", tier: "survive", freq: "Every night",
      why: "A third of every life — about 25 years — is spent asleep. Bad sleep breaks health, mood and work.",
      items: [
        ["🛏️", "Beds & mattresses", "cots, mattresses, mattress toppers"],
        ["🛌", "Bedding", "pillows, sheets, quilts, blankets, mosquito nets"],
        ["🌙", "Dark & quiet", "curtains, blackout blinds, ear plugs, eye masks"],
        ["❄️", "Right temperature", "fans, coolers, ACs, heaters"],
        ["💤", "Sleep help", "sleep apps, white-noise devices, melatonin"],
        ["🩺", "Sleep medicine", "sleep clinics, apnea tests, CPAP machines"],
        ["🏨", "A bed away from home", "hotels, hostels, PGs, sleeper buses & trains"]
      ],
      s: { manufacturing: 3, retail: 3, health: 2, accommodation: 2, information: 1 },
      chain: ["manufacturing", "wholesale", "retail"],
      models: "Durable goods sold once every 7–10 years, direct-to-consumer brands, clinics"
    },
    {
      id: "shelter", emoji: "🏠", title: "Shelter & Home", tier: "survive", freq: "Every day; big decisions 2–5× a life",
      why: "Protection from weather and danger, and a place to keep family and belongings. It is the single biggest thing households pay for — a third of all spending.",
      items: [
        ["🏡", "Buying a home", "builders, plots, home loans, brokers, registration"],
        ["🏢", "Renting", "landlords, apartments, PGs, hostels, rental apps"],
        ["🧱", "Building materials", "cement, steel, bricks, sand, wood, tiles, paint"],
        ["🔨", "Repair & renovation", "plumbers, electricians, carpenters, painters"],
        ["🛋️", "Furniture & furnishing", "sofas, tables, wardrobes, curtains, decor"],
        ["🧺", "Appliances", "fridge, washing machine, AC, fans, water heater"],
        ["🧹", "Cleaning supplies", "detergent, mops, brooms, disinfectant"],
        ["🔐", "Doors, locks & safety", "locks, grills, smart locks, fire extinguishers"],
        ["🐜", "Pest control", "termite, mosquito, rodent treatment"],
        ["🏘️", "Building upkeep", "society maintenance, property managers, security staff"],
        ["📦", "Moving & storage", "packers & movers, self-storage"],
        ["🌿", "Garden & yard", "plants, pots, lawn care, landscaping"]
      ],
      s: { realestate: 3, construction: 3, manufacturing: 3, finance: 2, retail: 2, admin: 2, otherservices: 1, utilities: 1, mining: 1 },
      chain: ["mining", "manufacturing", "construction", "realestate", "finance"],
      models: "Big-ticket sales, monthly rent, loans with interest, repair services, maintenance fees"
    },
    {
      id: "clothing", emoji: "👕", title: "Clothing & Footwear", tier: "survive", freq: "Bought monthly, worn daily",
      why: "Protection from cold, heat and injury first — then modesty, culture and identity.",
      items: [
        ["👕", "Everyday wear", "shirts, t-shirts, trousers, jeans, kurtas"],
        ["👗", "Occasion wear", "sarees, lehengas, suits, wedding clothes"],
        ["🧥", "Weather wear", "jackets, sweaters, raincoats, caps"],
        ["🩲", "Innerwear & socks", "vests, briefs, bras, socks, thermals"],
        ["👟", "Footwear", "chappals, shoes, sports shoes, work boots"],
        ["👶", "Kids & baby clothes", "fast-outgrown sizes — bought again and again"],
        ["🦺", "Uniforms & safety wear", "school uniforms, work uniforms, PPE"],
        ["🏃", "Sportswear", "track pants, jerseys, yoga wear"],
        ["👜", "Bags, belts & wallets", "school bags, handbags, travel bags"],
        ["🧵", "Tailoring & alteration", "tailors, stitching, embroidery"],
        ["🧼", "Laundry & dry-cleaning", "washing, ironing, dry-cleaners"],
        ["🔁", "Second-hand & rental", "thrift stores, resale apps, outfit rental"]
      ],
      s: { manufacturing: 3, retail: 3, agri: 2, wholesale: 2, otherservices: 2, transport: 1 },
      chain: ["agri", "manufacturing", "wholesale", "transport", "retail"],
      models: "Fashion seasons, brands, private labels, tailoring & laundry services"
    },
    {
      id: "hygiene", emoji: "🧼", title: "Hygiene & Personal Care", tier: "survive", freq: "Every day",
      why: "Cleanliness prevents disease — and grooming is how humans feel ready to face others.",
      items: [
        ["🧼", "Soap & body wash", "bath soap, hand wash, sanitiser"],
        ["🪥", "Oral care", "toothpaste, brushes, floss, mouthwash"],
        ["🧴", "Hair & skin care", "shampoo, oil, lotion, sunscreen"],
        ["🪒", "Shaving & grooming", "razors, trimmers, beard care"],
        ["💇", "Haircuts & salons", "barbers, salons, parlours"],
        ["🩸", "Menstrual care", "pads, tampons, menstrual cups"],
        ["🧻", "Toilet paper & tissues", "tissue, wet wipes"],
        ["🧷", "Diapers", "baby diapers, adult incontinence products"],
        ["🌸", "Deodorant & fragrance", "deodorant, perfume, attar"],
        ["💅", "Nails & spa", "manicure, pedicure, massage"]
      ],
      s: { manufacturing: 3, retail: 3, otherservices: 3, wholesale: 1 },
      chain: ["manufacturing", "wholesale", "retail", "otherservices"],
      models: "High-frequency FMCG brands, salon chains, subscriptions"
    },
    {
      id: "health", emoji: "🩺", title: "Health & Medicine", tier: "safe", freq: "Daily for some, sudden for all",
      why: "Every human gets sick, injured and old. America spends nearly $5 trillion a year on health care (CMS National Health Expenditure).",
      items: [
        ["🩺", "Doctors & clinics", "GPs, specialists, telemedicine"],
        ["🏥", "Hospitals & surgery", "emergency, ICU, operations, maternity"],
        ["💊", "Medicines", "pharmacies, generics, branded drugs, insulin"],
        ["🦷", "Dental care", "check-ups, fillings, braces, implants"],
        ["👓", "Eye care", "eye tests, glasses, contact lenses, cataract surgery"],
        ["🧪", "Tests & scans", "blood tests, X-ray, MRI, diagnostic labs"],
        ["🚑", "Emergency transport", "ambulances, air ambulances"],
        ["💉", "Prevention", "vaccines, health check-ups, screening"],
        ["🧠", "Mental health", "therapists, psychiatrists, counselling apps"],
        ["🦽", "Disability & mobility aids", "wheelchairs, hearing aids, prosthetics"],
        ["🛡️", "Health insurance", "private insurance, government health schemes"],
        ["🏋️", "Fitness", "gyms, yoga classes, sports, wearables"],
        ["🧓", "Long-term care", "nursing homes, home nurses, physiotherapy"]
      ],
      s: { health: 3, manufacturing: 3, finance: 3, professional: 2, retail: 2, government: 2, wholesale: 2, arts: 1, education: 1 },
      chain: ["professional", "manufacturing", "wholesale", "health", "finance"],
      models: "Fee-for-service, insurance reimbursement, drug patents, recurring prescriptions"
    },
    {
      id: "energy", emoji: "⚡", title: "Energy & Power", tier: "survive", freq: "Every hour",
      why: "Modern life runs on energy — for light, cooking, cooling, moving and every machine.",
      items: [
        ["💡", "Electricity", "grid power, meters, prepaid connections"],
        ["🔥", "Cooking fuel", "LPG, piped gas, induction, firewood"],
        ["⛽", "Vehicle fuel", "petrol, diesel, CNG, EV charging"],
        ["🌡️", "Heating & cooling", "AC, heaters, heat pumps"],
        ["☀️", "Own generation", "rooftop solar, inverters, home batteries, generators"],
        ["🔋", "Portable power", "batteries, power banks, chargers"],
        ["🔌", "Wiring", "cables, switches, MCBs, electricians"]
      ],
      s: { utilities: 3, mining: 3, manufacturing: 2, retail: 2, construction: 1, transport: 1 },
      chain: ["mining", "manufacturing", "transport", "utilities", "retail"],
      models: "Metered bills, fuel margins, equipment + installation, long-term power contracts"
    },
    {
      id: "safety", emoji: "🛡️", title: "Safety & Security", tier: "safe", freq: "Always on",
      why: "Protection of body, family and property from crime, accidents, war and disaster.",
      items: [
        ["👮", "Police & public safety", "police, traffic control, emergency numbers"],
        ["🚒", "Fire & rescue", "fire brigade, fire alarms, extinguishers"],
        ["🪖", "National defence", "army, navy, air force, weapons makers"],
        ["📹", "Home & shop security", "CCTV, alarms, safes, smart doorbells"],
        ["💂", "Guards", "security agencies, watchmen, bouncers"],
        ["🧯", "Safety equipment", "helmets, seat belts, first-aid kits"],
        ["🌪️", "Disaster protection", "flood defences, shelters, relief"],
        ["💻", "Cyber safety", "antivirus, fraud detection, password managers"],
        ["🏚️", "Insurance against loss", "home, car, theft, crop insurance"]
      ],
      s: { government: 3, finance: 3, admin: 2, manufacturing: 2, professional: 2, information: 1 },
      chain: ["government", "manufacturing", "admin", "finance"],
      models: "Taxes, government contracts, monthly security retainers, insurance premiums"
    },
    {
      id: "money", emoji: "💰", title: "Money & Financial Security", tier: "safe", freq: "Daily payments, life-long savings",
      why: "Money stores the value of work over time — to pay, borrow for big things, and survive bad years and old age.",
      items: [
        ["🏦", "Bank account & savings", "accounts, fixed deposits, savings schemes"],
        ["💳", "Payments", "cash, UPI, cards, wallets, bill payment"],
        ["🏠", "Loans", "home, car, education, gold, personal, business loans"],
        ["📈", "Investing", "stocks, mutual funds, gold, bonds, property"],
        ["👴", "Retirement", "pensions, provident fund, annuities"],
        ["🛡️", "Insurance", "life, health, car, home, crop insurance"],
        ["🧾", "Taxes & accounts", "tax filing, CA / accountants, bookkeeping"],
        ["💸", "Sending money home", "remittances, money transfer"],
        ["📊", "Credit & advice", "credit scores, financial planners"]
      ],
      s: { finance: 3, professional: 2, information: 2, government: 2, management: 1, realestate: 1 },
      chain: ["finance", "information", "professional", "government"],
      models: "Interest spread, fees, commissions, premiums, assets under management"
    },
    {
      id: "work", emoji: "💼", title: "Work & Income", tier: "safe", freq: "5–6 days a week, ~40 years",
      why: "Almost every adult needs a way to earn. Work is also identity, structure and dignity.",
      items: [
        ["🔎", "Finding a job", "job portals, recruiters, referrals"],
        ["📄", "Hiring & staffing", "staffing agencies, contract labour, gig platforms"],
        ["🧰", "Tools of the trade", "tools, machines, vehicles, uniforms"],
        ["💻", "Work computers & software", "laptops, office software, cloud apps"],
        ["🏢", "Place to work", "offices, shops, co-working, factories"],
        ["🎓", "Skills & certificates", "vocational training, certifications"],
        ["🧑‍💻", "Freelancing", "freelance marketplaces, creator platforms"],
        ["🧾", "Payroll & HR", "salary processing, compliance, PF/ESI"],
        ["🏪", "Starting your own business", "registration, licences, POS, loans"],
        ["🤝", "Workers' rights", "unions, labour law, labour courts"]
      ],
      s: { admin: 3, professional: 2, information: 2, management: 2, finance: 2, education: 2, realestate: 2, government: 1, otherservices: 1 },
      chain: ["education", "admin", "management", "finance"],
      models: "Placement fees, SaaS subscriptions, office rent, training fees"
    },
    {
      id: "mobility", emoji: "🚗", title: "Mobility & Transport", tier: "safe", freq: "Every day",
      why: "Getting to work, school, market and family. The second-biggest household expense after housing.",
      items: [
        ["🚲", "Bicycles & two-wheelers", "cycles, scooters, motorbikes, e-bikes"],
        ["🚗", "Cars", "new & used cars, EVs, dealers"],
        ["⛽", "Fuel & charging", "petrol pumps, EV chargers"],
        ["🔧", "Repair & servicing", "garages, tyres, spare parts, car wash"],
        ["🚌", "Buses & metro", "city buses, metro, school buses"],
        ["🚆", "Trains", "long-distance rail, commuter rail"],
        ["✈️", "Flights", "airlines, airports"],
        ["🚕", "Taxis & ride-hailing", "auto-rickshaws, cabs, ride apps"],
        ["🅿️", "Parking & tolls", "parking lots, FASTag / toll roads"],
        ["🛣️", "Roads & bridges", "highways, flyovers, street lights"],
        ["🧾", "Vehicle loans & insurance", "auto loans, motor insurance"],
        ["📦", "Moving things", "couriers, trucks, tempos, delivery"]
      ],
      s: { manufacturing: 3, retail: 3, transport: 3, construction: 2, finance: 2, government: 2, otherservices: 2, mining: 1, realestate: 1 },
      chain: ["mining", "manufacturing", "retail", "finance", "otherservices", "transport"],
      models: "Vehicle sales, fuel margins, fares, loans, repair services, tolls"
    },
    {
      id: "communication", emoji: "📱", title: "Communication & Information", tier: "belong", freq: "Hundreds of times a day",
      why: "Humans are social animals — we must talk, know what is happening and find information to decide.",
      items: [
        ["📱", "Phones", "smartphones, feature phones, repairs"],
        ["📶", "Connection", "mobile data, broadband, Wi-Fi"],
        ["💬", "Messaging & social", "chat apps, social networks, video calls"],
        ["📰", "News", "newspapers, TV news, news apps"],
        ["🔍", "Search & maps", "search engines, maps, reviews"],
        ["🖥️", "Computers", "laptops, desktops, tablets"],
        ["✉️", "Post & courier", "postal service, couriers"],
        ["🗣️", "Language", "translation, language apps"],
        ["☁️", "Storing memories", "cloud storage, photo backup"]
      ],
      s: { information: 3, manufacturing: 3, retail: 2, transport: 1, professional: 1 },
      chain: ["manufacturing", "information", "retail"],
      models: "Monthly data plans, advertising, device sales, app subscriptions"
    },
    {
      id: "learning", emoji: "🎓", title: "Learning & Education", tier: "grow", freq: "Daily for ~15–20 years",
      why: "Humans are born knowing almost nothing. Every skill, job and idea is learned.",
      items: [
        ["🧸", "Early learning", "preschool, play school, day care"],
        ["🏫", "Schools", "government, private and international schools"],
        ["🎓", "College & university", "degrees, diplomas, hostels"],
        ["📚", "Books & stationery", "textbooks, notebooks, pens"],
        ["🧑‍🏫", "Tuition & coaching", "tuition classes, entrance-exam coaching"],
        ["💻", "Online learning", "courses, apps, video lectures"],
        ["🛠️", "Vocational training", "ITI, trade schools, apprenticeships"],
        ["📝", "Exams & certificates", "boards, tests, certification bodies"],
        ["🏛️", "Libraries & museums", "public libraries, science centres"],
        ["🎒", "School supplies", "bags, uniforms, shoes, school transport"]
      ],
      s: { education: 3, government: 3, information: 2, health: 1, retail: 1, professional: 1, manufacturing: 1 },
      chain: ["government", "education", "information"],
      models: "Fees, government funding, coaching, books, edtech subscriptions"
    },
    {
      id: "family", emoji: "👨‍👩‍👧", title: "Love, Family & Children", tier: "belong", freq: "A lifetime",
      why: "Finding a partner, raising children and caring for parents drives a huge share of every life's spending.",
      items: [
        ["💞", "Finding a partner", "matchmaking, dating apps, marriage bureaus"],
        ["💍", "Weddings", "venues, caterers, decor, jewellery, photographers"],
        ["🤰", "Pregnancy & birth", "fertility clinics, IVF, maternity care"],
        ["👶", "Baby products", "diapers, prams, cribs, baby care"],
        ["🧑‍🍼", "Childcare", "crèches, day care, nannies"],
        ["🧸", "Toys", "toys, games, kids' books"],
        ["🎂", "Celebrations", "birthdays, festivals, gifts, cakes"],
        ["💐", "Gifts & flowers", "gift shops, florists, greeting cards"],
        ["👵", "Caring for parents", "home care, elder care, medicines"],
        ["⚖️", "Family law", "adoption, divorce, custody, inheritance"]
      ],
      s: { health: 3, retail: 2, manufacturing: 2, otherservices: 2, accommodation: 2, information: 1, professional: 1, arts: 1 },
      chain: ["manufacturing", "retail", "health", "accommodation"],
      models: "Life-event spending (wedding, baby), recurring childcare fees, gifting"
    },
    {
      id: "pets", emoji: "🐕", title: "Pets & Animals", tier: "belong", freq: "Daily care",
      why: "People bond with animals as family members — and spend on them like family.",
      items: [
        ["🐶", "Getting a pet", "adoption shelters, breeders, pet shops"],
        ["🦴", "Pet food", "dog & cat food, treats, fish feed"],
        ["🩺", "Vets", "vet clinics, vaccines, pet insurance"],
        ["✂️", "Grooming & boarding", "pet salons, kennels, dog walkers"],
        ["🎾", "Pet supplies", "toys, leashes, beds, litter"],
        ["🐄", "Farm animals", "cattle, poultry, feed, veterinary care for livestock"]
      ],
      s: { professional: 3, otherservices: 3, retail: 2, manufacturing: 2, agri: 1, finance: 1 },
      chain: ["manufacturing", "retail", "professional", "otherservices"],
      models: "Recurring food sales, vet fees, grooming subscriptions"
    },
    {
      id: "belonging", emoji: "🤝", title: "Community & Belonging", tier: "belong", freq: "Weekly",
      why: "Loneliness harms health as much as smoking. Humans need a tribe — faith, neighbours, clubs, friends.",
      items: [
        ["🛕", "Places of worship", "temples, churches, mosques, gurudwaras"],
        ["🎉", "Festivals & events", "community festivals, fairs, melas"],
        ["🏟️", "Clubs & associations", "sports clubs, alumni groups, hobby clubs"],
        ["📲", "Online communities", "social media, groups, forums"],
        ["🤲", "Charity & volunteering", "NGOs, donations, food banks"],
        ["🏘️", "Neighbourhood groups", "resident welfare associations, panchayats"],
        ["☕", "Third places", "cafés, tea stalls, bars, parks"],
        ["🎗️", "Support groups", "help groups, recovery groups, counselling"]
      ],
      s: { otherservices: 3, information: 2, accommodation: 2, arts: 2, health: 1 },
      chain: ["otherservices", "information", "accommodation"],
      models: "Donations & memberships, event tickets, ad-funded platforms"
    },
    {
      id: "play", emoji: "🎮", title: "Play & Entertainment", tier: "grow", freq: "Daily",
      why: "Rest for the mind. Stories, games and sport are as old as humanity.",
      items: [
        ["📺", "TV, movies & streaming", "OTT apps, cinema, cable TV"],
        ["🎵", "Music", "streaming, concerts, instruments"],
        ["🎮", "Video games", "mobile games, consoles, PC games"],
        ["⚽", "Sport — play & watch", "turfs, equipment, leagues, stadiums"],
        ["🎲", "Toys & board games", "puzzles, cards, board games"],
        ["🎢", "Amusement parks", "theme parks, water parks, arcades"],
        ["🎭", "Live shows", "theatre, comedy, concerts"],
        ["📖", "Reading for fun", "novels, comics, audiobooks"],
        ["🎰", "Gambling & lotteries", "casinos, betting, lotteries"],
        ["🎣", "Hobbies", "fishing, gardening, crafts, collecting"]
      ],
      s: { information: 3, arts: 3, manufacturing: 2, retail: 2, accommodation: 1 },
      chain: ["information", "arts", "manufacturing", "retail"],
      models: "Subscriptions, tickets, ads, in-app purchases"
    },
    {
      id: "beauty", emoji: "💄", title: "Beauty & Style", tier: "esteem", freq: "Daily / monthly",
      why: "How we look changes how others treat us — and how we feel about ourselves.",
      items: [
        ["💄", "Cosmetics", "makeup, skincare, beauty brands"],
        ["💍", "Jewellery & watches", "gold, silver, imitation, watches"],
        ["🕶️", "Accessories", "sunglasses, bags, belts"],
        ["💇‍♀️", "Hair styling", "colour, treatments, extensions"],
        ["🏋️‍♀️", "Body goals", "gyms, diet plans, trainers"],
        ["🩻", "Cosmetic procedures", "dermatology, hair transplant, aesthetics"],
        ["📸", "Photos", "photographers, photo studios, editing apps"],
        ["✨", "Luxury & designer", "luxury brands, designer wear"]
      ],
      s: { retail: 3, otherservices: 3, manufacturing: 2, health: 1, professional: 1, arts: 1 },
      chain: ["manufacturing", "retail", "otherservices"],
      models: "Brand premiums, salon services, influencer marketing"
    },
    {
      id: "identity", emoji: "🪪", title: "Respect, Identity & Rights", tier: "esteem", freq: "Key moments",
      why: "Being recognised — as a citizen, an owner, an achiever. Without papers a person cannot open a bank account, travel or own land.",
      items: [
        ["🪪", "Identity documents", "ID cards, passports, birth certificates"],
        ["📜", "Proof of ownership", "land records, property registration"],
        ["⚖️", "Lawyers & courts", "legal advice, disputes, notary"],
        ["🗳️", "A voice", "voting, elections, petitions"],
        ["🏆", "Recognition", "awards, certificates, titles"],
        ["🚘", "Status symbols", "brands, cars, homes, memberships"],
        ["🌐", "Online presence", "profiles, personal websites, reviews"]
      ],
      s: { government: 3, professional: 3, information: 1, otherservices: 1, retail: 1 },
      chain: ["government", "professional"],
      models: "Government fees, legal fees, verification services"
    },
    {
      id: "culture", emoji: "🎨", title: "Art, Culture & Creativity", tier: "grow", freq: "Weekly",
      why: "Humans make things to express what words cannot — songs, pictures, stories, buildings.",
      items: [
        ["🖼️", "Art", "painting, sculpture, galleries"],
        ["🎼", "Learning an instrument", "music classes, instruments"],
        ["📷", "Photo & video making", "cameras, editing software"],
        ["✍️", "Writing & publishing", "books, blogs, self-publishing"],
        ["🏛️", "Heritage", "museums, monuments, historical sites"],
        ["🧶", "Crafts & DIY", "craft supplies, workshops"],
        ["🎬", "Content creation", "YouTube, podcasts, creator tools"],
        ["🎨", "Design", "graphic, interior and product design"]
      ],
      s: { arts: 3, information: 2, education: 2, professional: 1, retail: 1, manufacturing: 1 },
      chain: ["education", "arts", "information"],
      models: "Classes, tickets, creator ad revenue, art sales"
    },
    {
      id: "travel", emoji: "✈️", title: "Travel & Exploration", tier: "grow", freq: "A few times a year",
      why: "Curiosity, holidays, pilgrimage and visiting family — humans want to see new places.",
      items: [
        ["✈️", "Getting there", "flights, trains, buses, car rental"],
        ["🏨", "Places to stay", "hotels, homestays, resorts"],
        ["🗺️", "Trips & guides", "travel agents, tour packages, guides"],
        ["🛂", "Visas & passports", "passport offices, visa services"],
        ["🧳", "Travel gear", "luggage, travel adapters"],
        ["🕌", "Pilgrimage", "yatras, Hajj, Char Dham tours"],
        ["🏖️", "Holidays", "beach resorts, cruises, hill stations"],
        ["🏕️", "Outdoors", "camping, trekking, RVs"],
        ["💱", "Money abroad", "forex, travel cards, travel insurance"]
      ],
      s: { transport: 3, accommodation: 3, admin: 2, arts: 1, government: 1, finance: 1, retail: 1 },
      chain: ["transport", "accommodation", "admin", "arts"],
      models: "Fares, room nights, commissions, packages"
    },
    {
      id: "environment", emoji: "🌳", title: "Clean Surroundings & Nature", tier: "safe", freq: "Daily",
      why: "Every human produces about 1–2 kg of waste a day and needs clean streets, parks and a stable climate.",
      items: [
        ["🗑️", "Waste collection", "garbage collection, bins, landfills"],
        ["♻️", "Recycling", "scrap dealers, recycling plants"],
        ["🌳", "Parks & green space", "parks, gardens, forests"],
        ["🌡️", "Climate protection", "cooling, flood barriers, heat shelters"],
        ["🌱", "Clean energy", "solar, wind, EVs"],
        ["💨", "Pollution control", "treatment plants, filters, monitoring"],
        ["🐾", "Wildlife", "conservation, zoos, national parks"]
      ],
      s: { admin: 3, government: 3, utilities: 2, professional: 2, construction: 1, arts: 1 },
      chain: ["government", "admin", "utilities"],
      models: "Municipal contracts, recycling margins, green energy tariffs"
    },
    {
      id: "convenience", emoji: "⏱️", title: "Time & Convenience", tier: "esteem", freq: "Every day",
      why: "Everyone gets just 24 hours. As incomes rise, people pay to buy back time.",
      items: [
        ["🛵", "Delivery", "groceries in minutes, food, parcels"],
        ["🧹", "Home help", "maids, cooks, drivers, home-service apps"],
        ["🧺", "Laundry services", "wash & fold, ironing"],
        ["🤖", "Machines that save work", "dishwashers, robot vacuums"],
        ["📅", "Apps that save time", "bill pay, booking, reminders"],
        ["🏪", "Shops always open", "24/7 stores, vending machines"],
        ["🔧", "On-demand repair", "AC, plumber, electrician at your door"]
      ],
      s: { information: 3, transport: 2, otherservices: 2, retail: 2, admin: 2, manufacturing: 1 },
      chain: ["information", "transport", "otherservices"],
      models: "Platform commissions, delivery fees, subscriptions"
    },
    {
      id: "meaning", emoji: "🕉️", title: "Meaning, Purpose & Spirituality", tier: "grow", freq: "Lifelong",
      why: "Once basic needs are met, humans ask 'why?'. Faith, purpose and self-growth fill that space.",
      items: [
        ["🙏", "Religion & prayer", "places of worship, puja items, priests"],
        ["🧘", "Meditation & yoga", "classes, retreats, apps"],
        ["📚", "Self-improvement", "books, courses, seminars"],
        ["🎯", "Coaching & therapy", "life coaches, therapists"],
        ["🤲", "Giving back", "charity, volunteering, foundations"],
        ["🌄", "Retreats & pilgrimages", "ashrams, retreats, spiritual travel"],
        ["🔭", "Curiosity", "science, astronomy, philosophy"]
      ],
      s: { otherservices: 3, education: 2, health: 1, information: 1, arts: 1, accommodation: 1 },
      chain: ["otherservices", "education", "information"],
      models: "Donations, course fees, retreats, apps"
    },
    {
      id: "endoflife", emoji: "🕯️", title: "Old Age, Death & Legacy", tier: "safe", freq: "Once — planned for decades",
      why: "Every human ages and dies. Families need care, dignity, rituals, and a way to pass on what was built.",
      items: [
        ["🏡", "Retirement living", "retirement homes, senior communities"],
        ["🦯", "Elder care", "home nurses, day-care for elders, aids"],
        ["🏥", "Hospice & palliative care", "end-of-life medical care"],
        ["⚰️", "Funerals", "funeral homes, cremation, last rites"],
        ["🪦", "Memorials", "cemeteries, memorials, remembrance"],
        ["📜", "Wills & estates", "wills, trusts, succession"],
        ["🛡️", "Life insurance", "term plans, annuities"]
      ],
      s: { health: 3, otherservices: 3, finance: 3, professional: 2, realestate: 1, government: 1 },
      chain: ["finance", "health", "otherservices", "professional"],
      models: "Insurance premiums, care fees, funeral services"
    }
  ],

  // ---------------------------------------------------------------- LIFE STAGES
  stages: [
    { emoji: "🤰", name: "Before birth", age: "−9 months", needs: ["health", "family", "money", "food"], buys: "fertility care, scans, prenatal vitamins, maternity clothes, hospital delivery" },
    { emoji: "👶", name: "Baby", age: "0–2", needs: ["food", "hygiene", "health", "family", "sleep", "clothing"], buys: "diapers, formula, vaccines, crib, pram, baby clothes, paediatrician, day care" },
    { emoji: "🧒", name: "Child", age: "3–12", needs: ["learning", "play", "food", "clothing", "health", "family"], buys: "school fees, uniforms, books, toys, tuition, sports, cartoons, snacks" },
    { emoji: "🧑‍🎓", name: "Teen", age: "13–19", needs: ["learning", "communication", "beauty", "play", "belonging", "identity"], buys: "smartphone, data, fashion, coaching, exams, games, first two-wheeler" },
    { emoji: "🧑", name: "Young adult", age: "20–29", needs: ["work", "shelter", "family", "money", "travel", "communication", "mobility"], buys: "college, first job, rent, dating, laptop, gym, first loan, first investments, trips" },
    { emoji: "👩‍👧", name: "Building a life", age: "30–44", needs: ["shelter", "family", "money", "mobility", "safety", "work", "convenience"], buys: "wedding, home loan, car, children, insurance, furniture, appliances, childcare" },
    { emoji: "🧑‍💼", name: "Peak years", age: "45–64", needs: ["health", "money", "learning", "family", "travel", "meaning"], buys: "children's college, health check-ups, wealth building, parents' care, children's weddings" },
    { emoji: "🧓", name: "Elder", age: "65–84", needs: ["health", "money", "belonging", "meaning", "convenience", "travel"], buys: "pension, medicines, doctor visits, home help, pilgrimages, hobbies, grandchildren gifts" },
    { emoji: "🕯️", name: "End of life", age: "85+", needs: ["endoflife", "health", "family", "identity"], buys: "nursing, hospice, wills, funeral, memorial" }
  ],

  // ---------------------------------------------------------------- INDUSTRIES (NAICS sectors)
  // va: BEA 2025 value added, $ millions.  jobs: BLS 2025 avg, thousands.  naics: key into SUSB_SIZE.
  // sub: [emoji, name, value added $M or null, plain note]
  // Ordered as the economy flows: take from the earth -> make -> move -> sell -> serve -> govern.
  stagesOfEconomy: [
    { name: "Take from the Earth", ids: ["agri", "mining"] },
    { name: "Power & build", ids: ["utilities", "construction"] },
    { name: "Make things", ids: ["manufacturing"] },
    { name: "Move & sell things", ids: ["wholesale", "transport", "retail"] },
    { name: "Information & money", ids: ["information", "finance", "realestate"] },
    { name: "Help businesses run", ids: ["professional", "management", "admin"] },
    { name: "Care for people", ids: ["education", "health"] },
    { name: "Feed, host & entertain", ids: ["arts", "accommodation"] },
    { name: "Everyday services", ids: ["otherservices"] },
    { name: "Run the country", ids: ["government"] }
  ],
  industries: [
    {
      id: "agri", naics: "11", emoji: "🌾", name: "Agriculture, Forestry & Fishing", short: "Agriculture",
      va: 255925, jobs: null, jobsNote: "≈2.1M incl. self-employed farmers (BLS household survey); not in payroll counts",
      firmsNote: "1.9 million farms (USDA Census of Agriculture 2022) — farms are excluded from Census business counts",
      what: "Grows food, fibre and wood: crops, livestock, dairy, fish and timber. The start of the food and clothing chains.",
      sub: [["🚜", "Farms (crops & livestock)", 203549, "grain, vegetables, fruit, cotton, cattle, poultry, dairy"], ["🎣", "Forestry, fishing & related", 52377, "timber, fishing boats, farm services"]],
      examples: "Family farms, contract poultry growers, timber companies",
      insight: "Tiny share of GDP (under 1%) yet everything in Food, Clothing and Shelter starts here."
    },
    {
      id: "mining", naics: "21", emoji: "⛏️", name: "Mining, Oil & Gas", short: "Mining & oil",
      va: 398662, jobs: 613, jobsNote: "mining & logging",
      what: "Pulls raw materials out of the ground: crude oil, natural gas, coal, metals, sand and stone.",
      sub: [["🛢️", "Oil & gas extraction", 251712, "crude oil, natural gas wells"], ["🪨", "Mining (except oil & gas)", 81207, "coal, copper, iron, gold, sand, stone"], ["🛠️", "Support activities", 65744, "drilling services, oilfield services"]],
      examples: "ExxonMobil, Chevron, ConocoPhillips, Freeport-McMoRan",
      insight: "Very few workers, very high value per worker — capital-heavy and dominated by large firms."
    },
    {
      id: "utilities", naics: "22", emoji: "💡", name: "Utilities", short: "Utilities",
      va: 507741, jobs: 601,
      what: "Delivers electricity, piped gas and water to every home and business.",
      sub: [["⚡", "Electric power", null, "generation, transmission, distribution"], ["🔥", "Natural gas distribution", null, "piped gas to homes and industry"], ["🚰", "Water, sewage & steam", null, "water supply and treatment"]],
      examples: "NextEra Energy, Duke Energy, Southern Company, American Water",
      insight: "Natural monopolies — regulated prices, guaranteed demand, huge upfront investment."
    },
    {
      id: "construction", naics: "23", emoji: "🏗️", name: "Construction", short: "Construction",
      va: 1340017, jobs: 8263,
      what: "Builds homes, offices, factories, roads, bridges and pipelines — and repairs them.",
      sub: [["🏘️", "Building construction", null, "homes, apartments, offices, shops"], ["🛣️", "Heavy & civil engineering", null, "roads, bridges, dams, utility lines"], ["🔌", "Specialty trade contractors", null, "plumbing, electrical, roofing, painting, HVAC"]],
      examples: "D.R. Horton, Lennar, Bechtel, Turner, millions of local contractors",
      insight: "One of the most small-business sectors: ~780,000 employer firms, most jobs in firms under 500."
    },
    {
      id: "manufacturing", naics: "31-33", emoji: "🏭", name: "Manufacturing", short: "Manufacturing",
      va: 2930097, jobs: 12632,
      what: "Turns raw materials into products: food, medicines, chemicals, cars, chips, clothes, machines.",
      sub: [
        ["🧪", "Chemicals (incl. medicines)", 579356, "pharma, plastics resin, fertiliser, soaps, paints"],
        ["🥫", "Food, beverage & tobacco", 384011, "packaged food, dairy, meat processing, soft drinks"],
        ["💻", "Computers & electronics", 315443, "chips, phones, computers, instruments"],
        ["⚙️", "Machinery", 220204, "farm, construction & industrial machines"],
        ["✈️", "Aircraft, ships & other transport", 201534, "aircraft, aerospace, ships, rail cars"],
        ["🔩", "Fabricated metal products", 199166, "tools, cans, structural metal, hardware"],
        ["🚗", "Motor vehicles & parts", 185076, "cars, trucks, auto parts"],
        ["🛢️", "Petroleum & coal products", 147973, "refined petrol, diesel, asphalt"],
        ["🩹", "Miscellaneous (medical devices, toys…)", 118941, "medical equipment, jewellery, toys, sporting goods"],
        ["🧴", "Plastics & rubber", 94074, "packaging, tyres, pipes"],
        ["🔌", "Electrical equipment & appliances", 87092, "appliances, motors, batteries, lighting"],
        ["🧱", "Non-metallic minerals", 85094, "cement, glass, bricks, ceramics"],
        ["🏗️", "Primary metals", 77837, "steel, aluminium, copper"],
        ["📦", "Paper", 70916, "paper, cartons, tissue"],
        ["🪵", "Wood products", 55509, "lumber, plywood"],
        ["🖨️", "Printing", 42531, "printing, labels"],
        ["🛋️", "Furniture", 35391, "household & office furniture"],
        ["🧶", "Textile mills", 17747, "yarn, fabric, carpets"],
        ["👔", "Apparel & leather", 12201, "garments, footwear, leather goods"]
      ],
      examples: "Eli Lilly, Pfizer, PepsiCo, Procter & Gamble, GM, Ford, Boeing, Intel",
      insight: "Biggest goods-producing sector. Note how small US apparel making is — clothes are mostly imported."
    },
    {
      id: "wholesale", naics: "42", emoji: "📦", name: "Wholesale Trade", short: "Wholesale",
      va: 1952420, jobs: 6058,
      what: "The middlemen: buy in bulk from makers and sell to shops, hospitals, restaurants and factories.",
      sub: [["🔧", "Durable goods distributors", null, "machinery, cars & parts, electronics, building supplies"], ["💊", "Non-durable distributors", null, "drugs, groceries, chemicals, fuel, apparel"], ["🤝", "Agents & electronic markets", null, "brokers, B2B marketplaces"]],
      examples: "McKesson, Cencora, Cardinal Health, Sysco",
      insight: "Thin margins, huge revenue: wholesale has the largest receipts of any sector (≈$11.6T in 2022)."
    },
    {
      id: "transport", naics: "48-49", emoji: "🚚", name: "Transportation & Warehousing", short: "Transport",
      va: 1008931, jobs: 6639,
      what: "Moves people and goods — by truck, rail, air, ship and pipeline — and stores them in warehouses.",
      sub: [["🚛", "Trucking", 248757, "freight trucking, long-haul and local"], ["📮", "Couriers, postal & support", 229897, "couriers, freight forwarding, airports, ports"], ["✈️", "Air transport", 182604, "airlines, cargo airlines"], ["🏬", "Warehousing & storage", 132159, "warehouses, cold storage, fulfilment"], ["🚌", "Transit & ground passenger", 86690, "buses, taxis, school buses"], ["🛢️", "Pipelines", 51998, "oil & gas pipelines"], ["🚆", "Rail", 50585, "freight railroads"], ["🚢", "Water transport", 26240, "shipping, ferries"]],
      examples: "UPS, FedEx, Delta, Union Pacific, J.B. Hunt",
      insight: "The physical link in every product chain — e-commerce made warehousing one of the fastest-growing parts."
    },
    {
      id: "retail", naics: "44-45", emoji: "🛒", name: "Retail Trade", short: "Retail",
      va: 1810361, jobs: 15442,
      what: "Sells goods to people: supermarkets, kirana-type stores, car dealers, pharmacies, petrol pumps, online stores.",
      sub: [["🛍️", "Other retail (incl. online, clothing, pharmacies, fuel, hardware)", 992262, "e-commerce, apparel, health stores, gas stations, home improvement"], ["🚘", "Car & parts dealers", 357075, "new & used cars, auto parts"], ["🥬", "Food & beverage stores", 234709, "supermarkets, grocery, liquor stores"], ["🏬", "General merchandise", 226315, "department stores, warehouse clubs, supercentres"]],
      examples: "Walmart, Amazon, Costco, Home Depot, Kroger, CVS",
      insight: "One of the biggest employers (15.4M jobs), but half of retail jobs are in giant chains (20,000+ staff)."
    },
    {
      id: "information", naics: "51", emoji: "📡", name: "Information & Media", short: "Information",
      va: 1766412, jobs: 2861,
      what: "Software, internet platforms, telecom, publishing, film, music and broadcasting.",
      sub: [["🌐", "Internet, search & data processing", 595997, "search, social media, cloud, data centres"], ["📶", "Broadcasting & telecom", 548612, "mobile, broadband, cable, TV, radio"], ["💾", "Publishing incl. software", 507546, "software, newspapers, books"], ["🎬", "Film & music", 114257, "movies, studios, music labels, cinemas"]],
      examples: "Alphabet, Meta, Microsoft, Comcast, AT&T, Netflix",
      insight: "Only 1.8% of jobs but 5.7% of GDP — one of the highest values per worker (with utilities, mining and real estate)."
    },
    {
      id: "finance", naics: "52", emoji: "🏦", name: "Finance & Insurance", short: "Finance",
      va: 2687634, jobs: 6739,
      what: "Banks, lenders, payment networks, stock markets, fund managers and insurance companies.",
      sub: [["🏦", "Banks & credit", 1237877, "banks, credit cards, lenders, the Federal Reserve"], ["🛡️", "Insurance", 942955, "life, health, car, home insurance (health insurers sit here)"], ["📈", "Securities & investments", 491872, "brokers, asset managers, exchanges"], ["🗄️", "Funds & trusts", 14931, "pension funds, trusts"]],
      examples: "JPMorgan Chase, Bank of America, Berkshire Hathaway, UnitedHealth (insurance), BlackRock, Visa",
      insight: "Every other need touches money — finance takes a small cut of almost every transaction in the economy."
    },
    {
      id: "realestate", naics: "53", emoji: "🏢", name: "Real Estate, Rental & Leasing", short: "Real estate",
      va: 4234142, jobs: 2456,
      what: "Owning, renting and managing land and buildings — plus renting out cars, equipment and brands.",
      sub: [["🏠", "Housing", 3028020, "rent paid, plus the rent homeowners 'pay themselves' (BEA imputes it)"], ["🏬", "Other real estate", 853529, "offices, shops, warehouses, brokers, property managers"], ["🔑", "Rental & leasing", 352592, "car rental, equipment leasing, franchise / brand licensing"]],
      examples: "Landlords & homeowners, Prologis, Simon Property, CBRE, U-Haul",
      insight: "Largest sector in GDP (13.7%) with few workers. Most of it is housing: BEA counts the rent owners would pay to themselves."
    },
    {
      id: "professional", naics: "54", emoji: "🧑‍💻", name: "Professional, Scientific & Technical", short: "Professional",
      va: 2465150, jobs: 10777,
      what: "Sells expertise: lawyers, accountants, engineers, IT services, consultants, ad agencies, R&D labs, vets.",
      sub: [["🧮", "Accounting, engineering, consulting, ads, R&D, vets…", 1472091, "architects, designers, marketing, research labs"], ["💻", "Computer systems design", 569158, "IT services, custom software, system integrators"], ["⚖️", "Legal services", 423900, "law firms, notaries"]],
      examples: "Accenture, Deloitte, Kirkland & Ellis, AECOM, Omnicom",
      insight: "872,000 employer firms — the most of any sector. Knowledge businesses can start with one person and a laptop."
    },
    {
      id: "management", naics: "55", emoji: "🏛️", name: "Management of Companies", short: "Head offices",
      va: 558559, jobs: 2623,
      what: "Corporate head offices and holding companies that own and run other businesses.",
      sub: [["🏢", "Head offices & holding companies", 558559, "corporate HQs, regional offices, bank holding companies"]],
      examples: "Group HQs of large companies",
      insight: "Exists because big firms separate 'running the company' from 'doing the work'. Almost entirely large firms."
    },
    {
      id: "admin", naics: "56", emoji: "🧹", name: "Admin Support & Waste Management", short: "Admin & waste",
      va: 919944, jobs: 9015,
      what: "Does the support work: staffing agencies, security guards, cleaning, call centres, travel agents, garbage.",
      sub: [["🧑‍🤝‍🧑", "Administrative & support", 823566, "staffing, payroll, call centres, security, building cleaning, travel agencies"], ["🗑️", "Waste management", 96378, "garbage collection, landfills, recycling, remediation"]],
      examples: "Waste Management, ADP, ManpowerGroup, Allied Universal, ABM",
      insight: "Grows when companies outsource. Over a third of its jobs are in giant (20,000+) firms."
    },
    {
      id: "education", naics: "61", emoji: "🏫", name: "Educational Services (private)", short: "Education",
      va: 353221, jobs: 4051, jobsNote: "private only — public schools & universities are counted under Government",
      what: "Private schools, colleges, universities, coaching, training and tutoring.",
      sub: [["🏫", "Private schools", null, "K-12 private schools"], ["🎓", "Colleges & universities", null, "private universities, community colleges"], ["🧑‍🏫", "Training & coaching", null, "test prep, vocational, language, IT training"]],
      examples: "Harvard, NYU, Kaplan, driving & coding schools",
      insight: "Most US education is public and sits in Government — the private sector is only 1.1% of GDP."
    },
    {
      id: "health", naics: "62", emoji: "🏥", name: "Health Care & Social Assistance", short: "Health care",
      va: 2327196, jobs: 23291,
      what: "Doctors, hospitals, nursing homes, home care, child day care and social services.",
      sub: [["🩺", "Ambulatory care (doctors, dentists, labs, home care)", 1127368, "clinics, outpatient, diagnostic labs, home health"], ["🏥", "Hospitals", 728277, "general, specialty & psychiatric hospitals"], ["🛏️", "Social assistance (incl. child day care)", 249286, "child care, elder services, food banks, job training"], ["🧓", "Nursing & residential care", 222265, "nursing homes, assisted living"]],
      examples: "HCA Healthcare, Kaiser Permanente, Mayo Clinic, DaVita",
      insight: "America's largest private employer: 23.3M jobs — 1 in every 7 jobs. Ageing populations keep growing it."
    },
    {
      id: "arts", naics: "71", emoji: "🎭", name: "Arts, Entertainment & Recreation", short: "Arts & recreation",
      va: 321256, jobs: 2680,
      what: "Live performances, sports teams, museums, theme parks, gyms, golf courses and casinos.",
      sub: [["🏟️", "Performing arts, sports, museums", 177889, "theatres, sports teams, artists, museums, zoos"], ["🎢", "Amusement, gambling & recreation", 143368, "theme parks, casinos, gyms, golf, bowling"]],
      examples: "Live Nation, NFL & NBA teams, Planet Fitness, Six Flags",
      insight: "Mostly small and local — 64% of its jobs are in firms with under 500 employees."
    },
    {
      id: "accommodation", naics: "72", emoji: "🍔", name: "Accommodation & Food Services", short: "Hotels & food",
      va: 965347, jobs: 14189,
      what: "Restaurants, cafés, bars, caterers, hotels and resorts.",
      sub: [["🍽️", "Restaurants & bars", 708914, "restaurants, fast food, cafés, caterers, bars"], ["🏨", "Accommodation", 256433, "hotels, motels, resorts, hostels"]],
      examples: "McDonald's & its franchisees, Starbucks, Chipotle, Marriott, Hilton",
      insight: "Lowest value per worker of all sectors — many jobs, low wages. 63% of jobs in firms under 500."
    },
    {
      id: "otherservices", naics: "81", emoji: "✂️", name: "Other Services", short: "Other services",
      va: 629714, jobs: 5995,
      what: "Everyday local services: car repair, salons, laundry, funeral homes, pet care — plus religious, civic and professional organisations.",
      sub: [["🔧", "Repair & maintenance", null, "car repair, electronics & appliance repair"], ["💇", "Personal & laundry", null, "salons, barbers, laundries, funeral homes, pet care"], ["🛕", "Religious, civic & member organisations", null, "places of worship, NGOs, unions, associations"], ["🧑‍🍳", "Private households", null, "maids, cooks, nannies employed by families"]],
      examples: "Local garages, salons and laundries; Service Corporation International (funerals); churches and associations",
      insight: "The most small-business sector of all: 85% of its jobs are in firms with under 500 employees."
    },
    {
      id: "government", naics: null, emoji: "🏛️", name: "Government", short: "Government",
      va: 3428566, jobs: 23513,
      firmsNote: "1 federal government, 50 states and ~90,800 local governments (Census of Governments 2022)",
      what: "Defence, police, courts, public schools & universities, roads, social security, post office, public hospitals.",
      sub: [["🏙️", "State & local", 2331108, "public schools, state universities, police, fire, roads, water, public hospitals"], ["🪖", "Federal — national defence", 565309, "military, defence civilians"], ["🏛️", "Federal — non-defence", 446700, "tax, courts, social security, health agencies, parks"], ["📮", "Federal enterprises", 85448, "US Postal Service and similar"]],
      jobsSplit: { federal: 2903, state: 5505, local: 15104 },
      examples: "Department of Defense, Veterans Affairs, USPS, public school districts, state universities",
      insight: "11% of GDP and 15% of jobs. Two-thirds of government jobs are local — mostly teachers."
    }
  ],

  // Other institutions people meet in daily life (counts rounded; sources noted)
  institutions: [
    ["🤲", "Nonprofits", "≈1.9M registered with IRS (2025); ≈14M workers", "Spread across health, education, religion, arts — counted inside those sectors"],
    ["🛕", "Religious congregations", "≈350,000+", "Counted in Other Services"],
    ["🏫", "Public schools", "≈99,000", "NCES — counted in Government"],
    ["🏥", "Hospitals", "≈6,100", "American Hospital Association"],
    ["🎓", "Degree-granting colleges", "≈3,900", "NCES"],
    ["🏙️", "Local governments", "90,837", "Census of Governments 2022 — counties, cities, towns, school & special districts"],
    ["🧑‍💼", "One-person businesses", "29.8M", "Census Nonemployer Statistics 2022 — freelancers, gig workers, sole owners"]
  ]
};
