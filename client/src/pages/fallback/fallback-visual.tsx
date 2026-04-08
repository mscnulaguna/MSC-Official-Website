import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { FallbackType } from '../../config/fallback-config';

const LOTTIE_URLS: Record<FallbackType, string> = {
  "404":                "/lottie/ufo.lottie",
  "comingSoon":         "/lottie/Fire.lottie",
  "maintenance":        "/lottie/maintenance.lottie",
  "accessRestricted":   "/lottie/access-restricted.lottie",
  "noAnnouncements":    "/lottie/ufo.lottie",
  "somethingWentWrong": "/lottie/ufo.lottie",
};

// Ambient/ongoing states loop
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

export default function FallbackVisual({ type }: FallbackVisualProps) {
  const src = LOTTIE_URLS[type];

  return (
    <div
      className="w-90 h-90"
    >
      <DotLottieReact
        src={src}
        loop={LOOP_CONFIG[type]}
        autoplay
        style={{ width: 360, height: 360 }}
      />
    </div>
  );
}