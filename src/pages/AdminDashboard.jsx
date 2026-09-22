import React, { useState } from 'react';

export default function AdminDashboard({ vendors, students, orders, onBack }) {
  const [pin, setPin] = useState(''); const [auth, setAuth] = useState(false); const [err, setErr] = useState(false);
  
  if (!auth) return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative text-center">
          <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">Admin Access</h2>
          <p className="text-sm text-slate-500 mb-6">Enter PIN (132006)</p>
          <form onSubmit={e=>{e.preventDefault();pin==='132006'?setAuth(true):(setErr(true),setPin(''));}}>
            <input type="password" maxLength="6" value={pin} onChange={e=>{setPin(e.target.value);setErr(false);}} className={`w-full bg-slate-50 border ${err ? 'border-rose-500 text-rose-500' : 'border-slate-200 text-slate-800'} rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-black mb-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} placeholder="••••••" />
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95">Verify & Enter</button>
          </form>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Database Overview</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Super Admin Control Panel</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10">Exit Admin</button>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-500"></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase mb-1 tracking-wider">Total Registered Students</h3>
            <p className="text-4xl font-black text-slate-800">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-orange-500"></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase mb-1 tracking-wider">Total Tiffin Centers</h3>
            <p className="text-4xl font-black text-slate-800">{vendors.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-emerald-500"></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase mb-1 tracking-wider">Total Orders Processed</h3>
            <p className="text-4xl font-black text-slate-800">{orders.length}</p>
          </div>
        </div>

        {/* DETAILED TABLES */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
               <h2 className="text-lg font-black text-slate-800">Registered Vendors ({vendors.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-xs uppercase text-slate-500 font-black tracking-wider">
                    <th className="py-4 px-6">Center Name</th>
                    <th className="py-4 px-6">Owner</th>
                    <th className="py-4 px-6">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {vendors.length === 0 ? <tr><td colSpan="3" className="text-center py-8 text-slate-400 font-medium">No vendors found in database.</td></tr> : 
                    vendors.map(v => (
                      <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">{v.name}</td>
                        <td className="py-4 px-6 text-slate-600">{v.owner}</td>
                        <td className="py-4 px-6 text-slate-600 font-mono font-medium">{v.phone}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
               <h2 className="text-lg font-black text-slate-800">Registered Students ({students.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-xs uppercase text-slate-500 font-black tracking-wider">
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Phone Number</th>
                    <th className="py-4 px-6">Hostel & Room</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students.length === 0 ? <tr><td colSpan="3" className="text-center py-8 text-slate-400 font-medium">No students found in database.</td></tr> : 
                    students.map(s => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">{s.name}</td>
                        <td className="py-4 px-6 text-slate-600 font-mono font-medium">{s.phone}</td>
                        <td className="py-4 px-6">
                           <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                             {s.hostelBlock} - Rm {s.roomNo}
                           </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
               <h2 className="text-lg font-black text-slate-800">Order Logs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-xs uppercase text-slate-500 font-black tracking-wider">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Vendor</th>
                    <th className="py-4 px-6">Qty</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.length === 0 ? <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">No orders recorded yet.</td></tr> : 
                    [...orders].reverse().map(o => (
                      <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">{o.id.replace('ord_', '')}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{o.studentName}</td>
                        <td className="py-4 px-6 text-slate-600">{o.vendorName}</td>
                        <td className="py-4 px-6 font-black text-slate-800">x{o.quantity}</td>
                        <td className="py-4 px-6">
                           <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                             {o.status}
                           </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}