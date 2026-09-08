interface IconProps {
  className?: string;
}

const base = "shrink-0";

export const IconDropLeaf = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path
      d="M12 2.6c3.4 4.1 6.4 7.6 6.4 11.3a6.4 6.4 0 0 1-12.8 0C5.6 10.2 8.6 6.7 12 2.6Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M12 8.5v8m0-4.2c-1.2-1-2.3-1.3-3.4-1.2.4 1.5 1.6 2.6 3.4 2.9m0-1.7c1.2-1 2.3-1.3 3.4-1.2-.4 1.5-1.6 2.6-3.4 2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const IconStar = ({ className = "w-3.5 h-3.5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.8 6.4 20l1.3-6.3L2.9 9.4l6.4-.7L12 2.8Z" />
  </svg>
);

export const IconCheck = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M4.5 12.6l4.6 4.6L19.5 6.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSearch = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M15.5 15.5L20.5 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconPhone = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path
      d="M5.2 3.8h3.1l1.6 4-2 1.5a12.6 12.6 0 0 0 6.8 6.8l1.5-2 4 1.6v3.1c0 1-.8 1.8-1.8 1.7C10.3 19.9 4.1 13.7 3.5 5.6c-.1-1 .7-1.8 1.7-1.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconMail = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <rect x="3" y="5.2" width="18" height="13.6" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3.8 6.6l8.2 6.2 8.2-6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPin = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 21.5s7-6.1 7-11.2A7 7 0 0 0 5 10.3c0 5.1 7 11.2 7 11.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const IconFactory = ({ className = "w-6 h-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M3 20.5V9.8l5.4 3V9.8l5.4 3V9.8l5.4 3v7.7H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.2 9.2V4.4h3v4.8M15.8 20.5v-4h2.6v4M8 20.5v-4h2.6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconFlask = ({ className = "w-6 h-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M9.6 3h4.8M10.4 3v6L4.9 18a2.4 2.4 0 0 0 2.1 3.5h10a2.4 2.4 0 0 0 2.1-3.5L13.6 9V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.6 15.4h8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="18.2" r="0.9" fill="currentColor" />
  </svg>
);

export const IconShield = ({ className = "w-6 h-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 2.8l7.4 2.7v6c0 4.6-3.1 8.3-7.4 9.7-4.3-1.4-7.4-5.1-7.4-9.7v-6L12 2.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.7 11.8l2.4 2.4 4.3-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTruck = ({ className = "w-6 h-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M2.8 6.2h11v10h-11zM13.8 9.4h3.9l3.5 3.4v3.4h-7.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.4" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconChart = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M4 20.2h16.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6.6 20V11M11.4 20V5.4M16.2 20v-6.4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const IconAlert = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 3.6L22 20.4H2L12 3.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 9.6v4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17.2" r="1.1" fill="currentColor" />
  </svg>
);

export const IconClose = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconSend = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M21 3.8L10.4 14.4M21 3.8l-6.8 17-3.8-6.4L3.6 10.6 21 3.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowDown = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 4.4v15.2m0 0l-5.6-5.6M12 19.6l5.6-5.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLock = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <rect x="4.6" y="10.2" width="14.8" height="10.2" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="15.2" r="1.4" fill="currentColor" />
  </svg>
);

export const IconDiamond = ({ className = "w-3 h-3" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 2.5L21.5 12 12 21.5 2.5 12 12 2.5Z" />
  </svg>
);

export const IconBox = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M12 2.9l8.4 4.2v9.8L12 21.1 3.6 16.9V7.1L12 2.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3.8 7.2L12 11.4l8.2-4.2M12 11.4v9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const IconMenu = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const LogoMark = ({ className = "w-10 h-10" }: IconProps) => (
  <svg viewBox="0 0 48 48" className={`${base} ${className}`} aria-hidden="true">
    <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#C0511C" />
    <rect x="1.5" y="1.5" width="45" height="45" rx="13" stroke="#93400F" strokeWidth="1.4" />
    <path
      d="M24 9.5c5 6 9.3 11.1 9.3 16.5a9.3 9.3 0 0 1-18.6 0C14.7 20.6 19 15.5 24 9.5Z"
      fill="#FAF4EA"
    />
    <path
      d="M24 18v13m0-6.4c-1.8-1.5-3.4-1.9-5-1.8.6 2.2 2.4 3.8 5 4.3m0-2.5c1.8-1.5 3.4-1.9 5-1.8-.6 2.2-2.4 3.8-5 4.3"
      stroke="#C0511C"
      strokeWidth="1.7"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="36.5" cy="12.5" r="2.4" fill="#FAF4EA" opacity="0.85" />
  </svg>
);
