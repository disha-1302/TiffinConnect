import React, { useState } from 'react';
import { generateTextWithGemini } from '../services/gemini';

export default function VendorDashboard({ vendor, menus, orders, onAddMenu, onUpdateMenu, onDeleteMenu, onUpdateOrderStatus, onLogout, onUpdateProfile, onDeleteAccount }) {
  const [items, setItems] = useState(''); const [price, setPrice] = useState(''); const [cutoffTime, setCutoffTime] = useState('');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editCenterName, setEditCenterName] = useState(vendor.name);
  const [editOwnerName, setEditOwnerName] = useState(vendor.owner);
  const [editPhone, setEditPhone] = useState(vendor.phone);
  const [editPassword, setEditPassword] = useState(vendor.password);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const myMenus = menus.filter(m => m.vendorId === vendor.id);
  const activeOrders = orders.filter(o => o.vendorId === vendor.id && o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.vendorId === vendor.id && o.status === 'Delivered').reverse();

  const groupedOrders = activeOrders.reduce((acc, order) => {
    if (!acc[order.hostelBlock]) acc[order.hostelBlock] = [];
    acc[order.hostelBlock].push(order);
    return acc;
  }, {});

  const handleMagicEnhance = async () => {
    if (!items.trim()) return;
    setIsEnhancing(true);
    const systemInstruction = "You are an expert food copywriter. Enhance the provided Indian tiffin menu into a VERY SHORT, punchy, and appetizing phrase (maximum 8-10 words). Do not add new items. Keep it short and sweet. DO NOT use quotes.";
    const prompt = `Enhance this menu concisely: ${items}`;
    const enhancedText = await generateTextWithGemini(prompt, systemInstruction);
    if (enhancedText && !enhancedText.includes("unavailable")) setItems(enhancedText.replace(/["']/g, ''));
    setIsEnhancing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-orange-200">
      <header className="bg-orange-600 shadow-lg p-5 sticky top-0 z-10 flex justify-between items-center rounded-b-3xl">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">Vendor Portal</h1>
          <p className="text-xs text-orange-200 font-medium mt-0.5">{vendor.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-orange-700 hover:bg-orange-800 text-white rounded-full flex items-center justify-center transition-all border border-orange-500 shadow-inner">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
          <button onClick={onLogout} className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      {showProfile && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => {setShowProfile(false); setConfirmDelete(false);}} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full p-1.5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-xl font-black text-slate-800 mb-4">Center Settings</h2>
            <form onSubmit={(e) => {e.preventDefault(); onUpdateProfile({ name: editCenterName, owner: editOwnerName, phone: editPhone, password: editPassword }, 'vendor'); setShowProfile(false); setConfirmDelete(false);}} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Center Name</label><input required type="text" value={editCenterName} onChange={e=>setEditCenterName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner Name</label><input required type="text" value={editOwnerName} onChange={e=>setEditOwnerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label><input required type="tel" value={editPhone} onChange={e=>setEditPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none" /></div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 mt-2">Save Details</button>
            </form>
            <hr className="my-6 border-slate-100" />
            {!confirmDelete ? (
               <button onClick={() => setConfirmDelete(true)} className="w-full text-rose-500 font-bold py-2.5 rounded-xl border-2 border-rose-100 hover:bg-rose-50 transition-colors">Close Account</button>
            ) : (
               <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 animate-in zoom-in duration-200">
                 <p className="text-rose-700 text-sm font-bold mb-4 text-center">Are you sure? This removes your center.</p>
                 <div className="flex space-x-3">
                   <button onClick={() => onDeleteAccount(vendor.id, 'vendor')} className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl hover:bg-rose-700">Delete</button>
                   <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-white text-slate-700 font-bold py-2.5 rounded-xl border border-slate-300">Cancel</button>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 max-w-md mx-auto space-y-6 mt-2">
        <div className="grid grid-cols-2 gap-3 mb-2">
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Live Orders</p>
              <p className="text-3xl font-black text-slate-800">{activeOrders.length}</p>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tiffins to Prep</p>
              <p className="text-3xl font-black text-orange-500">{activeOrders.reduce((sum, o) => sum + Number(o.quantity), 0)}</p>
           </div>
        </div>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-400"></div>
          <h2 className="text-lg font-black text-slate-800 mb-5">{editingMenuId ? "Edit Menu" : "Publish Today's Menu"}</h2>
          <form onSubmit={(e) => {
             e.preventDefault();
             if (editingMenuId) onUpdateMenu({ id: editingMenuId, vendorId: vendor.id, vendorName: vendor.name, items, price: Number(price), cutoffTime, date: new Date().toLocaleDateString() });
             else onAddMenu({ id: `menu_${Date.now()}`, vendorId: vendor.id, vendorName: vendor.name, items, price: Number(price), cutoffTime, date: new Date().toLocaleDateString() });
             setEditingMenuId(null); setItems(''); setPrice(''); setCutoffTime('');
          }} className="space-y-4">
            
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                <span>What's cooking?</span>
              </label>
              <div className="relative">
                <textarea rows="3" required value={items} onChange={e=>setItems(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium resize-none" placeholder="e.g. Kadhai Paneer, 4 Roti..." />
                <button type="button" onClick={handleMagicEnhance} disabled={isEnhancing || !items.trim()} title="Make it sound delicious with AI!" className="absolute right-2 bottom-3 p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg transition-colors disabled:opacity-50">
                  {isEnhancing ? <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>}
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
               <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                <input required type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-black text-slate-700" placeholder="70" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cut-off Time</label>
                <input required type="time" value={cutoffTime} onChange={e=>setCutoffTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-700" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className={`flex-1 text-white font-black py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 ${editingMenuId ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}`}>
                {editingMenuId ? "Update Info" : "Publish Menu"}
              </button>
              {editingMenuId && <button type="button" onClick={() => {setItems(''); setPrice(''); setCutoffTime(''); setEditingMenuId(null);}} className="px-5 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200">Cancel</button>}
            </div>
          </form>
        </section>

        {myMenus.length > 0 && (
          <section>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Live Published</h2>
            {myMenus.map(menu => (
              <div key={menu.id} className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center shadow-sm gap-4">
                 <div>
                   <p className="font-bold text-slate-800 leading-snug">{menu.items}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="bg-white text-orange-600 text-xs font-black px-2 py-1 rounded-md border border-orange-100 shadow-sm">₹{menu.price}</span>
                      <span className="text-xs font-medium text-slate-500">Closes at {menu.cutoffTime}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => {setItems(menu.items); setPrice(menu.price); setCutoffTime(menu.cutoffTime); setEditingMenuId(menu.id);}} className="p-2.5 bg-white rounded-xl text-indigo-600 hover:bg-indigo-50 border border-indigo-100 transition-colors shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => onDeleteMenu(menu.id)} className="p-2.5 bg-white rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 transition-colors shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 </div>
              </div>
            ))}
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4 mt-8">
            <h2 className="text-lg font-black text-slate-800">Order Management</h2>
            <button onClick={() => setShowHistory(!showHistory)} className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
              {showHistory ? 'Show Active' : 'View History'}
            </button>
          </div>

          {showHistory ? (
            <div className="space-y-3">
              {pastOrders.length === 0 ? <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300"><p className="text-slate-400 text-sm font-medium">No history available.</p></div> : 
                pastOrders.map(order => (
                  <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm opacity-70 hover:opacity-100 transition-opacity flex justify-between items-center">
                     <div>
                       <span className="font-bold text-slate-700 block">Room {order.roomNo} <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded ml-2 text-xs font-black">x{order.quantity}</span></span>
                       <span className="text-slate-400 text-xs font-medium">{order.studentName}</span>
                     </div>
                     <div className="text-right"><div className="text-slate-800 font-black text-sm">₹{order.quantity * (menus.find(m => m.id === order.menuId)?.price || 0)}</div></div>
                  </div>
                ))
              }
            </div>
          ) : (
            activeOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <p className="text-slate-500 text-sm font-bold">Waiting for orders...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.keys(groupedOrders).map(hostel => {
                  const totalTiffins = groupedOrders[hostel].reduce((sum, order) => sum + Number(order.quantity), 0);
                  return (
                  <div key={hostel} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                     <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                       <h3 className="font-black text-slate-800 flex items-center gap-2">
                         <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                         {hostel}
                       </h3>
                       <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1.5 rounded-xl">
                         {totalTiffins} Tiffin(s)
                       </span>
                     </div>
                     <div className="divide-y divide-slate-50">
                       {groupedOrders[hostel].map(order => (
                         <div key={order.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                           <div>
                             <span className="font-black text-slate-800 block text-lg mb-1">Room {order.roomNo} <span className="text-orange-500 bg-orange-50 px-2.5 py-1 rounded-xl ml-2 text-xs font-black">x{order.quantity}</span></span>
                             <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                               {order.studentName} <span className="mx-1">•</span> {order.studentPhone}
                             </span>
                           </div>
                           <div className="flex items-center gap-4">
                             <span className="text-slate-800 font-black">₹{order.quantity * (menus.find(m => m.id === order.menuId)?.price || 0)}</span>
                             <select value={order.status} onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)} className={`text-xs font-black px-4 py-2.5 rounded-xl border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none appearance-none pr-8 relative ${order.status === 'Placed' ? 'bg-slate-100 text-slate-600' : order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`} style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 7l5 5 5-5'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em'}}>
                               <option value="Placed">Placed</option><option value="Preparing">Preparing</option><option value="Out for Delivery">Out for Delivery</option><option value="Delivered">Mark Delivered</option>
                             </select>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                  );
                })}
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}