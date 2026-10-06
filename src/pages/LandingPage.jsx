import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { TiffinCarrier, MealMotif, LeafMark } from '../components/FoodArt';
import { EmptyState } from '../components/ui';
import { HOSTEL_BLOCKS } from '../services/database';

const MOTIF_TINTS = [
  { bg: '#FBEDE6', fg: 'var(--color-tomato)' },
  { bg: '#E9F1EA', fg: 'var(--color-herb)' },
  { bg: '#FAF1DD', fg: 'var(--color-amber-ink)' },
  { bg: '#F4EDE1', fg: 'var(--color-ink-2)' },
];

const motifIndex = (id) =>
  [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;

const STEPS = [
  {
    n: '01',
    t: 'Pick today’s kitchen',
    d: 'Every kitchen publishes what it is cooking, the price and the exact cut-off time — before you commit to anything.',
  },
  {
    n: '02',
    t: 'Order before the cut-off',
    d: 'Choose your quantity, hostel block and room. One confirmation, no hidden steps, no surprise charges.',
  },
  {
    n: '03',
    t: 'Track it to your hall',
    d: 'Placed, Preparing, Out for Delivery — you see the same status the kitchen sees, live on your order.',
  },
];

const REASONS = [
  {
    t: 'Cut-offs, not guesswork',
    d: 'Each menu tells you exactly when ordering closes, so the kitchen cooks to a real number.',
  },
  {
    t: 'Delivered where you live',
    d: 'Hall and room are part of the order. Vendors group deliveries block-wise for faster rounds.',
  },
  {
    t: 'The real menu, in plain text',
    d: 'No stock photos of food you will not receive. Kitchens list exactly what is in the tiffin.',
  },
  {
    t: 'A nutrition read before you eat',
    d: 'One tap asks the AI for an estimate of calories, protein and carbs for that specific meal.',
  },
];

export default function LandingPage({ setCurrentView, menus = [], vendors = [] }) {
  const goStudent = () => setCurrentView('auth-student');
  const goVendor = () => setCurrentView('auth-vendor');

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const liveMenus = menus.slice(0, 4);
  const popular = [...menus].slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader onStudent={goStudent} onVendor={goVendor} />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="shell">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center pt-14 pb-20 md:pt-20 md:pb-28">
              {/* left */}
              <div className="max-w-[620px]">
                <p className="eyebrow flex items-center gap-2.5">
                  <LeafMark className="w-4 h-4 text-herb" />
                  IIITDM Jabalpur &middot; campus kitchens
                </p>

                <h1 className="display-1 mt-6">
                  Home-style tiffins,
                  <br />
                  <span className="text-tomato">delivered to your block.</span>
                </h1>

                <p className="lede mt-6 max-w-[520px]">
                  Tiffin Connect brings the kitchens around campus onto one shelf. Read the
                  day&rsquo;s menu, order before the cut-off, and track it straight to your hall
                  room — the way a hostel meal should work.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={goStudent} className="btn btn-primary btn-lg">
                    Browse today&rsquo;s menu
                  </button>
                  <button onClick={goVendor} className="btn btn-outline btn-lg">
                    List your kitchen
                  </button>
                </div>

                <dl className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-y-6 border-t border-line pt-7">
                  <div className="pr-6">
                    <dt className="eyebrow">Hostel blocks</dt>
                    <dd className="num text-[1.9rem] leading-none mt-2">{HOSTEL_BLOCKS.length}</dd>
                  </div>
                  <div className="sm:border-l border-line sm:pl-6 pr-6">
                    <dt className="eyebrow">Kitchens live</dt>
                    <dd className="num text-[1.9rem] leading-none mt-2">{vendors.length}</dd>
                  </div>
                  <div className="border-t sm:border-t-0 border-line pt-6 sm:pt-0 sm:border-l sm:pl-6 col-span-2 sm:col-span-1">
                    <dt className="eyebrow">Menus listed today</dt>
                    <dd className="num text-[1.9rem] leading-none mt-2">{menus.length}</dd>
                  </div>
                </dl>
              </div>

              {/* right */}
              <div className="relative">
                <div className="relative mx-auto max-w-[430px] lg:max-w-none">
                  <TiffinCarrier className="w-full h-auto max-h-[440px]" />
                </div>

                <div className="mt-6 lg:mt-0 lg:absolute lg:-left-4 lg:bottom-2 lg:w-[290px] panel p-4 shadow-[0_18px_40px_-24px_rgba(25,21,18,0.4)]">
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <p className="eyebrow">On the shelf</p>
                    <p className="text-[11.5px] text-ink-3">{today}</p>
                  </div>

                  {liveMenus.length > 0 ? (
                    <ul className="divide-y divide-line">
                      {liveMenus.map((m) => (
                        <li key={m.id} className="flex items-baseline justify-between gap-3 py-2.5">
                          <span className="text-[13.5px] font-medium leading-snug truncate">
                            {m.vendorName}
                          </span>
                          <span className="num text-[15px] shrink-0">₹{m.price}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13.5px] leading-relaxed text-ink-3 py-3">
                      Kitchens post their menu each morning. Sign in to see it the moment it goes
                      live.
                    </p>
                  )}

                  <p className="mt-3 pt-3 border-t border-line text-[12px] text-ink-3">
                    Delivering to {HOSTEL_BLOCKS.length} hostel blocks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TODAY'S MENUS ============ */}
        <section id="today" className="scroll-mt-24 border-t border-line bg-paper-2/50">
          <div className="shell section-pad">
            <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow mb-3">Today&rsquo;s shelf</p>
                <h2 className="display-2">
                  What the kitchens
                  <br />
                  are cooking.
                </h2>
                <p className="prose-sm mt-4 max-w-xs">
                  Menus change daily. Price and cut-off are set by the kitchen — what you read is
                  what you pay.
                </p>
                <button onClick={goStudent} className="btn btn-dark mt-6">
                  Sign in to order
                </button>
              </div>

              <div>
                {popular.length === 0 ? (
                  <EmptyState
                    title="No menus published yet"
                    copy="Kitchens haven’t posted today’s menu. It usually appears by late morning — sign in to catch it first."
                    icon={<MealMotif variant={0} className="w-full h-full" />}
                    action={
                      <button onClick={goStudent} className="btn btn-outline btn-sm">
                        Open student portal
                      </button>
                    }
                  />
                ) : (
                  <ul className="border-t border-line-2">
                    {popular.map((m, i) => {
                      const tint = MOTIF_TINTS[motifIndex(m.id)];
                      return (
                        <li
                          key={m.id}
                          className="group border-b border-line py-6 first:pt-0 flex flex-col sm:flex-row gap-5 sm:gap-7 items-start"
                        >
                          <div
                            className="shrink-0 w-[92px] h-[76px] rounded-[5px] grid place-items-center"
                            style={{ background: tint.bg, color: tint.fg }}
                          >
                            <MealMotif variant={motifIndex(m.id) + i} className="w-[62px] h-auto" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="eyebrow">Menu {String(i + 1).padStart(2, '0')}</p>
                                <h3 className="display-3 mt-1.5">{m.vendorName}</h3>
                              </div>
                              <p className="num text-[1.6rem] leading-none shrink-0">₹{m.price}</p>
                            </div>
                            <p className="prose-sm mt-2 max-w-xl">{m.items}</p>
                            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                              <span className="tag tag-neutral">Cut-off {m.cutoffTime}</span>
                              {m.date && <span className="tag tag-neutral">Listed {m.date}</span>}
                              <button
                                onClick={goStudent}
                                className="ml-auto text-[13.5px] font-semibold text-tomato hover:text-tomato-2 transition-colors"
                              >
                                Order &rarr;
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section id="how" className="scroll-mt-24 border-t border-line">
          <div className="shell section-pad">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">How it works</p>
              <h2 className="display-2">
                Three steps, and the
                <br />
                tiffin is on its way.
              </h2>
            </div>

            <ol className="mt-12 grid md:grid-cols-3 border-t border-line-2">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`py-8 md:py-10 md:px-8 ${i === 0 ? 'md:pl-0' : ''} ${
                    i > 0 ? 'md:border-l border-line' : ''
                  } ${i > 0 ? 'border-t md:border-t-0 border-line' : ''}`}
                >
                  <p className="num text-tomato text-[1.05rem]">{s.n}</p>
                  <h3 className="display-3 mt-4">{s.t}</h3>
                  <p className="prose-sm mt-3 pr-4">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ WHY STUDENTS ============ */}
        <section id="why" className="scroll-mt-24 border-t border-line bg-paper-2/50">
          <div className="shell section-pad">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-20">
              <div>
                <p className="eyebrow mb-3">Why students use it</p>
                <h2 className="display-2">
                  Built around the
                  <br />
                  mess-hall problem.
                </h2>
                <p className="lede mt-5 max-w-md">
                  Hostel food fails on the same four things: you don&rsquo;t know what&rsquo;s
                  cooking, you find out too late, delivery is vague, and nobody tells you what is
                  actually on the plate.
                </p>
              </div>

              <ul className="border-t border-line-2">
                {REASONS.map((r) => (
                  <li key={r.t} className="grid sm:grid-cols-[1fr_1.4fr] gap-2 sm:gap-8 py-6 border-b border-line">
                    <h3 className="text-[17px] font-semibold leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
                      {r.t}
                    </h3>
                    <p className="prose-sm">{r.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section id="trust" className="scroll-mt-24 bg-ink text-paper">
          <div className="shell section-pad">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              <div>
                <p className="eyebrow" style={{ color: 'rgba(251,247,241,0.45)' }}>
                  Trust, hygiene, reliability
                </p>
                <h2 className="display-2 mt-4">
                  You should know
                  <br />
                  whose kitchen it is.
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
                {[
                  {
                    t: 'Named kitchens',
                    d: 'Every listing shows the centre name and owner. Nothing anonymous reaches your room.',
                  },
                  {
                    t: 'Fixed cut-offs',
                    d: 'Orders close at a stated time, so kitchens cook to confirmed numbers — never a guess.',
                  },
                  {
                    t: 'Visible status',
                    d: 'Placed, Preparing, Out for Delivery. The same timeline on both sides of the order.',
                  },
                ].map((x, i) => (
                  <div
                    key={x.t}
                    className={`pt-6 ${
                      i > 0 ? 'sm:pl-6 sm:border-l' : ''
                    }`}
                    style={{ borderColor: 'rgba(251,247,241,0.16)' }}
                  >
                    <div className="w-8 h-8 rounded-full grid place-items-center mb-4 border border-tomato text-tomato">
                      <span className="num text-[13px]">{i + 1}</span>
                    </div>
                    <h3 className="text-[17px] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
                      {x.t}
                    </h3>
                    <p className="text-[14.5px] leading-relaxed mt-2" style={{ color: 'rgba(251,247,241,0.62)' }}>
                      {x.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ AI ============ */}
        <section id="ai" className="scroll-mt-24 border-b border-line">
          <div className="shell section-pad">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="eyebrow mb-3">On-device help, not a gimmick</p>
                <h2 className="display-2">
                  Know what&rsquo;s on
                  <br />
                  the plate.
                </h2>
                <p className="lede mt-5 max-w-lg">
                  Ask for a nutrition read on any listed meal and you get one plain line back —
                  calories, protein and carbs. Kitchens get the mirror tool: turn a dry ingredient
                  list into a line people actually want to order.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <span className="tag tag-neutral">Nutrition estimate</span>
                  <span className="tag tag-neutral">Menu copy assist</span>
                  <span className="tag tag-neutral">One-line results</span>
                </div>
              </div>

              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-paper-2/60">
                  <p className="eyebrow">Example output</p>
                  <span className="tag tag-tomato">AI</span>
                </div>
                <div className="p-6">
                  <p className="text-[13.5px] text-ink-3">Meal</p>
                  <p className="text-[15.5px] font-medium mt-1">
                    Rajma, steamed rice, 4 phulka, salad
                  </p>
                  <div className="mt-5 rule pt-5">
                    <p className="eyebrow mb-2">Nutrition estimate</p>
                    <p className="num text-[1.35rem] sm:text-[1.5rem] text-herb leading-snug">
                      est. 620 kcal &middot; 21g protein &middot; 88g carbs
                    </p>
                  </div>
                  <p className="mt-5 text-[12.5px] text-ink-3 leading-relaxed">
                    Estimates are generated per meal and are indicative only — not medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FOR VENDORS ============ */}
        <section id="vendors" className="scroll-mt-24 bg-paper-2/50">
          <div className="shell section-pad">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
              <div>
                <p className="eyebrow mb-3">For tiffin centres</p>
                <h2 className="display-2">
                  Publish the menu once.
                  <br />
                  Get block-wise orders.
                </h2>
                <p className="lede mt-5 max-w-xl">
                  Post what you&rsquo;re cooking with a price and a cut-off. Orders arrive grouped
                  by hostel block with room numbers, quantities and a status you control — Placed,
                  Preparing, Out for Delivery, Delivered.
                </p>

                <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    'Daily menu with cut-off time',
                    'Orders grouped hostel-wise',
                    'Live tiffin count per block',
                    'Order history & delivery log',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] border-b border-line pb-3">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-tomato shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button onClick={goVendor} className="btn btn-dark btn-lg mt-8">
                  Open vendor portal
                </button>
              </div>

              <div className="panel p-6 sm:p-7">
                <p className="eyebrow">Order board</p>
                <div className="mt-5 space-y-3">
                  {[
                    { k: 'Hall 4', v: '18 tiffins', s: 'Preparing' },
                    { k: 'Hall 3', v: '11 tiffins', s: 'Out for Delivery' },
                    { k: 'PG Hostel', v: '6 tiffins', s: 'Placed' },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 border border-line rounded-[5px] bg-paper/70"
                    >
                      <div>
                        <p className="text-[15px] font-semibold">{row.k}</p>
                        <p className="text-[12.5px] text-ink-3">{row.v}</p>
                      </div>
                      <span
                        className={`tag ${
                          row.s === 'Out for Delivery'
                            ? 'tag-tomato'
                            : row.s === 'Preparing'
                            ? 'tag-amber'
                            : 'tag-neutral'
                        }`}
                      >
                        {row.s}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 pt-4 border-t border-line text-[12.5px] text-ink-3">
                  Illustration of a live order board — real numbers come from your orders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="bg-tomato text-white">
          <div className="shell py-16 md:py-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Ready when you are
                </p>
                <h2 className="display-2 mt-4">
                  Dinner doesn&rsquo;t have to be
                  <br />
                  a hostel gamble.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={goStudent}
                  className="btn btn-lg"
                  style={{ background: '#fff', color: 'var(--color-tomato-2)' }}
                >
                  Create a student account
                </button>
                <button
                  onClick={goVendor}
                  className="btn btn-lg"
                  style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
                >
                  Join as a kitchen
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onStudent={goStudent} onVendor={goVendor} onAdmin={() => setCurrentView('admin-dashboard')} />
    </div>
  );
}
