/* Hand-drawn style illustrations. Used sparingly as editorial art,
   never as a stand-in for real product photography. */

export function TiffinCarrier({ className = '' }) {
  return (
    <svg viewBox="0 0 420 440" className={className} role="img" aria-label="Stacked tiffin carrier">
      <circle cx="210" cy="238" r="176" fill="none" stroke="var(--color-line-2)" strokeWidth="1.5" />
      <circle cx="210" cy="238" r="152" fill="var(--color-paper-2)" />

      {/* handle */}
      <path
        d="M133 128c0-52 34-84 77-84s77 32 77 84"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M133 128c0-52 34-84 77-84s77 32 77 84"
        fill="none"
        stroke="var(--color-tomato)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 16"
      />

      {/* lid */}
      <rect x="86" y="124" width="248" height="36" rx="6" fill="#0f0c0a" />
      <ellipse cx="210" cy="124" rx="124" ry="33" fill="var(--color-ink)" />
      <ellipse cx="210" cy="116" rx="86" ry="22" fill="none" stroke="#4a423b" strokeWidth="2" />
      <rect x="196" y="86" width="28" height="18" rx="6" fill="var(--color-ink)" />

      {/* clip */}
      <rect x="76" y="150" width="16" height="58" rx="5" fill="#0f0c0a" />
      <rect x="328" y="150" width="16" height="58" rx="5" fill="#0f0c0a" />

      {/* tier one */}
      <rect x="86" y="172" width="248" height="52" rx="4" fill="var(--color-tomato)" />
      <ellipse cx="210" cy="224" rx="124" ry="33" fill="var(--color-tomato-2)" />
      <ellipse cx="210" cy="172" rx="124" ry="33" fill="#e0562f" />

      {/* tier two */}
      <rect x="86" y="240" width="248" height="52" rx="4" fill="#efe6d6" />
      <ellipse cx="210" cy="292" rx="124" ry="33" fill="#d9cdb8" />
      <ellipse cx="210" cy="240" rx="124" ry="33" fill="#f7f1e6" />

      {/* base */}
      <rect x="86" y="308" width="248" height="50" rx="4" fill="var(--color-ink)" />
      <ellipse cx="210" cy="358" rx="124" ry="33" fill="#0f0c0a" />
      <ellipse cx="210" cy="308" rx="124" ry="33" fill="#332c26" />

      {/* steam */}
      <path
        d="M150 60c8-10-8-18 0-28M210 46c8-10-8-18 0-28M270 60c8-10-8-18 0-28"
        fill="none"
        stroke="var(--color-ink-3)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function MealMotif({ variant = 0, className = '' }) {
  const stroke = 'currentColor';
  const common = {
    fill: 'none',
    stroke,
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (variant % 4 === 0) {
    return (
      <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
        <path d="M18 44h74c0 22-16 34-37 34S18 66 18 44z" {...common} />
        <path d="M12 44h86" {...common} />
        <path d="M44 32c6-6-4-12 2-19M60 30c6-7-4-13 2-20M76 32c6-6-4-12 2-19" {...common} />
        <path d="M34 78h42" {...common} opacity="0.45" />
      </svg>
    );
  }
  if (variant % 4 === 1) {
    return (
      <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
        <circle cx="60" cy="50" r="36" {...common} />
        <circle cx="60" cy="50" r="24" {...common} opacity="0.5" />
        <circle cx="42" cy="34" r="8" {...common} />
        <circle cx="76" cy="38" r="7" {...common} />
        <circle cx="58" cy="70" r="7" {...common} />
        <path d="M96 26c4-5-4-9 1-14" {...common} opacity="0.6" />
      </svg>
    );
  }
  if (variant % 4 === 2) {
    return (
      <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
        <ellipse cx="60" cy="62" rx="38" ry="16" {...common} />
        <ellipse cx="60" cy="50" rx="38" ry="16" {...common} />
        <ellipse cx="60" cy="38" rx="38" ry="16" {...common} />
        <path d="M42 34c6 4 14 6 22 5" {...common} opacity="0.5" />
        <path d="M88 20c4-5-4-9 1-14" {...common} opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
      <path d="M24 34h56l6 40c1 8-6 14-15 14H33c-9 0-16-6-15-14z" {...common} />
      <path d="M18 34h68" {...common} />
      <path d="M30 34V24c0-4 4-8 10-8h24c6 0 10 4 10 8v10" {...common} opacity="0.5" />
      <path d="M86 44c8 2 12 8 10 16" {...common} />
      <path d="M42 16c5-6-4-11 2-17M62 16c5-6-4-11 2-17" {...common} opacity="0.55" />
    </svg>
  );
}

export function LeafMark({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 20c0-9 6-15 16-16 1 10-4 17-13 17H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 20C8 15 12 12 17 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
