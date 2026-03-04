import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import mscLogo from "../assets/Favicon.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

//partner types
interface Partner {
    id: string;
    name: string;
    logo: string;
    url: string;
    bio: string;
    tier: "bronze" | "silver" | "gold";
}

//partner logo card 
const PartnerLogo = ({partner}: {partner: Partner}): JSX.Element => {
    return (
        <a 
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
        className="flex items-center justify-center p-4 transition-all duration-300"
        >
            <img 
            src={partner.logo} 
            alt={`${partner.name} logo`} 
            className="h-25 w-auto object-contain" 
            />
        </a>
    )
}

const FALLBACK_PARTNERS: Partner[] = Array(12).fill(null).map((_, i) => ({
    id: `fallback-${i}`,
    name: 'MSC NU Laguna',
    logo: mscLogo,
    url: "https://www.facebook.com/mscnulaguna",
    bio: "",
    tier: "gold",
}));

//skeleton loader for partner logos
const LogoSkeleton = (): JSX.Element => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="h-16 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
    )
}

//sponsor card component
type Tier = "Bronze" | "Silver" | "Gold";

interface TierCardProps {
    tier: Tier;
    features: string[];
}

const tierColors: Record<Tier, string> = {
    Bronze: "text-amber-700",
    Silver: "text-slate-400",
    Gold: "text-yellow-500",
}

const TierCard = ({tier, features}: TierCardProps) => (
    <Card className="flex flex-col border border-gray-200 rounded-lg 
    shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
            <div className="flex justify-center mb-2">
                <svg
                    viewBox="0 0 512 512"
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                >
                    <path d="M 208 0 L 304 0 L 304 173 L 454 86 L 502 170 L 352 256 L 502 342 L 454 426 L 304 339 L 304 512 L 208 512 L 208 339 L 58 426 L 10 343 L 160 256 L 10 170 L 58 87 L 208 173 Z" />
                </svg>
            </div>
            <h3 className={`text-xl font-bold ${tierColors[tier]}`}>{tier}</h3>
        </CardHeader>
        <CardContent className="flex-1">
            <ul className="space-y-2">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                    </li>
                ))}    
            </ul>
        </CardContent>
        <CardFooter>
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-rounded-sm text-sm">
                Get Started
            </Button>
        </CardFooter>  
    </Card>
);

//stat badge
const StatBadge = ({ color, count, label }: { color: string; count: number; label: string}) => (
    <div className="flex flex-col items-center gap-1">
        <div className={`w-14 h-14 rounded-md flex items-center justify-center text-white text-xl ${color}`}>
            <svg
                viewBox="0 0 512 512"
                className="w-10 h-10 text-blue-600"
                fill="currentColor"
            >
                <path d="M 208 0 L 304 0 L 304 173 L 454 86 L 502 170 L 352 256 L 502 342 L 454 426 L 304 339 L 304 512 L 208 512 L 208 339 L 58 426 L 10 343 L 160 256 L 10 170 L 58 87 L 208 173 Z" />
            </svg>
        </div>
        <span className="text-2xl font-bold text-gray-800">{count}+</span>
        <span className="text-sm text-gray-500">{label}</span>
    </div>
);

//testimonial card
const TestimonialCard = () => (
    <Card className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <CardContent className="p-0 space-y-3">
            <div className="text-3xl text-gray-300 leading none">"</div>
            <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div>
                <p className="text-sm font-semibold text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Position, Company</p>
            </div>
        </CardContent>
    </Card>
);

//static tier data (to be updated with real package details)
const TIERS: TierCardProps[] = [
    {
        tier: "Bronze",
        features: [
            "Logo on MSC website", 
            "Social media mention",
            "Event booth slot",
            "Certificate of partnership",
        ],
    },
    {
        tier: "Silver",
        features: [
            "All Bronze benefits",
            "Featured in newsletter",
            "Webinar speaking slot",
        ],
    },
    {
        tier: "Gold",
        features: [
            "All Silver benefits",
            "Co-branded marketing materials",
            "Exclusive networking events",
        ],
    }
];

//page
export default function PartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${API_BASE}/partners`);

                if (!res.ok){
                    const err = await res.json();
                    throw new Error(err?.error?.message || "Failed to load partners.");
                }

                const json = await res.json();
                setPartners(json.data);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : "Something went wrong.");
                setPartners(FALLBACK_PARTNERS);//use fallback data on error
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    //group partners by tier
    const byTier = (tier: Partner["tier"]) => partners.filter((p) => p.tier === tier);

    return (
        <div className="min-h-screen w-screen font-sans">
            {/* section 1: partners */}
            <section className="py-16 px-6 text-center">
                <h1 className="text-4xl font-extrabold">
                    <span className="text-sky-500">OUR</span>
                    <span className="text-orange-500"> PARTNERS</span>
                </h1>
                <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
                    We collaborate with tech companies and organizations to bring exclusive benefits to our community members. 
                </p>

                {/* error state */}
                {error && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-red-500 text-sm">
                        {/*<AlertCircle className="w-4 h-4"/>*/}
                        {/*<span>{error}</span>*/}
                    </div>
                )}

                {/* loading skeleton */}
                {loading && (
                <div className="mt-10 grid grid-cols-6 gap-4 w-4/5 mx-auto">
                    {Array(12).fill(null).map((_, i) => <LogoSkeleton key={i} />)}
                </div>
                )}

                {/* partner logos */}
                {!loading && (
                    <div className="mt-10 grid grid-cols-6 gap-4 w-4/5 mx-auto">
                        {partners.map((partner) => (
                            <PartnerLogo key={partner.id} partner={partner} />
                        ))}
                    </div>
                )}
            </section>
            
            {/* section 2: sponsorship packages */}
            <section className="py-16 px-6 bg-gray-100 text-center">
                <h2 className="text-3xl font-extrabold">
                    <span className="text-sky-500">SPONSORSHIP</span>
                    <span className="text-orange-500"> PACKAGES</span>
                </h2>
                <p className="mt-2 text-gray-500 text-sm">
                    Partner with us and engage directly with 300+ members.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {TIERS.map((tier) => (
                        <TierCard key={tier.tier} {...tier} />
                    ))}
                </div>
            </section>

            {/*section 3: why partner w us */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-3xl font-extrabold">
                    <span className="text-sky-500">WHY</span>
                    <span className="text-orange-500"> PARTNER WITH US?</span>
                </h2>
                <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
                    From certifications to career connections, being part of MSC opens
                    doors you didn't know existed.
                </p>
            

                {/* stats row*/}
                <div className="mt-10 flex justify-center gap-12 flex-wrap">
                    <StatBadge color="bg-sky-500" count={partners.length || 0} label="Partners" />
                    <StatBadge color="bg-green-500" count={300} label="Members" />
                    <StatBadge color="bg-orange-500" count={byTier("gold").length || 0} label="Gold Partners" />
                </div>

                {/* testimonials */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                    <TestimonialCard />
                    <TestimonialCard />
                    <TestimonialCard />
                </div>
            </section>

        </div>
    )
}