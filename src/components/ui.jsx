export function StatusTag({ status }) {
  const map = {
    Placed: 'tag-neutral',
    Preparing: 'tag-amber',
    'Out for Delivery': 'tag-tomato',
    Delivered: 'tag-herb',
  };
  return <span className={`tag ${map[status] || 'tag-neutral'}`}>{status}</span>;
}

export function SectionHead({ eyebrow, title, copy, action, align = 'left' }) {
  return (
    <div
      className={`flex flex-wrap gap-6 ${
        align === 'between' ? 'items-end justify-between' : 'items-end'
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="display-2">{title}</h2>
        {copy && <p className="lede mt-4">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, copy, icon, action }) {
  return (
    <div className="border border-dashed border-line-2 rounded-[6px] bg-paper-2/60 px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-4 w-10 h-10 text-ink-3">{icon}</div>}
      <p className="font-display text-lg">{title}</p>
      {copy && <p className="prose-sm mt-1.5 max-w-sm mx-auto">{copy}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

export function Metric({ label, value, tone = 'ink', hint, className = '' }) {
  const tones = {
    ink: 'text-ink',
    tomato: 'text-tomato',
    herb: 'text-herb',
    amber: 'text-amber-ink',
  };
  return (
    <div className={`px-5 py-4 ${className}`}>
      <p className="eyebrow">{label}</p>
      <p className={`num mt-2 text-[2.4rem] leading-none ${tones[tone]}`}>{value}</p>
      {hint && <p className="mt-2 text-[12.5px] text-ink-3">{hint}</p>}
    </div>
  );
}
