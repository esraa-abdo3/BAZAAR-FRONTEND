// Small inline SVG illustrations used across auth/error screens.
// Kept dependency-free (no external images) so they always load instantly
// and match the site's own color palette.

export function LockedIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="142" rx="70" ry="10" fill="#F3F2EE" />
      <circle cx="100" cy="72" r="62" fill="#FBEAEA" />
      <rect
        x="66"
        y="70"
        width="68"
        height="52"
        rx="10"
        fill="#EF4444"
        opacity="0.12"
      />
      <rect
        x="70"
        y="74"
        width="60"
        height="44"
        rx="8"
        fill="#fff"
        stroke="#EF4444"
        strokeWidth="3"
      />
      <path
        d="M82 74V60a18 18 0 0136 0v14"
        stroke="#EF4444"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="100" cy="94" r="6" fill="#EF4444" />
      <rect x="97" y="98" width="6" height="12" rx="3" fill="#EF4444" />
    </svg>
  );
}

export function BlockedIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="142" rx="70" ry="10" fill="#F3F2EE" />
      <circle cx="100" cy="72" r="62" fill="#FEF3E2" />
      <path
        d="M100 40l32 12v22c0 22-14 36-32 42-18-6-32-20-32-42V52l32-12z"
        fill="#fff"
        stroke="#F59E0B"
        strokeWidth="3.5"
      />
      <circle cx="100" cy="80" r="14" stroke="#F59E0B" strokeWidth="3.5" fill="none" />
      <line
        x1="90.5"
        y1="70.5"
        x2="109.5"
        y2="89.5"
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NotFoundIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 220 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="110" cy="142" rx="80" ry="10" fill="#F3F2EE" />
      <rect x="48" y="30" width="90" height="100" rx="10" fill="#fff" stroke="#D9D5CC" strokeWidth="3" />
      <line x1="62" y1="52" x2="124" y2="52" stroke="#E7E3D8" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="66" x2="110" y2="66" stroke="#E7E3D8" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="80" x2="118" y2="80" stroke="#E7E3D8" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="94" x2="96" y2="94" stroke="#E7E3D8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="140" cy="98" r="34" fill="#EEF2FF" />
      <circle cx="136" cy="94" r="17" stroke="#6366F1" strokeWidth="4" fill="#fff" />
      <line
        x1="148"
        y1="106"
        x2="164"
        y2="122"
        stroke="#6366F1"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text
        x="136"
        y="99"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#6366F1"
        fontFamily="sans-serif"
      >
        ?
      </text>
    </svg>
  );
}
