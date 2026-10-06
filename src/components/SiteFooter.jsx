import { Brand } from './Brand';
import { HOSTEL_BLOCKS } from '../services/database';

export default function SiteFooter({ onStudent, onVendor, onAdmin }) {
  return (
    <footer className="bg-ink text-paper mt-auto">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Brand size={26} tone="paper" />
            <p className="mt-4 text-[14.5px] leading-relaxed text-paper/60 max-w-xs">
              Homemade tiffins from trusted kitchens near campus, ordered in under a minute and
              delivered to your hostel block.
            </p>
            <p className="mt-5 eyebrow" style={{ color: 'rgba(251,247,241,0.42)' }}>
              IIITDM Jabalpur
            </p>
          </div>

          <div>
            <p className="eyebrow" style={{ color: 'rgba(251,247,241,0.42)' }}>
              Students
            </p>
            <ul className="mt-4 space-y-2.5 text-[14.5px] text-paper/70">
              <li>
                <button onClick={onStudent} className="hover:text-paper transition-colors">
                  Sign in / register
                </button>
              </li>
              <li>
                <a href="#today" className="hover:text-paper transition-colors">
                  Today&rsquo;s menus
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-paper transition-colors">
                  How ordering works
                </a>
              </li>
              <li>
                <a href="#ai" className="hover:text-paper transition-colors">
                  AI nutrition estimate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow" style={{ color: 'rgba(251,247,241,0.42)' }}>
              Kitchens
            </p>
            <ul className="mt-4 space-y-2.5 text-[14.5px] text-paper/70">
              <li>
                <button onClick={onVendor} className="hover:text-paper transition-colors">
                  Vendor portal
                </button>
              </li>
              <li>
                <a href="#vendors" className="hover:text-paper transition-colors">
                  Publish a daily menu
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-paper transition-colors">
                  Hygiene &amp; cut-offs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow" style={{ color: 'rgba(251,247,241,0.42)' }}>
              Delivering to
            </p>
            <ul className="mt-4 space-y-2.5 text-[14.5px] text-paper/70">
              {HOSTEL_BLOCKS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-[13px]"
          style={{ borderTop: '1px solid rgba(251,247,241,0.14)' }}
        >
          <p style={{ color: 'rgba(251,247,241,0.5)' }}>
            &copy; {new Date().getFullYear()} Tiffin Connect &middot; Built for campus life
          </p>
          <button
            onClick={onAdmin}
            className="self-start sm:self-auto text-[13px] transition-colors"
            style={{ color: 'rgba(251,247,241,0.5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fbf7f1')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(251,247,241,0.5)')}
          >
            Admin access
          </button>
        </div>
      </div>
    </footer>
  );
}
