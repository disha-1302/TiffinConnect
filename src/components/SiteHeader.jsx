import { useEffect, useState } from 'react';
import { Brand } from './Brand';

const links = [
  { href: '#today', label: "Today's menu" },
  { href: '#how', label: 'How it works' },
  { href: '#trust', label: 'Why us' },
  { href: '#vendors', label: 'For vendors' },
];

export default function SiteHeader({ onStudent, onVendor }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/92 backdrop-blur-[8px] transition-[border-color,box-shadow] duration-200 ${
        scrolled ? 'border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <div className="shell">
        <div className="flex items-center justify-between h-[68px] gap-6">
          <Brand size={26} />

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link link-underline">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onVendor} className="btn btn-ghost btn-sm hidden sm:inline-flex">
              List your kitchen
            </button>
            <button onClick={onStudent} className="btn btn-dark btn-sm">
              Order food
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
