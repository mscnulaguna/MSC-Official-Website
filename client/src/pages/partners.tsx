import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCheck, Copy, AlertCircle } from "lucide-react";
import { useEffect, useState, type JSX, type ChangeEvent, type CSSProperties } from "react";
import mscLogo from "../assets/Favicon.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const MSC_EMAIL = "msc@nu-laguna.edu.ph";

const gradientStyle: CSSProperties = {
    background: "linear-gradient(to right, #00A2ED 0%, #6AAC0E 33%, #FFBB00 66%, #F04E1F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

// Types 
interface Partner {
    id: string;
    name: string;
    logo: string;
    url: string;
    bio: string;
}

// Fallback data 
const FALLBACK_PARTNERS: Partner[] = Array(12).fill(null).map((_, i) => ({
    id: `fallback-${i}`,
    name: "MSC NU Laguna",
    logo: mscLogo,
    url: "https://www.facebook.com/mscnulaguna",
    bio: "",
}));

// Partner logo 
const PartnerLogo = ({ partner }: { partner: Partner }): JSX.Element => (
    <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        title={partner.name}
        className="flex items-center justify-center p-2 sm:p-4 transition-all duration-300 hover:scale-105"
    >
        <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            className="h-14 sm:h-24 md:h-28 lg:h-32 w-auto object-contain"
        />
    </a>
);

// Star icon 
const StarIcon = ({ style }: { style?: CSSProperties }): JSX.Element => (
    <svg viewBox="0 0 512 512" className="w-7 h-7 sm:w-8 sm:h-8" style={style} fill="currentColor">
        <path d="M 208 0 L 304 0 L 304 173 L 454 86 L 502 170 L 352 256 L 502 342 L 454 426 L 304 339 L 304 512 L 208 512 L 208 339 L 58 426 L 10 343 L 160 256 L 10 170 L 58 87 L 208 173 Z" />
    </svg>
);

// Logo skeleton 
const LogoSkeleton = (): JSX.Element => (
    <div className="flex items-center justify-center p-2 sm:p-4">
        <div className="h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded bg-gray-200 animate-pulse" />
    </div>
);

// Stat badge 
const StatBadge = ({ bgColor, iconColor, count, label }: {
    bgColor: string;
    iconColor: string;
    count: number;
    label: string;
}): JSX.Element => (
    <div className="flex flex-col items-center gap-1">
        <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
        >
            <StarIcon style={{ color: iconColor }} />
        </div>
        <span className="text-xl sm:text-2xl font-bold text-black">{count}+</span>
        <span className="text-xs sm:text-sm text-gray-500">{label}</span>
    </div>
);

// Testimonial card 
const TestimonialCard = (): JSX.Element => (
    <Card className="rounded-none p-4 sm:p-6 shadow-sm" style={{ border: "1px solid #CBD5E1" }}>
        <CardContent className="p-0 space-y-3">
            <svg width="28" height="21" viewBox="0 0 32 24" fill="none">
                <path d="M0 24V14.4C0 10.08 1.12 6.56 3.36 3.84C5.6 1.12 8.64 0 12.48 0V4.8C10.56 4.8 9.04 5.44 7.92 6.72C6.8 8 6.24 9.76 6.24 12H12V24H0ZM20 24V14.4C20 10.08 21.12 6.56 23.36 3.84C25.6 1.12 28.64 0 32.48 0V4.8C30.56 4.8 29.04 5.44 27.92 6.72C26.8 8 26.24 9.76 26.24 12H32V24H20Z"
                    fill="#CBD5E1" />
            </svg>
            <p className="text-xs sm:text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="pt-2">
                <p className="text-sm font-bold text-gray-900">Alysa Liu</p>
                <p className="text-xs text-gray-500">HR Director, Accenture Philippines</p>
            </div>
        </CardContent>
    </Card>
);

// Contact form 
const ContactForm = (): JSX.Element => {
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({
        companyName: "",
        contactName: "",
        email: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setSending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSending(false);
        setSent(true);
        setForm({ companyName: "", contactName: "", email: "", message: "" });
        setTimeout(() => setSent(false), 4000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(MSC_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A2ED]";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left items-stretch">

            {/* Left: form fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input required name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. NU Laguna" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input required name="contactName" value={form.contactName} onChange={handleChange} placeholder="e.g. Juan dela Cruz" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. juan@company.com" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us about your company and partnership interests..." className={`${inputClass} resize-none`} />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={sending || sent}
                    className="w-full text-white text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#00A2ED" }}
                >
                    {sending ? "Sending..." : sent ? "Sent!" : "Send Message"}
                </Button>
                {sent && (
                    <p className="text-sm text-center" style={{ color: "#6AAC0E" }}>
                        ✓ Message sent! We'll get back to you shortly.
                    </p>
                )}
            </div>

            {/* Right: reach out directly */}
            <div
                className="flex flex-col justify-start space-y-4 md:border-l md:pl-8 lg:pl-10"
                style={{ borderColor: "#CBD5E1" }}
            >
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#00A2ED" }}>Reach Out Directly</h3>
                <p className="text-sm text-black-500">
                    Prefer to reach out directly? Send us an email and we'll get back to you as soon as possible.
                </p>
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-md"
                    style={{ border: "1px solid #CBD5E1", backgroundColor: "#F5F5F5" }}
                >
                    <span className="text-xs sm:text-sm text-gray-700 flex-1 font-medium break-all">{MSC_EMAIL}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs px-2 sm:px-3 py-1 border rounded transition-colors shrink-0"
                        style={{ color: "#00A2ED", borderColor: "#00A2ED", backgroundColor: "transparent" }}
                    >
                        {copied
                            ? <><CheckCheck className="w-4 h-4" /><span className="hidden sm:inline">Copied</span></>
                            : <><Copy className="w-4 h-4" /><span className="hidden sm:inline">Copy</span></>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

// Page 
export default function PartnersPage(): JSX.Element {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_BASE}/partners`);
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err?.error?.message || "Failed to load partners.");
                }
                const json = await res.json();
                setPartners(json.data);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : "Something went wrong.");
                setPartners(FALLBACK_PARTNERS);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    return (
        <div className="font-sans">

            {/* ── Section 1: Our Partners ── */}
            <section className="py-32 sm:py-40 text-center">
                <div className="w-full max-w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block" style={gradientStyle}>
                        OUR PARTNERS
                    </h1>
                    <p className="mt-3 text-black-500 text-sm sm:text-sm     lg:text-lg max-w-4xl mx-auto">
                        We collaborate with tech companies and organizations to bring exclusive
                        benefits to our community members.
                    </p>

                    {error && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-base" style={{ color: "#F04E1F" }}>
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading && (
                        <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                            {Array(12).fill(null).map((_, i) => <LogoSkeleton key={i} />)}
                        </div>
                    )}

                    {!loading && (
                        <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                            {partners.map((partner) => (
                                <PartnerLogo key={partner.id} partner={partner} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Section 2: Why Partner With Us ── */}
            <section className="py-32 sm:py-40 text-center" style={{ backgroundColor: "#F5F5F5" }}>
                <div className="w-full max-w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block" style={gradientStyle}>
                        WHY PARTNER WITH US
                    </h2>
                    <p className="mt-2 text-black-500 text-sm sm:text-sm lg:text-lg max-w-4xl mx-auto">
                        From certifications to career connections, being part of MSC opens
                        doors you didn't know existed.
                    </p>

                    {/* Stats */}
                    <div className="mt-8 flex justify-center gap-8 sm:gap-12 flex-wrap">
                        <StatBadge bgColor="#E6F4FD" iconColor="#00A2ED" count={partners.length || 0} label="Partners" />
                        <StatBadge bgColor="#EEF6E6" iconColor="#6AAC0E" count={300} label="Members" />
                        <StatBadge bgColor="#FFF8E6" iconColor="#FFBB00" count={10} label="Events" />
                    </div>

                    {/* Testimonials */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
                        <TestimonialCard />
                        <TestimonialCard />
                        <TestimonialCard />
                    </div>
                </div>
            </section>

            {/* ── Section 3: Become a Partner ── */}
            <section className="py-32 sm:py-40">
                <div className="w-full max-w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="rounded-none shadow-sm" style={{ border: "1px solid #CBD5E1" }}>
                        <CardContent className="p-6 sm:p-10 lg:p-12">
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block" style={gradientStyle}>
                                    BECOME A PARTNER
                                </h2>
                                <p className="mt-2 text-black-500 text-sm sm:text-sm lg:text-lg max-w-4xl mx-auto">
                                    Interested in partnering with MSC NU Laguna? Fill out the form
                                    below and we'll get back to you shortly.
                                </p>
                            </div>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </div>
            </section>

        </div>
    );
}
