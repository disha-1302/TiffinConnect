import { Brand } from './Brand';

export default function TopBar({ title, subtitle, tabs, activeTab, onTab, actions }) {
  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-[6px] border-b border-line">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 h-[62px]">
          <div className="flex items-center gap-4 min-w-0">
            <Brand size={24} />
            <span className="hidden sm:block h-5 w-px bg-line-2" />
            <div className="min-w-0">
              <p className="font-display text-[15px] leading-tight truncate">{title}</p>
              {subtitle && <p className="text-[11.5px] text-ink-3 leading-tight truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        </div>
      </div>
      {tabs && (
        <div className="shell">
          <nav className="flex gap-1 -mb-px overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onTab(t.key)}
                  className={`nav-link relative px-3 py-2.5 whitespace-nowrap text-[13.5px] ${
                    active ? 'text-ink' : ''
                  }`}
                >
                  {t.label}
                  {t.count != null && (
                    <span className={`ml-1.5 text-[11px] font-semibold ${active ? 'text-tomato' : 'text-ink-3'}`}>
                      {t.count}
                    </span>
                  )}
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-[2px] bg-tomato transition-transform duration-200 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
