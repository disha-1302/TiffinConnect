import React, { useState } from 'react';
import { generateTextWithGemini } from '../services/gemini';
import { HOSTEL_BLOCKS } from '../services/database';

export default function StudentDashboard({ menus, orders, onPlaceOrder, onLogout, student, onUpdateProfile, onDeleteAccount }) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hostel, setHostel] = useState(student.hostelBlock);
  const [room, setRoom] = useState(student.roomNo);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editPhone, setEditPhone] = useState(student.phone);
  const [editPassword, setEditPassword] = useState(student.password);
  const [editHostel, setEditHostel] = useState(student.hostelBlock);
  const [editRoom, setEditRoom] = useState(student.roomNo);
  const [analyzingMenuId, setAnalyzingMenuId] = useState(null);
  const [nutritionData, setNutritionData] = useState({});

  const activeOrders = orders.filter(o => o.studentPhone === student.phone && o.status !== 'Delivered').reverse();
  const pastOrders = orders.filter(o => o.studentPhone === student.phone && o.status === 'Delivered').reverse();

  const handleAnalyzeNutrition = async (menuId, itemsText) => {
    setAnalyzingMenuId(menuId);
    const systemInstruction = "You are a nutritionist. Provide ONLY a single short line estimating Calories, Protein, and Carbs. Format exactly like this: 'est. 450 kcal | 15g Protein | 60g Carbs'. No extra text or bullet points.";
    const prompt = `Analyze this meal: ${itemsText}`;
    const result = await generateTextWithGemini(prompt, systemInstruction);
    setNutritionData(prev => ({ ...prev, [menuId]: result }));
    setAnalyzingMenuId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-indigo-200">
      <header className="bg-indigo-900 shadow-lg p-5 sticky top-0 z-10 flex justify-between items-center rounded-b-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-black">TC</span>
             </div>
             <h1 className="text-lg font-black text-white tracking-tight">TiffinConnect</h1>
          </div>
          <p className="text-xs text-indigo-200 font-medium ml-8">IIITDM Jabalpur</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-indigo-800/50 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all border border-indigo-700">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
          <button onClick={onLogout} className="w-10 h-10 bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white rounded-full flex items-center justify-center transition-all border border-rose-500/20">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      {showProfile && (
        <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100">
            <button onClick={() => {setShowProfile(false); setConfirmDelete(false);}} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full p-1.5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6">My Profile</h2>
            <form onSubmit={(e) => { e.preventDefault(); onUpdateProfile({ name: editName, phone: editPhone, password: editPassword, hostelBlock: editHostel, roomNo: editRoom }, 'student'); setShowProfile(false); setConfirmDelete(false); }} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label><input required type="text" value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label><input required type="tel" value={editPhone} onChange={e=>setEditPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div className="flex space-x-4">
                <div className="flex-1"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hostel</label><select value={editHostel} onChange={e=>setEditHostel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">{HOSTEL_BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div className="w-1/3"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room</label><input required type="text" value={editRoom} onChange={e=>setEditRoom(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4">Save Changes</button>
            </form>
            <hr className="my-6 border-slate-100" />
            {!confirmDelete ? (
               <button onClick={() => setConfirmDelete(true)} className="w-full text-rose-500 font-bold py-3 rounded-xl border-2 border-rose-100 hover:bg-rose-50 transition-colors">Delete Account</button>
            ) : (
               <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 animate-in zoom-in duration-200">
                 <p className="text-rose-700 text-sm font-bold mb-4 text-center">Delete your account permanently?</p>
                 <div className="flex space-x-3">
                   <button onClick={() => onDeleteAccount(student.id, 'student')} className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl hover:bg-rose-700 transition-colors shadow-sm">Confirm</button>
                   <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-white text-slate-700 font-bold py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors">Cancel</button>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 max-w-md mx-auto space-y-6 -mt-3">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">Hi, {student.name.split(' ')[0]} 👋</h2>
            <p className="text-sm text-slate-500 mt-0.5">{student.hostelBlock}, Room {student.roomNo}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl">
          <button onClick={() => setShowHistory(false)} className={`flex-1 text-sm font-bold py-2.5 rounded-xl transition-all duration-300 ${!showHistory ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Live Orders</button>
          <button onClick={() => setShowHistory(true)} className={`flex-1 text-sm font-bold py-2.5 rounded-xl transition-all duration-300 ${showHistory ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Past Tiffins</button>
        </div>

        {!showHistory ? (
          activeOrders.length > 0 && (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">{order.vendorName}</h3>
                      <p className="text-xs text-slate-500 font-medium">Order #{order.id.split('_')[1].slice(-6)}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1.5 rounded-xl border border-indigo-100">Qty: {order.quantity}</span>
                  </div>
                  <div className="pl-2">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400">Placed</span>
                      <span className="text-slate-400">Preparing</span>
                      <span className="text-slate-400">On Way</span>
                    </div>
                    <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100 shadow-inner">
                      <div style={{ width: order.status === 'Placed' ? '33%' : order.status === 'Preparing' ? '66%' : '100%' }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ease-out ${order.status === 'Out for Delivery' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                    </div>
                    <div className="text-center">
                       <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${order.status === 'Out for Delivery' ? 'text-emerald-700 bg-emerald-100' : 'text-indigo-700 bg-indigo-100'}`}>
                         <span className="relative flex h-2 w-2"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === 'Out for Delivery' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></span><span className={`relative inline-flex rounded-full h-2 w-2 ${order.status === 'Out for Delivery' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span></span>
                         {order.status}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
             {pastOrders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                   <p className="text-slate-400 font-medium text-sm">No past orders found.</p>
                </div>
             ) : (
               pastOrders.map(order => (
                 <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                   <div>
                     <h3 className="font-bold text-slate-800">{order.vendorName}</h3>
                     <span className="text-slate-400 text-xs font-medium">{new Date(order.timestamp).toLocaleDateString()}</span>
                   </div>
                   <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">Delivered</span>
                 </div>
               ))
             )}
          </div>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4 mt-6">
             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
             <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Today's Menus</h2>
          </div>
          
          {menus.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="font-bold text-slate-600">Menus Not Published</h3>
              <p className="text-slate-400 text-sm mt-1">Vendors haven't updated today's food.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {menus.map(menu => (
                <div key={menu.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-16 bg-gradient-to-r from-orange-400 to-rose-400 flex items-end px-5 pb-3 relative overflow-hidden">
                     <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                     <span className="bg-white/20 text-white backdrop-blur-md text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">Lunch Special</span>
                  </div>
                  <div className="p-5 pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black text-xl text-slate-800">{menu.vendorName}</h3>
                      <span className="font-black text-orange-500 text-xl bg-orange-50 px-2 py-1 rounded-xl">₹{menu.price}</span>
                    </div>
                    
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4 border-l-2 border-slate-200 pl-3">{menu.items}</p>
                    
                    <div className="mb-5">
                      {nutritionData[menu.id] ? (
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 font-medium">
                          <span className="font-bold block mb-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> AI Nutrition Estimate</span>
                          {nutritionData[menu.id]}
                        </div>
                      ) : (
                        <button onClick={() => handleAnalyzeNutrition(menu.id, menu.items)} disabled={analyzingMenuId === menu.id} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                          {analyzingMenuId === menu.id ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full"></span> Analyzing...</> : <>✨ AI Health Check</>}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 w-max px-3 py-2 rounded-xl border border-slate-100">
                         <svg className="w-4 h-4 mr-1.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         Order before <span className="text-rose-500 ml-1">{menu.cutoffTime}</span>
                       </div>
                       <button onClick={() => setSelectedMenu(menu)} className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95">Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedMenu && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h2 className="text-2xl font-black text-slate-800">Confirm Order</h2>
                 <p className="text-sm text-slate-500 font-medium">For {student.name.split(' ')[0]}</p>
               </div>
               <button onClick={() => {setSelectedMenu(null); setQuantity(1);}} className="p-2.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
             </div>
             
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6">
                <p className="font-black text-indigo-900">{selectedMenu.vendorName}</p>
                <p className="text-sm text-indigo-700/70 mt-1 font-medium">{selectedMenu.items}</p>
             </div>

             <form onSubmit={(e) => {
                e.preventDefault();
                onPlaceOrder({ id: `ord_${Date.now()}`, menuId: selectedMenu.id, vendorId: selectedMenu.vendorId, vendorName: selectedMenu.vendorName, studentName: student.name, studentPhone: student.phone, hostelBlock: hostel, roomNo: room, quantity, status: 'Placed', timestamp: new Date().toISOString() });
                setSelectedMenu(null); setQuantity(1);
             }} className="space-y-5">
               <div className="flex items-center justify-between bg-white border-2 border-slate-100 p-2 rounded-2xl">
                 <span className="ml-3 font-bold text-slate-700 text-sm">Tiffin Quantity</span>
                 <div className="flex items-center gap-3">
                   <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-slate-100 rounded-xl font-black text-lg flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors">-</button>
                   <span className="font-black text-xl w-6 text-center text-slate-800">{quantity}</span>
                   <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-indigo-100 rounded-xl font-black text-lg flex items-center justify-center hover:bg-indigo-200 text-indigo-700 transition-colors">+</button>
                 </div>
               </div>

               <div className="flex space-x-4">
                <div className="flex-1"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hostel Block</label><select value={hostel} onChange={e=>setHostel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium">{HOSTEL_BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div className="w-1/3"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room No</label><input required type="text" value={room} onChange={e=>setRoom(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" /></div>
              </div>
              
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-transform active:scale-95 shadow-xl shadow-slate-900/20 mt-4 flex justify-between px-6 items-center">
                <span>Confirm Order</span>
                <span className="text-lg bg-white/20 px-3 py-1 rounded-lg">₹{selectedMenu.price * quantity}</span>
              </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}