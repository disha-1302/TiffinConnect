import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { StatusTag, Metric, EmptyState } from '../components/ui';
import { Brand } from '../components/Brand';
import { TiffinCarrier } from '../components/FoodArt';

const SECTIONS = [
  { key: 'adm-overview', label: 'Overview' },
  { key: 'adm-vendors', label: 'Vendors' },
  { key: 'adm-students', label: 'Students' },
  { key: 'adm-orders', label: 'Orders' },
];

function PinGate({ onBack, onAuth }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="shell">
        <div className="flex items-center justify-between h-[68px]">
          <Brand size={24} />
          <button onClick={onBack} className="btn btn-ghost btn-sm">
            ← Back to site
          </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 items-stretch">
        <div className="hidden lg:flex items-center justify-center border-r border-line bg-paper-2/50 p-10">
          <div className="w-[280px] opacity-95">
            <TiffinCarrier className="w-full h-auto" />
          </div>
        </div>

        <div className="flex items-center px-6 sm:px-10 lg:px-16 py-14">
          <div className="w-full max-w-[380px]">
            <p className="eyebrow">Restricted</p>
            <h1 className="display-1 text-[clamp(2.2rem,4vw,3rem)] mt-4">Admin access</h1>
            <p className="lede mt-4">
              Entry to the campus database — every registered student, kitchen and order in one
              place.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pin === '132006') onAuth();
                else {
                  setErr(true);
                  setPin('');
                }
              }}
              className="mt-9"
            >
              <label className="field-label">6-digit PIN</label>
              <input
                type="password"
                maxLength="6"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErr(false);
                }}
                className={`field text-center text-2xl tracking-[0.5em] font-semibold ${
                  err ? 'border-tomato text-tomato' : ''
                }`}
                placeholder="••••••"
              />
              {err && <p className="text-[13px] text-tomato mt-2">Incorrect PIN. Try again.</p>}
              <button type="submit" className="btn btn-dark btn-lg btn-block mt-5">
                Verify &amp; enter
              </button>
            </form>

            <p className="text-[13px] text-ink-3 mt-6 pt-5 border-t border-line">
              Demo PIN <span className="font-semibold text-ink">132006</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ vendors, students, orders, onBack }) {
  const [auth, setAuth] = useState(false);
  const [active, setActive] = useState('adm-overview');

  useEffect(() => {
    if (!auth) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.3] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [auth]);

  if (!auth)
    return <PinGate onBack={onBack} onAuth={() => setAuth(true)} />;

  const jump = (key) => {
    setActive(key);
    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const th = 'py-3 px-5 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-3 border-b border-line-2 whitespace-nowrap';
  const td = 'py-3.5 px-5 text-[14.5px] border-b border-line align-middle';

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title="Database overview"
        subtitle="Super admin control panel"
        tabs={SECTIONS}
        activeTab={active}
        onTab={jump}
        actions={
          <button onClick={onBack} className="btn btn-dark btn-sm">
            Exit admin
          </button>
        }
      />

      <div className="shell py-8 md:py-10 flex-1">
        {/* stats */}
        <section id="adm-overview" className="scroll-mt-28">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Campus network</p>
            <h1 className="display-2">Everything on record.</h1>
          </div>

          <div className="mt-6 panel grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
            <Metric label="Registered students" value={students.length} className="sm:border-r border-b sm:border-b-0 border-line" />
            <Metric label="Tiffin centres" value={vendors.length} tone="tomato" className="border-b sm:border-b-0 sm:border-r border-line" />
            <Metric label="Orders processed" value={orders.length} tone="herb" />
          </div>
        </section>

        {/* vendors */}
        <section id="adm-vendors" className="scroll-mt-28 mt-12">
          <div className="flex items-end justify-between gap-4 border-b border-line-2 pb-3">
            <div>
              <p className="eyebrow mb-2.5">Management</p>
              <h2 className="display-3 text-[1.5rem]">Registered vendors</h2>
            </div>
            <span className="tag tag-neutral">{vendors.length} total</span>
          </div>

          <div className="panel mt-5 overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className={th}>Centre name</th>
                  <th className={th}>Owner</th>
                  <th className={th}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-0 border-b-0">
                      <div className="px-5 py-8">
                        <EmptyState title="No vendors registered" copy="Tiffin centres appear here once they create an account." />
                      </div>
                    </td>
                  </tr>
                ) : (
                  vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-paper-2/60 transition-colors">
                      <td className={`${td} font-medium`}>{v.name}</td>
                      <td className={`${td} text-ink-2`}>{v.owner}</td>
                      <td className={`${td} text-ink-2 tabular-nums`}>{v.phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* students */}
        <section id="adm-students" className="scroll-mt-28 mt-12">
          <div className="flex items-end justify-between gap-4 border-b border-line-2 pb-3">
            <div>
              <p className="eyebrow mb-2.5">Management</p>
              <h2 className="display-3 text-[1.5rem]">Registered students</h2>
            </div>
            <span className="tag tag-neutral">{students.length} total</span>
          </div>

          <div className="panel mt-5 overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Phone</th>
                  <th className={th}>Hostel &amp; room</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-0 border-b-0">
                      <div className="px-5 py-8">
                        <EmptyState title="No students registered" copy="Student accounts appear here as they sign up." />
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-paper-2/60 transition-colors">
                      <td className={`${td} font-medium`}>{s.name}</td>
                      <td className={`${td} text-ink-2 tabular-nums`}>{s.phone}</td>
                      <td className={td}>
                        <span className="tag tag-neutral">
                          {s.hostelBlock} · Rm {s.roomNo}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* orders */}
        <section id="adm-orders" className="scroll-mt-28 mt-12 mb-4">
          <div className="flex items-end justify-between gap-4 border-b border-line-2 pb-3">
            <div>
              <p className="eyebrow mb-2.5">Logs</p>
              <h2 className="display-3 text-[1.5rem]">Order history</h2>
            </div>
            <span className="tag tag-neutral">{orders.length} total</span>
          </div>

          <div className="panel mt-5 overflow-x-auto">
            <table className="w-full border-collapse min-w-[680px]">
              <thead>
                <tr>
                  <th className={th}>Order</th>
                  <th className={th}>Student</th>
                  <th className={th}>Vendor</th>
                  <th className={th}>Qty</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-0 border-b-0">
                      <div className="px-5 py-8">
                        <EmptyState title="No orders recorded yet" copy="Every placed order is logged here with its final status." />
                      </div>
                    </td>
                  </tr>
                ) : (
                  [...orders].reverse().map((o) => (
                    <tr key={o.id} className="hover:bg-paper-2/60 transition-colors">
                      <td className={`${td} text-ink-3 text-[13px] tabular-nums`}>{o.id.replace('ord_', '')}</td>
                      <td className={`${td} font-medium`}>{o.studentName}</td>
                      <td className={`${td} text-ink-2`}>{o.vendorName}</td>
                      <td className={`${td} font-semibold`}>×{o.quantity}</td>
                      <td className={td}>
                        <StatusTag status={o.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
