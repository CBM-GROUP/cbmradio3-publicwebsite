"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  Clock,
  Search,
  Share2,
  Heart,
  MessageSquare,
  Download,
  Mail,
  Send,
  Check,
  Radio,
  FileText,
  Bookmark,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// =========================================================================
// 📰 THE WIRE // 12 EDITORIAL ARTICLES & PRESS RELEASES DATASET
// Easily edit, add, or replace articles in this array.
// =========================================================================
export interface WireArticle {
  id: string;
  slug: string;
  category: "Sports" | "Culture" | "Music" | "Station News" | "Press Releases";
  headline: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  dateline: string;
  content: {
    lead: string;
    paragraphs: string[];
    subheading?: string;
    subparagraphs?: string[];
    bulletListTitle?: string;
    bulletList?: string[];
  };
  featured?: boolean;
  secondaryFeatured?: boolean;
  isPressRelease?: boolean;
  pdfUrl?: string;
  views: number;
  initialLikes: number;
  comments: { id: string; author: string; time: string; text: string }[];
}

export const WIRE_ARTICLES: WireArticle[] = [
  {
    id: "wire-1",
    slug: "east-africa-underground-afrogospel-producers",
    category: "Music",
    headline: "East Africa’s New Wave: The Kampala & Nairobi Producers Redefining Afrogospel",
    excerpt:
      "From home studios in Kawangware to mastering suites in Muyenga, a rising generation of beatmakers is melding log drums, coastal guitar licks, and acoustic choir stems into global radio anthems.",
    coverImage: "/cbm_images/dj-music.jpg",
    author: {
      name: "Brian Omondi",
      avatar: "/artists/artist-1.jpg",
      role: "Lead Music Editor",
    },
    date: "NOV 02, 2026",
    readTime: "5 MIN READ",
    dateline: "Nairobi, Kenya —",
    content: {
      lead:
        "Inside a sunlit third-floor studio tucked away in Nairobi’s Kilimani district, 24-year-old producer Kevin Kibet is looping an 808 sub-bass under a traditional Nyatiti plucking rhythm.",
      paragraphs: [
        "What began as bedroom experiments during late-night lockdown sessions has evolved into East Africa’s fastest-growing musical export. Dubbed by local disc jockeys as 'Urban Afrogospel', the sub-genre blends traditional Swahili praise cadences with the rolling percussion of Amapiano and the lush harmonies of Nairobi's cathedral choirs.",
        "Over the past twelve months, streaming numbers across Kenya, Uganda, Tanzania, and the diaspora have spiked by over 340%, propelled heavily by daily rotation on CBM Radio’s daytime countdown and curated digital crate playlists.",
        "The shift isn't merely sonic; it's cultural. Independent artists are bypassing major global labels, producing, mixing, and uploading stems directly to station desks and independent syndication networks.",
      ],
      subheading: "Analog Warmth in an Algorithmic Era",
      subparagraphs: [
        "Unlike Western counterparts who rely almost exclusively on synthesizer plugins, East African producers insist on authentic studio room acoustics. In CBM Radio’s live sound room, artists record live percussions and acoustic horns before layering digital frequencies.",
        "This tactile recording process gives the music an organic heartbeat that cuts cleanly through both high-end car stereos and dusty FM transistor radios in rural counties.",
      ],
      bulletListTitle: "Key Pillars of the Movement:",
      bulletList: [
        "Live instrumentation blended with electronic polyrhythms.",
        "Bilingual lyricism alternating between Sheng, English, Luganda, and Swahili.",
        "Decentralized distribution powered by independent radio airplay and community tapes.",
      ],
    },
    featured: true,
    views: 18420,
    initialLikes: 412,
    comments: [
      {
        id: "c-1",
        author: "Amina Mwangi",
        time: "2 hours ago",
        text: "The fusion of coastal taarab scales with contemporary basslines is truly unmatched. Proud to see our sound on the world stage!",
      },
      {
        id: "c-2",
        author: "Joshua K.",
        time: "5 hours ago",
        text: "Kibet's production on the new morning jingles is top tier. CBM always champions real grassroots creators.",
      },
    ],
  },
  {
    id: "wire-2",
    slug: "preserving-mombasa-coastal-taarab-vinyl-archives",
    category: "Culture",
    headline: "Preserving Sonic Heritage: How Mombasa Vinyl Crates Are Rescuing Forgotten Coastal Taarab",
    excerpt:
      "Station archivist Samuel Ndegwa digs through century-old tape reels and shellac discs in Old Town Mombasa, restoring cultural poetry for FM transmission.",
    coverImage: "/cbm_images/cbm-conversation-radio-show.png",
    author: {
      name: "Fatma Bakhresa",
      avatar: "/artists/artist-2.jpg",
      role: "Heritage & Arts Correspondent",
    },
    date: "NOV 01, 2026",
    readTime: "4 MIN READ",
    dateline: "Mombasa, Kenya —",
    content: {
      lead:
        "Behind heavy carved wooden doors in Old Town Mombasa, dust particles dance in the afternoon sunlight above stacks of decaying 78 RPM shellac records.",
      paragraphs: [
        "For the past three months, CBM Radio’s Heritage Audio Initiative has been meticulously cataloging, cleaning, and digitizing recordings made between 1948 and 1975 along the Swahili coastline.",
        "These records preserve intricate oud performances, kanun melodies, and poetic dialogues once performed at seaside wedding celebrations and royal community dhows across the Indian Ocean.",
      ],
      subheading: "From Shellac Grooves to Clean Digital Master Tapes",
      subparagraphs: [
        "Using optical turntable styluses and noise-reduction preamplifiers, the preservation team removes decades of ocean humidity and saline erosion without stripping away the authentic crackle of the performance.",
        "Selected restored master tapes will premiere as a weekly midnight retrospective series titled 'The Coastal Wire' on CBM Radio 104.2 FM.",
      ],
    },
    secondaryFeatured: true,
    views: 9230,
    initialLikes: 245,
    comments: [],
  },
  {
    id: "wire-3",
    slug: "cbm-expands-regional-transmitters-eldoret-kisumu",
    category: "Station News",
    headline: "CBM Radio Expands Regional Broadcast Network with High-Gain FM Transmitters in Western Kenya",
    excerpt:
      "New high-elevation mast installations in the Rift Valley and Lake Victoria basin bring crystal-clear audio to an estimated 1.8 million additional households.",
    coverImage: "/cbm_images/behind-the-scenes-studio.png",
    author: {
      name: "Engineering Desk",
      avatar: "/artists/artist-3.jpg",
      role: "Broadcast Operations",
    },
    date: "OCT 30, 2026",
    readTime: "3 MIN READ",
    dateline: "Eldoret, Kenya —",
    content: {
      lead:
        "CBM Radio has officially commissioned two state-of-the-art 5kW FM broadcast transmission facilities situated on high-elevation ridgelines overlooking Eldoret and Kisumu.",
      paragraphs: [
        "The infrastructural investment addresses longstanding frequency shadows across agricultural valleys and border regions, delivering uninterrupted transmission to long-distance truck corridors and community trading centres.",
        "Equipped with backup solar battery banks and dual satellite telemetry uplinks, the new transmitter arrays ensure 99.98% broadcast uptime even during severe wet-season electrical outages.",
      ],
    },
    secondaryFeatured: true,
    views: 6540,
    initialLikes: 189,
    comments: [],
  },
  {
    id: "wire-4",
    slug: "rift-valley-marathon-runners-audio-training-diary",
    category: "Sports",
    headline: "The Rift Valley Runners’ Audio Diary: Why Elite Athletes Train to High-Tempo African Beats",
    excerpt:
      "At 2,400 meters above sea level in Iten, world-record marathoners share how bespoke CBM morning mixes set the metronome for grueling hill repetitions.",
    coverImage: "/cbm_images/sports-collections.jpg",
    author: {
      name: "Geoffrey Kiprop",
      avatar: "/artists/artist-4.jpg",
      role: "Athletics Reporter",
    },
    date: "OCT 29, 2026",
    readTime: "4 MIN READ",
    dateline: "Iten, Kenya —",
    content: {
      lead:
        "Dawn breaks over the red clay dirt roads of Iten, universally known across the athletic globe as the Home of Champions.",
      paragraphs: [
        "As packs of runners surge past misty cedar forests, one detail stands out: nearly every support vehicle and pack pacemaker is tuned in to CBM Radio's 'Dawn Horizon' 175 BPM morning track rotation.",
        "Sport physiologists at the local high-altitude training academy note that synchronized musical pacing reduces perceived exertion during lactate-threshold interval workouts.",
      ],
      bulletListTitle: "Athletic Pace Benchmarks:",
      bulletList: [
        "170-180 BPM cadence matching marathon race stride frequency.",
        "Inspiring spoken-word affirmations during final gradient inclines.",
        "Live weather alerts broadcast at 15-minute intervals.",
      ],
    },
    views: 12400,
    initialLikes: 358,
    comments: [],
  },
  {
    id: "wire-5",
    slug: "cbm-media-group-syndication-panafrican-alliance",
    category: "Press Releases",
    headline: "PRESS RELEASE: CBM Media Group Enters Multi-Territory Syndication Agreement with Pan-African Alliance",
    excerpt:
      "Historic partnership allows CBM original podcasts, news journals, and live music countdowns to be rebroadcast across 14 African nations.",
    coverImage: "/cbm_images/newsroom-studio-set.png",
    author: {
      name: "Corporate Affairs",
      avatar: "/artists/artist-5.jpg",
      role: "CBM Media Group",
    },
    date: "OCT 28, 2026",
    readTime: "2 MIN READ",
    dateline: "Kampala, Uganda —",
    content: {
      lead:
        "CBM Media Group today confirmed the signing of a landmark cross-border content syndication and satellite distribution pact with the Pan-African Independent Broadcasters Alliance.",
      paragraphs: [
        "Under the terms of the five-year covenant, flagship shows including 'The Morning Drive', 'East African Weekly Dispatches', and 'The Sound Lab' will be distributed to affiliate commercial and community stations across Uganda, Tanzania, Rwanda, Ghana, and Nigeria.",
        "The agreement represents a major step forward in building independent, community-financed media infrastructure that tells African stories without foreign editorial intermediation.",
      ],
    },
    isPressRelease: true,
    pdfUrl: "#download-pdf-syndication-pact",
    views: 4310,
    initialLikes: 112,
    comments: [],
  },
  {
    id: "wire-6",
    slug: "storytelling-traditions-mt-kenya-coffee-farmers",
    category: "Culture",
    headline: "From Coffee Shambas to Global Airwaves: Oral Storytelling Traditions of Mt. Kenya Communities",
    excerpt:
      "A deep-dive audio series unearths centuries-old farming folklore, climate-adaptation wisdom, and generational family songs recorded directly on the mountainside.",
    coverImage: "/cbm_images/on-air-studio.png",
    author: {
      name: "Miriam Wanjiru",
      avatar: "/artists/artist-6.jpg",
      role: "Cultural Features",
    },
    date: "OCT 26, 2026",
    readTime: "5 MIN READ",
    dateline: "Nyeri, Kenya —",
    content: {
      lead:
        "High on the slopes of Mount Kenya, the rhythmic harvesting of red coffee cherries has long been accompanied by call-and-response field chants.",
      paragraphs: [
        "Our documentary unit spent two weeks living alongside cooperative farmers, recording hours of oral history covering seasonal rainfall patterns, ancestral tree stewardship, and communal mutual-aid traditions.",
        "These field recordings have now been mixed into an immersive five-part audio documentary premiering across our podcast crate this week.",
      ],
    },
    views: 8900,
    initialLikes: 290,
    comments: [],
  },
  {
    id: "wire-7",
    slug: "dj-soundclash-tech-turntablism-station-mix-lab",
    category: "Music",
    headline: "Inside The Sound Lab: The Analog Turntablism and Modular Synthesizers Behind Friday Night Sessions",
    excerpt:
      "Resident selector DJ Kato takes us behind the twin direct-drive decks, demonstrating why human hands will always outperform AI-curated playlist algorithms.",
    coverImage: "/cbm_images/evening-drive.jpg",
    author: {
      name: "DJ Kato",
      avatar: "/artists/artist-1.jpg",
      role: "Senior Selector",
    },
    date: "OCT 25, 2026",
    readTime: "4 MIN READ",
    dateline: "Nairobi, Kenya —",
    content: {
      lead:
        "Every Friday at precisely 9:00 PM, the red 'ON AIR' indicator flashes in Studio C, and the needle touches 180-gram vinyl.",
      paragraphs: [
        "While digital streaming algorithms rely on mathematical proximity to recommend songs, DJ Kato argues that genuine radio magic lives in the human element — reading listener WhatsApp reactions in real time and adjusting harmonic keys on the fly.",
        "The studio setup utilizes vintage rotary mixers, tape delay units, and direct-drive platters paired with ultra-low-latency broadcast codecs.",
      ],
    },
    views: 11100,
    initialLikes: 460,
    comments: [],
  },
  {
    id: "wire-8",
    slug: "safari-rally-naivasha-live-radio-dispatch",
    category: "Sports",
    headline: "Safari Rally Naivasha: Live Radio Dispatches from the Dust, Fesh-Fesh, and Speed of the Rift Valley",
    excerpt:
      "CBM’s mobile broadcast Land Cruiser braves muddy river crossings and volcanic dust bowls to bring listener play-by-play telemetry from the WRC stages.",
    coverImage: "/cbm_images/the-morning-show.jpg",
    author: {
      name: "Dennis Macharia",
      avatar: "/artists/artist-2.jpg",
      role: "Motorsport Correspondent",
    },
    date: "OCT 24, 2026",
    readTime: "4 MIN READ",
    dateline: "Naivasha, Kenya —",
    content: {
      lead:
        "Tires churning through powdery fesh-fesh and engines revving at 8,000 RPM signaled the return of the world's toughest automotive endurance trial.",
      paragraphs: [
        "Armed with portable satellite transmitters, CBM reporters stationed themselves at notorious chicanes along the Sleeping Warrior and Hell's Gate stages.",
        "Listeners tuned in from across the region to experience real-time interval splits, audio exhausts, and exclusive post-stage interviews with Kenyan and international rally drivers.",
      ],
    },
    views: 14200,
    initialLikes: 512,
    comments: [],
  },
  {
    id: "wire-9",
    slug: "annual-report-2026-cbm-audience-reach",
    category: "Press Releases",
    headline: "PRESS RELEASE: CBM Radio Reaches 2.4 Million Weekly Listeners in 2026 Audience Survey",
    excerpt:
      "Independent media measurement audits confirm strong audience expansion in youth cohorts, online streaming syndication, and diaspora listenership.",
    coverImage: "/cbm_images/artist-spotlight.png",
    author: {
      name: "Communications Office",
      avatar: "/artists/artist-3.jpg",
      role: "Official Press Release",
    },
    date: "OCT 22, 2026",
    readTime: "3 MIN READ",
    dateline: "Nairobi, Kenya —",
    content: {
      lead:
        "The East African Broadcast Research Council (EABRC) has released its comprehensive Q3 2026 media consumption audit, verifying unprecedented audience growth for CBM Radio.",
      paragraphs: [
        "Key audit metrics reveal an average weekly reach of 2.42 million terrestrial listeners across Kenya and eastern Uganda, alongside a 145% surge in monthly digital episode downloads.",
        "Station management credited the milestone to an unwavering commitment to non-partisan cultural journalism, authentic music curation, and active listener engagement via live broadcast channels.",
      ],
    },
    isPressRelease: true,
    pdfUrl: "#download-pdf-annual-audit",
    views: 5200,
    initialLikes: 198,
    comments: [],
  },
  {
    id: "wire-10",
    slug: "inside-studio-b-32-channel-analogue-console",
    category: "Station News",
    headline: "Inside Studio B: Installing the 32-Channel Custom British Console for Acoustic Showcases",
    excerpt:
      "A peek behind the glass as station engineers wire up vintage transformer preamps to capture live choirs and acoustic session bands with warm clarity.",
    coverImage: "/cbm_images/radio 2.jpeg",
    author: {
      name: "Engineering Desk",
      avatar: "/artists/artist-4.jpg",
      role: "Studio Operations",
    },
    date: "OCT 20, 2026",
    readTime: "3 MIN READ",
    dateline: "Nairobi, Kenya —",
    content: {
      lead:
        "The smell of fresh solder and oiled teak filled Studio B this week during the final commissioning of our new 32-channel analog mixing desk.",
      paragraphs: [
        "Designed specifically for high-headroom broadcast capture, the console incorporates discrete Class-A preamplifiers that faithfully replicate the nuanced dynamic range of live gospel chorales and multi-percussion ensembles.",
        "First sessions scheduled for next week will feature acoustic showcases from upcoming coastal vocalists.",
      ],
    },
    views: 7400,
    initialLikes: 305,
    comments: [],
  },
  {
    id: "wire-11",
    slug: "gospel-choral-arrangements-electronic-fusion",
    category: "Music",
    headline: "Polyphonic Traditions Meet Modern Synthesis: The Rise of East African Choral Electronic Fusion",
    excerpt:
      "How cathedral choir directors and ambient synth producers are collaborating on meditative spiritual records that top late-night playlists.",
    coverImage: "/cbm_images/take 3.jpeg",
    author: {
      name: "Brian Omondi",
      avatar: "/artists/artist-5.jpg",
      role: "Lead Music Editor",
    },
    date: "OCT 18, 2026",
    readTime: "4 MIN READ",
    dateline: "Kigali, Rwanda —",
    content: {
      lead:
        "In a historic stone chapel in Kigali, forty vocalists rehearse centuries-old choral four-part harmonies while a laptop captures microphone arrays in 96kHz 24-bit resolution.",
      paragraphs: [
        "The resulting compositions marry deep spiritual reverie with subtle warm analog pads and organic room reverbs.",
        "Listeners describe the sound as transformative during evening commutes and early dawn meditations, proving that sacred music continues to evolve without losing its sacred core.",
      ],
    },
    views: 9800,
    initialLikes: 390,
    comments: [],
  },
  {
    id: "wire-12",
    slug: "statement-independent-journalism-community-charter",
    category: "Press Releases",
    headline: "PRESS RELEASE: CBM Radio Reaffirms Community Dispatches Editorial Charter and Ethics Code",
    excerpt:
      "Governing board publishes open charter detailing factual verification protocols, conflict-of-interest guidelines, and community protection principles.",
    coverImage: "/cbm_images/newsroom-studio-set.png",
    author: {
      name: "Editorial Board",
      avatar: "/artists/artist-6.jpg",
      role: "Ethics Committee",
    },
    date: "OCT 15, 2026",
    readTime: "2 MIN READ",
    dateline: "Dar es Salaam, Tanzania —",
    content: {
      lead:
        "The board of trustees of CBM Radio has ratified an updated Community Editorial Dispatches Charter, setting the benchmark for ethical reporting across our regional bureaus.",
      paragraphs: [
        "The public charter mandates multi-source factual verification for all investigative features, transparency in source attribution, and absolute editorial independence from political sponsors.",
        "The complete charter document is made freely accessible to the public, researchers, and journalism students worldwide.",
      ],
    },
    isPressRelease: true,
    pdfUrl: "#download-pdf-editorial-charter",
    views: 3890,
    initialLikes: 140,
    comments: [],
  },
];

// Top Ticker Headlines
const TICKER_ITEMS = [
  "EAST AFRICA AFROGOSPEL STREAMS SURGE 340% ACROSS CONTINENT",
  "NEW HIGH-GAIN 5KW FM TRANSMITTER COMMISSIONED IN RIFT VALLEY",
  "MOMBASA COASTAL TAARAB 1950S MASTER REELS RESTORED TO DIGITAL",
  "WRC SAFARI RALLY: CBM MOBILE CRUISER PROVIDES TELEMETRY FEED",
  "ANNUAL REPORT CONFIRMS 2.4M WEEKLY LISTENERS ACROSS AIRWAVES",
  "COMMUNITY DISPATCHES EDITORIAL CHARTER RATIFIED BY TRUSTEES",
];

const CATEGORIES = [
  "All",
  "Sports",
  "Culture",
  "Music",
  "Station News",
  "Press Releases",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export default function TheWireSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeArticle, setActiveArticle] = useState<WireArticle | null>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [userLikes, setUserLikes] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const map: Record<string, { count: number; liked: boolean }> = {};
    WIRE_ARTICLES.forEach((a) => {
      map[a.id] = { count: a.initialLikes, liked: false };
    });
    return map;
  });
  const [articleComments, setArticleComments] = useState<Record<string, WireArticle["comments"]>>(() => {
    const map: Record<string, WireArticle["comments"]> = {};
    WIRE_ARTICLES.forEach((a) => {
      map[a.id] = a.comments;
    });
    return map;
  });
  const [commentInput, setCommentInput] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const articleOverlayRef = useRef<HTMLDivElement | null>(null);

  // Sync with window.location.hash for browser back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#wire-")) {
        const slug = hash.replace("#wire-", "");
        const found = WIRE_ARTICLES.find((a) => a.slug === slug || a.id === slug);
        if (found) {
          setActiveArticle(found);
          document.body.style.overflow = "hidden";
        }
      } else {
        setActiveArticle(null);
        document.body.style.overflow = "auto";
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Track scroll reading progress inside article overlay
  const handleArticleScroll = () => {
    if (!articleOverlayRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = articleOverlayRef.current;
    const total = scrollHeight - clientHeight;
    if (total <= 0) {
      setReadingProgress(0);
      return;
    }
    const pct = Math.min(100, Math.max(0, (scrollTop / total) * 100));
    setReadingProgress(pct);
  };

  // Open article
  const openArticle = (article: WireArticle) => {
    window.location.hash = `wire-${article.slug}`;
  };

  // Close article
  const closeArticle = () => {
    if (window.location.hash) {
      history.back();
    } else {
      setActiveArticle(null);
      document.body.style.overflow = "auto";
    }
  };

  // Toggle like
  const toggleLike = (articleId: string) => {
    setUserLikes((prev) => {
      const current = prev[articleId] || { count: 0, liked: false };
      const newLiked = !current.liked;
      return {
        ...prev,
        [articleId]: {
          liked: newLiked,
          count: current.count + (newLiked ? 1 : -1),
        },
      };
    });
  };

  // Add comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeArticle) return;

    const newComment = {
      id: "comment-" + Date.now(),
      author: "Community Reader",
      time: "Just now",
      text: commentInput.trim(),
    };

    setArticleComments((prev) => ({
      ...prev,
      [activeArticle.id]: [newComment, ...(prev[activeArticle.id] || [])],
    }));

    setCommentInput("");
  };

  // Copy article link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return WIRE_ARTICLES;
    return WIRE_ARTICLES.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featuredArticle = useMemo(
    () => WIRE_ARTICLES.find((a) => a.featured) || WIRE_ARTICLES[0],
    []
  );

  const secondaryFeatured = useMemo(
    () => WIRE_ARTICLES.filter((a) => a.secondaryFeatured),
    []
  );

  const gridArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const pressReleases = useMemo(
    () => WIRE_ARTICLES.filter((a) => a.isPressRelease).slice(0, 4),
    []
  );

  const mostReadArticles = useMemo(
    () => [...WIRE_ARTICLES].sort((a, b) => b.views - a.views).slice(0, 5),
    []
  );

  // Filtered related articles for modal sidebar
  const relatedArticles = useMemo(() => {
    if (!activeArticle) return [];
    return WIRE_ARTICLES.filter((a) => a.id !== activeArticle.id).slice(0, 5);
  }, [activeArticle]);

  return (
    <section
      id="the-wire"
      aria-label="The Wire - Full Editorial Articles & Releases"
      className="relative scroll-mt-20 border-t-2 border-black bg-[#060c18] px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Ambient background flares */}
      <div
        className="pointer-events-none absolute left-1/4 top-10 h-96 w-96 rounded-full bg-[#04b093]/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-[#04b093]/10 blur-[140px]"
        aria-hidden="true"
      />

      <style>{`
        /* Seamless Continuous Live Ticker */
        @keyframes ticker-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-slide 32s linear infinite;
        }

        .group\\/ticker:hover .animate-ticker {
          animation-play-state: paused !important;
        }

        /* Reading Progress Bar Animation */
        .progress-bar-transition {
          transition: width 0.12s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ticker {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl">
        {/* =========================================================================
            01 // LIVE TICKER STRIP (SEAMLESS CONTINUOUS LOOP, PAUSE ON HOVER)
            ========================================================================= */}
        <div className="group/ticker mb-8 overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center">
            {/* Live Badge */}
            <div className="z-10 flex shrink-0 items-center gap-2 border-r-2 border-black bg-[#04b093] px-3.5 py-2 font-mono text-[0.7rem] font-black uppercase tracking-wider text-black">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-black opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-black" />
              </span>
              <span>LIVE WIRE</span>
            </div>

            {/* Seamless Scrolling Headlines */}
            <div className="relative flex overflow-hidden py-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <div className="animate-ticker flex items-center gap-8 px-4 whitespace-nowrap">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((headline, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-4 hover:text-[#04b093] transition-colors cursor-pointer"
                    onClick={() => {
                      const match = WIRE_ARTICLES[idx % WIRE_ARTICLES.length];
                      if (match) openArticle(match);
                    }}
                  >
                    <span>{headline}</span>
                    <span className="text-[#04b093]">◆</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            02 // SECTION HEADER
            - Small Monospace Label: "THE WIRE"
            - Heading (bold uppercase): "FULL EDITORIAL ARTICLES & RELEASES"
            ========================================================================= */}
        <div className="mb-10 flex flex-col gap-4 border-b-2 border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-black px-3.5 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#04b093] border border-[#04b093]/40 shadow-sm">
                THE WIRE
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                DISPATCHES & EDITORIAL JOURNALISM
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              FULL EDITORIAL ARTICLES & RELEASES
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm font-medium text-zinc-400 leading-relaxed">
            In-depth reporting, music underground essays, athletic diaries, and official station communiqués across East Africa.
          </p>
        </div>

        {/* =========================================================================
            03 // MAGAZINE STYLE TOP FEATURED STORY DECK
            1 Large Card (Left) + 2 Stacked Cards (Right)
            ========================================================================= */}
        <div className="mb-14 grid gap-8 lg:grid-cols-12">
          
          {/* Main Large Featured Card */}
          <article
            onClick={() => openArticle(featuredArticle)}
            className="group lg:col-span-7 flex flex-col justify-between rounded-3xl border-3 border-black bg-[#0a1222] p-6 sm:p-8 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:border-[#04b093] hover:shadow-[12px_12px_0_0_rgba(4,176,147,0.3)] cursor-pointer"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-md">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.headline}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-[#04b093] px-3.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-black shadow-md">
                    {featuredArticle.category}
                  </span>
                </div>

                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 font-mono text-[0.65rem] font-bold text-white backdrop-blur-sm">
                  <Sparkles size={11} className="text-[#04b093]" />
                  <span>FEATURED DISPATCH</span>
                </div>
              </div>

              {/* Author & Date Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="relative size-6 overflow-hidden rounded-full border border-white/20">
                    <Image
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-bold uppercase tracking-wider text-white">
                    BY {featuredArticle.author.name}
                  </span>
                </div>
                <span className="text-zinc-600">/</span>
                <span className="font-mono text-xs">{featuredArticle.date}</span>
                <span className="text-zinc-600">/</span>
                <span className="flex items-center gap-1 text-[#04b093] font-mono text-xs">
                  <Clock size={12} />
                  <span>{featuredArticle.readTime}</span>
                </span>
              </div>

              {/* Headline */}
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight group-hover:text-[#04b093] transition-colors">
                {featuredArticle.headline}
              </h3>

              {/* Excerpt */}
              <p className="mt-3 text-sm leading-relaxed text-zinc-300 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
            </div>

            {/* Bottom Action */}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#04b093] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md transition-all group-hover:bg-white group-hover:scale-105 active:scale-95">
                <span>Read Full Story</span>
                <ArrowUpRight size={14} />
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {featuredArticle.views.toLocaleString()} READS
              </span>
            </div>
          </article>

          {/* Right: Stacked Story Cards (2 items) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {secondaryFeatured.map((sec) => (
              <article
                key={sec.id}
                onClick={() => openArticle(sec)}
                className="group flex flex-col justify-between rounded-3xl border-3 border-black bg-[#0a1222] p-6 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:border-[#04b093] hover:shadow-[12px_12px_0_0_rgba(4,176,147,0.3)] cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                    <Image
                      src={sec.coverImage}
                      alt={sec.headline}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[0.65rem] text-zinc-400">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono font-bold uppercase text-[#04b093]">
                        {sec.category}
                      </span>
                      <span className="font-mono">{sec.date}</span>
                    </div>

                    <h4 className="mt-2 text-base font-black uppercase tracking-tight text-white group-hover:text-[#04b093] transition-colors line-clamp-2">
                      {sec.headline}
                    </h4>

                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {sec.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="font-mono text-[0.65rem] text-zinc-400">
                    BY {sec.author.name}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] font-bold uppercase text-[#04b093] group-hover:underline">
                    <span>Inspect</span>
                    <ArrowUpRight size={12} />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* =========================================================================
            04 // CATEGORY FILTER TABS
            All, Sports, Culture, Music, Station News, Press Releases
            Active tab is teal, smooth filtering
            ========================================================================= */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-1 max-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`rounded-full px-4 py-2 font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? "border-2 border-black bg-[#04b093] text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] scale-105"
                      : "border border-white/15 bg-[#0a1222] text-zinc-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline-block font-mono text-xs text-zinc-400">
            SHOWING: {filteredArticles.length} DISPATCHES
          </span>
        </div>

        {/* =========================================================================
            05 // LATEST ARTICLES GRID (6 CARDS + "LOAD MORE" BUTTON)
            Thumbnail, teal category tag, headline, date, and Read More link
            ========================================================================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => openArticle(article)}
              className="group flex flex-col justify-between rounded-3xl border-3 border-black bg-[#0a1222] p-5 text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#04b093] hover:shadow-[10px_10px_0_0_rgba(4,176,147,0.25)] cursor-pointer"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black border border-white/10">
                  <Image
                    src={article.coverImage}
                    alt={article.headline}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-[#04b093] px-3 py-0.5 font-mono text-[0.62rem] font-black uppercase tracking-wider text-black shadow">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 flex items-center justify-between text-[0.68rem] text-zinc-400">
                  <span className="font-mono">{article.date}</span>
                  <span className="flex items-center gap-1 text-[#04b093] font-mono">
                    <Clock size={11} />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                {/* Headline */}
                <h4 className="mt-2 text-lg font-black uppercase tracking-tight text-white group-hover:text-[#04b093] transition-colors line-clamp-2 leading-snug">
                  {article.headline}
                </h4>

                {/* Excerpt */}
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer: Read More */}
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-black uppercase text-[#04b093] group-hover:underline">
                  <span>Read More</span>
                  <ArrowUpRight size={13} />
                </span>
                <span className="font-mono text-[0.62rem] text-zinc-400 uppercase">
                  BY {article.author.name}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredArticles.length && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-8 py-3 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#04b093] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Load More Dispatches</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* =========================================================================
            06 // TWO COLUMNS BELOW GRID:
            LEFT: "PRESS RELEASES" WIRE FEED LIST
            RIGHT: "MOST READ" TOP 5 LIST + NEWSLETTER SIGNUP BOX
            ========================================================================= */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: PRESS RELEASES Wire Feed List */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border-3 border-black bg-[#0a1222] p-6 sm:p-8 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#04b093]" />
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    PRESS RELEASES & NOTICES
                  </h3>
                </div>
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#04b093]">
                  OFFICIAL FEED
                </span>
              </div>

              <div className="divide-y divide-white/10 mt-2">
                {pressReleases.map((pr) => (
                  <div
                    key={pr.id}
                    className="group/pr flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono text-xs font-bold text-[#04b093] pt-0.5 shrink-0">
                        {pr.date}
                      </span>
                      <div>
                        <span className="inline-block rounded bg-white/10 px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-zinc-300 mb-1">
                          STATEMENT
                        </span>
                        <h4
                          onClick={() => openArticle(pr)}
                          className="text-sm font-black uppercase text-white hover:text-[#04b093] transition-colors cursor-pointer line-clamp-2"
                        >
                          {pr.headline}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 sm:self-center self-end">
                      <a
                        href={pr.pdfUrl || "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Initiating download for ${pr.slug}.pdf`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase text-zinc-300 hover:text-black hover:bg-[#04b093] hover:border-[#04b093] transition-all cursor-pointer"
                      >
                        <Download size={11} />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>* All communiqués are certified by CBM Secretariat</span>
              <span className="text-[#04b093]">ARCHIVE REPOSITORY</span>
            </div>
          </div>

          {/* Right Column: MOST READ Top 5 + NEWSLETTER BOX */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* MOST READ Numbered Top 5 */}
            <div className="rounded-3xl border-3 border-black bg-[#0a1222] p-6 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#04b093]" />
                  MOST READ DISPATCHES
                </h3>
                <span className="font-mono text-[0.65rem] text-zinc-400">TOP 5</span>
              </div>

              <div className="divide-y divide-white/10 mt-1">
                {mostReadArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    onClick={() => openArticle(article)}
                    className="group/mr flex items-baseline gap-3 py-3 hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span className="font-mono text-base font-black tabular-nums text-zinc-500 group-hover/mr:text-[#04b093]">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[0.6rem] font-bold text-[#04b093] uppercase">
                        {article.category}
                      </span>
                      <h4 className="text-xs font-black uppercase text-white group-hover/mr:text-[#04b093] transition-colors line-clamp-2">
                        {article.headline}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Box */}
            <div className="rounded-3xl border-3 border-black bg-gradient-to-br from-[#0c192d] to-[#040810] p-6 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 text-[#04b093]">
                <Mail size={16} />
                <span className="font-mono text-[0.65rem] font-black uppercase tracking-[0.2em]">
                  WEEKLY DISPATCH WIRE
                </span>
              </div>

              <h4 className="mt-2 text-lg font-black uppercase tracking-tight text-white">
                Get the dispatches in your inbox
              </h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Receive curated cultural essays, studio playlists, and station bulletins every Friday morning.
              </p>

              {newsletterSuccess ? (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#04b093]/20 border border-[#04b093] p-3 text-xs text-[#04b093] font-bold">
                  <Check size={16} />
                  <span>You are subscribed to the CBM Wire dispatches!</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSuccess(true);
                  }}
                  className="mt-4 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 rounded-full border-2 border-zinc-700 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#04b093] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full border-2 border-black bg-[#04b093] px-6 py-2.5 font-mono text-xs font-black uppercase text-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* =========================================================================
            07 // MEDIA CONTACT BOX: PRESS EMAIL & MEDIA KIT LINK
            ========================================================================= */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-zinc-800 bg-black/60 p-5 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Radio size={16} className="text-[#04b093]" />
            <span className="text-zinc-400">NEWSROOM & PRESS ACCREDITATION:</span>
            <a
              href="mailto:press@cbmradio.com"
              className="font-bold text-white hover:text-[#04b093] underline underline-offset-4"
            >
              press@cbmradio.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#media-kit-download"
              onClick={(e) => {
                e.preventDefault();
                alert("Downloading CBM Radio Official Media Kit & Brand Assets (PDF)");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#04b093] bg-[#04b093]/10 px-4 py-1.5 font-black uppercase text-[#04b093] hover:bg-[#04b093] hover:text-black transition-colors"
            >
              <span>Media Kit (2026)</span>
              <Download size={12} />
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
          PART 2: ARTICLE READING PAGE (FULL-SCREEN OVERLAY & HASH ROUTE)
          - Top Bar: "← Back to The Wire" on left, search field on right
          - Reading progress bar at top
          - Main Column: headline, author avatar/name/category/date, wide cover, body
          - Right Sidebar (30% width): Share buttons (real URLs), Related Articles
          - Bottom Bar: Like toggle + count, comments count, share count, comment input
          ========================================================================= */}
      {activeArticle && (
        <div
          ref={articleOverlayRef}
          onScroll={handleArticleScroll}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#060c18] text-white animate-in fade-in duration-200"
        >
          {/* Top Sticky Reading Progress Bar */}
          <div className="sticky top-0 z-50 h-1.5 w-full bg-zinc-800">
            <div
              className="h-full bg-[#04b093] progress-bar-transition shadow-[0_0_8px_#04b093]"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* Top Sticky Navigation Bar */}
          <div className="sticky top-1.5 z-40 border-b border-zinc-800 bg-[#060c18]/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <button
                type="button"
                onClick={closeArticle}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-white hover:border-[#04b093] hover:bg-[#04b093] hover:text-black transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to The Wire</span>
              </button>

              <div className="relative w-48 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-zinc-700 bg-black/70 py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:border-[#04b093] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Main Article Content Container */}
          <main className="mx-auto max-w-6xl px-4 py-10 pb-36 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Left / Main Column (70% width) */}
              <div className="lg:col-span-8">
                
                {/* Category & Read Time */}
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#04b093] px-3.5 py-1 font-mono text-xs font-black uppercase text-black">
                    {activeArticle.category}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    {activeArticle.readTime}
                  </span>
                </div>

                {/* Large Bold Headline */}
                <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {activeArticle.headline}
                </h1>

                {/* Author Avatar Row */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-800 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-full border-2 border-[#04b093]">
                      <Image
                        src={activeArticle.author.avatar}
                        alt={activeArticle.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-white text-sm">
                        {activeArticle.author.name}
                      </p>
                      <p className="font-mono text-xs text-[#04b093]">
                        {activeArticle.author.role}
                      </p>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-zinc-400">
                    PUBLISHED: {activeArticle.date}
                  </div>
                </div>

                {/* Wide Cover Image with Rounded Corners */}
                <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-3xl border-2 border-zinc-800 bg-black shadow-2xl">
                  <Image
                    src={activeArticle.coverImage}
                    alt={activeArticle.headline}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Article Body */}
                <article className="prose prose-invert mt-8 max-w-none text-zinc-200">
                  {/* Bold Dateline Lead-in */}
                  <p className="text-lg sm:text-xl font-medium leading-relaxed text-zinc-100">
                    <strong className="font-black text-[#04b093] uppercase mr-2">
                      {activeArticle.dateline}
                    </strong>
                    {activeArticle.content.lead}
                  </p>

                  {/* Body Paragraphs */}
                  {activeArticle.content.paragraphs.map((para, i) => (
                    <p key={i} className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-300">
                      {para}
                    </p>
                  ))}

                  {/* Subheading & Subparagraphs */}
                  {activeArticle.content.subheading && (
                    <div className="mt-10">
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white border-l-4 border-[#04b093] pl-4">
                        {activeArticle.content.subheading}
                      </h2>
                      {activeArticle.content.subparagraphs?.map((subpara, j) => (
                        <p key={j} className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-300">
                          {subpara}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Bullet List */}
                  {activeArticle.content.bulletList && (
                    <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#0a1222] p-6">
                      <h4 className="font-mono text-xs font-black uppercase tracking-widest text-[#04b093]">
                        {activeArticle.content.bulletListTitle || "Key Observations:"}
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                        {activeArticle.content.bulletList.map((item, k) => (
                          <li key={k} className="flex items-start gap-2">
                            <span className="text-[#04b093] font-bold">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>

                {/* Comments Section inside Article */}
                <div className="mt-14 border-t border-zinc-800 pt-8">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#04b093]" />
                    <span>Reader Comments ({articleComments[activeArticle.id]?.length || 0})</span>
                  </h3>

                  {/* Comment List */}
                  <div className="mt-6 space-y-4">
                    {articleComments[activeArticle.id]?.map((c) => (
                      <div key={c.id} className="rounded-2xl border border-zinc-800 bg-[#0a1222] p-4">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                          <span className="font-bold text-white">{c.author}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-300">{c.text}</p>
                      </div>
                    ))}
                    {(!articleComments[activeArticle.id] || articleComments[activeArticle.id].length === 0) && (
                      <p className="font-mono text-xs text-zinc-500">Be the first to share your perspective on this wire dispatch.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Sidebar (30% width) */}
              <aside className="lg:col-span-4 flex flex-col gap-8">
                
                {/* SHARE TO Buttons */}
                <div className="rounded-3xl border-2 border-zinc-800 bg-[#0a1222] p-6 text-white shadow-lg">
                  <h4 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#04b093] flex items-center gap-2">
                    <Share2 size={14} />
                    <span>SHARE THIS DISPATCH</span>
                  </h4>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${activeArticle.headline} - CBM Radio: ${typeof window !== "undefined" ? window.location.href : ""}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-bold text-zinc-200 hover:border-[#04b093] hover:text-[#04b093] transition-colors"
                    >
                      <span>WhatsApp</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        activeArticle.headline
                      )}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-bold text-zinc-200 hover:border-[#04b093] hover:text-[#04b093] transition-colors"
                    >
                      <span>X (Twitter)</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-bold text-zinc-200 hover:border-[#04b093] hover:text-[#04b093] transition-colors"
                    >
                      <span>Facebook</span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent(activeArticle.headline)}&body=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : ""
                      )}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-bold text-zinc-200 hover:border-[#04b093] hover:text-[#04b093] transition-colors"
                    >
                      <span>Email</span>
                    </a>
                  </div>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="mt-3 w-full rounded-xl border border-zinc-700 bg-black px-4 py-2 font-mono text-xs font-bold uppercase text-white hover:border-[#04b093] hover:text-[#04b093] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} className="text-[#04b093]" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} />
                        <span>Copy Story Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* RELATED ARTICLES (5 rows) */}
                <div className="rounded-3xl border-2 border-zinc-800 bg-[#0a1222] p-6 text-white shadow-lg">
                  <h4 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#04b093] pb-3 border-b border-white/10">
                    RELATED ARTICLES
                  </h4>

                  <div className="divide-y divide-white/10 mt-2">
                    {relatedArticles.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          openArticle(rel);
                          if (articleOverlayRef.current) {
                            articleOverlayRef.current.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="group flex gap-3 py-3 hover:translate-x-1 transition-all cursor-pointer"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                          <Image src={rel.coverImage} alt={rel.headline} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-[0.6rem] uppercase text-zinc-400">
                            {rel.category}
                          </span>
                          <h5 className="text-xs font-bold uppercase text-white group-hover:text-[#04b093] transition-colors line-clamp-2">
                            {rel.headline}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </aside>

            </div>
          </main>

          {/* =========================================================================
              BOTTOM BAR FIXED TO SCREEN BOTTOM:
              - Like Button (toggles, keeps in memory)
              - Comments Count
              - Shares Count
              - "Write a comment..." Input + Send Button
              ========================================================================= */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-[#060c18]/95 px-4 py-3 backdrop-blur-md sm:px-8">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
              
              {/* Interaction Stats & Like Button */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleLike(activeArticle.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                    userLikes[activeArticle.id]?.liked
                      ? "border-[#04b093] bg-[#04b093] text-black shadow-[0_0_12px_rgba(4,176,147,0.4)]"
                      : "border-white/20 bg-white/5 text-white hover:border-[#04b093] hover:text-[#04b093]"
                  }`}
                >
                  <Heart size={14} className={userLikes[activeArticle.id]?.liked ? "fill-black" : ""} />
                  <span>{userLikes[activeArticle.id]?.count || 0}</span>
                </button>

                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <MessageSquare size={14} />
                  <span>{articleComments[activeArticle.id]?.length || 0}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <Share2 size={14} />
                  <span>{activeArticle.views > 1000 ? `${(activeArticle.views / 100).toFixed(0)}` : "120"}</span>
                </div>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex flex-1 max-w-md items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full rounded-full border border-zinc-700 bg-black/80 px-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-[#04b093] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="rounded-full border border-black bg-[#04b093] p-2 text-black hover:bg-white disabled:opacity-40 disabled:hover:bg-[#04b093] transition-all cursor-pointer"
                  aria-label="Submit comment"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>
          </div>

        </div>
      )}
    </section>
  );
}
