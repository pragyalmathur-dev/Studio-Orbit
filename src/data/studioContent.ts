/**
 * StudioOrbit Content Configuration
 * Focused positioning: Branding & Brand Transformation
 */

export interface MapShowcaseProject {
  id: string;
  title: string;
  description: string;
  publicUrl: string;
  embedUrl?: string;
  imageUrl?: string;
  category: string;
  features: string[];
  statusLabel?: string;
}

export interface BrandPortfolioItem {
  id: string;
  title: string;
  discipline: string;
  summary: string;
  details: string[];
  imageUrl?: string;
  liveUrl?: string;
  tag?: string;
}

export interface SelectedProject {
  id: string;
  title: string;
  subtitle: string;
  client?: string;
  category: 'Branding' | 'Brand Transformation';
  brandChallenge: string;
  whatChanged: string;
  brief?: string;
  role?: string;
  whatWeBuilt?: string;
  keyFeatures?: string[];
  label: 'Branding' | 'Brand Transformation';
  publicLinkText?: string;
  publicUrl?: string;
  imageUrl?: string;
  pdfUrl?: string;
  results?: string;
  brandPortfolio?: BrandPortfolioItem[];
}

export function getProjectPdfUrl(project: SelectedProject): string {
  if (project.pdfUrl) return project.pdfUrl;
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `/assets/work/${slug}.pdf`;
}

export interface CoreOffering {
  number: '01' | '02';
  title: 'Branding' | 'Brand Transformation';
  headline: string;
  description: string;
  supportingLine: string;
  narrative: string;
  capabilities: string[];
}

export interface HowWeWorkStep {
  number: string;
  name: string;
  summary: string;
  description: string;
}

export const STUDIO_CONFIG = {
  name: 'StudioOrbit',
  legalName: 'StudioOrbit',
  tagline: 'A branding and brand transformation studio.',
  descriptor: 'A branding and brand transformation studio.',
  eyebrow: 'Branding & Brand Transformation',
  heroHeadline: 'Build a brand.\nShape what comes next.',
  heroSupporting:
    'We create brands with a clear identity and help established businesses evolve through strategy, design, and digital experiences.',
  aboutHeadline: 'We work with businesses at defining moments.',
  aboutSubtitle:
    'Whether building a brand from the beginning or shaping its next chapter, we bring strategy and creative execution together to create a clear, consistent brand presence.',
  aboutCopy:
    'We work with businesses at defining moments, whether they are building a brand from the beginning or shaping its next chapter. We bring strategy and creative execution together to create a clear, consistent brand presence.',
  
  // Real Contact Channels
  email: 'studioorbit.in@gmail.com',
  emailFormatted: 'studioorbit.in@gmail.com',
  phone: '+91 85270 55370',
  phoneFormatted: '+91 85270 55370',
  phoneTel: '+918527055370',
  location: 'Delhi, India',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com/company/studioorbit',
  copyrightYear: 2026,
};

export const CORE_OFFERINGS: CoreOffering[] = [
  {
    number: '01',
    title: 'Branding',
    headline: 'Build something new.',
    description:
      'We define what your brand stands for and bring it to life through a distinctive identity, a clear voice, and a consistent presence.',
    supportingLine: 'For new ventures and businesses establishing their brand.',
    narrative:
      'We shape the strategic and creative foundations that give a new venture its distinction: finding the clear market positioning, crafting an unmistakable visual identity and voice, and delivering the launch touchpoints, website, and packaging needed to enter the world with authority.',
    capabilities: [
      'Brand discovery and positioning',
      'Audience and competitor understanding',
      'Naming and messaging architecture',
      'Visual identity and typographic systems',
      'Brand voice and tone guidelines',
      'Website and digital launch applications',
      'Essential brand packaging and collateral',
    ],
  },
  {
    number: '02',
    title: 'Brand Transformation',
    headline: 'Move an existing brand forward.',
    description:
      'We help established businesses find renewed clarity, evolving their positioning, identity, and presence for what comes next.',
    supportingLine: 'For brands ready for their next chapter.',
    narrative:
      'We work with established businesses whose positioning, visual identity, communication, or digital presence has outgrown their current expression. We reassess the existing brand, sharpen its strategic focus, and bring its physical and digital presence into direct alignment with its next stage of growth.',
    capabilities: [
      'Brand audit and strategic reassessment',
      'Repositioning and narrative evolution',
      'Identity refresh and visual modernization',
      'Messaging and customer communication updates',
      'Website and digital presence evolution',
      'Consistent implementation across relevant touchpoints',
      'Brand governance and team design systems',
    ],
  },
];

export const HOW_WE_WORK_STEPS: HowWeWorkStep[] = [
  {
    number: '01',
    name: 'Understand',
    summary: 'Clear direction from day one.',
    description:
      'We explore your business, audience, and ambition to establish a clear direction.',
  },
  {
    number: '02',
    name: 'Define',
    summary: 'The character and voice of your brand.',
    description:
      'We shape the positioning, identity, and voice that give your brand its character.',
  },
  {
    number: '03',
    name: 'Bring to life',
    summary: 'Consistent expression across all touchpoints.',
    description:
      'We translate that direction into a consistent brand presence across the touchpoints that matter.',
  },
];

export const SELECTED_PROJECTS: SelectedProject[] = [
  // 1. LEDOR BELGIAN CHOCOLATE (BRANDING)
  {
    id: 'ledor-belgian-chocolates',
    title: 'Ledor Belgian Chocolate',
    subtitle: 'Luxury packaging design, brand identity for Ledor World, and sensory brand communication.',
    client: 'Ledor World',
    category: 'Branding',
    label: 'Branding',
    imageUrl: '/assets/homepage/services/ledorbelgianchocolates.png',
    pdfUrl: '/assets/work/ledorbelgianchocolate.pdf',
    brandChallenge:
      'Launching a luxury Belgian chocolate boutique and café in Delhi required establishing immediate distinction and sensory indulgence against established international gifting brands.',
    whatChanged:
      'We developed the complete brand identity, sensory tone of voice, gold-foiled luxury structural packaging, and launch collaterals, positioning Ledor as Delhi’s premier destination for luxury confectionery.',
    brief:
      'Ledor Belgian Chocolate is a luxury chocolate boutique based in Delhi, offering premium couverture chocolates, desserts, and an elevated café experience under Ledor World.',
    role: 'Brand identity design, structural packaging, sensory brand communication, food styling and photoshoot art direction.',
    whatWeBuilt:
      'A refined, sensory brand ecosystem evoking decadence and quiet luxury: muted rich tones, clean typography, luxury embossed packaging for chocolate tablets, specialty gift hampers, and artisanal spreads.',
    keyFeatures: [
      'Structural packaging for couverture tablets, bonbon gift boxes, and specialty spread jars',
      'Custom gold-foiled typography, ribbon banding, and botanical gold accents',
      'Monthly editorial brand grid celebrating chocolate craftsmanship and pastry textures',
      'Café collaterals including menus, tissue wraps, and branded paper bags with continental flair',
    ],
    results: 'Established Ledor as a recognized destination for luxury gifting and couverture chocolate.',
    brandPortfolio: [
      {
        id: 'ledor-01',
        title: 'Couverture Tablet & Bonbon Rigid Box Packaging',
        discipline: 'Structural Packaging & Print',
        summary: 'Gold-foiled rigid gift boxes and embossed folding cartons with custom chocolate tablet molds and botanical motifs.',
        details: [
          'Heavyweight rigid boxes with tactile soft-touch velvet lamination',
          'Custom bonbon tray dividers, parchment dividers, and ribbon banding',
          'Specialty chocolate spread glass jar labels with metallic foil seals',
        ],
        tag: 'Packaging Design',
      },
      {
        id: 'ledor-02',
        title: 'Ledor World Café Dining & Patisserie Menus',
        discipline: 'Tactile Collateral Suite',
        summary: 'Tactile dining collaterals for the boutique café, evoking continental patisserie elegance and quiet luxury.',
        details: [
          'Hardbound linen-textured dessert and beverage menus with brass screw-posts',
          'Custom greaseproof parchment wrappers and pastry tissue inserts',
          'Branded kraft takeaway bags with foil-stamped crest and grosgrain handles',
        ],
        tag: 'Hospitality Collateral',
      },
      {
        id: 'ledor-03',
        title: 'Sensory Brand Voice & Editorial Food Direction',
        discipline: 'Brand Storytelling & Content',
        summary: 'Curated editorial voice celebrating cocoa origin stories, pastry craftsmanship, and sensory indulgence.',
        details: [
          'Boutique menu tasting notes with bean origin percentages and flavour profiles',
          'Monthly social grid styling direction and photography brief',
          'Sensory launch storytelling cards placed inside each gift box',
        ],
        tag: 'Brand Voice',
      },
      {
        id: 'ledor-04',
        title: 'Artisanal Festive & Wedding Gifting Hampers',
        discipline: 'Luxury Merchandising',
        summary: 'Limited-edition gifting hampers crafted for Diwali, weddings, and VIP corporate celebrations in Delhi.',
        details: [
          'Custom wooden and leatherette keepsake hamper trunks',
          'Wax-sealed ingredient provenance tags on organic twine',
          'Gold-embossed personalized greeting inserts on deckle-edge cardstock',
        ],
        tag: 'Gifting Suite',
      },
    ],
  },

  // 2. FIORELLA: THE FLOWER BOUTIQUE (BRAND TRANSFORMATION)
  {
    id: 'fiorella-flower-boutique',
    title: 'Fiorella: The Flower Boutique',
    subtitle: 'Digital presence evolution, signature delivery fleet wraps, and elevated customer communications.',
    client: 'Fiorella India',
    category: 'Brand Transformation',
    label: 'Brand Transformation',
    imageUrl: '/assets/homepage/services/fiorellatheflowerboutique.png',
    pdfUrl: '/assets/work/fiorellathefolwerboutique.pdf',
    brandChallenge:
      'An established floral boutique needed to unify its customer touchpoints, elevate brand perception, and scale recognition across major metropolitan markets.',
    whatChanged:
      'We evolved their digital storefront, designed iconic botanical illustrated delivery fleet wraps across major cities, and brought romantic editorial storytelling to all customer touchpoints.',
    brief:
      'Fiorella is a premium online floral brand based in India, specialising in expertly curated bouquets, preserved roses, bespoke floral styling, luxury hampers, and same-day delivery.',
    role: 'Website design & digital presence evolution, brand communication, print collaterals, delivery fleet vehicle branding.',
    whatWeBuilt:
      'An aspirational, romantic brand aesthetic blending refined natural beauty with clean luxury layouts. Designed the flagship e-commerce platform and iconic illustrated floral delivery vans.',
    keyFeatures: [
      'Bespoke e-commerce website design with date-picker delivery scheduling and box customizers',
      'Full vehicle wrap graphics for city delivery vans featuring signature hand-drawn botanical arrangements',
      'Luxury festive and Valentine’s marketing pamphlets and gift enclosures',
      'Cohesive brand presence combining high-fashion floral photography and lifestyle storytelling',
    ],
    results: 'Multi-city brand recognition across Mumbai, Delhi, and key metropolitan markets.',
    brandPortfolio: [
      {
        id: 'fiorella-01',
        title: 'City Delivery Fleet Illustrated Vehicle Wraps',
        discipline: 'Transit & Environmental Branding',
        summary: 'Complete vehicle graphics for city delivery vans across Mumbai and Delhi featuring signature botanical illustrations.',
        details: [
          'Full-body delivery van vinyl wraps with hand-drawn floral arrangements',
          'High-contrast typography readable at city driving speeds and stoplights',
          'Weatherproof matte metallic finishes and crisp contact typography',
        ],
        tag: 'Fleet Graphics',
      },
      {
        id: 'fiorella-02',
        title: 'Flagship Digital Storefront & Bouquet Customizer',
        discipline: 'Digital Experience & E-Commerce',
        summary: 'Custom e-commerce experience designed for effortless floral gifting, bouquet customization, and date selection.',
        details: [
          'Interactive rose variety selector and cylindrical box size customizer',
          'Precise date-and-time slot delivery scheduler with zip code validation',
          'Frictionless checkout flow with custom message preview on digital card',
        ],
        tag: 'Digital Experience',
      },
      {
        id: 'fiorella-03',
        title: 'Luxury Enclosure Cards & Festive Pamphlets',
        discipline: 'Stationery & Customer Touchpoints',
        summary: 'Tactile stationery and seasonal pamphlets accompanying bespoke bouquets for Valentine’s and festive gifting.',
        details: [
          'Blind-debossed message cards on 350gsm warm cotton cardstock',
          'Velvet-touch envelope sleeves with custom satin ribbon ties',
          'Illustrated floral care instruction cards ensuring flower longevity',
        ],
        tag: 'Print Suite',
      },
      {
        id: 'fiorella-04',
        title: 'Preserved Roses Cylindrical Keepsake Box',
        discipline: 'Structural Packaging',
        summary: 'Signature cylindrical hatboxes with foil-stamped branding designed to preserve perennial roses for years.',
        details: [
          'Rigid cylindrical hatbox structure in signature ivory and blush tones',
          'Gold-foiled Fiorella typographic crest on lid and perimeter rim',
          'Fitted velvet base insert holding preserved blooms in pristine condition',
        ],
        tag: 'Packaging Design',
      },
    ],
  },

  // 3. BE MY GUEST (BRANDING)
  {
    id: 'be-my-guest-weddings',
    title: 'Be My Guest',
    subtitle: 'Heirloom wedding stationery, bespoke botanical illustrations, and brand storytelling.',
    client: 'Be My Guest',
    category: 'Branding',
    label: 'Branding',
    imageUrl: '/assets/homepage/services/bemyguest.png',
    pdfUrl: '/assets/work/bemyguest.pdf',
    brandChallenge:
      'Articulating a distinctive, heirloom aesthetic for a luxury destination wedding planning house managing grand celebrations across the globe.',
    whatChanged:
      'We crafted bespoke architectural watercolor wedding suites, illustrated cultural guides, and ceremony stationery that elevated guest hospitality and established a signature studio aesthetic.',
    brief:
      'Be My Guest is a full-service wedding planning company curating bespoke celebrations across India and international destinations with precision and warmth.',
    role: 'Bespoke wedding stationery design, custom architectural and botanical illustration, brand storytelling.',
    whatWeBuilt:
      'Bespoke destination wedding collateral suites (such as Paridhi & Manos at Taj Khema, Agra) featuring hand-painted architectural watercolors of the Taj Mahal, traditional motifs, Haldi cards, and Vedic ceremony guides.',
    keyFeatures: [
      'Multi-day folded wedding itineraries with bespoke watercolor heritage landmarks and florals',
      'Ceremony welcome standees, Haldi and Cocktail table stationery, and baggage tags',
      'Custom Vedic ceremony guide booklets explaining traditional rituals with illustrated motifs',
      'Editorial brand showcase highlighting behind-the-scenes hospitality and destination setups',
    ],
    results: 'Elevated VIP guest hospitality for landmark destination weddings in Agra, Udaipur, and Europe.',
    brandPortfolio: [
      {
        id: 'bmg-01',
        title: 'Taj Khema Heritage Architectural Suite (Paridhi & Manos)',
        discipline: 'Bespoke Stationery & Fine Art',
        summary: 'Hand-painted watercolor architectural illustrations of the Taj Mahal rendered on textured deckle-edge handmade paper.',
        details: [
          'Deckle-edge handmade cotton paper with gold foil serif typography',
          'Watercolor panoramic gatefold illustration featuring Taj Khema garden view',
          'Translucent vellum overlay jackets sealed with custom wax monogram',
        ],
        tag: 'Bespoke Stationery',
      },
      {
        id: 'bmg-02',
        title: 'Vedic Ceremony Guidebook & Sacred Ritual Motifs',
        discipline: 'Editorial Book Design',
        summary: 'Illustrated cultural guides detailing Vedic wedding rituals, Pheras, and Sanskrit shlokas for international guests.',
        details: [
          'Saddle-stitched booklet with gold foil cover details and silk ribbon binding',
          'Illustrated icons explaining the Saptapadi vows and sacred symbolic rituals',
          'Bilingual Sanskrit and English explanatory narrative for multicultural attendees',
        ],
        tag: 'Ritual Publication',
      },
      {
        id: 'bmg-03',
        title: 'Multi-Day Foldout Itinerary & Landmark Map',
        discipline: 'Guest Hospitality Collateral',
        summary: 'Pocket-sized multi-day event schedules with illustrated city landmarks and transportation schedules.',
        details: [
          'Accordion-fold itinerary with venue dress codes and sunrise/sunset timings',
          'Illustrated watercolor orientation map of Agra and Taj monument surroundings',
          'Color-coded schedule badges for Haldi, Sangeet, Vedic Pheras, and Reception',
        ],
        tag: 'Itinerary Design',
      },
      {
        id: 'bmg-04',
        title: 'Ceremony Table Settings & Welcome Standees',
        discipline: 'Signage & Tabletop Systems',
        summary: 'Cohesive ceremony table stationery, Haldi menu cards, acrylic welcome easels, and luggage tags.',
        details: [
          'Large-format acrylic welcome signage with floral frame borders',
          'Bespoke dinner table placecards and signature cocktail recipe cards',
          'Leatherette guest baggage tags with hot-stamped wedding crest',
        ],
        tag: 'Event Signage',
      },
    ],
  },

  // 4. VIANAAR (BRAND TRANSFORMATION)
  {
    id: 'vianaar-holiday-homes',
    title: 'Vianaar',
    subtitle: 'Monograph collateral suite, investor communications, and interactive spatial explorers.',
    client: 'Vianaar',
    category: 'Brand Transformation',
    label: 'Brand Transformation',
    imageUrl: '/assets/homepage/services/vianaarholidayhomes.png',
    pdfUrl: '/assets/work/vianaar.pdf',
    brandChallenge:
      'Translating Vianaar’s philosophy of slow, intentional architecture into a cohesive collateral system and digital property explorer for discerning villa buyers.',
    whatChanged:
      'We aligned print monographs, investor communications, and interactive spatial explorers with Vianaar’s understated design philosophy, giving buyers an intuitive way to experience estate masterplans.',
    brief:
      'Vianaar is a luxury holiday home developer shaped by the philosophy of slow, intentional living, with design-led estates across Goa, Kasauli, and Sri Lanka.',
    role: 'Editorial collateral design, print standees, architectural monographs, interactive masterplan exploration.',
    whatWeBuilt:
      'A design-forward collateral suite reflecting slow living: Pol Vatta Estate luxury villa monographs, architectural roll-up standees, investor emailers, and an interactive 3D spatial masterplan for Dappled Light Estate.',
    keyFeatures: [
      'Luxury hardcover villa brochures with panoramic landscape foldouts and architectural specifications',
      'Large-format exhibition standees showcasing pool villas and heritage estates',
      'Curated buyer communications focusing on natural materials, local flora, and slow living rituals',
      'Interactive 3D masterplan explorer for Dappled Light Estate',
    ],
    publicLinkText: 'Explore Dappled Light Estate by Vianaar',
    publicUrl: 'https://dappled-light-estate-vianaar.vercel.app/',
    results: 'Direct support for high-value holiday villa acquisitions across Goa and Kasauli.',
    brandPortfolio: [
      {
        id: 'vianaar-01',
        title: 'Interactive Property Masterplan',
        discipline: 'Interactive 3D / WebGL Experience',
        summary: 'Web-based 3D spatial property masterplan navigator featuring real-time sunlight angle inspection, clickable unit specifications, and friction-free inquiry routing for Vianaar estate buyers.',
        details: [
          'Interactive villas, apartments & masterplan plot footprints across Goa estates',
          'High-resolution architectural floor plans & unit availability layers',
          'Curated Goan landmark & beach proximity markers with driving travel times',
          'Dynamic solar angle simulator showing morning and golden hour sunlight progression',
          'Filterable by bedroom count, gross plot area, and reservation status',
        ],
        imageUrl: '/assets/homepage/services/interactivepropertyexperiences.png',
        liveUrl: 'https://dappled-light-estate-vianaar.vercel.app/',
        tag: 'Spatial 3D Platform',
      },
      {
        id: 'vianaar-02',
        title: 'Cinematic Architectural Walkthroughs',
        discipline: 'Cinematography & Virtual Production',
        summary: 'Evocative, slow-motion property films capturing natural daylight progression, misty Goan mornings, and tactile stone finishes across Vianaar luxury residences.',
        details: [
          '4K resolution capture preserving textured limestone, timber grain, and private pool reflections',
          'Controlled slow-motion camera dollies preserving architectural vanishing lines',
          'Natural daylight transitions across tropical stone, private courtyards, and pavilion interiors',
          'Multi-aspect deliveries (16:9 widescreen investor reels, 9:16 vertical storytelling reels)',
          'Quiet luxury ambient acoustic soundtrack evoking calm and natural immersion',
        ],
        imageUrl: '/assets/homepage/services/cinematicwalkthroughs.png',
        tag: 'Architectural Film',
      },
      {
        id: 'vianaar-03',
        title: 'Marketing & Sales Dashboard',
        discipline: 'Commercial Intelligence & Data Systems',
        summary: 'Calm, single-screen reporting console bringing together multi-channel ad spend, qualified buyer leads (CPL), and unit reservation stages across Vianaar estates.',
        details: [
          'Unified campaign spend vs. qualified high-intent buyer volume tracking',
          'Channel source attribution and cost-per-qualified-lead (CPL) precision metrics',
          'Interactive unit reservation pipeline with villa deposit status filtering',
          'Scheduled weekly snapshot generation with exportable executive PDF digests',
          'Broker commission tracking and inquiry-to-visit conversion analytics',
        ],
        imageUrl: '/assets/homepage/services/marketingsalesdashboard.png',
        tag: 'Executive Dashboard',
      },
      {
        id: 'vianaar-04',
        title: 'Research & Analysis Tools',
        discipline: 'Market Intelligence UI & Research',
        summary: 'Dedicated intelligence repository for comparing Goa and regional holiday home developments, pricing benchmarks, and positioning claims.',
        details: [
          'Side-by-side competitor specification, land parcel, & price-per-sq-ft matrices',
          'Verified source-linked marketing claim observations with snapshot capture dates',
          'Holiday home message, slow-living tone, and offer positioning audits',
          'Structured amenity breakdown across competing coastal developments',
          'Searchable intelligence archive informing quarterly pricing and launch strategies',
        ],
        imageUrl: '/assets/homepage/services/researchanalysistools.png',
        tag: 'Market Research Tool',
      },
      {
        id: 'vianaar-05',
        title: 'Pol Vatta Estate Hardcover Architectural Monograph',
        discipline: 'Editorial & Book Design',
        summary: 'Luxury hardcover villa monograph featuring panoramic landscape foldouts, architectural blueprints, and material specifications reflecting slow living.',
        details: [
          'Clothbound hardcover with blind-debossed title and linen-wrapped spine',
          'Panoramic landscape gatefolds showcasing private pool villa courtyards',
          'Large-format exhibition roll-up standees for luxury buyer lounges',
          'Tactile direct-mail collateral celebrating local Goan flora and slow-living rituals',
        ],
        imageUrl: '/assets/homepage/services/vianaarholidayhomes.png',
        tag: 'Editorial Monograph',
      },
    ],
  },

  // 5. THE BLUE KITE (BRAND TRANSFORMATION)
  {
    id: 'the-blue-kite-homes',
    title: 'The Blue Kite',
    subtitle: 'Guest welcome collateral, eco-hero guidebooks, and transparent rental communication.',
    client: 'The Blue Kite',
    category: 'Brand Transformation',
    label: 'Brand Transformation',
    imageUrl: '/assets/homepage/services/thebluekiteholidayhomes.png',
    pdfUrl: '/assets/work/thebluekite.pdf',
    brandChallenge:
      'A growing holiday home management collective needed to build immediate guest trust, standardise in-villa communications, and advocate environmental responsibility.',
    whatChanged:
      'We redesigned the guest welcome system, created transparent pre-arrival guidebooks, and established the "Eco-Hero" sustainability communication framework.',
    brief:
      'Established in 2019, The Blue Kite connects travellers with thoughtfully managed holiday homes across India, emphasizing transparency, comfort, and reliability.',
    role: 'Print & digital collaterals, guest guide design, environmental communications.',
    whatWeBuilt:
      'Tactile welcome collateral and "Eco-Hero" sustainability posters detailing waste segregation, water conservation, and chemical-free housekeeping practices for guests.',
    keyFeatures: [
      'In-villa Eco-Hero infographic posters encouraging responsible vacation practices',
      'Your Guide to Goa guest booklets with local food, beach, and cultural recommendations',
      'Digital pre-arrival guides ensuring seamless self check-in and villa orientation',
    ],
    results: 'Enhanced guest satisfaction scores and substantial reduction in single-use plastic waste.',
    brandPortfolio: [
      {
        id: 'bluekite-01',
        title: 'Eco-Hero In-Villa Sustainability Infographic Framework',
        discipline: 'Environmental Information Design',
        summary: 'Graphic in-villa posters and guides educating guests on waste segregation, water conservation, and eco-conscious living.',
        details: [
          'Clean infographic posters for kitchens and living areas with friendly visual cues',
          'Plastic-free housekeeping guidelines for guests and resident estate staff',
          'Water and power conservation reminder signage on bamboo mounts',
        ],
        tag: 'Sustainability Design',
      },
      {
        id: 'bluekite-02',
        title: 'Your Guide to Goa Guest Experience Booklets',
        discipline: 'Editorial & Guest Collateral',
        summary: 'Curated pocket travel guides featuring hand-picked local eateries, quiet beaches, and cultural trails.',
        details: [
          'Saddle-stitched travel booklet with illustrated local maps and secret beaches',
          'Insider culinary recommendations from Goan heritage chefs',
          'Resident host directory and emergency support contacts',
        ],
        tag: 'Travel Publication',
      },
      {
        id: 'bluekite-03',
        title: 'Pre-Arrival Digital Guest Check-in Platform',
        discipline: 'Digital UX Design',
        summary: 'Mobile-first digital onboarding platform providing guests with directions, check-in codes, and villa orientation.',
        details: [
          'Interactive Google Maps route with landmark photos for easy arrival',
          'Digital keycode verification and security instructions',
          'One-touch concierge messaging and housekeeping requests',
        ],
        tag: 'Digital Guest UX',
      },
      {
        id: 'bluekite-04',
        title: 'Villa Keycards & Hospitality Packaging Suite',
        discipline: 'Tactile Collateral Suite',
        summary: 'Recycled kraft card holders, welcome envelopes, and organic bathroom amenity sleeves.',
        details: [
          'Kraft paper keycard holders printed with eco-friendly soy inks',
          'Welcome letterhead on textured natural paper with handwritten host note',
          'Bathroom amenity wrappers with botanical typography',
        ],
        tag: 'Hospitality Print',
      },
    ],
  },

  // 6. NORBU: THE MONTANNA (IHCL SELEQTIONS) (BRAND TRANSFORMATION)
  {
    id: 'norbu-the-montanna',
    title: 'Norbu: The Montanna (IHCL Seleqtions)',
    subtitle: 'Boutique Himalayan retreat branding, guest journey touchpoints, and IHCL Seleqtions luxury collateral system.',
    client: 'IHCL Seleqtions & Norbu Hospitality',
    category: 'Brand Transformation',
    label: 'Brand Transformation',
    imageUrl: '/assets/homepage/services/norbuthemontanna.png',
    pdfUrl: '/assets/work/norbuthemontanna.pdf',
    brandChallenge:
      'Positioning a boutique mountain sanctuary in the Himalayas within the prestigious IHCL Seleqtions umbrella while preserving its intimate, soul-stirring Himalayan identity and distinct Tibetan-inspired heritage.',
    whatChanged:
      'We refined the retreat visual identity, designed tactile guest collateral, curated seasonal culinary campaign graphics, and harmonized IHCL brand standards with authentic local craftsmanship and mountain serenity.',
    brief:
      'Nestled in pristine mountain ridges, Norbu: The Montanna (IHCL Seleqtions) offers a bespoke sanctuary where traditional Himalayan architecture meets the warm, storied hospitality of IHCL.',
    role: 'Brand strategy, identity refinement, tactile guest stationery, seasonal hospitality campaigns, and experiential print suites.',
    whatWeBuilt:
      'An elevated hospitality identity system incorporating copper-gold foil detailing, textured botanical stationery, seasonal dining menus, curated local excursion booklets, and bespoke guest room amenities.',
    keyFeatures: [
      'Tactile guest arrival suites with warm Himalayan welcomes and handwritten estate scrolls',
      'Seasonal dining & Valentine curated campaign materials celebrating mountain gastronomy',
      'Handcrafted room directory and nature trail compendiums highlighting indigenous flora and heritage trails',
      'Cohesive brand alignment bridging IHCL luxury benchmarks with soulful boutique intimacy',
    ],
    results: 'Elevated brand perception among discerning luxury travelers and unified property collateral under IHCL Seleqtions standards.',
    brandPortfolio: [
      {
        id: 'norbu-01',
        title: 'Himalayan Guest Arrival & Welcome Collateral Suite',
        discipline: 'Tactile Hospitality Design',
        summary: 'Custom welcome letters, leather-bound keycard jackets, and hand-pressed botanical tea gift boxes for arriving guests.',
        details: [
          'Textured cotton cardstock with embossed gold foil crest',
          'Hand-calligraphed welcome greetings and estate maps',
          'Bespoke room amenity sleeves and botanical wellness labels',
        ],
        tag: 'Hospitality Stationery',
      },
      {
        id: 'norbu-02',
        title: 'The Montanna Culinary & Dining Menus',
        discipline: 'Editorial & Print Design',
        summary: 'Refined restaurant and deck dining menus showcasing local organic harvest and contemporary Himalayan gastronomy.',
        details: [
          'Hand-stitched linen menu folders with brass foil accents',
          'Curated Valentine & festival seasonal dining collateral',
          'Artisanal tea room tasting cards and cocktail narratives',
        ],
        tag: 'Editorial Print',
      },
      {
        id: 'norbu-03',
        title: 'Heritage Trail & Sanctuary Guidebooks',
        discipline: 'Environmental & Publication Design',
        summary: 'Pocket-sized naturalist guidebooks outlining bird watching routes, pine forest trails, and sacred mountain viewpoints.',
        details: [
          'Illustrated architectural elevations and topographic trail maps',
          'Flora and fauna guides printed on recycled stone paper',
          'In-room library compendium with local folklore',
        ],
        tag: 'Guest Experience',
      },
    ],
  },

  // 7. SALT & GREY (BRANDING)
  {
    id: 'salt-and-grey',
    title: 'Salt & Grey',
    subtitle: 'Contemporary ceramic atelier identity, tactile material storytelling, and minimal architectural packaging.',
    client: 'Salt & Grey Studio',
    category: 'Branding',
    label: 'Branding',
    imageUrl: '/assets/homepage/services/saltandgrey.png',
    pdfUrl: '/assets/work/saltandgrey.pdf',
    brandChallenge:
      'Transforming a bespoke ceramic and architectural homeware workshop into a recognized minimalist lifestyle label that honors raw earth, handcrafted imperfection, and sculptural stillness.',
    whatChanged:
      'We crafted a serene visual identity built around tactile textures, understated typography, bespoke debossed stationery, and an editorial grid celebrating the tactile rhythm of clay, salt glaze, and mineral tone.',
    brief:
      'Salt & Grey creates functional ceramic sculptures, stoneware tableware, and architectural interior accents that celebrate texture, light, and quiet permanence.',
    role: 'Brand identity, typographic architecture, packaging design, editorial social direction, and studio collateral.',
    whatWeBuilt:
      'A monolithic yet intimate visual language featuring blind debossed textured paper, unbleached cotton ribboning, stoneware care cards, and a minimalist digital archive layout.',
    keyFeatures: [
      'Blind-debossed identity suite on heavyweight cotton paper reflecting raw clay textures',
      'Modular packaging system designed for safe transit of delicate ceramic heirlooms',
      'Studio calendar and pottery editorial grid capturing hand-turned studio processes',
      'Minimalist artist stamps and provenance certificates accompanying every bespoke piece',
    ],
    results: 'Established a recognized presence in interior design publications and sold out initial seasonal releases across boutique galleries.',
    brandPortfolio: [
      {
        id: 'salt-01',
        title: 'Atelier Packaging & Unboxing System',
        discipline: 'Packaging & Structural Design',
        summary: 'Sustainable kraft and unbleached greyboard boxes with bespoke die-cut inserts and blind-embossed studio seals.',
        details: [
          'FSC-certified recyclable boxes with mineral grey interior linings',
          'Hand-torn handmade paper provenance cards with potter signature line',
          'Custom woven organic cotton ribbon ties and wax seal stamps',
        ],
        tag: 'Sustainable Packaging',
      },
      {
        id: 'salt-02',
        title: 'Ceramic Provenance & Stoneware Care Guides',
        discipline: 'Editorial Collateral',
        summary: 'Tactile instruction cards explaining clay firing processes, food-safe glazes, and long-term stoneware preservation.',
        details: [
          'Letterpress printing on raw textured paper stock',
          'Detailed care guide for high-temperature stoneware and microwave safety',
          'Numbered batch cards for limited-edition kiln firings',
        ],
        tag: 'Print Craft',
      },
      {
        id: 'salt-03',
        title: 'Studio Grid & Material Storytelling System',
        discipline: 'Art Direction & Digital Presence',
        summary: 'A curated visual direction highlighting raw textures, natural light, hands at the wheel, and the architectural dialogue of pottery.',
        details: [
          'Muted natural palette inspired by sea salt, dry clay, and wet graphite',
          'Art direction guidelines for product photography and gallery exhibitions',
          'Minimalist digital catalog structure with generous negative space',
        ],
        tag: 'Art Direction',
      },
    ],
  },

  // 8. JHALAK GEMS (BRANDING)
  {
    id: 'jhalak-gems',
    title: 'Jhalak Gems',
    subtitle: 'High-jewelry gemstone curation, provenance storytelling, and heirloom velvet packaging suite.',
    client: 'Jhalak Gems & Fine Jewelry',
    category: 'Branding',
    label: 'Branding',
    imageUrl: '/assets/homepage/services/jhalakgems.png',
    pdfUrl: '/assets/work/jhalakgems.pdf',
    brandChallenge:
      'Elevating a legacy gemstone dealer into a modern luxury high-jewelry house, conveying uncompromising gemological pedigree, rare stone provenance, and contemporary bespoke allure.',
    whatChanged:
      'We designed an authoritative identity system centered on classic high-contrast serif typography, deep jewel-toned velvet packaging, gemological provenance certificate folders, and refined gold-stamped stationery.',
    brief:
      'Jhalak Gems specializes in rare, ethically sourced colored gemstones—Burmese rubies, Colombian emeralds, and Ceylon sapphires—curated for discerning collectors and private bespoke jewelers.',
    role: 'Complete brand architecture, visual identity, luxury packaging, certificate design, and collector collateral.',
    whatWeBuilt:
      'A timeless luxury ecosystem: deep forest green velvet presentation cases, gold-embossed gem certification folios, micro-detailed stone authenticity seals, and bespoke salon presentation trays.',
    keyFeatures: [
      'Bespoke gemstone certificate folder with security watermarking and gold foil crest',
      'Rich velvet jewelry cases with custom-molded interior beds for rare individual cuts',
      'Collector provenance books chronicling stone origin, cut geometry, and optical properties',
      'Private viewing salon stationery, appointment cards, and gold-trimmed correspondence envelopes',
    ],
    results: 'Reinforced authority among international gem collectors and secured partnerships with prominent private luxury jewelry designers.',
    brandPortfolio: [
      {
        id: 'jhalak-01',
        title: 'Gemological Provenance & Certification Folios',
        discipline: 'Luxury Document & Security Print',
        summary: 'Rigid folios with blind debossing, gold foil detailing, and security paper to certify rare gemstone authenticity.',
        details: [
          'Heavyweight 400gsm cotton board with deep green velvet lining',
          'Gold hot-stamped seal of authenticity and gemological grading grid',
          'Custom translucent vellum overlays displaying gemstone optical schematics',
        ],
        tag: 'Certification Suite',
      },
      {
        id: 'jhalak-02',
        title: 'Heirloom Velvet Presentation Cases',
        discipline: 'Structural Packaging',
        summary: 'Custom handcrafted presentation boxes wrapped in plush forest green velvet with brushed brass hardware.',
        details: [
          'Precision-engineered interior cushions accommodating varied carats and cuts',
          'Subtle debossed monogram on exterior lid with concealed magnetic closure',
          'Complementary microfiber cleaning cloth and inspection loupe pouch',
        ],
        tag: 'Luxury Packaging',
      },
      {
        id: 'jhalak-03',
        title: 'Collector Salon Stationery & Private View Suites',
        discipline: 'Corporate Identity & Collateral',
        summary: 'Tactile stationery suite for private client viewing salons, including appointment cards, envelope seals, and ledger folios.',
        details: [
          'Gilt-edged correspondence cards with deep forest green engraved lettering',
          'Custom die-cut gem inspection envelopes with peel-and-seal gold wax wafers',
          'Private viewing presentation display mats crafted from Italian suede',
        ],
        tag: 'Client Collateral',
      },
    ],
  },
];


