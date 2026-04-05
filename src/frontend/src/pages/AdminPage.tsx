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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Building2,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export interface AdminProduct {
  image: string;
  badge: string;
  name: string;
  price: string;
  availability: string;
  desc: string;
  fullDescription: string;
  details: [string, string][];
}

export interface AdminService {
  image: string;
  title: string;
  desc: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  interested: string;
  message: string;
  date: string;
  status?: "new" | "replied";
}

interface LandingPageSettings {
  heroHeading: string;
  heroTagline: string;
  heroSubtext: string;
  heroCtaText: string;
  aboutHeading: string;
  aboutText: string;
  servicesHeading: string;
  servicesSubtext: string;
  productsHeading: string;
  productsSubtext: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerTagline: string;
}

type AdminSection =
  | "overview"
  | "products"
  | "services"
  | "contacts"
  | "landing"
  | "media";

// -------------------------------------------------------------------------
// Default data
// -------------------------------------------------------------------------

const DEFAULT_PRODUCTS: AdminProduct[] = [
  {
    image: "/assets/generated/product-interior-frame-v2.dim_800x600.jpg",
    badge: "INTERIOR",
    name: "Interior Frames",
    price: "₹12,500",
    availability: "In Stock",
    desc: "High-quality interior frames designed for durability and elegant indoor aesthetics.",
    fullDescription:
      "Our Interior Frames are crafted from premium wood and PVC materials, designed to withstand daily wear while maintaining their elegant finish.",
    details: [
      ["Material", "Wood / PVC"],
      ["Finish", "Smooth / Matte"],
      ["Usage", "Indoor"],
      ["Durability", "High"],
    ],
  },
  {
    image: "/assets/generated/product-wooden-door-v2.dim_800x600.jpg",
    badge: "WOODEN",
    name: "Wooden Doors",
    price: "₹18,000",
    availability: "Only 3 left",
    desc: "Crafted with premium wood, our doors offer strength, security, and a timeless aesthetic.",
    fullDescription:
      "Handcrafted from solid hardwood, our Wooden Doors are built to last a lifetime. Each door is carefully finished with a polished coating.",
    details: [
      ["Material", "Solid Wood"],
      ["Style", "Classic / Modern"],
      ["Finish", "Polished"],
      ["Strength", "Heavy Duty"],
    ],
  },
  {
    image: "/assets/generated/product-exterior-door-v2.dim_800x600.jpg",
    badge: "EXTERIOR",
    name: "Exterior Doors",
    price: "₹25,000",
    availability: "In Stock",
    desc: "Premium exterior doors built for durability, weather resistance, and modern aesthetics.",
    fullDescription:
      "Our Exterior Doors combine security and design. Made from reinforced materials with weather-resistant coatings.",
    details: [
      ["Material", "Steel / Hardwood"],
      ["Style", "Modern"],
      ["Weather Resistance", "High"],
      ["Security", "Premium"],
    ],
  },
];

const DEFAULT_SERVICES: AdminService[] = [
  {
    image: "/assets/generated/service-construction-services.dim_800x500.jpg",
    title: "Construction Services",
    desc: "We provide complete construction services with a focus on quality, durability, and modern design.",
  },
  {
    image:
      "/assets/generated/service-architectural-planning-v2.dim_800x500.jpg",
    title: "Architectural Planning",
    desc: "We deliver detailed architectural designs that combine innovation, structural integrity, and practical functionality.",
  },
  {
    image: "/assets/generated/service-waterproofing.dim_800x500.jpg",
    title: "Waterproofing Solutions",
    desc: "We provide advanced waterproofing solutions to protect your building from leakage, dampness, and water damage.",
  },
  {
    image: "/assets/generated/service-interior-construction-v2.dim_800x500.jpg",
    title: "Interior Construction",
    desc: "We create functional and modern interior spaces using quality materials, precise planning, and expert craftsmanship.",
  },
  {
    image: "/assets/generated/service-renovation-remodeling.dim_800x500.jpg",
    title: "Renovation & Remodeling",
    desc: "We transform old and outdated spaces into modern, functional, and stylish environments.",
  },
];

const DEFAULT_LANDING: LandingPageSettings = {
  heroHeading: "trevia projects",
  heroTagline: "Live Brighter",
  heroSubtext:
    "Premium construction & architectural planning for residential, commercial, and infrastructure projects.",
  heroCtaText: "Explore Our Services",
  aboutHeading: "About Trevia Projects",
  aboutText:
    "Trevia Projects is a trusted construction company delivering high-quality residential, commercial, and infrastructure solutions.",
  servicesHeading: "OUR SERVICES",
  servicesSubtext: "End-to-end construction solutions tailored to your needs.",
  productsHeading: "OUR PRODUCTS",
  productsSubtext: "Premium doors, frames, and finishing materials.",
  footerEmail: "contact@treviaprojects.com",
  footerPhone: "+91 90005 64939",
  footerAddress: "Trevia Projects, Guntur, Andhra Pradesh, India",
  footerTagline: "Building dreams with precision and excellence.",
};

// -------------------------------------------------------------------------
// Storage helpers
// -------------------------------------------------------------------------

function getStoredProducts(): AdminProduct[] {
  try {
    const s = localStorage.getItem("trevia_products");
    if (s) return JSON.parse(s);
  } catch {
    /* noop */
  }
  localStorage.setItem("trevia_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}
function saveStoredProducts(p: AdminProduct[]) {
  localStorage.setItem("trevia_products", JSON.stringify(p));
}

function getStoredServices(): AdminService[] {
  try {
    const s = localStorage.getItem("trevia_services");
    if (s) return JSON.parse(s);
  } catch {
    /* noop */
  }
  localStorage.setItem("trevia_services", JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
}
function saveStoredServices(s: AdminService[]) {
  localStorage.setItem("trevia_services", JSON.stringify(s));
}

function getStoredContacts(): ContactSubmission[] {
  try {
    const s = localStorage.getItem("trevia_contact_submissions");
    if (s) return JSON.parse(s);
  } catch {
    /* noop */
  }
  return [];
}
function saveStoredContacts(c: ContactSubmission[]) {
  localStorage.setItem("trevia_contact_submissions", JSON.stringify(c));
}

function getStoredLanding(): LandingPageSettings {
  try {
    const s = localStorage.getItem("trevia_landing_page");
    if (s) return { ...DEFAULT_LANDING, ...JSON.parse(s) };
  } catch {
    /* noop */
  }
  return DEFAULT_LANDING;
}
function saveStoredLanding(s: LandingPageSettings) {
  localStorage.setItem("trevia_landing_page", JSON.stringify(s));
  localStorage.setItem(
    "trevia_site_settings",
    JSON.stringify({
      heroHeading: s.heroHeading,
      heroTagline: s.heroTagline,
      heroSubtext: s.heroSubtext,
      aboutText: s.aboutText,
    }),
  );
}

// -------------------------------------------------------------------------
// Design tokens
// -------------------------------------------------------------------------
const T = {
  bg: "oklch(0.97 0.008 75)",
  card: "#ffffff",
  sidebarBg: "oklch(0.13 0.015 60)",
  sidebarTxt: "oklch(0.68 0.02 60)",
  sidebarActiveTxt: "#ffffff",
  sidebarActiveBg: "oklch(0.22 0.025 60)",
  sidebarHoverBg: "oklch(0.18 0.02 60)",
  textPrimary: "oklch(0.18 0.01 60)",
  textSecondary: "oklch(0.50 0.02 60)",
  textMuted: "oklch(0.65 0.02 60)",
  border: "oklch(0.91 0.01 80)",
  borderStrong: "oklch(0.85 0.02 80)",
  accent: "oklch(0.42 0.08 155)",
  accentHover: "oklch(0.38 0.09 155)",
  accentWarm: "oklch(0.55 0.12 55)",
  accentBlue: "oklch(0.48 0.12 260)",
  danger: "oklch(0.52 0.18 22)",
  shadow: "0 2px 12px oklch(0.3 0.02 60 / 0.07)",
  shadowMd: "0 4px 24px oklch(0.3 0.02 60 / 0.10)",
  radius: "14px",
  fontDisp: "Cormorant Garamond, Georgia, serif",
  fontBody: "Poppins, system-ui, sans-serif",
};

// -------------------------------------------------------------------------
// Field helpers
// -------------------------------------------------------------------------
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: T.fontBody,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: T.textSecondary,
        margin: "0 0 6px",
      }}
    >
      {children}
    </p>
  );
}

// -------------------------------------------------------------------------
// PIN Login Screen
// -------------------------------------------------------------------------
function PinLoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const CORRECT_PIN = "123456";

  function handleDigit(d: string) {
    if (pin.length >= 6 || success) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 6) {
      if (next === CORRECT_PIN) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 600);
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setPin("");
          setShake(false);
          setError(false);
        }, 800);
      }
    }
  }
  function handleBack() {
    if (!success) {
      setPin((p) => p.slice(0, -1));
      setError(false);
    }
  }
  function handleClear() {
    if (!success) {
      setPin("");
      setError(false);
    }
  }

  const pad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div
      data-ocid="admin.login.section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, oklch(0.11 0.015 55) 0%, oklch(0.16 0.02 60) 100%)",
        fontFamily: T.fontBody,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          border: "1px solid oklch(0.22 0.02 60)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          border: "1px solid oklch(0.18 0.015 60)",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />
      <img
        src="/assets/trevialogo-019d56b3-17e3-7435-a4db-304c47c47498.png"
        alt="Trevia"
        style={{
          height: "50px",
          width: "auto",
          objectFit: "contain",
          marginBottom: "40px",
          filter: "brightness(0) invert(1) opacity(0.9)",
          position: "relative",
          zIndex: 1,
        }}
      />
      <div
        style={{
          backgroundColor: "oklch(0.16 0.018 60)",
          borderRadius: "24px",
          padding: "44px 40px",
          width: "min(380px, 92vw)",
          boxShadow:
            "0 24px 64px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.28 0.02 60)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            backgroundColor: "oklch(0.20 0.025 155)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Shield size={24} style={{ color: "oklch(0.70 0.14 155)" }} />
        </div>
        <h1
          style={{
            color: "oklch(0.95 0.01 80)",
            fontSize: "20px",
            fontWeight: 600,
            textAlign: "center",
            margin: "0 0 6px",
            fontFamily: T.fontDisp,
          }}
        >
          Admin Panel
        </h1>
        <p
          style={{
            color: "oklch(0.52 0.02 60)",
            fontSize: "13px",
            textAlign: "center",
            margin: "0 0 32px",
          }}
        >
          Enter your 6-digit PIN to continue
        </p>
        <div
          data-ocid="admin.pin.section"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "28px",
            animation: shake ? "adminShake 0.45s ease-in-out" : "none",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={String(i)}
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: error
                  ? "2px solid oklch(0.55 0.18 25)"
                  : success
                    ? "2px solid oklch(0.52 0.14 155)"
                    : "2px solid oklch(0.35 0.03 60)",
                backgroundColor:
                  i < pin.length
                    ? error
                      ? "oklch(0.55 0.18 25)"
                      : success
                        ? "oklch(0.52 0.14 155)"
                        : T.accent
                    : "transparent",
                transition: "all 0.15s ease",
              }}
            />
          ))}
        </div>
        {error && (
          <p
            data-ocid="admin.pin.error_state"
            style={{
              color: "oklch(0.62 0.18 25)",
              fontSize: "12px",
              textAlign: "center",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            ✕ Incorrect PIN. Try again.
          </p>
        )}
        {success && (
          <p
            data-ocid="admin.pin.success_state"
            style={{
              color: "oklch(0.62 0.14 155)",
              fontSize: "12px",
              textAlign: "center",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            ✓ Access granted. Loading...
          </p>
        )}
        <div
          data-ocid="admin.numpad.section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          {pad.map((btn) => (
            <button
              key={btn}
              type="button"
              data-ocid="admin.pin.button"
              onClick={() => {
                if (btn === "⌫") handleBack();
                else if (btn === "C") handleClear();
                else handleDigit(btn);
              }}
              style={{
                height: "54px",
                borderRadius: "12px",
                border: "1px solid oklch(0.28 0.02 60)",
                backgroundColor:
                  btn === "C" ? "oklch(0.20 0.04 20)" : "oklch(0.22 0.018 60)",
                color:
                  btn === "C" ? "oklch(0.65 0.12 25)" : "oklch(0.85 0.01 80)",
                fontSize: btn === "⌫" ? "16px" : "20px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  btn === "C" ? "oklch(0.26 0.05 20)" : "oklch(0.28 0.025 60)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  btn === "C" ? "oklch(0.20 0.04 20)" : "oklch(0.22 0.018 60)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.93)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              {btn}
            </button>
          ))}
        </div>
        <p
          style={{
            color: "oklch(0.40 0.02 60)",
            fontSize: "11px",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Forgot PIN? Contact support
        </p>
      </div>
      <style>
        {
          "@keyframes adminShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }"
        }
      </style>
    </div>
  );
}

// -------------------------------------------------------------------------
// Overview
// -------------------------------------------------------------------------
function AdminOverview({
  products,
  services,
  contacts,
  onNavigate,
}: {
  products: AdminProduct[];
  services: AdminService[];
  contacts: ContactSubmission[];
  onNavigate: (s: AdminSection) => void;
}) {
  const pending = contacts.filter(
    (c) => !c.status || c.status === "new",
  ).length;
  const recent = [...contacts].reverse().slice(0, 5);

  const stats: Array<{
    label: string;
    value: number;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    color: string;
    bg: string;
    section: AdminSection;
  }> = [
    {
      label: "Total Products",
      value: products.length,
      Icon: Package,
      color: T.accent,
      bg: "oklch(0.94 0.04 155)",
      section: "products",
    },
    {
      label: "Total Services",
      value: services.length,
      Icon: Building2,
      color: T.accentWarm,
      bg: "oklch(0.94 0.04 55)",
      section: "services",
    },
    {
      label: "Total Contacts",
      value: contacts.length,
      Icon: Inbox,
      color: T.accentBlue,
      bg: "oklch(0.94 0.04 260)",
      section: "contacts",
    },
    {
      label: "Pending Contacts",
      value: pending,
      Icon: BarChart3,
      color: T.danger,
      bg: "oklch(0.95 0.04 22)",
      section: "contacts",
    },
  ];

  const actions: Array<{
    label: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    section: AdminSection;
    color: string;
  }> = [
    {
      label: "Add Product",
      Icon: Package,
      section: "products",
      color: T.accent,
    },
    {
      label: "Edit Services",
      Icon: Building2,
      section: "services",
      color: T.accentWarm,
    },
    {
      label: "View Contacts",
      Icon: Inbox,
      section: "contacts",
      color: T.accentBlue,
    },
    {
      label: "Edit Landing Page",
      Icon: Globe,
      section: "landing",
      color: T.accentBlue,
    },
    {
      label: "Manage Media",
      Icon: Image,
      section: "media",
      color: T.accentWarm,
    },
  ];

  return (
    <div data-ocid="admin.overview.section">
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: T.textPrimary,
            margin: "0 0 4px",
            fontFamily: T.fontDisp,
          }}
        >
          Welcome back! 👋
        </h2>
        <p
          style={{
            color: T.textSecondary,
            fontSize: "13px",
            fontFamily: T.fontBody,
          }}
        >
          Here is a summary of your Trevia Projects website.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {stats.map((s, i) => {
          const { Icon } = s;
          return (
            <button
              key={s.label}
              type="button"
              data-ocid={`admin.stats.card.${i + 1}`}
              onClick={() => onNavigate(s.section)}
              style={{
                backgroundColor: T.card,
                borderRadius: T.radius,
                padding: "22px",
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                fontFamily: T.fontBody,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  T.shadowMd;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  T.shadow;
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    color: s.color,
                    fontFamily: T.fontDisp,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: T.textSecondary,
                    marginTop: "4px",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: T.card,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow,
            padding: "22px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: T.textPrimary,
              margin: "0 0 14px",
              fontFamily: T.fontBody,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {actions.map((a) => {
              const { Icon } = a;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => onNavigate(a.section)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "9px",
                    border: `1px solid ${T.border}`,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: T.fontBody,
                    color: T.textPrimary,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = T.bg;
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={15} style={{ color: a.color }} />
                  {a.label}
                  <ChevronRight
                    size={13}
                    style={{ color: T.textMuted, marginLeft: "auto" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            backgroundColor: T.card,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow,
            padding: "22px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: T.textPrimary,
              margin: "0 0 14px",
              fontFamily: T.fontBody,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Recent Contacts
          </h3>
          {recent.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "28px 0",
                color: T.textMuted,
                fontSize: "13px",
              }}
            >
              <Inbox
                size={26}
                style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}
              />
              No submissions yet
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {recent.map((c, i) => (
                <div
                  key={String(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    paddingBottom: "10px",
                    borderBottom:
                      i < recent.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "oklch(0.93 0.04 155)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.accent,
                      fontWeight: 700,
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {(c.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: T.textPrimary,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: T.textMuted,
                        margin: 0,
                      }}
                    >
                      {c.interested || c.email}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "20px",
                      backgroundColor:
                        !c.status || c.status === "new"
                          ? "oklch(0.94 0.04 22)"
                          : "oklch(0.93 0.04 155)",
                      color:
                        !c.status || c.status === "new" ? T.danger : T.accent,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.status || "new"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Products
// -------------------------------------------------------------------------
const EMPTY_PRODUCT: AdminProduct = {
  image: "",
  badge: "",
  name: "",
  price: "",
  availability: "In Stock",
  desc: "",
  fullDescription: "",
  details: [
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
  ],
};

function AdminProducts({
  products,
  onChange,
}: { products: AdminProduct[]; onChange: (p: AdminProduct[]) => void }) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminProduct>(EMPTY_PRODUCT);
  const [errs, setErrs] = useState<Record<string, string>>({});

  function openAdd() {
    setForm({
      ...EMPTY_PRODUCT,
      details: [
        ["", ""],
        ["", ""],
        ["", ""],
        ["", ""],
      ],
    });
    setEditIdx(null);
    setErrs({});
    setShowForm(true);
  }
  function openEdit(i: number) {
    const p = products[i];
    setForm({
      ...p,
      details: [
        p.details[0] ?? ["", ""],
        p.details[1] ?? ["", ""],
        p.details[2] ?? ["", ""],
        p.details[3] ?? ["", ""],
      ] as [string, string][],
    });
    setEditIdx(i);
    setErrs({});
    setShowForm(true);
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price.trim()) e.price = "Price is required";
    return e;
  }
  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrs(e);
      return;
    }
    const cleaned = {
      ...form,
      details: form.details.filter(([k, v]) => k.trim() && v.trim()) as [
        string,
        string,
      ][],
    };
    const updated =
      editIdx !== null
        ? products.map((p, i) => (i === editIdx ? cleaned : p))
        : [...products, cleaned];
    saveStoredProducts(updated);
    onChange(updated);
    setShowForm(false);
    toast.success(editIdx !== null ? "Product updated" : "Product added");
  }
  function handleDelete() {
    if (deleteIdx === null) return;
    const updated = products.filter((_, i) => i !== deleteIdx);
    saveStoredProducts(updated);
    onChange(updated);
    setDeleteIdx(null);
    toast.success("Product deleted");
  }
  function setDetail(i: number, field: 0 | 1, val: string) {
    setForm((prev) => {
      const d = [...prev.details] as [string, string][];
      d[i] = [field === 0 ? val : d[i][0], field === 1 ? val : d[i][1]] as [
        string,
        string,
      ];
      return { ...prev, details: d };
    });
  }

  return (
    <div data-ocid="admin.products.section">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "22px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: T.textPrimary,
              margin: "0 0 3px",
              fontFamily: T.fontDisp,
            }}
          >
            Products
          </h2>
          <p style={{ color: T.textSecondary, fontSize: "13px", margin: 0 }}>
            {products.length} product{products.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <button
          type="button"
          data-ocid="admin.products.primary_button"
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: T.accent,
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              T.accentHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              T.accent;
          }}
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div
          data-ocid="admin.products.empty_state"
          style={{
            textAlign: "center",
            padding: "70px 20px",
            backgroundColor: T.card,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
          }}
        >
          <Package
            size={38}
            style={{
              color: T.textMuted,
              margin: "0 auto 10px",
              display: "block",
            }}
          />
          <p
            style={{
              fontWeight: 600,
              color: T.textPrimary,
              fontSize: "14px",
              margin: "0 0 4px",
            }}
          >
            No products yet
          </p>
          <p style={{ color: T.textMuted, fontSize: "12px" }}>
            Click "Add Product" to get started
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {products.map((p, i) => (
            <div
              key={p.name + String(i)}
              data-ocid={`admin.products.item.${i + 1}`}
              style={{
                backgroundColor: T.card,
                borderRadius: T.radius,
                border: `1px solid ${T.border}`,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: T.shadow,
                flexWrap: "wrap",
              }}
            >
              {p.image ? (
                <div
                  style={{
                    width: "60px",
                    height: "46px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "46px",
                    borderRadius: "8px",
                    backgroundColor: "oklch(0.93 0.01 80)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image size={18} style={{ color: T.textMuted }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    flexWrap: "wrap",
                    marginBottom: "3px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: T.textPrimary,
                      fontSize: "14px",
                    }}
                  >
                    {p.name}
                  </span>
                  {p.badge && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "20px",
                        backgroundColor: "oklch(0.93 0.04 155)",
                        color: T.accent,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: T.accentWarm,
                    fontWeight: 600,
                    margin: "0 0 1px",
                  }}
                >
                  {p.price}
                </p>
                <p style={{ fontSize: "11px", color: T.textMuted, margin: 0 }}>
                  {p.availability}
                </p>
              </div>
              <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                <button
                  type="button"
                  data-ocid={`admin.products.edit_button.${i + 1}`}
                  onClick={() => openEdit(i)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: `1px solid ${T.border}`,
                    backgroundColor: T.card,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = T.bg;
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = T.card;
                  }}
                >
                  <Pencil size={13} style={{ color: T.accentBlue }} />
                </button>
                <button
                  type="button"
                  data-ocid={`admin.products.delete_button.${i + 1}`}
                  onClick={() => setDeleteIdx(i)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: "1px solid oklch(0.92 0.04 22)",
                    backgroundColor: T.card,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.97 0.02 22)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = T.card;
                  }}
                >
                  <Trash2 size={13} style={{ color: T.danger }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          data-ocid="admin.product.modal"
          style={{ maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: T.fontDisp, fontSize: "20px" }}>
              {editIdx !== null ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <FieldLabel>Product Name *</FieldLabel>
              <Input
                id="p-name"
                data-ocid="admin.product.name.input"
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setErrs((err) => ({ ...err, name: "" }));
                }}
                placeholder="e.g. Premium Exterior Door"
                style={{ borderColor: errs.name ? T.danger : undefined }}
              />
              {errs.name && (
                <p
                  style={{
                    fontSize: "11px",
                    color: T.danger,
                    marginTop: "3px",
                  }}
                >
                  {errs.name}
                </p>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <FieldLabel>Price (₹) *</FieldLabel>
                <Input
                  id="p-price"
                  data-ocid="admin.product.price.input"
                  value={form.price}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, price: e.target.value }));
                    setErrs((err) => ({ ...err, price: "" }));
                  }}
                  placeholder="₹45,000"
                  style={{ borderColor: errs.price ? T.danger : undefined }}
                />
                {errs.price && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: T.danger,
                      marginTop: "3px",
                    }}
                  >
                    {errs.price}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>Category Tag</FieldLabel>
                <Input
                  id="p-badge"
                  data-ocid="admin.product.badge.input"
                  value={form.badge}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, badge: e.target.value }))
                  }
                  placeholder="EXTERIOR"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Availability</FieldLabel>
              <select
                data-ocid="admin.product.availability.select"
                value={form.availability}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, availability: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${T.borderStrong}`,
                  fontSize: "14px",
                  fontFamily: T.fontBody,
                  color: T.textPrimary,
                  backgroundColor: T.card,
                  outline: "none",
                }}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Limited Stock">Limited Stock</option>
                <option value="Made to Order">Made to Order</option>
              </select>
            </div>
            <div>
              <FieldLabel>Image URL</FieldLabel>
              <Input
                id="p-img"
                data-ocid="admin.product.image.input"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="/assets/generated/product-name.jpg"
              />
            </div>
            <div>
              <FieldLabel>Short Description</FieldLabel>
              <Textarea
                id="p-desc"
                data-ocid="admin.product.desc.textarea"
                value={form.desc}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder="Brief product description shown in card"
                rows={2}
                style={{ resize: "vertical" }}
              />
            </div>
            <div>
              <FieldLabel>Full Description</FieldLabel>
              <Textarea
                id="p-full"
                data-ocid="admin.product.fullDescription.textarea"
                value={form.fullDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullDescription: e.target.value,
                  }))
                }
                placeholder="Detailed description shown on product page"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <div>
              <FieldLabel>Specifications</FieldLabel>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "7px" }}
              >
                {form.details.map((d, i) => (
                  <div
                    key={String(i)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "7px",
                    }}
                  >
                    <Input
                      data-ocid="admin.product.spec_key.input"
                      value={d[0]}
                      onChange={(e) => setDetail(i, 0, e.target.value)}
                      placeholder="Key (e.g. Material)"
                      style={{ fontSize: "13px" }}
                    />
                    <Input
                      data-ocid="admin.product.spec_val.input"
                      value={d[1]}
                      onChange={(e) => setDetail(i, 1, e.target.value)}
                      placeholder="Value (e.g. Wood)"
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter style={{ gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              data-ocid="admin.product.cancel_button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                backgroundColor: T.card,
                color: T.textPrimary,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="admin.product.save_button"
              onClick={handleSave}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: T.accent,
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {editIdx !== null ? "Save Changes" : "Add Product"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteIdx !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteIdx(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.product.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{deleteIdx !== null ? products[deleteIdx]?.name : ""}"?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.product.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.product.confirm_button"
              onClick={handleDelete}
              style={{ backgroundColor: T.danger }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// -------------------------------------------------------------------------
// Services
// -------------------------------------------------------------------------
function AdminServices({
  services,
  onChange,
}: { services: AdminService[]; onChange: (s: AdminService[]) => void }) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<AdminService>({
    image: "",
    title: "",
    desc: "",
  });
  const [errs, setErrs] = useState<Record<string, string>>({});

  function openEdit(i: number) {
    setForm({ ...services[i] });
    setEditIdx(i);
    setErrs({});
  }
  function handleSave() {
    if (!form.title.trim()) {
      setErrs({ title: "Service title is required" });
      return;
    }
    const updated = services.map((s, i) => (i === editIdx ? { ...form } : s));
    saveStoredServices(updated);
    onChange(updated);
    setEditIdx(null);
    toast.success("Service updated");
  }

  return (
    <div data-ocid="admin.services.section">
      <div style={{ marginBottom: "22px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: T.textPrimary,
            margin: "0 0 3px",
            fontFamily: T.fontDisp,
          }}
        >
          Services
        </h2>
        <p style={{ color: T.textSecondary, fontSize: "13px", margin: 0 }}>
          Edit service names, descriptions, and images
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {services.map((s, i) => (
          <div
            key={s.title + String(i)}
            data-ocid={`admin.services.item.${i + 1}`}
            style={{
              backgroundColor: T.card,
              borderRadius: T.radius,
              border: `1px solid ${T.border}`,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: T.shadow,
              flexWrap: "wrap",
            }}
          >
            {s.image ? (
              <div
                style={{
                  width: "68px",
                  height: "50px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "68px",
                  height: "50px",
                  borderRadius: "8px",
                  backgroundColor: "oklch(0.93 0.01 80)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={18} style={{ color: T.textMuted }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 700,
                  color: T.textPrimary,
                  fontSize: "14px",
                  margin: "0 0 3px",
                }}
              >
                {s.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: T.textSecondary,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {s.desc}
              </p>
            </div>
            <button
              type="button"
              data-ocid={`admin.services.edit_button.${i + 1}`}
              onClick={() => openEdit(i)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                backgroundColor: T.card,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  T.bg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  T.card;
              }}
            >
              <Pencil size={13} style={{ color: T.accentBlue }} />
            </button>
          </div>
        ))}
      </div>

      <Dialog
        open={editIdx !== null}
        onOpenChange={(o) => {
          if (!o) setEditIdx(null);
        }}
      >
        <DialogContent
          data-ocid="admin.service.modal"
          style={{ maxWidth: "500px" }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: T.fontDisp, fontSize: "20px" }}>
              Edit Service
            </DialogTitle>
          </DialogHeader>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <FieldLabel>Service Name *</FieldLabel>
              <Input
                id="s-title"
                data-ocid="admin.service.title.input"
                value={form.title}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, title: e.target.value }));
                  setErrs({});
                }}
                placeholder="e.g. Waterproofing Solutions"
                style={{ borderColor: errs.title ? T.danger : undefined }}
              />
              {errs.title && (
                <p
                  style={{
                    fontSize: "11px",
                    color: T.danger,
                    marginTop: "3px",
                  }}
                >
                  {errs.title}
                </p>
              )}
            </div>
            <div>
              <FieldLabel>Image URL</FieldLabel>
              <Input
                id="s-img"
                data-ocid="admin.service.image.input"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="/assets/generated/service-name.jpg"
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                id="s-desc"
                data-ocid="admin.service.desc.textarea"
                value={form.desc}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder="Service description"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
          <DialogFooter style={{ gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              data-ocid="admin.service.cancel_button"
              onClick={() => setEditIdx(null)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                backgroundColor: T.card,
                color: T.textPrimary,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="admin.service.save_button"
              onClick={handleSave}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: T.accent,
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------------------------------------------------------------
// Contacts
// -------------------------------------------------------------------------
function AdminContacts({
  contacts,
  onChange,
}: {
  contacts: ContactSubmission[];
  onChange: (c: ContactSubmission[]) => void;
}) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  function handleRefresh() {
    const fresh = getStoredContacts();
    onChange(fresh);
    toast.success("Contacts refreshed");
  }

  function toggleStatus(idx: number) {
    const updated = contacts.map((c, i) =>
      i === idx
        ? {
            ...c,
            status: (c.status === "replied" ? "new" : "replied") as
              | "new"
              | "replied",
          }
        : c,
    );
    saveStoredContacts(updated);
    onChange(updated);
  }
  function handleDelete() {
    if (deleteIdx === null) return;
    const updated = contacts.filter((_, i) => i !== deleteIdx);
    saveStoredContacts(updated);
    onChange(updated);
    setDeleteIdx(null);
    toast.success("Submission deleted");
  }
  function fmtDate(s: string) {
    try {
      return new Date(s).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return s;
    }
  }

  return (
    <div data-ocid="admin.contacts.section">
      <div
        style={{
          marginBottom: "22px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: T.textPrimary,
              margin: "0 0 3px",
              fontFamily: T.fontDisp,
            }}
          >
            Contact Submissions
          </h2>
          <p style={{ color: T.textSecondary, fontSize: "13px", margin: 0 }}>
            {contacts.length} submission{contacts.length !== 1 ? "s" : ""}{" "}
            received
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          data-ocid="admin.contacts.button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
            color: T.textSecondary,
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: T.fontBody,
          }}
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>
      {contacts.length === 0 ? (
        <div
          data-ocid="admin.contacts.empty_state"
          style={{
            textAlign: "center",
            padding: "70px 20px",
            backgroundColor: T.card,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
          }}
        >
          <Inbox
            size={38}
            style={{
              color: T.textMuted,
              margin: "0 auto 10px",
              display: "block",
            }}
          />
          <p
            style={{
              fontWeight: 600,
              color: T.textPrimary,
              fontSize: "14px",
              margin: "0 0 4px",
            }}
          >
            No contact submissions yet
          </p>
          <p style={{ color: T.textMuted, fontSize: "12px" }}>
            Form submissions will appear here
          </p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
          }}
        >
          <table
            data-ocid="admin.contacts.table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              fontFamily: T.fontBody,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "oklch(0.97 0.008 75)" }}>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Service",
                  "Message",
                  "Date",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: T.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderBottom: `1px solid ${T.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr
                  key={c.email + c.date}
                  data-ocid={`admin.contacts.row.${i + 1}`}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td
                    style={{
                      padding: "11px 14px",
                      fontWeight: 600,
                      color: T.textPrimary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </td>
                  <td style={{ padding: "11px 14px", color: T.textSecondary }}>
                    {c.email}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: T.textSecondary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.phone}
                  </td>
                  <td style={{ padding: "11px 14px", color: T.textSecondary }}>
                    {c.interested}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: T.textSecondary,
                      maxWidth: "180px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.message}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: T.textMuted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtDate(c.date)}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <button
                      type="button"
                      onClick={() => toggleStatus(i)}
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "4px 9px",
                        borderRadius: "20px",
                        border: "none",
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        backgroundColor:
                          !c.status || c.status === "new"
                            ? "oklch(0.94 0.04 22)"
                            : "oklch(0.93 0.04 155)",
                        color:
                          !c.status || c.status === "new" ? T.danger : T.accent,
                        transition: "all 0.15s",
                      }}
                    >
                      {c.status || "new"}
                    </button>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <button
                      type="button"
                      data-ocid={`admin.contacts.delete_button.${i + 1}`}
                      onClick={() => setDeleteIdx(i)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "oklch(0.97 0.02 22)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.93 0.05 22)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.97 0.02 22)";
                      }}
                    >
                      <Trash2 size={11} style={{ color: T.danger }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AlertDialog
        open={deleteIdx !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteIdx(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contact submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.contacts.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.contacts.confirm_button"
              onClick={handleDelete}
              style={{ backgroundColor: T.danger }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// -------------------------------------------------------------------------
// Landing Page Editor
// -------------------------------------------------------------------------
function AdminLandingPage() {
  const [settings, setSettings] =
    useState<LandingPageSettings>(getStoredLanding);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "hero" | "about" | "sections" | "footer"
  >("hero");

  function handleSave() {
    setSaving(true);
    saveStoredLanding(settings);
    setTimeout(() => setSaving(false), 500);
    toast.success("Landing page saved!");
  }
  function update(key: keyof LandingPageSettings, val: string) {
    setSettings((prev) => ({ ...prev, [key]: val }));
  }

  const tabs: Array<{
    id: "hero" | "about" | "sections" | "footer";
    label: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }> = [
    { id: "hero", label: "Hero", Icon: Home },
    { id: "about", label: "About", Icon: FileText },
    { id: "sections", label: "Sections", Icon: LayoutDashboard },
    { id: "footer", label: "Footer", Icon: Globe },
  ];

  return (
    <div data-ocid="admin.landing.section">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "22px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: T.textPrimary,
              margin: "0 0 3px",
              fontFamily: T.fontDisp,
            }}
          >
            Landing Page Editor
          </h2>
          <p style={{ color: T.textSecondary, fontSize: "13px", margin: 0 }}>
            Edit homepage content without any coding
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            data-ocid="admin.landing.preview_button"
            onClick={() => {
              window.open("/", "_blank");
              toast("Opening homepage...", { icon: "👁️" });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              borderRadius: "9px",
              border: `1px solid ${T.border}`,
              backgroundColor: T.card,
              color: T.textPrimary,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                T.bg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                T.card;
            }}
          >
            <Eye size={13} /> Preview <ExternalLink size={11} />
          </button>
          <button
            type="button"
            data-ocid="admin.landing.save_button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "9px",
              border: "none",
              backgroundColor: T.accent,
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.8 : 1,
              transition: "all 0.15s",
            }}
          >
            {saving ? (
              <Loader2
                size={13}
                style={{ animation: "adminSpin 1s linear infinite" }}
              />
            ) : (
              <Save size={13} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          backgroundColor: T.bg,
          padding: "4px",
          borderRadius: "12px",
          marginBottom: "22px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const { Icon } = tab;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={`admin.landing.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "9px",
                border: "none",
                backgroundColor: active ? T.card : "transparent",
                color: active ? T.textPrimary : T.textMuted,
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                boxShadow: active ? T.shadow : "none",
              }}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: T.card,
          borderRadius: T.radius,
          border: `1px solid ${T.border}`,
          padding: "26px",
          boxShadow: T.shadow,
        }}
      >
        {activeTab === "hero" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: T.textMuted,
                margin: 0,
              }}
            >
              Hero Section
            </p>
            {(
              [
                ["heroHeading", "Main Heading", "trevia projects"],
                ["heroTagline", "Tagline (script text)", "Live Brighter"],
                ["heroCtaText", "CTA Button Text", "Explore Our Services"],
              ] as const
            ).map(([k, l, ph]) => (
              <div key={k}>
                <Label
                  htmlFor={`lp-${k}`}
                  style={{
                    fontFamily: T.fontBody,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: T.textSecondary,
                  }}
                >
                  {l}
                </Label>
                <Input
                  id={`lp-${k}`}
                  data-ocid={`admin.landing.${k}.input`}
                  value={settings[k]}
                  onChange={(e) => update(k, e.target.value)}
                  placeholder={ph}
                  style={{ marginTop: "5px" }}
                />
              </div>
            ))}
            <div>
              <Label
                htmlFor="lp-heroSubtext"
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textSecondary,
                }}
              >
                Subtext / Description
              </Label>
              <Textarea
                id="lp-heroSubtext"
                data-ocid="admin.landing.heroSubtext.textarea"
                value={settings.heroSubtext}
                onChange={(e) => update("heroSubtext", e.target.value)}
                placeholder="Premium construction & architectural planning..."
                rows={3}
                style={{ marginTop: "5px", resize: "vertical" }}
              />
            </div>
          </div>
        )}
        {activeTab === "about" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: T.textMuted,
                margin: 0,
              }}
            >
              About Section
            </p>
            <div>
              <Label
                htmlFor="lp-aH"
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textSecondary,
                }}
              >
                Section Heading
              </Label>
              <Input
                id="lp-aH"
                data-ocid="admin.landing.aboutHeading.input"
                value={settings.aboutHeading}
                onChange={(e) => update("aboutHeading", e.target.value)}
                placeholder="About Trevia Projects"
                style={{ marginTop: "5px" }}
              />
            </div>
            <div>
              <Label
                htmlFor="lp-aT"
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textSecondary,
                }}
              >
                About Body Text
              </Label>
              <Textarea
                id="lp-aT"
                data-ocid="admin.landing.aboutText.textarea"
                value={settings.aboutText}
                onChange={(e) => update("aboutText", e.target.value)}
                placeholder="Trevia Projects is..."
                rows={5}
                style={{ marginTop: "5px", resize: "vertical" }}
              />
            </div>
          </div>
        )}
        {activeTab === "sections" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <p
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: T.textMuted,
                  margin: "0 0 14px",
                }}
              >
                Services Section
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <Label
                    htmlFor="lp-sH"
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: T.textSecondary,
                    }}
                  >
                    Section Heading
                  </Label>
                  <Input
                    id="lp-sH"
                    data-ocid="admin.landing.servicesHeading.input"
                    value={settings.servicesHeading}
                    onChange={(e) => update("servicesHeading", e.target.value)}
                    placeholder="OUR SERVICES"
                    style={{ marginTop: "5px" }}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lp-sS"
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: T.textSecondary,
                    }}
                  >
                    Subtext
                  </Label>
                  <Input
                    id="lp-sS"
                    data-ocid="admin.landing.servicesSubtext.input"
                    value={settings.servicesSubtext}
                    onChange={(e) => update("servicesSubtext", e.target.value)}
                    placeholder="End-to-end construction..."
                    style={{ marginTop: "5px" }}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <p
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: T.textMuted,
                  margin: "0 0 14px",
                }}
              >
                Products Section
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <Label
                    htmlFor="lp-pH"
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: T.textSecondary,
                    }}
                  >
                    Section Heading
                  </Label>
                  <Input
                    id="lp-pH"
                    data-ocid="admin.landing.productsHeading.input"
                    value={settings.productsHeading}
                    onChange={(e) => update("productsHeading", e.target.value)}
                    placeholder="OUR PRODUCTS"
                    style={{ marginTop: "5px" }}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lp-pS"
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: T.textSecondary,
                    }}
                  >
                    Subtext
                  </Label>
                  <Input
                    id="lp-pS"
                    data-ocid="admin.landing.productsSubtext.input"
                    value={settings.productsSubtext}
                    onChange={(e) => update("productsSubtext", e.target.value)}
                    placeholder="Premium doors, frames..."
                    style={{ marginTop: "5px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "footer" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: T.textMuted,
                margin: 0,
              }}
            >
              Footer / Contact Info
            </p>
            {(
              [
                [
                  "footerTagline",
                  "Footer Tagline",
                  "Building dreams with precision...",
                ],
                ["footerEmail", "Contact Email", "contact@treviaprojects.com"],
                ["footerPhone", "Phone Number", "+91 90005 64939"],
              ] as const
            ).map(([k, l, ph]) => (
              <div key={k}>
                <Label
                  htmlFor={`lp-${k}`}
                  style={{
                    fontFamily: T.fontBody,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: T.textSecondary,
                  }}
                >
                  {l}
                </Label>
                <Input
                  id={`lp-${k}`}
                  data-ocid={`admin.landing.${k}.input`}
                  value={settings[k]}
                  onChange={(e) => update(k, e.target.value)}
                  placeholder={ph}
                  style={{ marginTop: "5px" }}
                />
              </div>
            ))}
            <div>
              <Label
                htmlFor="lp-fA"
                style={{
                  fontFamily: T.fontBody,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textSecondary,
                }}
              >
                Address
              </Label>
              <Textarea
                id="lp-fA"
                data-ocid="admin.landing.footerAddress.textarea"
                value={settings.footerAddress}
                onChange={(e) => update("footerAddress", e.target.value)}
                placeholder="Trevia Projects, Guntur..."
                rows={2}
                style={{ marginTop: "5px", resize: "vertical" }}
              />
            </div>
          </div>
        )}
      </div>
      <style>
        {
          "@keyframes adminSpin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}"
        }
      </style>
    </div>
  );
}

// -------------------------------------------------------------------------
// Media Manager
// -------------------------------------------------------------------------
function AdminMedia() {
  const [files, setFiles] = useState<
    Array<{ name: string; url: string; size: string; type: string }>
  >(() => {
    try {
      const s = localStorage.getItem("trevia_media_files");
      if (s) return JSON.parse(s);
    } catch {
      /* noop */
    }
    return [
      {
        name: "service-construction.jpg",
        url: "/assets/generated/service-construction-services.dim_800x500.jpg",
        size: "140 KB",
        type: "Service",
      },
      {
        name: "service-architecture.jpg",
        url: "/assets/generated/service-architectural-planning-v2.dim_800x500.jpg",
        size: "128 KB",
        type: "Service",
      },
      {
        name: "service-waterproofing.jpg",
        url: "/assets/generated/service-waterproofing.dim_800x500.jpg",
        size: "135 KB",
        type: "Service",
      },
      {
        name: "service-interior.jpg",
        url: "/assets/generated/service-interior-construction-v2.dim_800x500.jpg",
        size: "142 KB",
        type: "Service",
      },
      {
        name: "service-renovation.jpg",
        url: "/assets/generated/service-renovation-remodeling.dim_800x500.jpg",
        size: "138 KB",
        type: "Service",
      },
      {
        name: "product-exterior-door.jpg",
        url: "/assets/generated/product-exterior-door-v2.dim_800x600.jpg",
        size: "118 KB",
        type: "Product",
      },
      {
        name: "product-interior-frame.jpg",
        url: "/assets/generated/product-interior-frame-v2.dim_800x600.jpg",
        size: "112 KB",
        type: "Product",
      },
      {
        name: "product-wooden-door.jpg",
        url: "/assets/generated/product-wooden-door-v2.dim_800x600.jpg",
        size: "120 KB",
        type: "Product",
      },
    ];
  });
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function persist(f: typeof files) {
    setFiles(f);
    localStorage.setItem("trevia_media_files", JSON.stringify(f));
  }
  function addUrl() {
    if (!urlInput.trim()) {
      toast.error("Please enter an image URL");
      return;
    }
    persist([
      ...files,
      {
        name: nameInput.trim() || urlInput.split("/").pop() || "image.jpg",
        url: urlInput.trim(),
        size: "–",
        type: "Custom",
      },
    ]);
    setUrlInput("");
    setNameInput("");
    toast.success("Image added");
  }
  function remove(i: number) {
    persist(files.filter((_, idx) => idx !== i));
    toast.success("Removed from library");
  }
  function copy(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div data-ocid="admin.media.section">
      <div style={{ marginBottom: "22px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: T.textPrimary,
            margin: "0 0 3px",
            fontFamily: T.fontDisp,
          }}
        >
          Media Manager
        </h2>
        <p style={{ color: T.textSecondary, fontSize: "13px", margin: 0 }}>
          Organize images used across your website
        </p>
      </div>
      <div
        style={{
          backgroundColor: T.card,
          borderRadius: T.radius,
          border: `1px solid ${T.border}`,
          padding: "18px",
          marginBottom: "18px",
          boxShadow: T.shadow,
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: T.textSecondary,
            margin: "0 0 10px",
          }}
        >
          Add Image by URL
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Input
            data-ocid="admin.media.name.input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Image name (optional)"
            style={{ flex: "1 1 140px", minWidth: "120px" }}
          />
          <Input
            data-ocid="admin.media.url.input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ flex: "3 1 240px", minWidth: "180px" }}
          />
          <button
            type="button"
            data-ocid="admin.media.upload_button"
            onClick={addUrl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: T.accent,
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Upload size={13} /> Add
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: "14px",
        }}
      >
        {files.map((f, i) => (
          <div
            key={f.url + String(i)}
            style={{
              backgroundColor: T.card,
              borderRadius: T.radius,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
              boxShadow: T.shadow,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadowMd;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadow;
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "16/10",
                backgroundColor: "oklch(0.94 0.01 80)",
                overflow: "hidden",
              }}
            >
              <img
                src={f.url}
                alt={f.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div style={{ padding: "10px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textPrimary,
                  margin: "0 0 1px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {f.name}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: T.textMuted,
                  margin: "0 0 8px",
                }}
              >
                {f.type} · {f.size}
              </p>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  type="button"
                  onClick={() => copy(f.url)}
                  style={{
                    flex: 1,
                    padding: "5px",
                    borderRadius: "6px",
                    border: `1px solid ${T.border}`,
                    backgroundColor:
                      copied === f.url ? "oklch(0.93 0.04 155)" : T.card,
                    color: copied === f.url ? T.accent : T.textSecondary,
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {copied === f.url ? "✓ Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  style={{
                    width: "28px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "oklch(0.97 0.02 22)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.93 0.05 22)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.97 0.02 22)";
                  }}
                >
                  <Trash2 size={11} style={{ color: T.danger }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Main Admin Page
// -------------------------------------------------------------------------
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>(() =>
    getStoredProducts(),
  );
  const [services, setServices] = useState<AdminService[]>(() =>
    getStoredServices(),
  );
  const [contacts, setContacts] = useState<ContactSubmission[]>(() =>
    getStoredContacts(),
  );

  useEffect(() => {
    if (sessionStorage.getItem("trevia_admin_auth") === "1")
      setIsAuthenticated(true);
  }, []);

  function handleAuthSuccess() {
    sessionStorage.setItem("trevia_admin_auth", "1");
    setIsAuthenticated(true);
  }
  function handleLogout() {
    sessionStorage.removeItem("trevia_admin_auth");
    setIsAuthenticated(false);
    toast("Logged out");
  }

  if (!isAuthenticated) return <PinLoginScreen onSuccess={handleAuthSuccess} />;

  const navItems: Array<{
    id: AdminSection;
    label: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }> = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
    { id: "products", label: "Products", Icon: Package },
    { id: "services", label: "Services", Icon: Building2 },
    { id: "contacts", label: "Contacts", Icon: Inbox },
    { id: "landing", label: "Landing Page", Icon: Globe },
    { id: "media", label: "Media", Icon: Image },
  ];

  const currentLabel =
    navItems.find((n) => n.id === activeSection)?.label ?? "Dashboard";

  return (
    <div
      data-ocid="admin.section"
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: T.fontBody,
        backgroundColor: T.bg,
      }}
    >
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "oklch(0 0 0 / 0.5)",
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSidebarOpen(false);
          }}
        />
      )}

      <aside
        data-ocid="admin.sidebar.panel"
        style={{
          width: "240px",
          backgroundColor: T.sidebarBg,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "4px 0 24px oklch(0 0 0 / 0.3)",
        }}
        className="md:translate-x-0"
      >
        <div
          style={{
            padding: "22px 18px 18px",
            borderBottom: "1px solid oklch(0.20 0.015 60)",
          }}
        >
          <img
            src="/assets/trevialogo-019d56b3-17e3-7435-a4db-304c47c47498.png"
            alt="Trevia"
            style={{
              height: "30px",
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1) opacity(0.9)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "9px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "oklch(0.60 0.16 155)",
                animation: "adminPulse 2s infinite",
              }}
            />
            <p
              style={{
                color: "oklch(0.42 0.02 60)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>

        <nav
          data-ocid="admin.sidebar.nav"
          style={{
            flex: 1,
            padding: "14px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            overflowY: "auto",
          }}
        >
          {navItems.map((item) => {
            const active = activeSection === item.id;
            const { Icon } = item;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`admin.sidebar.${item.id}.link`}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: active ? T.sidebarActiveBg : "transparent",
                  color: active ? T.sidebarActiveTxt : T.sidebarTxt,
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = T.sidebarHoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "18px",
                      borderRadius: "0 3px 3px 0",
                      backgroundColor: T.accent,
                    }}
                  />
                )}
                <Icon size={15} style={{ flexShrink: 0 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            padding: "10px 8px",
            borderTop: "1px solid oklch(0.20 0.015 60)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              borderRadius: "8px",
              color: T.sidebarTxt,
              fontSize: "12px",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                T.sidebarActiveTxt;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = T.sidebarTxt;
            }}
          >
            <Home size={13} /> Back to Site
          </a>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              color: "oklch(0.52 0.12 22)",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.18 0.03 22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 0,
        }}
        className="md:ml-[240px]"
      >
        <header
          data-ocid="admin.topbar.section"
          style={{
            backgroundColor: T.card,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 22px",
            height: "62px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: "0 1px 8px oklch(0.3 0.02 60 / 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              type="button"
              data-ocid="admin.mobile_menu.button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.textSecondary,
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Settings size={19} />
            </button>
            <div>
              <h1
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: T.textPrimary,
                  margin: 0,
                  fontFamily: T.fontDisp,
                }}
              >
                {currentLabel}
              </h1>
              <p style={{ fontSize: "11px", color: T.textMuted, margin: 0 }}>
                Trevia Admin Panel
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                backgroundColor: T.card,
                color: T.textSecondary,
                fontSize: "12px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  T.bg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  T.card;
              }}
            >
              <Eye size={12} /> Preview
            </a>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, oklch(0.42 0.08 155), oklch(0.55 0.12 55))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              A
            </div>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            padding: "26px 22px",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {activeSection === "overview" && (
            <AdminOverview
              products={products}
              services={services}
              contacts={contacts}
              onNavigate={setActiveSection}
            />
          )}
          {activeSection === "products" && (
            <AdminProducts products={products} onChange={setProducts} />
          )}
          {activeSection === "services" && (
            <AdminServices services={services} onChange={setServices} />
          )}
          {activeSection === "contacts" && (
            <AdminContacts contacts={contacts} onChange={setContacts} />
          )}
          {activeSection === "landing" && <AdminLandingPage />}
          {activeSection === "media" && <AdminMedia />}
        </main>

        <footer
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            textAlign: "center",
            color: T.textMuted,
            fontSize: "11px",
          }}
        >
          © {new Date().getFullYear()} Trevia Projects. All rights reserved.
        </footer>
      </div>

      <style>
        {"@keyframes adminPulse{0%,100%{opacity:1}50%{opacity:0.4}}"}
      </style>
    </div>
  );
}
