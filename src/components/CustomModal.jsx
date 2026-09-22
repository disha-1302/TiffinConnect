import React from 'react';

export default function CustomModal({ isOpen, title, message, onClose, isSuccess }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative border border-slate-100 transform scale-100 hover:scale-[1.02] transition-transform">
        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isSuccess ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          )}
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed whitespace-pre-wrap">{message}</p>
        <button onClick={onClose} className="w-full bg-indigo-900 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-800 transition-colors shadow-md shadow-indigo-900/20">
          Got it
        </button>
      </div>
    </div>
  );
}
