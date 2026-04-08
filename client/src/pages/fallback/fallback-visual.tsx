import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { FallbackType } from '../../config/fallback-config';

const LOTTIE_URLS: Record<FallbackType, string> = {
  "404":                "/lottie/UFO%20animation.lottie",
  "comingSoon":         "/lottie/Fire.lottie",
  "maintenance":        "/lottie/maintenance.lottie",
  "accessRestricted":   "/lottie/access-restricted.lottie",
  "noAnnouncements":    "/lottie/UFO%20animation.lottie",
  "somethingWentWrong": "/lottie/UFO%20animation.lottie",
};

// Ambient/ongoing states loop; terminal error states play once.
const LOOP_CONFIG: Record<FallbackType, boolean> = {
  "404":                true,
  "comingSoon":         true,
  "maintenance":        true,
  "accessRestricted":   true,
  "noAnnouncements":    true,
  "somethingWentWrong": true,
};

// ─── Props ────────────────────────────────────────────────────────────────────

type FallbackVisualProps = {
  type: FallbackType;
  accent: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FallbackVisual({ type, accent }: FallbackVisualProps) {
  const src = LOTTIE_URLS[type];

  return (
    <div
      className="w-60 h-60 rounded-full"
      style={{ background: `color-mix(in srgb, ${accent} 0%, transparent)` }}
    >
      <DotLottieReact
        src={src}
        loop={LOOP_CONFIG[type]}
        autoplay
        style={{ width: 260, height: 260 }}
      />
    </div>
  );
}