export function Mark({ size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="4" fill="var(--color-ink)" />
      <path
        d="M9 12.5c0-2.6 2-4.5 7-4.5s7 1.9 7 4.5"
        stroke="var(--color-tomato)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect x="8" y="13.2" width="16" height="4.4" rx="1.2" fill="var(--color-tomato)" />
      <rect x="8" y="18.6" width="16" height="4.4" rx="1.2" fill="var(--color-paper)" />
      <rect x="8" y="24" width="16" height="2.4" rx="1.2" fill="var(--color-tomato)" opacity="0.55" />
    </svg>
  );
}

export function Brand({ size = 26, tone = 'ink', onClick }) {
  const color = tone === 'paper' ? 'text-paper' : 'text-ink';
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`flex items-center gap-2.5 ${color} ${onClick ? 'bg-transparent border-0 p-0' : ''}`}
    >
      <Mark size={size} />
      <span
        className="font-display leading-none"
        style={{ fontSize: size * 0.72, fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        Tiffin&nbsp;Connect
      </span>
    </Wrapper>
  );
}
