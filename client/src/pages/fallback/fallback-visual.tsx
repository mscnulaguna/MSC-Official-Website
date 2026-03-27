type FallbackVisualProps = {
    type?: string; //raw type from route param - needs resolution to config key
    accent: string; //accent color from config for svg styling
};

export default function FallbackVisual({ type, accent }: FallbackVisualProps) {
  return (
    <div
      className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-lg relative"
      style={{
        background: `linear-gradient(135deg, ${accent}18 0%, ${accent}30 100%)`,
        border: `1px solid ${accent}25`,
      }}
    >
      {/* ── Swap these SVGs with your own icons per type ── */}
      {type === "404" && <Icon404 accent={accent} />}
      {type === "coming-soon" && <IconComingSoon accent={accent} />}
      {type === "maintenance" && <IconMaintenance accent={accent} />}
      {type === "access-restricted" && <IconAccessRestricted accent={accent} />}
      {type === "no-announcements" && <IconNoAnnouncements accent={accent} />}
    </div>
  );
}


//indiv icons
type Icon404Props = {
  accent: string 
};

type IconComingSoonProps = {
  accent: string
};

type IconMaintenanceProps = {
  accent: string
};

type IconAccessRestrictedProps = {
  accent: string
};

type IconNoAnnouncementsProps = {
  accent: string
};

type IconSomethingWentWrongProps = {
  accent: string
};

function Icon404({ accent }: Icon404Props) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="20" stroke={accent} strokeWidth="2" strokeDasharray="4 3" />
      <text x="28" y="33" textAnchor="middle" fontSize="14" fontWeight="700" fill={accent} fontFamily="Segoe UI, sans-serif">
        404
      </text>
    </svg>
  );
}
 
function IconComingSoon({ accent }: IconComingSoonProps ) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="18" stroke={accent} strokeWidth="2" />
      {/* Clock hands */}
      <line x1="28" y1="28" x2="28" y2="16" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="28" x2="36" y2="32" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2" fill={accent} />
    </svg>
  );
}
 
function IconMaintenance({ accent }: IconMaintenanceProps ) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Wrench */}
      <path
        d="M38 10a8 8 0 0 0-7.8 9.6L14 36a4 4 0 1 0 5.6 5.6l16.2-16.4A8 8 0 1 0 38 10z"
        stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="17" cy="38" r="2" fill={accent} />
    </svg>
  );
}
 
function IconAccessRestricted({ accent }: IconAccessRestrictedProps ) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Lock */}
      <rect x="16" y="26" width="24" height="18" rx="3" stroke={accent} strokeWidth="2" />
      <path d="M20 26v-5a8 8 0 0 1 16 0v5" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="35" r="3" fill={accent} />
      <line x1="28" y1="38" x2="28" y2="41" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
 
function IconNoAnnouncements({ accent }: IconNoAnnouncementsProps ) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Bell with x */}
      <path
        d="M28 12a14 14 0 0 1 14 14v7l3 4H11l3-4v-7A14 14 0 0 1 28 12z"
        stroke={accent} strokeWidth="2" strokeLinejoin="round"
      />
      <path d="M24 37a4 4 0 0 0 8 0" stroke={accent} strokeWidth="2" />
      <line x1="22" y1="22" x2="34" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="22" x2="22" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
