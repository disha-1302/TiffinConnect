import React from 'react';

export default function LandingPage({ setCurrentView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Abstract Background Vectors */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl mix-blend-screen"></div>

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-6 shadow-xl shadow-indigo-900/50">
           <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-white text-sm font-black tracking-tighter">TC</span>
           </div>
           <span className="text-indigo-100 font-bold tracking-widest uppercase text-xs flex items-center gap-1.5">
             For IIITDM Jabalpur <span className="bg-indigo-500/40 px-2 py-0.5 rounded-md text-[10px]">AI Powered ✨</span>
           </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">TiffinConnect</h1>
        <p className="text-indigo-200 text-lg md:text-xl max-w-md mx-auto font-medium leading-relaxed">The smartest way to order daily meals in campus.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl relative z-10">
        <button onClick={() => setCurrentView('auth-student')} className="group bg-white/10 hover:bg-white/15 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-300 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Student</h2>
          <p className="text-indigo-200/80 text-sm font-medium">Browse daily menus, check AI nutrition stats, and order fast.</p>
        </button>
        
        <button onClick={() => setCurrentView('auth-vendor')} className="group bg-white/10 hover:bg-white/15 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20">
           <div className="w-20 h-20 bg-orange-500/20 text-orange-300 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Vendor</h2>
          <p className="text-indigo-200/80 text-sm font-medium">Use AI to generate appetizing menus and manage hostel orders.</p>
        </button>
      </div>
      
      <div className="mt-16 text-center relative z-10">
        <button onClick={() => setCurrentView('admin-dashboard')} className="text-xs font-bold text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto bg-black/20 hover:bg-black/40 px-5 py-2.5 rounded-xl backdrop-blur-sm border border-white/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Access Secure Database
        </button>
      </div>
    </div>
  );
}