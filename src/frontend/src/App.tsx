import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Building2,
  ChevronUp,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Project, ProjectId } from "./backend";
import { useActor } from "./hooks/useActor";
import AdminPage from "./pages/AdminPage";

// ---------------------------------------------------------------------------
// Services data
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    image: "/assets/generated/service-construction-services.dim_800x500.jpg",
    title: "Construction Services",
    desc: "We provide complete construction services with a focus on quality, durability, and modern design. From planning to execution, we ensure every project is delivered with precision and excellence.",
  },
  {
    image:
      "/assets/generated/service-architectural-planning-v2.dim_800x500.jpg",
    title: "Architectural Planning",
    desc: "We Deliver Detailed Architectural Designs That Combine Innovation, Structural Integrity, And Practical Functionality.",
  },
  {
    image: "/assets/generated/service-waterproofing.dim_800x500.jpg",
    title: "Waterproofing Solutions",
    desc: "We provide advanced waterproofing solutions to protect your building from leakage, dampness, and water damage. Our services ensure long-lasting protection and improved building life.",
  },
  {
    image: "/assets/generated/service-interior-construction-v2.dim_800x500.jpg",
    title: "Interior Construction",
    desc: "We Create Functional And Modern Interior Spaces Using Quality Materials, Precise Planning, And Expert Craftsmanship.",
  },
  {
    image: "/assets/generated/service-renovation-remodeling.dim_800x500.jpg",
    title: "Renovation & Remodeling",
    desc: "We transform old and outdated spaces into modern, functional, and stylish environments. From minor upgrades to complete makeovers, we deliver high-quality renovation solutions tailored to your needs.",
  },
];

// ---------------------------------------------------------------------------
// Products data
// ---------------------------------------------------------------------------
// Selected product for detail page (module-level state)
let selectedProduct: (typeof PRODUCTS)[number] | null = null;
// Selected service for detail page (module-level state)
let selectedService: (typeof SERVICES)[number] | null = null;
// Selected project for detail page (module-level state)
let selectedProject: (typeof PROJECTS)[number] | null = null;

const PRODUCTS = [
  {
    image: "/assets/generated/product-interior-frame-v2.dim_800x600.jpg",
    badge: "INTERIOR",
    name: "Interior Frames",
    price: "₹12,500",
    availability: "In Stock",
    desc: "High-quality interior frames designed for durability and elegant indoor aesthetics.",
    fullDescription:
      "Our Interior Frames are crafted from premium wood and PVC materials, designed to withstand daily wear while maintaining their elegant finish. Suitable for modern homes, offices, and commercial spaces, these frames combine functionality with aesthetics to enhance any interior space.",
    details: [
      ["Material", "Wood / PVC"],
      ["Finish", "Smooth / Matte"],
      ["Usage", "Indoor"],
      ["Durability", "High"],
    ] as [string, string][],
  },
  {
    image: "/assets/generated/product-wooden-door-v2.dim_800x600.jpg",
    badge: "WOODEN",
    name: "Wooden Doors",
    price: "₹18,000",
    availability: "Only 3 left",
    desc: "Crafted with premium wood, our doors offer strength, security, and a timeless aesthetic.",
    fullDescription:
      "Handcrafted from solid hardwood, our Wooden Doors are built to last a lifetime. Each door is carefully finished with a polished coating to resist moisture, termites, and daily impact. Suitable for both residential and commercial installations, they bring warmth and class to any building.",
    details: [
      ["Material", "Solid Wood"],
      ["Style", "Classic / Modern"],
      ["Finish", "Polished"],
      ["Strength", "Heavy Duty"],
    ] as [string, string][],
  },
  {
    image: "/assets/generated/product-exterior-door-v2.dim_800x600.jpg",
    badge: "EXTERIOR",
    name: "Exterior Doors",
    price: "₹22,000",
    availability: "In Stock",
    desc: "Durable and weather-resistant exterior doors providing safety, insulation, and a strong first impression.",
    fullDescription:
      "Built for outdoor performance, our Exterior Doors are engineered with steel-reinforced cores and weatherproof sealing to withstand harsh conditions. They provide superior insulation, noise reduction, and security, making them ideal for main entrances of homes and commercial buildings.",
    details: [
      ["Material", "Steel / Wood"],
      ["Weather Resistance", "Yes"],
      ["Security", "High"],
      ["Usage", "Outdoor"],
    ] as [string, string][],
  },
];

// ---------------------------------------------------------------------------
// ScrollToTopButton with circular progress indicator
// ---------------------------------------------------------------------------
function ScrollToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Reset progress when route changes (page navigated to top)
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers reset intentionally
  useEffect(() => {
    setScrollProgress(0);
  }, [pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-attach listener on route change
  useEffect(() => {
    function onScroll() {
      const scrollTop =
        window.scrollY ?? document.documentElement.scrollTop ?? 0;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    // Call once on mount to sync state
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Show button only when user has scrolled at least a little
  const visible = scrollProgress > 1;

  if (!visible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - scrollProgress / 100);

  return (
    <button
      type="button"
      data-ocid="scroll_to_top.button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed z-50 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
      style={{
        bottom: "24px",
        right: "24px",
        width: "52px",
        height: "52px",
        backgroundColor: "oklch(0.97 0.01 80)",
        color: "oklch(0.28 0.02 60)",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 16px oklch(0.3 0.02 60 / 0.18)",
        padding: 0,
      }}
    >
      {/* SVG progress ring */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Background ring */}
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="oklch(0.88 0.02 60)"
          strokeWidth="2.5"
        />
        {/* Progress ring */}
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="oklch(0.42 0.08 155)"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transformOrigin: "26px 26px",
            transform: "rotate(-90deg)",
            transition: "stroke-dashoffset 0.1s ease",
          }}
        />
      </svg>
      {/* Up arrow */}
      <ChevronUp
        className="w-5 h-5"
        style={{ position: "relative", zIndex: 1 }}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Shared Header component
// ---------------------------------------------------------------------------
function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  function handleLogoClick() {
    navigate({ to: "/" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNavShop() {
    setMobileMenuOpen(false);
    navigate({ to: "/products" });
  }

  function handleNavServices() {
    setMobileMenuOpen(false);
    navigate({ to: "/services" });
  }

  function handleNavContact() {
    setMobileMenuOpen(false);
    navigate({ to: "/contact" });
  }

  function handleNavProjects() {
    setMobileMenuOpen(false);
    navigate({ to: "/projects" });
  }

  function handleNavAbout() {
    setMobileMenuOpen(false);
    if (currentPath === "/") {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate({ to: "/" });
      setTimeout(() => {
        const el = document.getElementById("about");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }

  return (
    <header
      data-ocid="nav.section"
      className="sticky top-0 z-40 w-full bg-card"
      style={{
        borderBottom: "1px solid oklch(0.93 0.01 80)",
        boxShadow: "0 1px 8px oklch(0.52 0.09 50 / 0.04)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.logo.link"
          onClick={handleLogoClick}
          className="flex items-center gap-1 flex-shrink-0 cursor-pointer"
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <img
            src="/assets/trevialogo-019d56b3-17e3-7435-a4db-304c47c47498.png"
            alt="Trevia Projects"
            style={{ height: "64px", width: "auto", objectFit: "contain" }}
          />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-xs hidden sm:flex items-center">
          {searchOpen ? (
            <div className="relative w-full flex items-center">
              <Search
                className="absolute left-2.5 w-3.5 h-3.5"
                style={{ color: "oklch(0.65 0.02 60)" }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search..."
                data-ocid="nav.search_input"
                className="w-full font-poppins rounded-full pl-8 pr-4 py-1.5 outline-none transition-all"
                style={{
                  fontSize: "12px",
                  border: "1px solid oklch(0.85 0.02 60)",
                  backgroundColor: "oklch(0.97 0.01 80)",
                  color: "oklch(0.22 0.01 60)",
                  letterSpacing: "0.02em",
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              data-ocid="nav.search_input"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              aria-label="Open search"
            >
              <Search
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.02 60)" }}
              />
              <span
                className="font-poppins hidden sm:inline"
                style={{
                  fontSize: "11px",
                  color: "oklch(0.65 0.02 60)",
                  letterSpacing: "0.1em",
                }}
              >
                Search
              </span>
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav
          className="hidden md:flex items-center"
          style={{ gap: "30px" }}
          aria-label="Main navigation"
        >
          {[
            { label: "SHOP", handler: handleNavShop },
            { label: "SERVICES", handler: handleNavServices },
            { label: "PROJECTS", handler: handleNavProjects },
            { label: "CONTACT", handler: handleNavContact },
            { label: "ABOUT", handler: handleNavAbout },
          ].map(({ label, handler }) => (
            <button
              key={label}
              type="button"
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className="font-poppins uppercase transition-colors"
              onClick={handler}
              style={{
                fontSize: "11px",
                fontWeight: 300,
                letterSpacing: "0.15em",
                color: "oklch(0.55 0.02 60)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.52 0.09 50)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.55 0.02 60)";
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right side — mobile menu only */}
        <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-6">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                data-ocid="nav.mobile_menu.button"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded transition-colors hover:opacity-70"
                aria-label="Open menu"
              >
                <Menu
                  className="w-5 h-5"
                  style={{ color: "oklch(0.52 0.09 50)" }}
                />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div
                  className="flex items-center px-6 py-4"
                  style={{ borderBottom: "1px solid oklch(0.90 0.01 80)" }}
                >
                  <img
                    src="/assets/trevialogo-019d56b3-17e3-7435-a4db-304c47c47498.png"
                    alt="Trevia Projects"
                    style={{
                      height: "36px",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Nav links */}
                <nav className="flex flex-col px-6 py-6 gap-1">
                  {[
                    { label: "SHOP", handler: handleNavShop },
                    { label: "SERVICES", handler: handleNavServices },
                    { label: "PROJECTS", handler: handleNavProjects },
                    { label: "CONTACT", handler: handleNavContact },
                    { label: "ABOUT", handler: handleNavAbout },
                  ].map(({ label, handler }) => (
                    <button
                      key={label}
                      type="button"
                      data-ocid={`nav.mobile.${label.toLowerCase()}.link`}
                      className="font-poppins uppercase text-left py-3 transition-colors hover:opacity-70"
                      style={{
                        fontSize: "12px",
                        fontWeight: 300,
                        letterSpacing: "0.2em",
                        color: "oklch(0.55 0.02 60)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        borderBottom: "1px solid oklch(0.93 0.01 80)",
                      }}
                      onClick={handler}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {/* Mobile Search */}
                <div
                  className="px-6 py-4"
                  style={{ borderTop: "1px solid oklch(0.90 0.01 80)" }}
                >
                  <div className="relative flex items-center">
                    <Search
                      className="absolute left-3 w-4 h-4"
                      style={{ color: "oklch(0.65 0.02 60)" }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSearchQuery("");
                        }
                      }}
                      placeholder="Search..."
                      className="w-full font-poppins rounded-full pl-10 pr-4 py-2.5 outline-none transition-all focus:ring-1"
                      style={{
                        fontSize: "13px",
                        border: "1px solid oklch(0.85 0.02 60)",
                        backgroundColor: "oklch(0.97 0.01 80)",
                        color: "oklch(0.22 0.01 60)",
                        letterSpacing: "0.02em",
                      }}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Shared Footer component
// ---------------------------------------------------------------------------
function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="text-white mt-auto"
      style={{ backgroundColor: "oklch(0.18 0.02 60)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/assets/trevialogo-019d56b3-17e3-7435-a4db-304c47c47498.png"
                alt="Trevia Projects"
                style={{
                  height: "56px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Bringing innovative architectural planning to life.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/" });
                    setTimeout(() => {
                      const el = document.getElementById("about");
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 150);
                  }}
                  className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/projects" })}
                  className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/products" })}
                  className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/contact" })}
                  className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Construction Services",
                "Interior Construction",
                "Architectural Planning",
                "Waterproofing Solutions",
                "Renovation & Remodeling",
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/services" })}
                    className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/contact" })}
                  className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                >
                  contact@treviaprojects.com
                </button>
              </li>
              <li className="text-sm text-white/60">+91 94909 00088</li>
              <li className="text-sm text-white/60">
                Guntur, Andhra Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Trevia Projects. All rights
            reserved.
          </p>
          <p>Built with ❤️ for Trevia Projects</p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// HeroSection component
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section
      data-ocid="hero.section"
      id="hero"
      className="w-full bg-card py-24 sm:py-32 flex flex-col items-center justify-center text-center px-4"
    >
      <h1
        className="font-cormorant font-bold uppercase tracking-[0.12em] text-foreground leading-none"
        style={{ fontSize: "clamp(28px, 7vw, 96px)" }}
      >
        trevia projects
      </h1>

      <div
        className="mt-3 flex items-center justify-center gap-0"
        style={{ width: "100%", maxWidth: "min(90vw, 500px)" }}
      >
        <div
          className="flex-1 h-px"
          style={{
            maxWidth: "clamp(40px, 8vw, 120px)",
            backgroundColor: "oklch(0.82 0.03 60)",
          }}
        />
        <span
          className="font-script mx-4 sm:mx-6"
          style={{
            fontSize: "34px",
            color: "oklch(0.52 0.09 50)",
            lineHeight: 1.2,
          }}
        >
          Live Brighter
        </span>
        <div
          className="flex-1 h-px"
          style={{
            maxWidth: "clamp(40px, 8vw, 120px)",
            backgroundColor: "oklch(0.82 0.03 60)",
          }}
        />
      </div>

      <p
        className="font-poppins font-light text-muted-foreground tracking-[0.05em] w-full"
        style={{
          fontSize: "13px",
          marginTop: "18px",
          maxWidth: "min(90%, 480px)",
        }}
      >
        Bringing innovative architectural planning to life
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// OurServices section — shows all 5 services, no pagination slider
// ---------------------------------------------------------------------------
function OurServicesSection({
  showViewAll = false,
}: { showViewAll?: boolean }) {
  const navigate = useNavigate();

  function handleServiceClick(service: (typeof SERVICES)[number]) {
    selectedService = service;
    navigate({ to: "/service-detail" });
  }

  return (
    <section
      data-ocid="services.section"
      id="services"
      className="w-full py-16 px-4 sm:px-6"
      style={{ backgroundColor: "oklch(0.97 0.01 80)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="font-cormorant uppercase tracking-[0.18em]"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              color: "oklch(0.22 0.01 60)",
            }}
          >
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <button
              type="button"
              key={service.title}
              data-ocid={`services.item.${i + 1}`}
              className={`rounded-xl overflow-hidden shadow-md cursor-pointer text-left p-0 w-full${i === 4 ? " lg:col-start-2" : ""}`}
              style={{ border: "none", background: "transparent" }}
              aria-label={`View details for ${service.title}`}
              onClick={() => handleServiceClick(service)}
            >
              <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div
                className="p-6"
                style={{ backgroundColor: "oklch(0.42 0.08 155)" }}
              >
                <h3
                  className="font-cormorant italic"
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: "10px",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.65,
                  }}
                >
                  {service.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {showViewAll && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              data-ocid="services.view_all.button"
              onClick={() => navigate({ to: "/services" })}
              className="font-poppins uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "oklch(0.42 0.08 155)",
                border: "1px solid oklch(0.42 0.08 155)",
                borderRadius: "2px",
                padding: "10px 32px",
                background: "transparent",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              View All Services
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
// ---------------------------------------------------------------------------
// OurProducts section
// ---------------------------------------------------------------------------
function OurProductsSection({
  showViewAll = false,
}: { showViewAll?: boolean }) {
  const navigate = useNavigate();

  return (
    <section
      data-ocid="products.section"
      id="products"
      className="w-full py-20 px-4 sm:px-6 bg-card"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="font-cormorant uppercase tracking-[0.18em]"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              color: "oklch(0.22 0.01 60)",
            }}
          >
            Our Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, i) => (
            <button
              type="button"
              key={product.name}
              data-ocid={`products.item.${i + 1}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer text-left w-full"
              style={{
                transition:
                  "transform 220ms ease-out, box-shadow 220ms ease-out",
                padding: 0,
              }}
              aria-label={`View details for ${product.name}`}
              onClick={() => {
                selectedProduct = product;
                navigate({ to: "/product-detail" });
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 32px oklch(0.3 0.02 60 / 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 font-poppins text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    letterSpacing: "0.1em",
                    backgroundColor: "rgba(0,0,0,0.82)",
                  }}
                >
                  {product.badge}
                </span>
              </div>

              <div className="p-6">
                <h3
                  className="font-cormorant font-semibold"
                  style={{
                    fontSize: "22px",
                    color: "oklch(0.18 0.01 60)",
                    marginBottom: "8px",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  className="font-poppins"
                  style={{
                    fontSize: "13px",
                    color: "oklch(0.50 0.02 60)",
                    lineHeight: 1.65,
                    marginBottom: "16px",
                  }}
                >
                  {product.desc}
                </p>

                <div
                  className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden"
                  style={{ border: "1px solid oklch(0.92 0.01 80)" }}
                >
                  {product.details.map(([key, value], di) => (
                    <div
                      key={key}
                      className="px-3 py-2.5"
                      style={{
                        backgroundColor:
                          di % 2 === 0
                            ? "oklch(0.97 0.01 80)"
                            : "oklch(0.99 0.005 80)",
                        borderRight:
                          di % 2 === 0
                            ? "1px solid oklch(0.92 0.01 80)"
                            : "none",
                        borderBottom:
                          di < 2 ? "1px solid oklch(0.92 0.01 80)" : "none",
                      }}
                    >
                      <p
                        className="font-poppins uppercase"
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.1em",
                          color: "oklch(0.60 0.02 60)",
                          marginBottom: "2px",
                          fontWeight: 600,
                        }}
                      >
                        {key}
                      </p>
                      <p
                        className="font-poppins"
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "oklch(0.25 0.01 60)",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* View All button */}
        {showViewAll && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              data-ocid="products.view_all.button"
              onClick={() => navigate({ to: "/products" })}
              className="font-poppins uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "oklch(0.52 0.09 50)",
                border: "1px solid oklch(0.52 0.09 50)",
                borderRadius: "2px",
                padding: "10px 32px",
                background: "transparent",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PROJECTS data
// ---------------------------------------------------------------------------
const PROJECTS = [
  {
    id: 1,
    title: "Greenfield Villa",
    type: "Residential Villa",
    location: "Guntur, AP",
    status: "Completed",
    year: "Completed 2024",
    area: "4,200 sq.ft",
    desc: "Luxury villa with modern architecture, premium interiors, and a manicured landscaped garden — crafted for refined living.",
    image: "/assets/generated/project-villa-completed.dim_800x500.jpg",
    client: "Mr. Rajesh Kumar",
    materials: [
      "RCC Structure",
      "AAC Blocks",
      "Marble Flooring",
      "Teak Wood",
      "Aluminium Windows",
    ],
    gallery: [
      "/assets/generated/project-villa-completed.dim_800x500.jpg",
      "/assets/generated/project-commercial-completed.dim_800x500.jpg",
      "/assets/generated/project-apartment-completed.dim_800x500.jpg",
    ],
  },
  {
    id: 2,
    title: "Horizon Office Complex",
    type: "Commercial Building",
    location: "Vijayawada, AP",
    status: "Completed",
    year: "Completed 2023",
    area: "12,000 sq.ft",
    desc: "Contemporary office complex with glass facade, modern amenities, and energy-efficient design built for thriving businesses.",
    image: "/assets/generated/project-commercial-completed.dim_800x500.jpg",
    client: "Horizon Enterprises Pvt. Ltd.",
    materials: [
      "Steel Frame",
      "Glass Facade",
      "Granite Flooring",
      "Structural Glass",
      "ACP Panels",
    ],
    gallery: [
      "/assets/generated/project-commercial-completed.dim_800x500.jpg",
      "/assets/generated/project-villa-completed.dim_800x500.jpg",
      "/assets/generated/project-commercial-ongoing.dim_800x500.jpg",
    ],
  },
  {
    id: 3,
    title: "Skyline Residency",
    type: "Apartment Complex",
    location: "Guntur, AP",
    status: "Completed",
    year: "Completed 2024",
    area: "24 Units",
    desc: "Premium 24-unit apartment complex with modern amenities, underground parking, and a stunning rooftop terrace.",
    image: "/assets/generated/project-apartment-completed.dim_800x500.jpg",
    client: "Skyline Builders & Developers",
    materials: [
      "RCC Frame",
      "Fly Ash Bricks",
      "Vitrified Tiles",
      "UPVC Windows",
      "Cement Plaster",
    ],
    gallery: [
      "/assets/generated/project-apartment-completed.dim_800x500.jpg",
      "/assets/generated/project-villa-ongoing.dim_800x500.jpg",
      "/assets/generated/project-renovation-ongoing.dim_800x500.jpg",
    ],
  },
  {
    id: 4,
    title: "Palm Grove Estate",
    type: "Luxury Villa",
    location: "Guntur, AP",
    status: "Ongoing",
    year: "Est. Dec 2025",
    area: "5,500 sq.ft",
    desc: "5,500 sq.ft premium villa with pool, smart home integration, and contemporary elevation design for a discerning client.",
    image: "/assets/generated/project-villa-ongoing.dim_800x500.jpg",
    client: "Mr. Suresh Reddy",
    materials: [
      "Premium RCC",
      "Natural Stone",
      "Italian Marble",
      "Smart Home Wiring",
      "Infinity Pool Tiles",
    ],
    gallery: [
      "/assets/generated/project-villa-ongoing.dim_800x500.jpg",
      "/assets/generated/project-villa-completed.dim_800x500.jpg",
      "/assets/generated/project-apartment-completed.dim_800x500.jpg",
    ],
  },
  {
    id: 5,
    title: "Central Square Mall",
    type: "Commercial Complex",
    location: "Vijayawada, AP",
    status: "Ongoing",
    year: "Est. Mar 2026",
    area: "45,000 sq.ft",
    desc: "45,000 sq.ft multi-level commercial complex with retail, office, and food court spaces — a landmark in the making.",
    image: "/assets/generated/project-commercial-ongoing.dim_800x500.jpg",
    client: "Central Realty Group",
    materials: [
      "Steel Structure",
      "Curtain Wall Glass",
      "Polished Concrete",
      "HVAC Systems",
      "Epoxy Flooring",
    ],
    gallery: [
      "/assets/generated/project-commercial-ongoing.dim_800x500.jpg",
      "/assets/generated/project-commercial-completed.dim_800x500.jpg",
      "/assets/generated/project-villa-completed.dim_800x500.jpg",
    ],
  },
  {
    id: 6,
    title: "Modern Haven Renovation",
    type: "Interior Renovation",
    location: "Hyderabad, TS",
    status: "Ongoing",
    year: "Est. Jun 2025",
    area: "3,200 sq.ft",
    desc: "Complete home transformation spanning 3,200 sq.ft — modular kitchen, premium flooring, false ceilings, and modern interiors.",
    image: "/assets/generated/project-renovation-ongoing.dim_800x500.jpg",
    client: "Mr. & Mrs. Prasad",
    materials: [
      "Gypsum False Ceiling",
      "Wooden Laminate Flooring",
      "Modular Kitchen Panels",
      "PVC Wall Panels",
      "LED Track Lighting",
    ],
    gallery: [
      "/assets/generated/project-renovation-ongoing.dim_800x500.jpg",
      "/assets/generated/project-villa-completed.dim_800x500.jpg",
      "/assets/generated/project-apartment-completed.dim_800x500.jpg",
    ],
  },
];

// ---------------------------------------------------------------------------
// ProjectDetailPage - Full page for project details
// ---------------------------------------------------------------------------
function ProjectDetailPage() {
  const navigate = useNavigate();
  const project = selectedProject ?? PROJECTS[0];
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<
    string | null
  >(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleContactWhatsApp() {
    const msg = encodeURIComponent(
      `Hello, I am interested in your project:\n\nProject: ${project.title}\nType: ${project.type}\nLocation: ${project.location}\n\nPlease share more details.`,
    );
    window.open(`https://wa.me/919490900088?text=${msg}`, "_blank");
  }

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        backgroundColor: "oklch(0.97 0.005 80)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Header />

      {/* Back button */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px 0" }}
      >
        <button
          type="button"
          data-ocid="project_detail.back.button"
          onClick={() => navigate({ to: "/projects" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "oklch(0.45 0.08 60)",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          ← Back to Projects
        </button>
      </div>

      {/* Hero Section */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "24px auto 0",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "21/7",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, oklch(0.10 0.02 60 / 0.75) 0%, oklch(0.10 0.02 60 / 0.25) 60%, transparent 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "clamp(20px, 4vw, 48px)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                marginBottom: "10px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#ffffff",
                backgroundColor:
                  project.status === "Completed"
                    ? "oklch(0.45 0.14 155)"
                    : "oklch(0.60 0.18 55)",
                borderRadius: "99px",
                padding: "4px 14px",
                width: "fit-content",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {project.status}
            </span>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.15,
                maxWidth: "600px",
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(12px, 1.4vw, 15px)",
                color: "rgba(255,255,255,0.80)",
                marginTop: "10px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {project.type} · {project.location}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "48px auto 0",
          padding: "0 16px",
        }}
      >
        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {[
            { label: "Area", value: project.area },
            { label: "Type", value: project.type },
            { label: "Location", value: project.location },
            { label: "Timeline", value: project.year },
            { label: "Client", value: project.client },
          ].map((info) => (
            <div
              key={info.label}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "22px 24px",
                border: "1px solid oklch(0.91 0.01 80)",
                boxShadow: "0 2px 12px oklch(0.3 0.02 60 / 0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(0.60 0.04 60)",
                  margin: "0 0 6px",
                  fontWeight: 500,
                }}
              >
                {info.label}
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "oklch(0.18 0.01 60)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {info.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "clamp(28px, 4vw, 48px)",
            border: "1px solid oklch(0.91 0.01 80)",
            boxShadow: "0 2px 16px oklch(0.3 0.02 60 / 0.06)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              margin: "0 0 16px",
              letterSpacing: "0.04em",
            }}
          >
            Project Overview
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "15px",
              color: "oklch(0.38 0.02 60)",
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            {project.desc}
          </p>
        </div>

        {/* Materials Used */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "clamp(28px, 4vw, 48px)",
            border: "1px solid oklch(0.91 0.01 80)",
            boxShadow: "0 2px 16px oklch(0.3 0.02 60 / 0.06)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              margin: "0 0 20px",
              letterSpacing: "0.04em",
            }}
          >
            Materials Used
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {project.materials.map((mat) => (
              <span
                key={mat}
                style={{
                  backgroundColor: "oklch(0.96 0.01 80)",
                  border: "1px solid oklch(0.88 0.02 60)",
                  borderRadius: "99px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  color: "oklch(0.35 0.04 60)",
                  fontWeight: 500,
                }}
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "clamp(28px, 4vw, 48px)",
            border: "1px solid oklch(0.91 0.01 80)",
            boxShadow: "0 2px 16px oklch(0.3 0.02 60 / 0.06)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              margin: "0 0 20px",
              letterSpacing: "0.04em",
            }}
          >
            Project Gallery
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {project.gallery.map((img, idx) => (
              <button
                key={img}
                type="button"
                data-ocid={`project_detail.gallery.item.${idx + 1}`}
                onClick={() => setSelectedGalleryImage(img)}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  aspectRatio: "16/10",
                  boxShadow: "0 2px 12px oklch(0.3 0.02 60 / 0.10)",
                  padding: 0,
                  border: "none",
                  background: "none",
                  display: "block",
                  width: "100%",
                }}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 300ms ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1)";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox overlay */}
        {selectedGalleryImage && (
          <dialog
            data-ocid="project_detail.gallery.modal"
            open
            onClick={() => setSelectedGalleryImage(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelectedGalleryImage(null);
            }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              cursor: "zoom-out",
              border: "none",
              maxWidth: "100vw",
              maxHeight: "100vh",
              width: "100vw",
              height: "100vh",
              margin: 0,
            }}
          >
            <img
              src={selectedGalleryImage}
              alt="Gallery preview"
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: "16px",
                objectFit: "contain",
                boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
              }}
            />
            <button
              type="button"
              data-ocid="project_detail.gallery.close_button"
              onClick={() => setSelectedGalleryImage(null)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                color: "#fff",
                fontSize: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </dialog>
        )}

        {/* WhatsApp Contact */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "60px",
          }}
        >
          <button
            type="button"
            data-ocid="project_detail.contact.button"
            onClick={handleContactWhatsApp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "oklch(0.50 0.16 155)",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "16px 40px",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 4px 20px oklch(0.50 0.16 155 / 0.30)",
              transition:
                "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 28px oklch(0.50 0.16 155 / 0.40)";
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "oklch(0.46 0.16 155)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px oklch(0.50 0.16 155 / 0.30)";
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "oklch(0.50 0.16 155)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <title>WhatsApp</title>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.553 4.101 1.519 5.828L0 24l6.335-1.662A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Enquire on WhatsApp
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProjectsSection({ showViewAll = false }: { showViewAll?: boolean }) {
  const navigate = useNavigate();
  return (
    <section
      data-ocid="projects.section"
      id="projects"
      className="w-full py-20 px-4 sm:px-6"
      style={{ backgroundColor: "oklch(0.97 0.01 80)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2
            className="font-cormorant uppercase tracking-[0.18em]"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              color: "oklch(0.22 0.01 60)",
            }}
          >
            Our Projects
          </h2>
          <p
            className="font-poppins mt-2"
            style={{
              fontSize: "13px",
              color: "oklch(0.52 0.04 60)",
              letterSpacing: "0.08em",
            }}
          >
            Ongoing Developments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {PROJECTS.filter((p) => p.status === "Ongoing").map((project, i) => (
            <div
              key={project.id}
              data-ocid={`projects.item.${i + 1}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
              style={{
                border: "1px solid oklch(0.92 0.01 80)",
                transition:
                  "transform 220ms ease-out, box-shadow 220ms ease-out",
              }}
              onClick={() => {
                selectedProject = project;
                navigate({ to: "/project-detail" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectedProject = project;
                  navigate({ to: "/project-detail" });
                }
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 32px oklch(0.3 0.02 60 / 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 font-poppins text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    letterSpacing: "0.08em",
                    backgroundColor:
                      project.status === "Completed"
                        ? "oklch(0.45 0.14 155)"
                        : "oklch(0.60 0.18 55)",
                  }}
                >
                  {project.status}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="font-cormorant font-semibold"
                    style={{
                      fontSize: "20px",
                      color: "oklch(0.18 0.01 60)",
                      lineHeight: 1.2,
                    }}
                  >
                    {project.title}
                  </h3>
                  <span
                    className="font-poppins shrink-0"
                    style={{
                      fontSize: "11px",
                      color: "oklch(0.55 0.06 55)",
                      fontWeight: 500,
                      marginTop: "3px",
                    }}
                  >
                    {project.year}
                  </span>
                </div>
                <p
                  className="font-poppins"
                  style={{
                    fontSize: "12px",
                    color: "oklch(0.55 0.02 60)",
                    marginBottom: "8px",
                  }}
                >
                  {project.type} · {project.location}
                </p>
                <p
                  className="font-poppins"
                  style={{
                    fontSize: "13px",
                    color: "oklch(0.40 0.02 60)",
                    lineHeight: 1.65,
                  }}
                >
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              data-ocid="projects.view_all.button"
              onClick={() => navigate({ to: "/projects" })}
              className="font-poppins uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "oklch(0.52 0.09 50)",
                border: "1px solid oklch(0.52 0.09 50)",
                borderRadius: "2px",
                padding: "10px 32px",
                background: "transparent",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ProjectsPage
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ProjectsPage
// ---------------------------------------------------------------------------
function ProjectsPageComponent() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"All" | "Completed" | "Ongoing">("All");
  const filtered =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.status === filter);

  return (
    <PageShell>
      <section
        data-ocid="projects.page"
        className="w-full pt-14 pb-2 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.98 0.008 80)" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="font-poppins uppercase tracking-[0.22em] mb-2"
            style={{ fontSize: "11px", color: "oklch(0.65 0.02 60)" }}
          >
            Our Work
          </p>
          <h1
            className="font-cormorant"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              letterSpacing: "0.04em",
            }}
          >
            Our Projects
          </h1>
        </div>
      </section>

      <section
        className="w-full py-10 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.98 0.008 80)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="flex justify-center gap-3 mb-10"
            data-ocid="projects.filter.tab"
          >
            {(["All", "Completed", "Ongoing"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className="font-poppins uppercase tracking-widest transition-all"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "8px 24px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  border:
                    filter === tab
                      ? "1px solid oklch(0.52 0.09 50)"
                      : "1px solid oklch(0.82 0.02 60)",
                  backgroundColor:
                    filter === tab ? "oklch(0.52 0.09 50)" : "transparent",
                  color: filter === tab ? "white" : "oklch(0.52 0.04 60)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <div
                key={project.id}
                data-ocid={`projects.item.${i + 1}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                style={{
                  border: "1px solid oklch(0.92 0.01 80)",
                  transition:
                    "transform 220ms ease-out, box-shadow 220ms ease-out",
                }}
                onClick={() => {
                  selectedProject = project;
                  navigate({ to: "/project-detail" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    selectedProject = project;
                    navigate({ to: "/project-detail" });
                  }
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px oklch(0.3 0.02 60 / 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-3 left-3 font-poppins text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      letterSpacing: "0.08em",
                      backgroundColor:
                        project.status === "Completed"
                          ? "oklch(0.45 0.14 155)"
                          : "oklch(0.60 0.18 55)",
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className="font-cormorant font-semibold"
                      style={{
                        fontSize: "20px",
                        color: "oklch(0.18 0.01 60)",
                        lineHeight: 1.2,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="font-poppins shrink-0"
                      style={{
                        fontSize: "11px",
                        color: "oklch(0.55 0.06 55)",
                        fontWeight: 500,
                        marginTop: "3px",
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p
                    className="font-poppins"
                    style={{
                      fontSize: "12px",
                      color: "oklch(0.55 0.02 60)",
                      marginBottom: "8px",
                    }}
                  >
                    {project.type} · {project.location}
                  </p>
                  <p
                    className="font-poppins"
                    style={{
                      fontSize: "13px",
                      color: "oklch(0.40 0.02 60)",
                      lineHeight: 1.65,
                    }}
                  >
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div data-ocid="projects.empty_state" className="text-center py-20">
              <p
                className="font-poppins"
                style={{ color: "oklch(0.55 0.02 60)", fontSize: "15px" }}
              >
                No projects found.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              type="button"
              data-ocid="projects.back.button"
              onClick={() => navigate({ to: "/" })}
              className="font-poppins uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "oklch(0.52 0.09 50)",
                border: "1px solid oklch(0.52 0.09 50)",
                borderRadius: "2px",
                padding: "10px 32px",
                background: "transparent",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// AboutUs section
// ---------------------------------------------------------------------------
function AboutUsSection() {
  const navigate = useNavigate();

  const serviceLinks = [
    "Construction Services",
    "Architectural Planning",
    "Waterproofing Solutions",
    "Interior Construction",
    "Renovation & Remodeling",
  ];

  return (
    <section
      data-ocid="about.section"
      id="about"
      className="w-full py-24 px-4 sm:px-8 relative overflow-hidden"
      style={{ backgroundColor: "oklch(0.96 0.02 80)" }}
    >
      <div
        className="absolute left-0 top-0 h-full w-8 md:w-16 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, oklch(0.88 0.02 80 / 0.35) 0px, oklch(0.88 0.02 80 / 0.35) 1px, transparent 1px, transparent 12px)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-8 md:w-16 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, oklch(0.88 0.02 80 / 0.35) 0px, oklch(0.88 0.02 80 / 0.35) 1px, transparent 1px, transparent 12px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Text content: left side */}
        <div className="flex-1 flex flex-col items-start text-left">
          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              letterSpacing: "0.04em",
              marginBottom: "24px",
            }}
          >
            Trevia Projects
          </h2>

          <p
            className="font-poppins"
            style={{
              fontSize: "15px",
              color: "oklch(0.38 0.02 60)",
              lineHeight: 1.85,
              marginBottom: "18px",
            }}
          >
            Trevia Projects is a trusted construction company delivering
            high-quality residential, commercial, and infrastructure solutions.
            We specialize in modern architectural planning, durable exterior and
            interior construction, and complete building development from
            foundation to finish.
          </p>
          <p
            className="font-poppins"
            style={{
              fontSize: "15px",
              color: "oklch(0.38 0.02 60)",
              lineHeight: 1.85,
              marginBottom: "32px",
            }}
          >
            With a strong focus on quality, safety, and innovation, we ensure
            every project is executed with precision and efficiency. Our
            commitment to excellence and client satisfaction makes us a reliable
            partner for all types of construction needs.
          </p>

          <p
            className="font-cormorant italic"
            style={{
              fontSize: "18px",
              color: "oklch(0.38 0.02 60)",
              marginBottom: "18px",
              letterSpacing: "0.04em",
            }}
          >
            Explore Our Services
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3 mb-12">
            {serviceLinks.map((link) => (
              <button
                key={link}
                type="button"
                data-ocid="about.services.link"
                onClick={() => navigate({ to: "/services" })}
                className="font-poppins transition-opacity hover:opacity-70"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "oklch(0.42 0.10 155)",
                  textDecoration: "underline",
                  textDecorationColor: "oklch(0.42 0.10 155 / 0.35)",
                  textUnderlineOffset: "4px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full">
            <div
              className="h-px flex-1"
              style={{
                maxWidth: "80px",
                backgroundColor: "oklch(0.72 0.04 60)",
              }}
            />
            <span style={{ fontSize: "16px", color: "oklch(0.52 0.09 50)" }}>
              ✦
            </span>
            <div
              className="h-px flex-1"
              style={{
                maxWidth: "80px",
                backgroundColor: "oklch(0.72 0.04 60)",
              }}
            />
          </div>
        </div>

        {/* Logo: right side, centered vertically */}
        <div className="flex-shrink-0 flex items-center justify-center md:w-64 lg:w-80">
          <img
            src="/assets/logo_01-019d5818-1097-742e-a17c-a7cc8ed3c613.png"
            alt="Trevia Projects Logo"
            style={{
              maxWidth: "280px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 4px 16px oklch(0.52 0.09 50 / 0.18))",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ContactUs section
// ---------------------------------------------------------------------------
function ContactUsSection() {
  const STEPS = [
    {
      key: "name",
      question: "What's your name?",
      type: "text",
      placeholder: "Your full name",
    },
    {
      key: "email",
      question: "How can we reach you?",
      type: "email",
      placeholder: "Your email address",
    },
    {
      key: "phone",
      question: "And your phone number?",
      type: "tel",
      placeholder: "10-digit mobile number",
    },
    {
      key: "interested",
      question: "What are you looking for?",
      type: "select",
      options: [
        "Construction Services",
        "Architectural Planning",
        "Waterproofing Solutions",
        "Interior Construction",
        "Renovation & Remodeling",
        "General Enquiry",
      ],
    },
    {
      key: "message",
      question: "Tell us about your project.",
      type: "textarea",
      placeholder: "Describe your project, timeline, budget...",
    },
  ] as const;

  type StepKey = (typeof STEPS)[number]["key"];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    name: "",
    email: "",
    phone: "",
    interested: "",
    message: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [typedQuestion, setTypedQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const step = STEPS[currentStep];

  // Typewriter effect for question
  // biome-ignore lint/correctness/useExhaustiveDependencies: STEPS is a stable const
  useEffect(() => {
    if (submitted) return;
    const question = STEPS[currentStep].question;
    setTypedQuestion("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedQuestion(question.slice(0, i));
      if (i >= question.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 100);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [currentStep, submitted]);

  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  function advanceStep(value?: string) {
    const val = value ?? inputValue;
    if (!val.trim()) return;

    const key = STEPS[currentStep].key;

    // Validate based on key
    if (key === "name") {
      if (val.trim().length < 2) {
        setError("Name must be at least 2 characters.");
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(val.trim())) {
        setError("Name should contain only letters.");
        return;
      }
    }

    if (key === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (key === "phone") {
      const digits = val.replace(/\D/g, "");
      if (digits.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }
    }

    if (key === "message") {
      if (val.trim().length < 10) {
        setError("Please provide at least 10 characters.");
        return;
      }
    }

    setError("");
    const updated = { ...answers, [key]: val };
    setAnswers(updated);

    if (currentStep < STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setInputValue("");
        setError("");
        setIsTransitioning(false);
      }, 320);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        try {
          const submissions = JSON.parse(
            localStorage.getItem("trevia_contact_submissions") || "[]",
          );
          submissions.push({
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            interested: updated.interested,
            message: updated.message,
            date: new Date().toISOString(),
            status: "new",
          });
          localStorage.setItem(
            "trevia_contact_submissions",
            JSON.stringify(submissions),
          );
        } catch (_e) {
          /* ignore */
        }
        toast.success("Message sent! We'll get back to you soon.");
        setSubmitted(true);
        setIsTransitioning(false);
      }, 320);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (step.type === "textarea") {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        advanceStep();
      }
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
        advanceStep();
      }
    }
  }

  function goBack() {
    if (currentStep === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const prevStep = currentStep - 1;
      const prevKey = STEPS[prevStep].key;
      setCurrentStep(prevStep);
      setInputValue(answers[prevKey] ?? "");
      setError("");
      setIsTransitioning(false);
    }, 320);
  }

  const completedAnswers = STEPS.slice(0, currentStep)
    .map((s) => answers[s.key])
    .filter(Boolean);

  if (submitted) {
    return (
      <section
        data-ocid="contact.section"
        id="contact"
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "oklch(0.97 0.01 80)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, oklch(0.88 0.03 80 / 0.5) 0%, transparent 60%), radial-gradient(ellipse at 75% 20%, oklch(0.92 0.02 75 / 0.4) 0%, transparent 50%)",
          }}
        />
        <div
          data-ocid="contact.success_state"
          className="relative z-10 text-center px-6"
          style={{ animation: "contactFadeUp 0.8s ease forwards" }}
        >
          <div className="flex justify-center mb-10">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Success checkmark"
              role="img"
            >
              <title>Success checkmark</title>
              <circle
                cx="36"
                cy="36"
                r="34"
                stroke="oklch(0.52 0.09 50)"
                strokeWidth="1.5"
                style={{
                  strokeDasharray: 214,
                  strokeDashoffset: 0,
                  animation: "contactDrawCircle 1s ease forwards",
                }}
              />
              <path
                d="M22 36L31 45L50 27"
                stroke="oklch(0.52 0.09 50)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 40,
                  strokeDashoffset: 40,
                  animation: "contactDrawCheck 0.5s 0.9s ease forwards",
                }}
              />
            </svg>
          </div>

          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 400,
              color: "oklch(0.18 0.01 60)",
              lineHeight: 1.1,
              fontStyle: "italic",
              marginBottom: "20px",
            }}
          >
            Thank you, {answers.name}.
          </h2>
          <p
            className="font-poppins"
            style={{
              fontSize: "15px",
              color: "oklch(0.50 0.02 60)",
              letterSpacing: "0.06em",
              marginBottom: "48px",
            }}
          >
            We&apos;ll be in touch shortly.
          </p>

          <div className="inline-flex flex-wrap gap-3 justify-center max-w-lg">
            {[answers.email, answers.phone, answers.interested]
              .filter(Boolean)
              .map((val) => (
                <span
                  key={val}
                  className="font-poppins"
                  style={{
                    fontSize: "11px",
                    color: "oklch(0.50 0.02 60)",
                    letterSpacing: "0.05em",
                    padding: "6px 14px",
                    border: "1px solid oklch(0.85 0.02 75)",
                    borderRadius: "999px",
                    backgroundColor: "oklch(1 0 0)",
                  }}
                >
                  {val}
                </span>
              ))}
          </div>
        </div>

        <style>{`
          @keyframes contactDrawCircle {
            from { stroke-dashoffset: 214; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes contactDrawCheck {
            to { stroke-dashoffset: 0; }
          }
          @keyframes contactFadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      data-ocid="contact.section"
      id="contact"
      className="w-full min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "oklch(0.97 0.01 80)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 60%, oklch(0.88 0.03 80 / 0.5) 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, oklch(0.92 0.02 75 / 0.4) 0%, transparent 45%)",
        }}
      />

      {/* Top contact strip */}
      <div
        className="relative z-10 w-full px-8 md:px-16 pt-10 pb-6 flex flex-wrap items-center gap-6 md:gap-10"
        style={{ borderBottom: "1px solid oklch(0.88 0.02 75)" }}
      >
        <div className="flex items-center gap-2.5">
          <MapPin
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "oklch(0.52 0.09 50)" }}
          />
          <span
            className="font-poppins"
            style={{
              fontSize: "11px",
              color: "oklch(0.50 0.02 60)",
              letterSpacing: "0.06em",
            }}
          >
            Guntur, Andhra Pradesh, India
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Mail
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "oklch(0.52 0.09 50)" }}
          />
          <span
            className="font-poppins"
            style={{
              fontSize: "11px",
              color: "oklch(0.50 0.02 60)",
              letterSpacing: "0.06em",
            }}
          >
            contact@treviaprojects.com
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "oklch(0.52 0.09 50)" }}
          />
          <span
            className="font-poppins"
            style={{
              fontSize: "11px",
              color: "oklch(0.50 0.02 60)",
              letterSpacing: "0.06em",
            }}
          >
            +91 94909 00088
          </span>
        </div>

        <div className="ml-auto">
          <span
            className="font-poppins tabular-nums"
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "oklch(0.65 0.02 60)",
            }}
          >
            <span style={{ color: "oklch(0.52 0.09 50)", fontWeight: 600 }}>
              0{currentStep + 1}
            </span>{" "}
            / <span>0{STEPS.length}</span>
          </span>
        </div>
      </div>

      {/* Main form area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-16">
        <div
          className="max-w-3xl"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(12px)" : "translateY(0)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          {/* Question */}
          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(32px, 5.5vw, 64px)",
              fontWeight: 400,
              color: "oklch(0.18 0.01 60)",
              lineHeight: 1.15,
              marginBottom: "48px",
              minHeight: "1.15em",
              fontStyle: "italic",
              letterSpacing: "-0.01em",
            }}
          >
            {typedQuestion}
            {isTyping && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "0.8em",
                  backgroundColor: "oklch(0.52 0.09 50)",
                  marginLeft: "3px",
                  verticalAlign: "middle",
                  animation: "contactBlink 0.9s step-end infinite",
                }}
              />
            )}
          </h2>

          {/* Input area */}
          {step.type === "select" ? (
            <div>
              <div className="flex flex-wrap gap-3" data-ocid="contact.select">
                {"options" in step &&
                  step.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => advanceStep(opt)}
                      className="font-poppins transition-all"
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.04em",
                        padding: "12px 22px",
                        border: "1px solid oklch(0.82 0.03 75)",
                        borderRadius: "999px",
                        backgroundColor: "oklch(1 0 0)",
                        color: "oklch(0.40 0.02 60)",
                        cursor: "pointer",
                        transition:
                          "border-color 0.2s, color 0.2s, background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        const btn = e.currentTarget;
                        btn.style.borderColor = "oklch(0.52 0.09 50)";
                        btn.style.color = "oklch(0.18 0.01 60)";
                        btn.style.backgroundColor = "oklch(0.95 0.02 75)";
                      }}
                      onMouseLeave={(e) => {
                        const btn = e.currentTarget;
                        btn.style.borderColor = "oklch(0.82 0.03 75)";
                        btn.style.color = "oklch(0.40 0.02 60)";
                        btn.style.backgroundColor = "oklch(1 0 0)";
                      }}
                    >
                      {opt}
                    </button>
                  ))}
              </div>
              {currentStep > 0 && (
                <button
                  type="button"
                  data-ocid="contact.back_button"
                  onClick={goBack}
                  className="font-poppins mt-6 inline-flex items-center gap-3 transition-all"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.62 0.02 60)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "oklch(0.40 0.02 60)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "oklch(0.62 0.02 60)";
                  }}
                >
                  <span style={{ fontSize: "14px" }}>&#8592;</span>
                  Back
                </button>
              )}
            </div>
          ) : step.type === "textarea" ? (
            <div>
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                data-ocid="contact.textarea"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={step.placeholder as string}
                rows={4}
                className="w-full font-poppins bg-transparent resize-none outline-none"
                style={{
                  fontSize: "clamp(16px, 2.2vw, 22px)",
                  color: "oklch(0.18 0.01 60)",
                  borderBottom: "1px solid oklch(0.78 0.03 75)",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  padding: "12px 0",
                  caretColor: "oklch(0.52 0.09 50)",
                  lineHeight: 1.6,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor =
                    "oklch(0.52 0.09 50)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor =
                    "oklch(0.78 0.03 75)";
                }}
              />
              {error && (
                <p
                  className="font-poppins mt-2"
                  style={{
                    fontSize: "12px",
                    color: "oklch(0.55 0.18 25)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {error}
                </p>
              )}
              <p
                className="font-poppins mt-4"
                style={{
                  fontSize: "11px",
                  color: "oklch(0.65 0.02 60)",
                  letterSpacing: "0.06em",
                }}
              >
                Ctrl + Enter ↵ to continue
              </p>
            </div>
          ) : (
            <div>
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                data-ocid="contact.input"
                type={step.type}
                value={inputValue}
                onChange={(e) => {
                  if (step.key === "phone") {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setInputValue(digits);
                  } else {
                    setInputValue(e.target.value);
                  }
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={step.placeholder as string}
                maxLength={step.key === "phone" ? 10 : undefined}
                className="w-full font-poppins bg-transparent outline-none"
                style={{
                  fontSize: "clamp(18px, 2.8vw, 28px)",
                  color: "oklch(0.18 0.01 60)",
                  borderBottom: "1px solid oklch(0.78 0.03 75)",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  padding: "12px 0",
                  caretColor: "oklch(0.52 0.09 50)",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor =
                    "oklch(0.52 0.09 50)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor =
                    "oklch(0.78 0.03 75)";
                }}
              />
              {error && (
                <p
                  className="font-poppins mt-2"
                  style={{
                    fontSize: "12px",
                    color: "oklch(0.55 0.18 25)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {error}
                </p>
              )}
              <p
                className="font-poppins mt-4"
                style={{
                  fontSize: "11px",
                  color: "oklch(0.65 0.02 60)",
                  letterSpacing: "0.06em",
                }}
              >
                Press Enter ↵ to continue
              </p>
            </div>
          )}

          {/* Action buttons: Next/Submit + Back stacked vertically */}
          {step.type !== "select" && (
            <div className="flex flex-col items-start mt-8 gap-4">
              <button
                type="button"
                data-ocid={
                  currentStep === STEPS.length - 1
                    ? "contact.submit_button"
                    : "contact.primary_button"
                }
                onClick={() => advanceStep()}
                disabled={!inputValue.trim()}
                className="font-poppins inline-flex items-center gap-3 transition-all"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: inputValue.trim()
                    ? "oklch(0.52 0.09 50)"
                    : "oklch(0.72 0.02 60)",
                  background: "transparent",
                  border: "none",
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                  padding: 0,
                  transition: "color 0.2s",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    backgroundColor: "currentColor",
                  }}
                />
                {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
                <span style={{ fontSize: "16px" }}>&#8594;</span>
              </button>

              {currentStep > 0 && (
                <button
                  type="button"
                  data-ocid="contact.back_button"
                  onClick={goBack}
                  className="font-poppins inline-flex items-center gap-3 transition-all"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.62 0.02 60)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "oklch(0.40 0.02 60)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "oklch(0.62 0.02 60)";
                  }}
                >
                  <span style={{ fontSize: "14px" }}>&#8592;</span>
                  Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-10 w-full h-px"
        style={{ backgroundColor: "oklch(0.88 0.02 75)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${(currentStep / STEPS.length) * 100}%`,
            backgroundColor: "oklch(0.52 0.09 50)",
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      {/* Previous answers breadcrumb */}
      {completedAnswers.length > 0 && (
        <div
          className="relative z-10 w-full px-8 md:px-16 py-4 flex flex-wrap items-center gap-2"
          style={{ backgroundColor: "oklch(0.94 0.01 80)" }}
        >
          {/* biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list */}
          {completedAnswers.map((ans, i) => (
            <span key={ans} className="flex items-center gap-2">
              <span
                className="font-poppins"
                style={{
                  fontSize: "11px",
                  color: "oklch(0.50 0.02 60)",
                  letterSpacing: "0.04em",
                }}
              >
                {ans}
              </span>
              {i < completedAnswers.length - 1 && (
                <span
                  style={{
                    color: "oklch(0.72 0.02 60)",
                    fontSize: "10px",
                  }}
                >
                  &middot;
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes contactBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Page shell (header + children + footer + scroll-to-top)
// ---------------------------------------------------------------------------
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-poppins flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route page components
// ---------------------------------------------------------------------------
function HomePageComponent() {
  return (
    <div className="page-enter">
      <PageShell>
        <HeroSection />
        <OurServicesSection showViewAll />
        <OurProductsSection showViewAll />
        <ProjectsSection showViewAll />
        <AboutUsSection />
      </PageShell>
    </div>
  );
}

function ContactPageComponent() {
  return (
    <PageShell>
      <ContactUsSection />
    </PageShell>
  );
}

function ProductsPageComponent() {
  return (
    <PageShell>
      <section
        data-ocid="products.page"
        className="w-full pt-14 pb-2 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.98 0.008 80)" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="font-poppins uppercase tracking-[0.22em] mb-2"
            style={{ fontSize: "11px", color: "oklch(0.65 0.02 60)" }}
          >
            Our Products
          </p>
          <h1
            className="font-cormorant"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              letterSpacing: "0.04em",
            }}
          >
            Premium Construction Products
          </h1>
        </div>
      </section>
      <OurProductsSection />
    </PageShell>
  );
}

function ServicesPageComponent() {
  const navigate = useNavigate();

  function handleServiceClick(service: (typeof SERVICES)[number]) {
    selectedService = service;
    navigate({ to: "/service-detail" });
  }

  return (
    <PageShell>
      <section
        data-ocid="services.page"
        className="w-full py-16 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.97 0.01 80)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="font-poppins uppercase tracking-[0.22em] mb-3"
              style={{ fontSize: "11px", color: "oklch(0.65 0.02 60)" }}
            >
              What We Offer
            </p>
            <h1
              className="font-cormorant uppercase tracking-[0.18em]"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 600,
                color: "oklch(0.18 0.01 60)",
              }}
            >
              Our Services
            </h1>
            <p
              className="font-poppins max-w-2xl mx-auto mt-6"
              style={{
                fontSize: "14px",
                color: "oklch(0.50 0.02 60)",
                lineHeight: 1.75,
              }}
            >
              From architectural planning to road infrastructure, we deliver
              end-to-end construction solutions with precision and excellence.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* First row: 3 services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.slice(0, 3).map((service, i) => (
                <button
                  type="button"
                  key={service.title}
                  data-ocid={`services.item.${i + 1}`}
                  className="rounded-xl overflow-hidden shadow-md min-w-0 cursor-pointer text-left w-full p-0"
                  style={{ border: "none", background: "transparent" }}
                  aria-label={`View details for ${service.title}`}
                  onClick={() => handleServiceClick(service)}
                >
                  <div
                    className="overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className="p-6"
                    style={{ backgroundColor: "oklch(0.42 0.08 155)" }}
                  >
                    <h3
                      className="font-cormorant italic"
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: "10px",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.65,
                      }}
                    >
                      {service.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Second row: 2 services centered */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {SERVICES.slice(3).map((service, i) => (
                <button
                  type="button"
                  key={service.title}
                  data-ocid={`services.item.${3 + i + 1}`}
                  className="rounded-xl overflow-hidden shadow-md cursor-pointer text-left p-0 w-full sm:w-auto"
                  style={{
                    border: "none",
                    background: "transparent",
                    maxWidth: "400px",
                    flexShrink: 0,
                    flexBasis: "calc(33.333% - 8px)",
                  }}
                  aria-label={`View details for ${service.title}`}
                  onClick={() => handleServiceClick(service)}
                >
                  <div
                    className="overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className="p-6"
                    style={{ backgroundColor: "oklch(0.42 0.08 155)" }}
                  >
                    <h3
                      className="font-cormorant italic"
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: "10px",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.65,
                      }}
                    >
                      {service.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
// Service pricing data
// ---------------------------------------------------------------------------
const SERVICE_PRICING: Record<
  string,
  {
    tagline: string;
    areas?: string[];
    plans: Array<{
      name: string;
      price: string;
      features: string[];
      highlight?: boolean;
      note?: string;
    }>;
  }
> = {
  "Waterproofing Solutions": {
    tagline:
      "We provide advanced waterproofing solutions to protect your building from leakage, dampness, and water damage. Our services ensure long-lasting protection and improved building life.",
    areas: [
      "Roof & Terrace",
      "Bathrooms & Kitchens",
      "Basements",
      "External Walls",
      "Water Tanks",
    ],
    plans: [
      {
        name: "Standard Plan",
        price: "₹79 / sq.ft",
        features: [
          "Ideal for homes with moderate water issues",
          "Chemical waterproofing treatment",
          "Roof & wall protection",
          "Crack filling & sealing",
          "Better durability",
        ],
      },
      {
        name: "Premium Plan",
        price: "₹129 / sq.ft",
        features: [
          "Complete protection for long-term performance",
          "Advanced waterproofing system",
          "Heat-resistant & anti-leak coating",
          "Suitable for roof, basement & walls",
          "High-quality materials",
        ],
        highlight: true,
      },
      {
        name: "Complete Protection Plan",
        price: "₹149 / sq.ft (Starting From)",
        features: [
          "Surface cleaning & preparation",
          "Crack repair & sealing",
          "Full roof waterproofing",
          "Basement & wall protection",
          "Bathroom & water tank treatment",
          "Final protective coating",
          "Long-lasting durability",
        ],
        note: "Best for: Complete building waterproofing solution",
      },
    ],
  },
  "Interior Construction": {
    tagline:
      "We create functional and modern interior spaces using quality materials, precise planning, and expert craftsmanship.",
    plans: [
      {
        name: "Basic Plan",
        price: "₹799 / sq.ft",
        features: [
          "Basic interior framework",
          "Standard fittings",
          "Simple ceiling work",
          "Basic painting",
          "Standard flooring",
          "1 Revision",
        ],
      },
      {
        name: "Standard Plan",
        price: "₹1,299 / sq.ft",
        features: [
          "Quality materials",
          "Modern designs",
          "False ceiling work",
          "Premium painting",
          "Quality flooring",
          "2–3 Revisions",
        ],
        highlight: true,
      },
      {
        name: "Premium Plan",
        price: "₹1,999 / sq.ft",
        features: [
          "Luxury interior",
          "Premium finishes",
          "Designer false ceiling",
          "High-end painting",
          "Imported flooring",
          "Unlimited revisions",
        ],
      },
    ],
  },
  "Renovation & Remodeling": {
    tagline:
      "We transform old and outdated spaces into modern, functional, and stylish environments. From minor upgrades to complete makeovers, we deliver high-quality renovation solutions tailored to your needs.",
    plans: [
      {
        name: "Standard Plan",
        price: "₹899 / sq.ft",
        features: [
          "Ideal for partial renovation & upgrades",
          "Wall repairs & repainting",
          "Basic flooring upgrades",
          "Bathroom & kitchen improvements",
          "Minor electrical & plumbing work",
          "Improved finishing",
        ],
      },
      {
        name: "Premium Plan",
        price: "₹1,499 / sq.ft",
        features: [
          "Best for full home renovation",
          "Complete interior remodeling",
          "Flooring replacement & modern finishes",
          "Modular kitchen & wardrobe upgrades",
          "Electrical & plumbing rework",
          "False ceiling & lighting",
          "High-quality materials",
        ],
        highlight: true,
      },
      {
        name: "Complete Renovation Plan",
        price: "₹1,999 / sq.ft (Starting From)",
        features: [
          "Site inspection & planning",
          "Demolition & structural modifications",
          "Complete redesign (interior & layout)",
          "Full electrical & plumbing setup",
          "Premium flooring, painting & finishes",
          "Doors, windows & fittings replacement",
          "Final touch & ready-to-use handover",
        ],
        note: "Best for: Complete home or commercial space transformation",
      },
    ],
  },
  "Construction Services": {
    tagline:
      "We provide complete construction services with a focus on quality, durability, and modern design. From planning to execution, we ensure every project is delivered with precision and excellence.",
    plans: [
      {
        name: "Standard Plan",
        price: "₹1,999 / sq.ft",
        features: [
          "Ideal for modern residential construction",
          "Strong RCC structure",
          "Quality construction materials",
          "Modern elevation design",
          "Basic electrical & plumbing",
          "Standard flooring & finishing",
        ],
      },
      {
        name: "Premium Plan",
        price: "₹2,799 / sq.ft",
        features: [
          "Best for high-quality and stylish construction",
          "Premium construction materials",
          "Designer elevation",
          "Advanced electrical & plumbing",
          "High-quality flooring & finishing",
          "Better durability & aesthetics",
        ],
        highlight: true,
      },
      {
        name: "Complete Turnkey Plan",
        price: "₹2,999 / sq.ft (Starting From)",
        features: [
          "Site preparation & foundation work",
          "Full structural construction (RCC, walls, slab)",
          "Electrical & plumbing complete setup",
          "Interior & exterior finishing",
          "Doors, windows & fittings installation",
          "Painting & final touch works",
          "Quality checks & supervision",
          "Ready-to-move-in delivery",
        ],
        note: "Best for: Hassle-free, end-to-end construction solution",
      },
    ],
  },
  "Architectural Planning": {
    tagline:
      "We deliver detailed architectural designs that combine innovation, structural integrity, and practical functionality.",
    plans: [
      {
        name: "Basic Plan",
        price: "₹25,000",
        features: [
          "Basic floor plan",
          "2D drawings",
          "Site layout plan",
          "Basic structural layout",
          "Digital delivery",
          "1 Revision",
        ],
      },
      {
        name: "Standard Plan",
        price: "₹55,000",
        features: [
          "Detailed 2D/3D plans",
          "Structural drawings",
          "Electrical layout",
          "Plumbing layout",
          "Digital + print delivery",
          "3 Revisions",
        ],
        highlight: true,
      },
      {
        name: "Premium Plan",
        price: "₹1,20,000",
        features: [
          "Complete project planning",
          "3D visualization",
          "Site supervision plan",
          "All structural drawings",
          "Interior design guide",
          "Unlimited revisions",
        ],
      },
    ],
  },
};

const WHY_CHOOSE_US = [
  { icon: "✔", label: "High-Quality Workmanship" },
  { icon: "✔", label: "Experienced Team" },
  { icon: "✔", label: "On-Time Delivery" },
  { icon: "✔", label: "Transparent Pricing" },
  { icon: "✔", label: "Customized Solutions" },
  { icon: "✔", label: "End-to-End Service" },
];

// ---------------------------------------------------------------------------
// Service Detail Page
// ---------------------------------------------------------------------------
function ServiceDetailPage() {
  const navigate = useNavigate();
  const service = selectedService ?? SERVICES[0];
  const pricing =
    SERVICE_PRICING[service.title] ??
    SERVICE_PRICING["Waterproofing Solutions"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleChoosePlan(planName: string, planPrice: string) {
    const msg = encodeURIComponent(
      `Hello, I am interested in your service:\n\nService: ${service.title}\nPlan: ${planName}\nPrice: ${planPrice}\n\nPlease share more details.`,
    );
    window.open(`https://wa.me/919490900088?text=${msg}`, "_blank");
  }

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        backgroundColor: "oklch(0.97 0.005 80)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Header />

      {/* Back button */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px 0" }}
      >
        <button
          type="button"
          data-ocid="service_detail.back.button"
          onClick={() => navigate({ to: "/services" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "oklch(0.45 0.08 60)",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          ← Back to Services
        </button>
      </div>

      {/* Hero Section */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "24px auto 0",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "21/7",
          }}
        >
          <img
            src={service.image}
            alt={service.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, oklch(0.10 0.02 60 / 0.75) 0%, oklch(0.10 0.02 60 / 0.25) 60%, transparent 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "clamp(20px, 4vw, 48px)",
            }}
          >
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.15,
                maxWidth: "600px",
              }}
            >
              {service.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(13px, 1.6vw, 16px)",
                color: "rgba(255,255,255,0.85)",
                marginTop: "12px",
                maxWidth: "520px",
                lineHeight: 1.7,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {pricing.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "56px auto 0",
          padding: "0 16px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            Choose Your Plan
          </h2>
          <div
            style={{
              width: "60px",
              height: "2px",
              backgroundColor: "oklch(0.42 0.08 155)",
              margin: "14px auto 0",
              borderRadius: "2px",
            }}
          />
          <p
            style={{
              fontSize: "14px",
              color: "oklch(0.50 0.02 60)",
              marginTop: "14px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Select the plan that best fits your requirements and budget.
          </p>
        </div>

        <div
          data-ocid="service_detail.plans.section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {pricing.plans.map((plan, idx) => (
            <div
              key={plan.name}
              data-ocid={`service_detail.plan.${idx + 1}`}
              style={{
                borderRadius: "16px",
                backgroundColor: plan.highlight
                  ? "oklch(0.42 0.08 155)"
                  : "oklch(1 0 0)",
                border: plan.highlight
                  ? "2px solid oklch(0.42 0.08 155)"
                  : "1.5px solid oklch(0.90 0.01 80)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: plan.highlight
                  ? "0 8px 32px oklch(0.42 0.08 155 / 0.25)"
                  : "0 2px 12px oklch(0.3 0.02 60 / 0.06)",
                position: "relative",
                transform: plan.highlight ? "scale(1.02)" : "scale(1)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "oklch(0.65 0.15 50)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    padding: "4px 16px",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: plan.highlight
                      ? "rgba(255,255,255,0.75)"
                      : "oklch(0.55 0.02 60)",
                    margin: 0,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {plan.name}
                </p>
                <p
                  style={{
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: 700,
                    color: plan.highlight ? "#ffffff" : "oklch(0.20 0.01 60)",
                    margin: "8px 0 0",
                    fontFamily: "Cormorant Garamond, serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {plan.price}
                </p>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                }}
              >
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "13px",
                      color: plan.highlight
                        ? "rgba(255,255,255,0.88)"
                        : "oklch(0.38 0.02 60)",
                      fontFamily: "Poppins, sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "14px",
                        color: plan.highlight
                          ? "rgba(255,255,255,0.9)"
                          : "oklch(0.42 0.10 155)",
                        marginTop: "1px",
                      }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.note && (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: plan.highlight
                      ? "rgba(255,255,255,0.85)"
                      : "oklch(0.45 0.08 155)",
                    fontFamily: "Poppins, sans-serif",
                    margin: "4px 0 0",
                    fontStyle: "italic",
                  }}
                >
                  {plan.note}
                </p>
              )}
              <button
                type="button"
                data-ocid={`service_detail.choose_plan.button.${idx + 1}`}
                onClick={() => handleChoosePlan(plan.name, plan.price)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  border: plan.highlight
                    ? "none"
                    : "1.5px solid oklch(0.42 0.12 145)",
                  backgroundColor: plan.highlight
                    ? "oklch(0.97 0.005 80)"
                    : "oklch(0.42 0.12 145)",
                  color: plan.highlight ? "oklch(0.30 0.08 155)" : "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.04em",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow: plan.highlight
                    ? "none"
                    : "0 3px 12px oklch(0.42 0.12 145 / 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Areas We Cover */}
      {pricing.areas && pricing.areas.length > 0 && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "56px auto 0",
            padding: "0 16px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 600,
                color: "oklch(0.18 0.01 60)",
                margin: 0,
                letterSpacing: "0.04em",
              }}
            >
              🛠️ Areas We Cover
            </h2>
            <div
              style={{
                width: "60px",
                height: "2px",
                backgroundColor: "oklch(0.42 0.08 155)",
                margin: "14px auto 0",
                borderRadius: "2px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {pricing.areas.map((area) => (
              <div
                key={area}
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1.5px solid oklch(0.90 0.01 80)",
                  borderRadius: "12px",
                  padding: "16px 28px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "oklch(0.25 0.02 60)",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow: "0 2px 8px oklch(0.3 0.02 60 / 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{ color: "oklch(0.42 0.08 155)", fontSize: "16px" }}
                >
                  ✓
                </span>
                {area}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "72px auto 0",
          padding: "0 16px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 600,
              color: "oklch(0.18 0.01 60)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            Why Choose Us
          </h2>
          <div
            style={{
              width: "60px",
              height: "2px",
              backgroundColor: "oklch(0.52 0.09 50)",
              margin: "14px auto 0",
              borderRadius: "2px",
            }}
          />
        </div>

        <div
          data-ocid="service_detail.why_us.section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                backgroundColor: "oklch(1 0 0)",
                borderRadius: "12px",
                padding: "20px 24px",
                border: "1px solid oklch(0.92 0.01 80)",
                boxShadow: "0 2px 8px oklch(0.3 0.02 60 / 0.05)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "oklch(0.42 0.08 155 / 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "16px",
                  color: "oklch(0.42 0.08 155)",
                  fontWeight: 700,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "oklch(0.25 0.02 60)",
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail Page
// ---------------------------------------------------------------------------
function ProductDetailPage() {
  const navigate = useNavigate();
  const product = selectedProduct ?? PRODUCTS[0];
  const [buying, setBuying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBuyNow = () => {
    setBuying(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const msg = encodeURIComponent(
            `Hello, I want to buy this product:\n\nProduct Name: ${product.name}\nPrice: ${product.price}\nDescription: ${product.desc}`,
          );
          window.open(`https://wa.me/919490900088?text=${msg}`, "_blank");
          setBuying(false);
          return 0;
        }
        return p + 5;
      });
    }, 60);
  };

  const isLow = product.availability.toLowerCase().includes("only");

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        backgroundColor: "oklch(0.97 0.005 80)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Header />

      {/* Breadcrumb */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px 0" }}
      >
        <button
          type="button"
          data-ocid="product_detail.back.button"
          onClick={() => navigate({ to: "/products" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "oklch(0.45 0.08 60)",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          ← Back to Products
        </button>
      </div>

      {/* Product Content */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Left: Image */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 32px oklch(0.3 0.02 60 / 0.12)",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1)";
              }}
            />
          </div>

          {/* Right: Details */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Badge */}
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: "oklch(0.92 0.02 80)",
                color: "oklch(0.38 0.06 60)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                width: "fit-content",
              }}
            >
              {product.badge}
            </span>

            {/* Name */}
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 600,
                color: "oklch(0.18 0.01 60)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "oklch(0.25 0.02 60)",
                margin: 0,
              }}
            >
              {product.price}
            </p>

            {/* Availability */}
            <span
              data-ocid="product_detail.availability"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                width: "fit-content",
                fontSize: "13px",
                fontWeight: 500,
                backgroundColor: isLow
                  ? "oklch(0.95 0.05 50)"
                  : "oklch(0.92 0.08 145)",
                color: isLow ? "oklch(0.45 0.12 40)" : "oklch(0.30 0.10 145)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isLow
                    ? "oklch(0.6 0.15 40)"
                    : "oklch(0.5 0.15 145)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {product.availability}
            </span>

            {/* Full Description */}
            <p
              style={{
                fontSize: "15px",
                color: "oklch(0.38 0.02 60)",
                lineHeight: 1.8,
                margin: 0,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {product.fullDescription}
            </p>

            {/* Specifications */}
            <div>
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "oklch(0.45 0.02 60)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Specifications
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {product.details.map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      backgroundColor: "oklch(0.94 0.01 80)",
                      borderRadius: "10px",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "oklch(0.52 0.02 60)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {key}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "oklch(0.22 0.02 60)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Now Button */}
            <div style={{ marginTop: "8px" }}>
              <button
                type="button"
                data-ocid="product_detail.buy_now.button"
                onClick={handleBuyNow}
                disabled={buying}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: buying
                    ? "oklch(0.55 0.15 145)"
                    : "oklch(0.45 0.15 145)",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: buying ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px oklch(0.45 0.15 145 / 0.3)",
                  letterSpacing: "0.04em",
                  fontFamily: "Poppins, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!buying) {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 28px oklch(0.45 0.15 145 / 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 20px oklch(0.45 0.15 145 / 0.3)";
                }}
              >
                {/* Progress bar overlay */}
                {buying && (
                  <div
                    data-ocid="product_detail.buy_now.loading_state"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "oklch(0.38 0.15 145)",
                      transition: "width 0.06s linear",
                      borderRadius: "12px",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  {buying
                    ? "Connecting to WhatsApp..."
                    : "Buy Now via WhatsApp"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root route component
// ---------------------------------------------------------------------------
function RootRoute() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname scroll reset is intentional
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Outlet />
      <ScrollToTopButton />
    </>
  );
}

// ---------------------------------------------------------------------------
// Router setup
// ---------------------------------------------------------------------------
const rootRoute = createRootRoute({ component: RootRoute });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePageComponent,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPageComponent,
});
const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPageComponent,
});
const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPageComponent,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/authority",
  component: AdminPage,
});
const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product-detail",
  component: ProductDetailPage,
});

const serviceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/service-detail",
  component: ServiceDetailPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project-detail",
  component: ProjectDetailPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPageComponent,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  contactRoute,
  productsRoute,
  servicesRoute,
  adminRoute,
  productDetailRoute,
  serviceDetailRoute,
  projectDetailRoute,
  projectsRoute,
]);

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------
export default function App() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
