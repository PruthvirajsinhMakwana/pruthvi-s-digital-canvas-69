// SEO landing-page matrix: service × city.
// Used by the dynamic route /services/:service/in/:city and the sitemap generator.

export interface SeoService {
  slug: string;
  name: string;
  short: string;
  benefits: string[];
  deliverables: string[];
  priceFrom: string; // INR
  faq: { q: string; a: string }[];
}

export interface SeoCity {
  slug: string;
  name: string;
  state: string;
  region: "gujarat" | "india";
  intro: string;
}

export const seoServices: SeoService[] = [
  {
    slug: "web-development",
    name: "Web Development",
    short: "Fast, secure, SEO-ready websites built with modern React & WordPress.",
    benefits: [
      "Lightning-fast load times under 2s",
      "Mobile-first responsive design",
      "On-page SEO baked in",
      "Secure hosting & SSL setup",
    ],
    deliverables: ["Custom UI/UX", "CMS or React build", "SEO setup", "Analytics & tracking", "1 month support"],
    priceFrom: "₹9,999",
    faq: [
      { q: "How long does a website take?", a: "Simple sites in 5–7 days, business sites in 2–3 weeks, custom builds in 4–6 weeks." },
      { q: "Do you provide hosting?", a: "Yes — I set up hosting, domain, SSL, and email on your account so you fully own the assets." },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    short: "End-to-end digital marketing: SEO, ads, social, email — with real ROI tracking.",
    benefits: ["Lead-gen funnels that convert", "Google & Meta Ads managed daily", "SEO + content strategy", "Monthly reporting"],
    deliverables: ["Strategy roadmap", "Ads setup & management", "Content calendar", "GA4 + Search Console", "Monthly reports"],
    priceFrom: "₹14,999/mo",
    faq: [
      { q: "How soon will I see results?", a: "Ads: 1–2 weeks. SEO: 3–6 months for meaningful movement, faster for local queries." },
      { q: "Who owns the ad accounts?", a: "You do. Everything is created on your Google/Meta business accounts." },
    ],
  },
  {
    slug: "video-editing",
    name: "Video Editing",
    short: "Reels, long-form YouTube, wedding films, and ad creatives edited fast.",
    benefits: ["Reels & shorts optimised for reach", "Colour grading + sound design", "Fast 48–72h turnaround", "Unlimited revisions on plans"],
    deliverables: ["Cut & assembly", "Motion graphics", "Subtitles", "Thumbnails", "Delivery in all formats"],
    priceFrom: "₹499/video",
    faq: [
      { q: "What software do you use?", a: "Premiere Pro, After Effects, DaVinci Resolve, and CapCut Pro for reels." },
      { q: "Do you edit wedding films?", a: "Yes — Gujarati/Hindi weddings, highlight reels, cinematic trailers." },
    ],
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    short: "Logos, brand kits, social creatives, packaging & pitch decks.",
    benefits: ["Original brand identity", "Print + digital deliverables", "Source files included", "Unlimited revisions"],
    deliverables: ["Logo suite", "Brand guidelines", "Social templates", "Business stationery"],
    priceFrom: "₹1,999",
    faq: [
      { q: "Do I get editable files?", a: "Yes — AI, PSD, Figma source files are handed over on final approval." },
      { q: "How many revisions?", a: "Up to 3 concept rounds + unlimited tweaks on the chosen direction." },
    ],
  },
  {
    slug: "seo-services",
    name: "SEO Services",
    short: "Rank on Google with on-page, technical, and local SEO done right.",
    benefits: ["Keyword research with real data", "On-page + schema fixes", "Local map pack ranking", "Backlink outreach"],
    deliverables: ["SEO audit", "Keyword map", "On-page fixes", "GBP optimisation", "Monthly reports"],
    priceFrom: "₹9,999/mo",
    faq: [
      { q: "Is SEO worth it for small business?", a: "For local service businesses, yes — Google Maps + local SEO returns leads within 60–90 days." },
      { q: "Do you guarantee #1 ranking?", a: "No ethical SEO can guarantee position — I guarantee process, transparency, and measurable growth." },
    ],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    short: "Instagram, Facebook & YouTube growth with content + paid ads.",
    benefits: ["Content calendar every month", "Reels + carousels", "Community management", "Paid boost strategy"],
    deliverables: ["12–20 posts/month", "8 reels/month", "Stories & engagement", "Monthly analytics"],
    priceFrom: "₹9,999/mo",
    faq: [
      { q: "Do you shoot content too?", a: "Yes — on-site shoots available in Gujarat cities; remote clients get scripts + shot lists." },
      { q: "Which platforms?", a: "Instagram, Facebook, YouTube Shorts, and LinkedIn for B2B." },
    ],
  },
  {
    slug: "wordpress-development",
    name: "WordPress Development",
    short: "Custom WordPress sites, WooCommerce, and Elementor builds.",
    benefits: ["No page-builder bloat", "SEO-ready themes", "WooCommerce stores", "Speed-optimised hosting"],
    deliverables: ["Custom theme/child theme", "Plugin setup", "SEO + caching", "Backups & security"],
    priceFrom: "₹12,999",
    faq: [
      { q: "Elementor or Gutenberg?", a: "I use whichever fits your team — Gutenberg for speed, Elementor for flexibility." },
      { q: "Do you migrate existing sites?", a: "Yes — zero-downtime migration from Wix, Shopify, or old hosts." },
    ],
  },
  {
    slug: "esports-hosting",
    name: "Esports Hosting & Commentary",
    short: "BGMI, Valorant & Free Fire tournament hosting, casting, and production.",
    benefits: ["Bilingual (Hindi/Gujarati/English) casting", "OBS + observer setup", "Sponsor-ready broadcast", "Prize + bracket management"],
    deliverables: ["Live casting", "Bracket & rules", "OBS overlays", "YouTube/Twitch stream setup"],
    priceFrom: "₹4,999/event",
    faq: [
      { q: "Which games do you cast?", a: "BGMI, Valorant, Free Fire, CODM — bilingual casting available." },
      { q: "Can you organise the full event?", a: "Yes — from registration to prize distribution, end-to-end tournament management." },
    ],
  },
];

export const seoCities: SeoCity[] = [
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", region: "gujarat", intro: "Ahmedabad's fast-growing startup and SME scene needs digital talent that ships." },
  { slug: "surat", name: "Surat", state: "Gujarat", region: "gujarat", intro: "Surat's textile, diamond and D2C brands run on great creatives and paid ads." },
  { slug: "rajkot", name: "Rajkot", state: "Gujarat", region: "gujarat", intro: "Rajkot's manufacturing and retail sector is going digital fast." },
  { slug: "vadodara", name: "Vadodara", state: "Gujarat", region: "gujarat", intro: "Vadodara SMBs need lead-gen sites and local SEO that actually ranks." },
  { slug: "gandhinagar", name: "Gandhinagar", state: "Gujarat", region: "gujarat", intro: "Gandhinagar's govt-tech and GIFT City brands need premium web presence." },
  { slug: "bhavnagar", name: "Bhavnagar", state: "Gujarat", region: "gujarat", intro: "Bhavnagar's shipping, ceramic and salt-industry brands go online." },
  { slug: "jamnagar", name: "Jamnagar", state: "Gujarat", region: "gujarat", intro: "Jamnagar brass and refinery ecosystem needs B2B lead-gen." },
  { slug: "junagadh", name: "Junagadh", state: "Gujarat", region: "gujarat", intro: "Junagadh tourism and agri brands scale with the right digital push." },
  { slug: "anand", name: "Anand", state: "Gujarat", region: "gujarat", intro: "Anand's dairy, education and agri ecosystem needs modern web + video." },
  { slug: "mehsana", name: "Mehsana", state: "Gujarat", region: "gujarat", intro: "Mehsana's local business owners need Google-first digital presence." },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", region: "india", intro: "Mumbai brands demand premium creative + performance marketing." },
  { slug: "delhi", name: "Delhi", state: "Delhi NCR", region: "india", intro: "Delhi NCR startups need fast websites and conversion-first ads." },
  { slug: "bangalore", name: "Bangalore", state: "Karnataka", region: "india", intro: "Bangalore tech + D2C brands scale with strong dev and content." },
  { slug: "pune", name: "Pune", state: "Maharashtra", region: "india", intro: "Pune SMBs and edtech brands rely on great web + video content." },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", region: "india", intro: "Hyderabad tech ecosystem needs polished digital storefronts." },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", region: "india", intro: "Chennai manufacturing and IT services scale with modern web." },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", region: "india", intro: "Kolkata brands modernise with fast websites and social growth." },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", region: "india", intro: "Jaipur handicraft, jewellery and tourism brands go global online." },
];

export function findService(slug: string) {
  return seoServices.find((s) => s.slug === slug);
}
export function findCity(slug: string) {
  return seoCities.find((c) => c.slug === slug);
}
