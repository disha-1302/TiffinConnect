import { useState, useEffect, useRef } from 'react';
import { generateTextWithGemini } from '../services/gemini';
import TopBar from '../components/TopBar';
import ProfileModal from '../components/ProfileModal';
import { EmptyState, Metric } from '../components/ui';

const NAV = [
  { id: 'sec-overview', label: 'Overview' },
  { id: 'sec-menu', label: 'Menu' },
  { id: 'sec-orders', label: 'Orders' },
  { id: 'sec-analytics', label: 'Analytics' },
];

const statusSelectClass = {
  Placed: 'bg-paper-2 text-ink-2 border-line-2',
  Preparing: 'bg-amber-50 text-amber-ink border-[#ead9b4]',
  'Out for Delivery': 'bg-tomato-50 text-tomato-2 border-[#efd2c7]',
  Delivered: 'bg-herb-50 text-herb border-[#cfe0d4]',
};

export default function VendorDashboard({
  vendor,
  menus,
  orders,
  onAddMenu,
  onUpdateMenu,
  onDeleteMenu,
  onUpdateOrderStatus,
  onLogout,
  onUpdateProfile,
  onDeleteAccount,
}) {
  const [items, setItems] = useState('');
  const [price, setPrice] = useState('');
  const [cutoffTime, setCutoffTime] = useState('');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-overview');
  const navLock = useRef(false);

  const myMenus = menus.filter((m) => m.vendorId === vendor.id);
  const activeOrders = orders.filter((o) => o.vendorId === vendor.id && o.status !== 'Delivered');
  const pastOrders = orders
    .filter((o) => o.vendorId === vendor.id && o.status === 'Delivered')
    .reverse();
  const allMyOrders = orders.filter((o) => o.vendorId === vendor.id);

  const groupedOrders = activeOrders.reduce((acc, order) => {
    if (!acc[order.hostelBlock]) acc[order.hostelBlock] = [];
    acc[order.hostelBlock].push(order);
    return acc;
  }, {});

  const priceOf = (order) => order.quantity * (menus.find((m) => m.id === order.menuId)?.price || 0);

  const analytics = Object.entries(
    allMyOrders.reduce((acc, o) => {
      const k = o.hostelBlock;
      if (!acc[k]) acc[k] = { count: 0, tiffins: 0, revenue: 0 };
      acc[k].count += 1;
      acc[k].tiffins += Number(o.quantity);
      acc[k].revenue += priceOf(o);
      return acc;
    }, {})
  ).sort((a, b) => b[1].tiffins - a[1].tiffins);
  const maxTiffins = Math.max(1, ...analytics.map(([, v]) => v.tiffins));
  const totalRevenue = allMyOrders.reduce((s, o) => s + priceOf(o), 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (navLock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.4] }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const jump = (id) => {
    navLock.current = true;
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      navLock.current = false;
    }, 750);
  };

  const handleMagicEnhance = async () => {
    if (!items.trim()) return;
    setIsEnhancing(true);
    const systemInstruction =
      'You are an expert food copywriter. Enhance the provided Indian tiffin menu into a VERY SHORT, punchy, and appetizing phrase (maximum 8-10 words). Do not add new items. Keep it short and sweet. DO NOT use quotes.';
    const prompt = `Enhance this menu concisely: ${items}`;
    const enhancedText = await generateTextWithGemini(prompt, systemInstruction);
    if (enhancedText && !enhancedText.includes('unavailable')) setItems(enhancedText.replace(/["']/g, ''));
    setIsEnhancing(false);
  };

  const submitMenu = (e) => {
    e.preventDefault();
    if (editingMenuId)
      onUpdateMenu({
        id: editingMenuId,
        vendorId: vendor.id,
        vendorName: vendor.name,
        items,
        price: Number(price),
        cutoffTime,
        date: new Date().toLocaleDateString(),
      });
    else
      onAddMenu({
        id: `menu_${Date.now()}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        items,
        price: Number(price),
        cutoffTime,
        date: new Date().toLocaleDateString(),
      });
    setEditingMenuId(null);
    setItems('');
    setPrice('');
    setCutoffTime('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title={vendor.name}
        subtitle={`Owner ${vendor.owner} · ${vendor.phone}`}
        actions={
          <>
            <button onClick={() => setShowProfile(true)} className="btn btn-outline btn-sm">
              Settings
            </button>
            <button onClick={onLogout} className="btn btn-ghost btn-sm" title="Sign out">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </>
        }
      />

      <div className="shell py-7 md:py-9 flex-1">
        <div className="grid lg:grid-cols-[186px_1fr] gap-8 lg:gap-12 items-start">
          {/* ---------- side nav ---------- */}
          <nav className="lg:sticky lg:top-[92px] -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto">
            <ul className="flex lg:block gap-1 min-w-max lg:min-w-0 lg:border-l lg:border-line">
              {NAV.map((n) => {
                const active = activeSection === n.id;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => jump(n.id)}
                      className={`w-full text-left px-3.5 py-2.5 text-[14px] transition-colors border-l-2 ${
                        active
                          ? 'border-tomato text-ink font-semibold'
                          : 'border-transparent text-ink-3 hover:text-ink-2'
                      }`}
                    >
                      {n.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ---------- content ---------- */}
          <div className="space-y-12 min-w-0">
            {/* overview */}
            <section id="sec-overview" className="scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2.5">Today</p>
                  <h1 className="display-2">Kitchen overview</h1>
                </div>
                <button onClick={() => jump('sec-menu')} className="btn btn-primary btn-sm">
                  {editingMenuId ? 'Edit menu' : 'Publish a menu'}
                </button>
              </div>

              <div className="mt-6 panel grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
                <Metric
                  label="Live orders"
                  value={activeOrders.length}
                  hint="Awaiting delivery"
                  className="border-r border-b border-line lg:border-b-0"
                />
                <Metric
                  label="Tiffins to prep"
                  value={activeOrders.reduce((s, o) => s + Number(o.quantity), 0)}
                  tone="tomato"
                  hint="Across all blocks"
                  className="border-b border-line lg:border-b-0 lg:border-r"
                />
                <Metric label="Menus live" value={myMenus.length} tone="herb" hint="Published by you" className="border-r border-line" />
                <Metric label="Delivered" value={pastOrders.length} tone="amber" hint="All time" />
              </div>
            </section>

            {/* menu */}
            <section id="sec-menu" className="scroll-mt-28">
              <div className="flex items-end justify-between gap-4 border-b border-line-2 pb-3">
                <div>
                  <p className="eyebrow mb-2.5">Menu management</p>
                  <h2 className="display-3 text-[1.5rem]">
                    {editingMenuId ? 'Edit published menu' : 'Publish today’s menu'}
                  </h2>
                </div>
                {editingMenuId && (
                  <button
                    onClick={() => {
                      setItems('');
                      setPrice('');
                      setCutoffTime('');
                      setEditingMenuId(null);
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <form onSubmit={submitMenu} className="panel p-5 sm:p-6 mt-5 space-y-4">
                <div>
                  <label className="field-label">What&rsquo;s cooking?</label>
                  <div className="relative">
                    <textarea
                      rows="3"
                      required
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      className="field pr-12"
                      placeholder="e.g. Kadhai paneer, 4 phulka, jeera rice, salad"
                    />
                    <button
                      type="button"
                      onClick={handleMagicEnhance}
                      disabled={isEnhancing || !items.trim()}
                      title="Rewrite this menu line with AI"
                      className="absolute right-2.5 bottom-3 w-8 h-8 grid place-items-center rounded-[4px] border border-line-2 bg-paper text-ink-2 hover:border-ink-3 hover:text-ink transition-colors disabled:opacity-45"
                    >
                      {isEnhancing ? (
                        <span className="w-4 h-4 rounded-full border-2 border-ink-3 border-t-ink animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.7"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[12.5px] text-ink-3 mt-2">
                    Students see this text exactly as you write it.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="field"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="field-label">Cut-off time</label>
                    <input
                      required
                      type="time"
                      value={cutoffTime}
                      onChange={(e) => setCutoffTime(e.target.value)}
                      className="field"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="submit" className={`btn ${editingMenuId ? 'btn-dark' : 'btn-primary'}`}>
                    {editingMenuId ? 'Update menu' : 'Publish menu'}
                  </button>
                </div>
              </form>

              <div className="mt-7">
                <p className="eyebrow mb-3">Live published menus</p>
                {myMenus.length === 0 ? (
                  <EmptyState
                    title="Nothing published yet"
                    copy="Your menus appear here once published — students see them immediately."
                  />
                ) : (
                  <ul className="border-t border-line">
                    {myMenus.map((menu) => (
                      <li key={menu.id} className="flex flex-wrap items-center gap-4 py-4 border-b border-line">
                        <div className="flex-1 min-w-[220px]">
                          <p className="text-[15.5px] font-medium leading-snug">{menu.items}</p>
                          <div className="flex flex-wrap items-center gap-2.5 mt-2">
                            <span className="tag tag-tomato">₹{menu.price}</span>
                            <span className="tag tag-neutral">Closes {menu.cutoffTime}</span>
                            {menu.date && <span className="text-[12px] text-ink-3">Listed {menu.date}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setItems(menu.items);
                              setPrice(menu.price);
                              setCutoffTime(menu.cutoffTime);
                              setEditingMenuId(menu.id);
                              jump('sec-menu');
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            Edit
                          </button>
                          <button onClick={() => onDeleteMenu(menu.id)} className="btn btn-ghost btn-sm text-tomato">
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* orders */}
            <section id="sec-orders" className="scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line-2 pb-3">
                <div>
                  <p className="eyebrow mb-2.5">Order management</p>
                  <h2 className="display-3 text-[1.5rem]">
                    {showHistory ? 'Delivery history' : 'Active orders'}
                  </h2>
                </div>
                <button onClick={() => setShowHistory(!showHistory)} className="btn btn-outline btn-sm">
                  {showHistory ? 'Show active' : 'View history'}
                </button>
              </div>

              {showHistory ? (
                <div className="mt-5">
                  {pastOrders.length === 0 ? (
                    <EmptyState title="No completed orders yet" copy="Delivered orders are archived here for your records." />
                  ) : (
                    <ul className="border-t border-line">
                      {pastOrders.map((order) => (
                        <li key={order.id} className="flex items-center justify-between gap-4 py-4 border-b border-line">
                          <div className="min-w-0">
                            <p className="text-[15.5px] font-medium">
                              Room {order.roomNo}
                              <span className="tag tag-neutral ml-2.5">×{order.quantity}</span>
                            </p>
                            <p className="text-[12.5px] text-ink-3 mt-1">
                              {order.studentName} · {order.studentPhone}
                            </p>
                          </div>
                          <span className="num text-[1.15rem] shrink-0">₹{priceOf(order)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    title="Waiting for orders"
                    copy="New orders land here the moment a student confirms one, grouped by hostel block."
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-8">
                  {Object.keys(groupedOrders).map((hostel) => {
                    const totalTiffins = groupedOrders[hostel].reduce((sum, order) => sum + Number(order.quantity), 0);
                    const blockTotal = groupedOrders[hostel].reduce((sum, order) => sum + priceOf(order), 0);
                    return (
                      <div key={hostel}>
                        <div className="flex items-center justify-between gap-4 pb-3 border-b border-line">
                          <div className="flex items-baseline gap-3 min-w-0">
                            <h3 className="display-3 text-[1.2rem] truncate">{hostel}</h3>
                            <span className="text-[12.5px] text-ink-3">
                              {totalTiffins} tiffin{totalTiffins === 1 ? '' : 's'} · ₹{blockTotal}
                            </span>
                          </div>
                          <span className="tag tag-ink shrink-0">{groupedOrders[hostel].length} orders</span>
                        </div>

                        <ul>
                          {groupedOrders[hostel].map((order) => (
                            <li
                              key={order.id}
                              className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6 py-4 border-b border-line"
                            >
                              <div className="min-w-0">
                                <p className="text-[15.5px] font-semibold">
                                  Room {order.roomNo}
                                  <span className="tag tag-tomato ml-2.5">×{order.quantity}</span>
                                </p>
                                <p className="text-[12.5px] text-ink-3 mt-1 truncate">
                                  {order.studentName} · {order.studentPhone}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 ml-auto shrink-0">
                                <span className="num text-[1.1rem]">₹{priceOf(order)}</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                                  className={`text-[12.5px] font-semibold h-9 pl-3 pr-8 rounded-[4px] border cursor-pointer outline-none focus:ring-2 focus:ring-ink/25 appearance-none ${
                                    statusSelectClass[order.status] || statusSelectClass.Placed
                                  }`}
                                  style={{
                                    backgroundImage:
                                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238b8177' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 7l5 5 5-5'/%3e%3c/svg%3e\")",
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.1em 1.1em',
                                  }}
                                >
                                  <option value="Placed">Placed</option>
                                  <option value="Preparing">Preparing</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Mark delivered</option>
                                </select>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* analytics */}
            <section id="sec-analytics" className="scroll-mt-28">
              <div className="border-b border-line-2 pb-3">
                <p className="eyebrow mb-2.5">Analytics</p>
                <h2 className="display-3 text-[1.5rem]">Where your tiffins go</h2>
              </div>

              {analytics.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    title="Not enough data yet"
                    copy="Block-wise delivery numbers appear after your first orders come in."
                  />
                </div>
              ) : (
                <div className="mt-6 panel divide-y divide-line">
                  <div className="flex items-center justify-between px-5 py-4">
                    <p className="eyebrow">Lifetime value</p>
                    <p className="num text-[1.6rem]">₹{totalRevenue}</p>
                  </div>
                  {analytics.map(([hostel, v]) => (
                    <div key={hostel} className="px-5 py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-[15px] font-medium truncate">{hostel}</p>
                        <p className="text-[13px] text-ink-3 shrink-0">
                          {v.count} order{v.count === 1 ? '' : 's'} · ₹{v.revenue}
                        </p>
                      </div>
                      <div className="mt-2.5 h-[6px] w-full bg-paper-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tomato rounded-full transition-[width] duration-500"
                          style={{ width: `${(v.tiffins / maxTiffins) * 100}%` }}
                        />
                      </div>
                      <p className="text-[12px] text-ink-3 mt-1.5">{v.tiffins} tiffins delivered</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {showProfile && (
        <ProfileModal
          role="vendor"
          user={vendor}
          onSave={(values) => {
            onUpdateProfile(values, 'vendor');
            setShowProfile(false);
          }}
          onDelete={onDeleteAccount}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
