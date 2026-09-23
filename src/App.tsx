import {
  Search,
  Menu,
  X,
  MapPin,
  CalendarCheck,
  Headphones,
  Star,
  ArrowRight,
  ArrowLeft,
  Compass,
  Palmtree,
  Mountain,
  Umbrella,
  CheckCircle2,
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const navLinks = [
  { label: "Home", href: "home" },
  { label: "Destinations", href: "destinations" },
  { label: "Packages", href: "packages" },
  { label: "Blog", href: "blog" },
  { label: "About Us", href: "about" },
];

const allDestinations = [
  {
    name: "El Nido",
    region: "Palawan",
    category: "Beach paradise",
    rating: 4.8,
    reviews: "1.2k",
    price: "8,499",
    image:
      "https://images.pexels.com/photos/35649530/pexels-photo-35649530.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "El Nido is a tropical paradise on the northern tip of Palawan, famed for its dramatic limestone cliffs, hidden lagoons, and pristine island-hopping routes. Whether you're kayaking through secret coves or lounging on white-sand beaches, every moment feels like a postcard come to life.",
    highlights: ["Big Lagoon kayaking", "Secret Beach exploration", "Shimizu Island snorkeling", "Sunset at Nacpan Beach"],
    itinerary: [
      "Day 1: Arrival in Puerto Princesa, transfer to El Nido",
      "Day 2: Island Hopping Tour A — lagoons and hidden beaches",
      "Day 3: Island Hopping Tour C — snorkeling and secret spots",
      "Day 4: Nacpan Beach day trip and departure",
    ],
    inclusions: ["Airport transfers", "Licensed tour guide", "Boat transfers & entrance fees", "3 nights accommodation"],
  },
  {
    name: "Baguio City",
    region: "Benguet",
    category: "Mountain retreat",
    rating: 4.7,
    reviews: "980",
    price: "4,299",
    image:
      "https://images.pexels.com/photos/13710317/pexels-photo-13710317.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Baguio City, the Summer Capital of the Philippines, offers a refreshing mountain escape with pine-scented air, vibrant markets, and a rich blend of culture and art. Stroll through Burnham Park, visit the iconic strawberry farms, and savor fresh produce from the highlands.",
    highlights: ["Burnham Park boating", "Session Road food trip", "Strawberry Farm picking", "BenCab Museum visit"],
    itinerary: [
      "Day 1: Arrival and Baguio city tour",
      "Day 2: Strawberry Farm, BenCab Museum, and Tam-Awan Village",
      "Day 3: Mines View Park and Botanical Garden",
      "Day 4: Free time for shopping at Baguio Public Market, departure",
    ],
    inclusions: ["Round-trip van transfers", "3 nights hotel stay", "Daily breakfast", "Local guide"],
  },
  {
    name: "Siargao",
    region: "Surigao del Norte",
    category: "Surf & island life",
    rating: 4.9,
    reviews: "850",
    price: "9,999",
    image:
      "https://images.pexels.com/photos/38265496/pexels-photo-38265496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Siargao is the Philippines' surfing capital and a laid-back island haven. Beyond the legendary Cloud 9 waves, you'll find coconut tree-lined roads, turquoise lagoons, and tiny offshore islands perfect for island hopping.",
    highlights: ["Surfing at Cloud 9", "Sugba Lagoon paddleboarding", "Island hopping to Guyam & Daku", "Coconut Tree Viewpoint"],
    itinerary: [
      "Day 1: Arrival in Siargao, sunset at Cloud 9",
      "Day 2: Surf lesson and island hopping tour",
      "Day 3: Sugba Lagoon and Magpupungko Rock Pools",
      "Day 4: Free time, souvenir shopping, departure",
    ],
    inclusions: ["Airport transfers", "Surf lesson", "Boat transfers", "3 nights boutique stay"],
  },
  {
    name: "Vigan",
    region: "Ilocos Sur",
    category: "Heritage city",
    rating: 4.6,
    reviews: "640",
    price: "5,499",
    image:
      "https://images.pexels.com/photos/32823059/pexels-photo-32823059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Vigan is a UNESCO World Heritage city that transports you back to Spanish colonial times. Walk along cobblestone streets lined with ancestral houses, ride a kalesa, and taste authentic Ilocano dishes like empanada and bagnet.",
    highlights: ["Calle Crisologo heritage walk", "Kalesa ride", "Bantay Bell Tower", "Ilocano food tour"],
    itinerary: [
      "Day 1: Arrival and Calle Crisologo night walk",
      "Day 2: Heritage city tour and kalesa ride",
      "Day 3: Bantay Bell Tower and pottery workshop",
      "Day 4: Food tour and departure",
    ],
    inclusions: ["Van transfers", "Heritage guide", "3 nights accommodation", "Breakfast daily"],
  },
  {
    name: "Batanes",
    region: "Cagayan Valley",
    category: "Nature & culture",
    rating: 4.9,
    reviews: "420",
    price: "12,499",
    image:
      "https://images.pexels.com/photos/29657070/pexels-photo-29657070.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Batanes is the Philippines' northernmost frontier, known for its rolling green hills, dramatic cliffs, stone houses, and deeply rooted Ivatan culture. It's a dream destination for nature lovers, photographers, and those seeking peace.",
    highlights: ["Marlboro Country hills", "Basco Lighthouse", "House of Dakay", "Morong Beach"],
    itinerary: [
      "Day 1: Arrival in Basco, Basco Lighthouse sunset",
      "Day 2: North Batan tour — hills, churches, and heritage",
      "Day 3: South Batan tour — fishing villages and cliffs",
      "Day 4: Free morning, departure",
    ],
    inclusions: ["Round-trip flights to Basco", "Private tour vehicle", "Local guide", "3 nights stay"],
  },
  {
    name: "Cebu",
    region: "Cebu",
    category: "City & beaches",
    rating: 4.7,
    reviews: "1.5k",
    price: "5,999",
    image:
      "https://images.pexels.com/photos/13256504/pexels-photo-13256504.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Cebu blends urban energy with tropical island charm. Explore Magellan's Cross and Basilica Minore, then escape to white-sand beaches and world-class diving spots just a short boat ride from the city.",
    highlights: ["Magellan's Cross", "Basilica Minore del Santo Niño", "Sumilon Island sandbar", "Moalboal sardine run"],
    itinerary: [
      "Day 1: Arrival and Cebu City heritage tour",
      "Day 2: South Cebu waterfalls and canyoneering",
      "Day 3: Moalboal island hopping and sardine run",
      "Day 4: Free time, departure",
    ],
    inclusions: ["Airport transfers", "Entrance fees", "3 nights hotel", "Boat transfers"],
  },
  {
    name: "Bohol",
    region: "Bohol",
    category: "Wildlife & beaches",
    rating: 4.8,
    reviews: "760",
    price: "6,799",
    image:
      "https://images.pexels.com/photos/36758178/pexels-photo-36758178.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Bohol is famous for the adorable tarsier, the surreal Chocolate Hills, and idyllic Panglao beaches. It's a perfect mix of wildlife, nature, and relaxation for families and couples alike.",
    highlights: ["Chocolate Hills viewpoint", "Tarsier Sanctuary", "Loboc River cruise", "Panglao beach hopping"],
    itinerary: [
      "Day 1: Arrival and Panglao beach time",
      "Day 2: Bohol countryside tour including Chocolate Hills",
      "Day 3: Island hopping to Balicasag and Virgin Island",
      "Day 4: Tarsier Sanctuary visit and departure",
    ],
    inclusions: ["Airport/seaport transfers", "Boat transfers", "3 nights resort", "Buffet lunch on Loboc cruise"],
  },
  {
    name: "Banaue",
    region: "Ifugao",
    category: "Heritage & trekking",
    rating: 4.8,
    reviews: "530",
    price: "7,299",
    image:
      "https://images.pexels.com/photos/11283650/pexels-photo-11283650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description:
      "Banaue is home to the UNESCO-listed rice terraces, often called the Eighth Wonder of the World. Trek through ancient stone-walled paddies, meet indigenous Ifugao communities, and wake up to misty mountain views.",
    highlights: ["Banaue Rice Terraces viewpoint", "Batad Rice Terraces trek", "Tappiya Falls", "Ifugao cultural immersion"],
    itinerary: [
      "Day 1: Overnight bus/van from Manila to Banaue",
      "Day 2: Sunrise viewpoint and Batad trek",
      "Day 3: Tappiya Falls and village visit",
      "Day 4: Return transfer to Manila",
    ],
    inclusions: ["Round-trip transfers from Manila", "Local guide", "Homestay accommodation", "Meals as per itinerary"],
  },
];

const tourPackages = [
  {
    id: "island-hopper",
    title: "Island Hopper Adventure",
    description: "Hop between pristine islands, snorkel crystal lagoons, and unwind on powder-white beaches.",
    price: "15,999",
    duration: "5 days",
    image:
      "https://images.pexels.com/photos/13256504/pexels-photo-13256504.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    icon: Palmtree,
  },
  {
    id: "northern-highland",
    title: "Northern Highland Escape",
    description: "Trek terraced mountains, explore heritage towns, and breathe in the cool mountain air.",
    price: "13,499",
    duration: "4 days",
    image:
      "https://images.pexels.com/photos/11283650/pexels-photo-11283650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    icon: Mountain,
  },
  {
    id: "batanes-cultural",
    title: "Batanes Cultural Journey",
    description: "Immerse yourself in Ivatan heritage, rolling hills, and dramatic coastal landscapes.",
    price: "18,999",
    duration: "4 days",
    image:
      "https://images.pexels.com/photos/29657070/pexels-photo-29657070.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    icon: Compass,
  },
  {
    id: "surf-siargao",
    title: "Siargao Surf & Chill",
    description: "Catch world-class waves, explore palm tree roads, and island-hop around the surfing capital.",
    price: "11,999",
    duration: "4 days",
    image:
      "https://images.pexels.com/photos/38265496/pexels-photo-38265496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    icon: Umbrella,
  },
];

const blogPosts = [
  {
    id: "hidden-beaches",
    title: "10 Hidden Beaches in the Philippines You Need to Visit",
    excerpt:
      "Discover secret shores away from the crowds, from Palawan to Camiguin.",
    image:
      "https://images.pexels.com/photos/2562177/pexels-photo-2562177.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    author: "Mara Santos",
    date: "January 15, 2026",
    readTime: "6 min read",
    content: [
      "The Philippines is home to over 7,600 islands, and while El Nido and Boracay often steal the spotlight, some of the country's most magical beaches remain blissfully under the radar.",
      "Start your journey in Palawan with Nagtabon Beach, a quiet stretch of sand just outside Puerto Princesa. Unlike the crowded tourist spots, Nagtabon offers calm waters, local fishing boats, and golden sunsets that feel entirely yours.",
      "Head north to Ilocos and you'll find Saud Beach in Pagudpud. Often called the 'Boracay of the North' decades ago, it remains refreshingly undeveloped with powdery white sand and crystal-clear water.",
      "In the Visayas, Camiguin's White Island is a sandbar that appears and disappears with the tide. Visiting at sunrise gives you an otherworldly experience surrounded by turquoise water and the silhouette of Mt. Hibok-Hibok.",
      "For those willing to venture off the beaten path, the Calaguas Islands in Camarines Norte offer raw, untouched beauty. No fancy resorts, just camping under the stars, fresh seafood, and beaches that rival any in Southeast Asia.",
      "Other gems include Caramoan Islands, Malcapuya Island, Tikling Beach, Kalanggaman Island, Dahican Beach, and Mantigue Island. Each offers a unique slice of paradise away from the main tourist routes.",
      "The best time to explore these hidden beaches is during the dry season from November to May. Always travel responsibly: bring your trash back, respect local communities, and support small island businesses.",
    ],
  },
  {
    id: "batanes-guide",
    title: "A First-Timer's Guide to Batanes",
    excerpt:
      "Everything you need to know before exploring the northern paradise of the Philippines.",
    image:
      "https://images.pexels.com/photos/29855990/pexels-photo-29855990.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    author: "Luis Cruz",
    date: "February 2, 2026",
    readTime: "8 min read",
    content: [
      "Batanes feels like a different country. Located at the northernmost tip of the Philippines, this cluster of islands is known for its rolling hills, stone houses, dramatic cliffs, and a culture rooted in Ivatan resilience.",
      "Getting to Batanes is easiest by plane from Manila or Clark. Book flights early, especially during peak season, as seats fill up quickly. The weather can be unpredictable, so pack a light rain jacket even in summer.",
      "Basco is the main town and a great base for first-timers. From here, you can visit the Basco Lighthouse, Valugan Boulder Beach, and the iconic Marlboro Country hills where green pastures meet the open sea.",
      "Don't miss South Batan, home to the famous Mahatao Tayid Lighthouse, Homoron Blue Lagoon, and the centuries-old House of Dakay. The winding coastal roads here are among the most scenic in the country.",
      "Food in Batanes is simple but fresh. Try turmeric rice, coconut crab (when in season and legally allowed), flying fish, and the local lobster. Many small eateries serve home-cooked meals that reflect the island's agricultural roots.",
      "Respect is essential in Batanes. The Ivatan people are warm but private. Always ask permission before entering private property or photographing locals. Traveling with a local guide helps you understand the customs and history deeply.",
      "A 3 to 4-day stay is ideal for exploring North Batan, South Batan, and perhaps a day trip to Sabtang Island. Batanes teaches you to slow down, breathe deeply, and appreciate nature's quiet grandeur.",
    ],
  },
  {
    id: "siargao-surf",
    title: "Best Time to Visit Siargao for Surfing",
    excerpt:
      "Plan your trip around the ideal swell season and island events.",
    image:
      "https://images.pexels.com/photos/2807218/pexels-photo-2807218.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    author: "Kai Reyes",
    date: "March 10, 2026",
    readTime: "5 min read",
    content: [
      "Siargao has transformed from a secret surf spot into one of the Philippines' most beloved islands. But for surfers, timing is everything. Understanding the swell season can make or break your trip.",
      "The prime surfing season runs from August to November. During these months, the Pacific Ocean delivers consistent swells, and Cloud 9—the island's most famous break—comes alive with glassy, barreling waves.",
      "September and October are widely considered the best months. The waves are reliable, the wind is offshore in the mornings, and the island hosts the annual Siargao Cloud 9 Surfing Cup, attracting pros from around the world.",
      "Beginners should consider visiting from March to May. The waves are smaller and gentler at spots like Guiuan and Pacifico, making it easier to learn the basics without fighting heavy crowds.",
      "Beyond surfing, Siargao offers island hopping to Guyam, Daku, and Naked Island, paddleboarding at Sugba Lagoon, and the famous Coconut Tree Viewpoint road. The island has a vibrant food scene with cafes, vegan spots, and beach bars.",
      "Accommodation ranges from budget hostels to boutique resorts. Book early during surf competitions and holiday weekends. Renting a motorbike is the best way to explore the island at your own pace.",
      "Whether you're chasing barrels or just want to experience island life, Siargao delivers. Pack reef-safe sunscreen, a rash guard, and a spirit of adventure.",
    ],
  },
];

const features = [
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "Explore hidden gems and authentic experiences guided by locals who know the islands best.",
  },
  {
    icon: CalendarCheck,
    title: "All-in-One Booking",
    description:
      "From flights and hotels to tours and transfers, book every part of your trip in one place.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Travel with confidence knowing our team is available around the clock, wherever you roam.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pick Your Destination",
    description:
      "Browse top Philippine spots and choose the islands, cities, or adventures that call to you.",
  },
  {
    number: "02",
    title: "Customize Your Tour",
    description:
      "Tailor your itinerary with flexible dates, add-ons, and experiences that match your style.",
  },
  {
    number: "03",
    title: "Confirm & Travel",
    description:
      "Secure your booking in minutes and get ready for a seamless, unforgettable journey.",
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [bookingStep, setBookingStep] = useState<"form" | "success" | "error">("form");
  const [bookingError, setBookingError] = useState("");
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [destinationDetailOpen, setDestinationDetailOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<typeof allDestinations[0] | null>(null);
  const [blogDetailOpen, setBlogDetailOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<typeof blogPosts[0] | null>(null);

  const itemsPerPage = 4;

  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allDestinations;
    return allDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const maxCarouselIndex = useMemo(
    () => Math.max(0, filteredDestinations.length - itemsPerPage),
    [filteredDestinations.length]
  );

  useEffect(() => {
    setCarouselIndex(0);
  }, [searchQuery]);

  const visibleDestinations = useMemo(() => {
    if (showAllDestinations) return filteredDestinations;
    return filteredDestinations.slice(carouselIndex, carouselIndex + itemsPerPage);
  }, [filteredDestinations, carouselIndex, showAllDestinations]);

  const canGoPrev = carouselIndex > 0;
  const canGoNext = carouselIndex < maxCarouselIndex;

  function goPrev() {
    setCarouselIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCarouselIndex((i) => Math.min(maxCarouselIndex, i + 1));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (bookingOpen || destinationDetailOpen || blogDetailOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingOpen, destinationDetailOpen, blogDetailOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openBooking(pkgId?: string) {
    setSelectedPackage(pkgId || "");
    setBookingStep("form");
    setBookingError("");
    setBookingOpen(true);
  }

  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) {
      setBookingError("Firebase configuration is missing. Restart Vite after updating .env.");
      setBookingStep("error");
      return;
    }

    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, "booking_requests"), {
        destination: String(formData.get("destination") || ""),
        travelDate: String(formData.get("travelDate") || ""),
        guests: Number(formData.get("guests") || 1),
        fullName: String(formData.get("fullName") || ""),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        notes: String(formData.get("notes") || ""),
        createdAt: serverTimestamp(),
      });
      setBookingStep("success");
    } catch (error) {
      console.error("Firebase booking save failed:", error);
      setBookingError(error instanceof Error ? error.message : "Unknown Firebase error");
      setBookingStep("error");
    }
  }

  function closeBooking() {
    setBookingOpen(false);
    setTimeout(() => setBookingStep("form"), 300);
  }

  function openDestinationDetail(destination: typeof allDestinations[0]) {
    setSelectedDestination(destination);
    setDestinationDetailOpen(true);
  }

  function closeDestinationDetail() {
    setDestinationDetailOpen(false);
    setTimeout(() => setSelectedDestination(null), 300);
  }

  function openBlogDetail(post: typeof blogPosts[0]) {
    setSelectedBlog(post);
    setBlogDetailOpen(true);
  }

  function closeBlogDetail() {
    setBlogDetailOpen(false);
    setTimeout(() => setSelectedBlog(null), 300);
  }

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (email && isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "newsletter_subscribers"), {
          email,
          createdAt: serverTimestamp(),
        });
        setNewsletterStatus("success");
        setNewsletterEmail("");
        setTimeout(() => setNewsletterStatus("idle"), 4000);
      } catch (error) {
        console.error("Firebase newsletter save failed:", error);
        setNewsletterStatus("error");
      }
    } else if (email) {
      setNewsletterStatus("error");
    }
  }

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { destinations: [], packages: [] };
    const destinationResults = allDestinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
      .slice(0, 4);
    const packageResults = tourPackages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 3);
    return { destinations: destinationResults, packages: packageResults };
  }, [searchQuery]);

  const hasSuggestions =
    searchSuggestions.destinations.length > 0 ||
    searchSuggestions.packages.length > 0;

  function handleSearchSelect(type: "destination" | "package", value: string) {
    setSearchQuery(value);
    setSearchDropdownOpen(false);
    if (type === "destination") {
      const destination = allDestinations.find((d) => d.name === value);
      if (destination) {
        openDestinationDetail(destination);
      }
    } else {
      const pkg = tourPackages.find((p) => p.title === value);
      if (pkg) {
        setExpandedPackage(pkg.id);
        scrollToSection("packages");
      }
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setSearchDropdownOpen(false);
      setShowAllDestinations(true);
      scrollToSection("destinations");
    }
  }

  const searchInput = (
    <div ref={searchContainerRef} className="relative">
      <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSearchDropdownOpen(true);
        }}
        onFocus={() => searchQuery.trim() && setSearchDropdownOpen(true)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Search for a place, city, or destination..."
        className="relative h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery("");
            setSearchDropdownOpen(false);
          }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Search Dropdown */}
      {searchDropdownOpen && searchQuery.trim() && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
          {!hasSuggestions ? (
            <div className="px-3 py-4 text-center text-sm text-slate-500">
              No results found. Press Enter to search destinations.
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {searchSuggestions.destinations.length > 0 && (
                <div>
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Destinations
                  </p>
                  {searchSuggestions.destinations.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => handleSearchSelect("destination", d.name)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-50"
                    >
                      <img
                        src={d.image}
                        alt={d.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{d.name}</p>
                        <p className="text-xs text-slate-500">{d.region} • {d.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchSuggestions.packages.length > 0 && (
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tour Packages
                  </p>
                  {searchSuggestions.packages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSearchSelect("package", p.title)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                        <p className="text-xs text-slate-500">₱{p.price} • {p.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-2 border-t border-slate-100 pt-2">
            <button
              onClick={() => {
                setSearchDropdownOpen(false);
                setShowAllDestinations(true);
                scrollToSection("destinations");
              }}
              className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm font-medium text-sky-600 hover:bg-sky-50"
            >
              View all results
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="WANDER.ph logo"
              className="h-10 w-auto object-contain mix-blend-multiply dark:invert"
            />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              WANDER<span className="text-sky-600">.ph</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link.href
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search + CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="w-72">{searchInput}</div>
            <button
              onClick={() => openBooking()}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-slate-800"
            >
              Book now
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="rounded-lg p-2 text-slate-700"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              className="rounded-lg p-2 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
            {searchInput}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-6 lg:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    scrollToSection(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium ${
                    activeSection === link.href
                      ? "text-slate-900"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  openBooking();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Book now
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[620px] w-full overflow-hidden sm:h-[720px]">
        <img
          src="https://images.pexels.com/photos/29657070/pexels-photo-29657070.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="Batanes rolling hills and ocean"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/60" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
            WANDER.PH
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Discover breathtaking destinations across the Philippines with curated tours,
            local insights, and seamless booking for every kind of traveler.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => openBooking()}
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-transform hover:scale-105 hover:bg-slate-50"
            >
              Plan Your Trip
            </button>
            <button
              onClick={() => scrollToSection("destinations")}
              className="rounded-full border-2 border-white/80 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20"
            >
              Explore Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Trust / Features Section */}
      <section id="about" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  Why Thousands of Travelers Choose WANDER.ph for Their Philippine
                  Adventures
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                  We combine deep local knowledge with a modern booking experience to help
                  you explore the Philippines with confidence, ease, and a sense of wonder.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Compass className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">12k</p>
                  <p className="text-xs text-slate-500">Happy and Satisfied Travelers</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Umbrella className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">10yrs</p>
                  <p className="text-xs text-slate-500">Proven Travel Industry Experience</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Mountain className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">50+</p>
                  <p className="text-xs text-slate-500">Philippine Destinations Covered</p>
                </div>
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="space-y-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-5 rounded-3xl bg-dusty-blue p-6 transition-transform hover:-translate-y-1 sm:p-8"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section id="destinations" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Top Destinations
              </h2>
              <p className="mt-3 max-w-xl text-base text-slate-600">
                Handpicked Philippine gems loved by travelers — from pristine beaches to
                highland havens.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                disabled={!canGoPrev || showAllDestinations}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                disabled={!canGoNext || showAllDestinations}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-4 text-sm text-slate-600">
              Showing results for "{searchQuery}" ({filteredDestinations.length} found)
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleDestinations.map((destination) => (
              <article
                key={destination.name}
                onClick={() => openDestinationDetail(destination)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                    starts at ₱{destination.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{destination.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{destination.category}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {destination.rating}
                    </span>
                    <span className="text-slate-400">({destination.reviews})</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-sky-600" />
                    <span>{destination.region}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openBooking(destination.name);
                    }}
                    className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-slate-800"
                  >
                    Book this destination
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white py-16 text-center">
              <p className="text-lg font-medium text-slate-900">No destinations found</p>
              <p className="mt-2 text-slate-500">Try a different search term.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Clear search
              </button>
            </div>
          )}

          {filteredDestinations.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAllDestinations((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                {showAllDestinations ? "Show less" : "View more"}
                {showAllDestinations ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="packages" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Tour Packages</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              Curated itineraries crafted for adventure, relaxation, and everything in between.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Text / CTA Panel */}
            <div className="flex flex-col justify-center rounded-3xl bg-dusty-blue p-8 sm:p-10">
              <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl">Tour Packages</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Curated itineraries crafted for adventure, relaxation, and everything in
                between. Let us handle the details while you make the memories.
              </p>
              <button
                onClick={() => openBooking()}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Browse all packages
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {tourPackages.slice(0, 2).map((pkg) => (
              <div
                key={pkg.id}
                className="group relative min-h-[400px] cursor-pointer overflow-hidden rounded-3xl"
                onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
                <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                  <pkg.icon className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                    {expandedPackage === pkg.id ? (
                      <ChevronUp className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                    {pkg.description}
                  </p>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedPackage === pkg.id ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {pkg.duration}
                      </span>
                      <span className="font-semibold text-sky-300">₱{pkg.price}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBooking(pkg.id);
                      }}
                      className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-transform hover:scale-105"
                    >
                      Book this package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra packages row */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {tourPackages.slice(2).map((pkg) => (
              <div
                key={pkg.id}
                className="group relative min-h-[300px] cursor-pointer overflow-hidden rounded-3xl"
                onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
                <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                  <pkg.icon className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                    {expandedPackage === pkg.id ? (
                      <ChevronUp className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                    {pkg.description}
                  </p>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedPackage === pkg.id ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {pkg.duration}
                      </span>
                      <span className="font-semibold text-sky-300">₱{pkg.price}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBooking(pkg.id);
                      }}
                      className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-transform hover:scale-105"
                    >
                      Book this package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Travel Blog</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              Tips, guides, and stories to inspire your next Philippine adventure.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => openBlogDetail(post)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openBlogDetail(post);
                    }}
                    className="mt-4 text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    Read more →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="bg-slate-900 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Booking made as easy as 1-2-3</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
              Your dream Philippine getaway is just a few simple steps away.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-700 bg-slate-800/50 p-8 text-center transition-transform hover:-translate-y-1"
              >
                {idx < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 bg-slate-700 md:block" />
                )}
                <span className="text-5xl font-black text-slate-700">{step.number}</span>
                <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Get Travel Deals & Inspiration
          </h2>
          <p className="mt-3 text-slate-600">
            Subscribe for exclusive Philippine travel tips, hidden gems, and limited-time offers.
          </p>
          {newsletterStatus === "success" ? (
            <div className="mt-6 rounded-2xl bg-green-50 py-4 text-green-700">
              <p className="font-semibold">You're subscribed! 🎉</p>
              <p className="text-sm">Watch your inbox for travel inspiration.</p>
            </div>
          ) : newsletterStatus === "error" ? (
            <div className="mt-6 rounded-2xl bg-red-50 py-4 text-red-700">
              <p className="font-semibold">Subscription could not be completed.</p>
              <p className="text-sm">Check the Firebase configuration and try again.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900"
            >
              <img
                src="/logo.png"
                alt="WANDER.ph logo"
                className="h-8 w-auto object-contain mix-blend-multiply dark:invert"
              />
              WANDER<span className="text-sky-600">.ph</span>
            </button>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} WANDER.ph. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-slate-400 transition-colors hover:text-slate-900"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 transition-colors hover:text-slate-900"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 transition-colors hover:text-slate-900"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
          onClick={closeBooking}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeBooking}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingStep === "success" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">Booking Request Sent!</h3>
                <p className="mt-2 text-slate-600">
                  Thank you for choosing WANDER.ph. Our travel team will contact you within 24 hours.
                </p>
                <button
                  onClick={closeBooking}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : bookingStep === "error" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <X className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">Booking Could Not Be Sent</h3>
                <p className="mt-2 text-slate-600">
                  Check the Firebase configuration and Firestore rules, then try again.
                </p>
                <p className="mx-auto mt-3 max-w-md break-words text-xs text-red-600">
                  {bookingError}
                </p>
                <button
                  onClick={() => setBookingStep("form")}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900">Plan Your Trip</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in your details and we'll craft your perfect Philippine getaway.
                </p>

                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Destination / Package
                    </label>
                    <select
                      required
                      name="destination"
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                    >
                      <option value="">Choose an option</option>
                      <optgroup label="Destinations">
                        {allDestinations.map((d) => (
                          <option key={d.name} value={d.name}>
                            {d.name}, {d.region}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Packages">
                        {tourPackages.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} — ₱{p.price}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Travel Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          name="travelDate"
                          required
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Guests
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          name="guests"
                          min={1}
                          max={20}
                          defaultValue={2}
                          required
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="Juan Dela Cruz"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+63 912 345 6789"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="juan@example.com"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Special Requests
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Dietary needs, preferred hotel, etc."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    Send Booking Request
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Destination Detail Modal */}
      {destinationDetailOpen && selectedDestination && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
          onClick={closeDestinationDetail}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDestinationDetail}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-64 sm:h-80">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {selectedDestination.category}
                </span>
                <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                  {selectedDestination.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedDestination.region}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="h-4 w-4 fill-current" />
                    {selectedDestination.rating} ({selectedDestination.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-slate-900">About this destination</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    {selectedDestination.description}
                  </p>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">Highlights</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {selectedDestination.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">Sample Itinerary</h3>
                  <div className="mt-3 space-y-3">
                    {selectedDestination.itinerary.map((day, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{day}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">What's Included</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {selectedDestination.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                    <p className="text-sm text-slate-500">Starting from</p>
                    <p className="text-3xl font-bold text-slate-900">₱{selectedDestination.price}</p>
                    <p className="mt-1 text-xs text-slate-400">per person, minimum of 2</p>

                    <button
                      onClick={() => {
                        closeDestinationDetail();
                        setTimeout(() => openBooking(selectedDestination.name), 300);
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                      Book this destination
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={closeDestinationDetail}
                      className="mt-3 w-full rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Back to destinations
                    </button>

                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CalendarCheck className="h-4 w-4 text-sky-600" />
                        <span>Flexible dates</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Headphones className="h-4 w-4 text-sky-600" />
                        <span>24/7 travel support</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-sky-600" />
                        <span>Private & group options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {blogDetailOpen && selectedBlog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
          onClick={closeBlogDetail}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeBlogDetail}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-64 sm:h-80">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                  <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                    Travel Guide
                  </span>
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {selectedBlog.title}
                </h2>
                <p className="mt-2 text-sm text-white/90">by {selectedBlog.author}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="prose prose-slate max-w-none">
                {selectedBlog.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-5 leading-relaxed text-slate-700 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Enjoyed this article? Start planning your trip today.
                </div>
                <button
                  onClick={() => {
                    closeBlogDetail();
                    setTimeout(() => openBooking(), 300);
                  }}
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                >
                  Plan Your Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
