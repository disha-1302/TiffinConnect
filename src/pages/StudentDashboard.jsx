import { useState } from 'react';
import { generateTextWithGemini } from '../services/gemini';
import { HOSTEL_BLOCKS } from '../services/database';
import TopBar from '../components/TopBar';
import ProfileModal from '../components/ProfileModal';
import { EmptyState, StatusTag } from '../components/ui';
import { MealMotif } from '../components/FoodArt';

const MOTIF_TINTS = [
  { bg: '#FBEDE6', fg: 'var(--color-tomato)' },
  { bg: '#E9F1EA', fg: 'var(--color-herb)' },
  { bg: '#FAF1DD', fg: 'var(--color-amber-ink)' },
  { bg: '#F4EDE1', fg: 'var(--color-ink-2)' },
];
const motifIndex = (id) => [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;

const STEPS = ['Placed', 'Preparing', 'Out for Delivery'];

export default function StudentDashboard({
  menus,
  orders,
  onPlaceOrder,
  onLogout,
  student,
  onUpdateProfile,
  onDeleteAccount,
}) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hostel, setHostel] = useState(student.hostelBlock);
  const [room, setRoom] = useState(student.roomNo);
  const [tab, setTab] = useState('menu');
  const [showProfile, setShowProfile] = useState(false);
  const [analyzingMenuId, setAnalyzingMenuId] = useState(null);
  const [nutritionData, setNutritionData] = useState({});

  const activeOrders = orders.filter((o) => o.studentPhone === student.phone && o.status !== 'Delivered').reverse();
  const pastOrders = orders.filter((o) => o.studentPhone === student.phone && o.status === 'Delivered').reverse();

  const handleAnalyzeNutrition = async (menuId, itemsText) => {
    setAnalyzingMenuId(menuId);
    const systemInstruction =
      "You are a nutritionist. Provide ONLY a single short line estimating Calories, Protein, and Carbs. Format exactly like this: 'est. 450 kcal | 15g Protein | 60g Carbs'. No extra text or bullet points.";
    const prompt = `Analyze this meal: ${itemsText}`;
    const result = await generateTextWithGemini(prompt, systemInstruction);
    setNutritionData((prev) => ({ ...prev, [menuId]: result }));
    setAnalyzingMenuId(null);
  };

  const progressWidth = (status) => (status === 'Placed' ? '34%' : status === 'Preparing' ? '67%' : '100%');

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title={`Hi, ${student.name.split(' ')[0]}`}
        subtitle={`${student.hostelBlock} · Room ${student.roomNo}`}
        actions={
          <>
            <button onClick={() => setShowProfile(true)} className="btn btn-outline btn-sm">
              Profile
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
        <div className="grid lg:grid-cols-[318px_1fr] gap-8 lg:gap-10 items-start">
          {/* ---------- left rail ---------- */}
          <aside className="lg:sticky lg:top-[92px] space-y-5">
            <div className="panel p-5">
              <p className="eyebrow">Delivering to</p>
              <p className="display-3 mt-2.5 leading-tight">{student.hostelBlock}</p>
              <p className="text-[14.5px] text-ink-2 mt-1">Room {student.roomNo}</p>
              <div className="rule mt-4 pt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="eyebrow">Live orders</p>
                  <p className="num text-[1.6rem] leading-none mt-1.5">{activeOrders.length}</p>
                </div>
                <div>
                  <p className="eyebrow">Delivered</p>
                  <p className="num text-[1.6rem] leading-none mt-1.5">{pastOrders.length}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="eyebrow">Order tracking</p>
                {activeOrders.length > 0 && (
                  <span className="text-[11.5px] text-ink-3">{activeOrders.length} active</span>
                )}
              </div>

              {activeOrders.length === 0 ? (
                <div className="border border-dashed border-line-2 rounded-[6px] px-4 py-5">
                  <p className="text-[14px] text-ink-3 leading-relaxed">
                    No live orders. Pick a menu and your status will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrders.map((order) => {
                    return (
                      <article key={order.id} className="panel p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[15.5px] font-semibold truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                              {order.vendorName}
                            </h3>
                            <p className="text-[12px] text-ink-3 mt-0.5">
                              #{order.id.split('_')[1].slice(-6)} · Room {order.roomNo}
                            </p>
                          </div>
                          <span className="tag tag-neutral shrink-0">×{order.quantity}</span>
                        </div>

                        <div className="mt-4">
                          <div className="h-[3px] w-full bg-paper-3 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-[width] duration-500 ease-out ${
                                order.status === 'Out for Delivery' ? 'bg-herb' : 'bg-tomato'
                              }`}
                              style={{ width: progressWidth(order.status) }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <StatusTag status={order.status} />
                            <div className="flex gap-3 text-[10.5px] text-ink-3">
                              {STEPS.map((s) => (
                                <span key={s} className={order.status === s ? 'text-ink font-semibold' : ''}>
                                  {s === 'Out for Delivery' ? 'On way' : s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ---------- main ---------- */}
          <section>
            <div className="flex items-end justify-between gap-4 border-b border-line-2">
              <div className="flex gap-1">
                {[
                  { key: 'menu', label: 'Today’s menu' },
                  { key: 'history', label: 'Order history', count: pastOrders.length || null },
                ].map((t) => {
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`relative px-3 pb-3 pt-1 text-[14.5px] font-semibold transition-colors ${
                        active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                      }`}
                    >
                      {t.label}
                      {t.count != null && <span className="ml-1.5 text-[11.5px] text-ink-3">{t.count}</span>}
                      <span
                        className={`absolute left-0 right-0 -bottom-px h-[2px] bg-tomato origin-left transition-transform duration-200 ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="hidden sm:block text-[12.5px] text-ink-3 pb-3">
                {menus.length} menu{menus.length === 1 ? '' : 's'} live
              </p>
            </div>

            {tab === 'menu' ? (
              <div className="mt-6">
                {menus.length === 0 ? (
                  <EmptyState
                    title="Menus aren’t published yet"
                    copy="Kitchens post today’s food with a price and cut-off time. This list fills up as soon as they do."
                    icon={<MealMotif variant={0} className="w-full h-full" />}
                  />
                ) : (
                  <div className="space-y-4">
                    {menus.map((menu) => {
                      const tint = MOTIF_TINTS[motifIndex(menu.id)];
                      const nutrition = nutritionData[menu.id];
                      const analyzing = analyzingMenuId === menu.id;
                      return (
                        <article
                          key={menu.id}
                          className="panel p-4 sm:p-5 flex gap-4 sm:gap-5 transition-colors hover:border-line-2"
                        >
                          <div
                            className="shrink-0 w-[74px] sm:w-[104px] h-[74px] sm:h-[96px] rounded-[5px] grid place-items-center"
                            style={{ background: tint.bg, color: tint.fg }}
                          >
                            <MealMotif variant={motifIndex(menu.id)} className="w-[54px] sm:w-[72px] h-auto" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="display-3 text-[1.15rem] sm:text-[1.3rem] truncate">{menu.vendorName}</h3>
                                <p className="text-[12.5px] text-ink-3 mt-1">
                                  Order before {menu.cutoffTime}
                                  {menu.date ? ` · ${menu.date}` : ''}
                                </p>
                              </div>
                              <p className="num text-[1.55rem] leading-none shrink-0">₹{menu.price}</p>
                            </div>

                            <p className="text-[14.5px] leading-relaxed text-ink-2 mt-2.5">{menu.items}</p>

                            <div className="mt-3.5">
                              {nutrition ? (
                                <div className="border border-line rounded-[5px] bg-herb-50 px-3 py-2.5">
                                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-herb mb-1">
                                    AI nutrition estimate
                                  </p>
                                  <p className="text-[13.5px] text-herb leading-snug">{nutrition}</p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAnalyzeNutrition(menu.id, menu.items)}
                                  disabled={analyzing}
                                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-2 hover:text-ink transition-colors disabled:opacity-60"
                                >
                                  {analyzing ? (
                                    <>
                                      <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-ink-3 border-t-ink animate-spin" />
                                      Estimating nutrition…
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="1.8"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                      </svg>
                                      Nutrition estimate
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-3">
                              <span className="tag tag-herb">Available</span>
                              <button onClick={() => { setSelectedMenu(menu); setQuantity(1); }} className="btn btn-dark btn-sm">
                                Add to order
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6">
                {pastOrders.length === 0 ? (
                  <EmptyState
                    title="No past orders"
                    copy="Meals you’ve received will be listed here once a kitchen marks them delivered."
                    icon={<MealMotif variant={2} className="w-full h-full" />}
                  />
                ) : (
                  <ul className="border-t border-line">
                    {pastOrders.map((order) => (
                      <li key={order.id} className="flex items-center justify-between gap-4 py-4 border-b border-line">
                        <div className="min-w-0">
                          <p className="text-[15.5px] font-semibold truncate">{order.vendorName}</p>
                          <p className="text-[12.5px] text-ink-3 mt-0.5">
                            {new Date(order.timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {' · '}Room {order.roomNo}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="tag tag-neutral">×{order.quantity}</span>
                          <StatusTag status="Delivered" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ---------- order sheet ---------- */}
      {selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button
            aria-label="Close"
            onClick={() => {
              setSelectedMenu(null);
              setQuantity(1);
            }}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade"
          />
          <div className="relative w-full sm:max-w-[460px] bg-card border border-line rounded-t-[10px] sm:rounded-[8px] shadow-[0_24px_60px_-24px_rgba(25,21,18,0.5)] animate-sheet sm:animate-rise max-h-[94vh] overflow-y-auto">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <span className="w-9 h-1 rounded-full bg-line-2" />
            </div>

            <div className="flex items-start justify-between gap-4 px-6 pt-4 sm:pt-6 pb-4 border-b border-line">
              <div className="min-w-0">
                <p className="eyebrow mb-2">Confirm order</p>
                <h2 className="display-3">{selectedMenu.vendorName}</h2>
                <p className="text-[13.5px] text-ink-3 mt-1.5">Cut-off at {selectedMenu.cutoffTime}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedMenu(null);
                  setQuantity(1);
                }}
                className="w-8 h-8 grid place-items-center rounded-[4px] text-ink-3 hover:text-ink hover:bg-paper-2 transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 border-b border-line bg-paper-2/50">
              <p className="text-[14.5px] leading-relaxed text-ink-2">{selectedMenu.items}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onPlaceOrder({
                  id: `ord_${Date.now()}`,
                  menuId: selectedMenu.id,
                  vendorId: selectedMenu.vendorId,
                  vendorName: selectedMenu.vendorName,
                  studentName: student.name,
                  studentPhone: student.phone,
                  hostelBlock: hostel,
                  roomNo: room,
                  quantity,
                  status: 'Placed',
                  timestamp: new Date().toISOString(),
                });
                setSelectedMenu(null);
                setQuantity(1);
                setTab('menu');
              }}
              className="px-6 py-5"
            >
              <div className="flex items-center justify-between py-3 border-b border-line">
                <div>
                  <p className="text-[15px] font-medium">Tiffin quantity</p>
                  <p className="text-[12.5px] text-ink-3 mt-0.5">Meals for this order</p>
                </div>
                <div className="flex items-center gap-1 border border-line-2 rounded-[5px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 grid place-items-center text-ink-2 hover:bg-paper-2 transition-colors text-lg leading-none"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-9 text-center num text-[17px]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 grid place-items-center text-ink-2 hover:bg-paper-2 transition-colors text-lg leading-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_96px] gap-3 py-4 border-b border-line">
                <div>
                  <label className="field-label">Hostel block</label>
                  <select className="field" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                    {HOSTEL_BLOCKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label">Room no.</label>
                  <input required type="text" className="field" value={room} onChange={(e) => setRoom(e.target.value)} />
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between text-[14.5px] text-ink-2 py-1.5">
                  <span>
                    ₹{selectedMenu.price} × {quantity}
                  </span>
                  <span className="num">₹{selectedMenu.price * quantity}</span>
                </div>
                <div className="flex items-center justify-between text-[14.5px] text-ink-2 py-1.5">
                  <span>Delivery</span>
                  <span className="text-herb font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-line">
                  <span className="text-[15px] font-semibold">Total</span>
                  <span className="num text-[1.5rem]">₹{selectedMenu.price * quantity}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Place order · ₹{selectedMenu.price * quantity}
              </button>
            </form>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileModal
          role="student"
          user={student}
          onSave={(values) => {
            onUpdateProfile(values, 'student');
            setShowProfile(false);
          }}
          onDelete={onDeleteAccount}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
