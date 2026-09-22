import React, { useState } from 'react';
import { HOSTEL_BLOCKS } from '../services/database';

export default function AuthScreen({ type, vendors, students, onLogin, onSignup, onUpdatePassword, onBack, showModal }) {
  const [isLogin, setIsLogin] = useState(true); const [isForgotPass, setIsForgotPass] = useState(false); const [forgotStep, setForgotStep] = useState(1);
  const [phone, setPhone] = useState(''); const [password, setPassword] = useState(''); const [otp, setOtp] = useState(''); const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState(''); const [centerName, setCenterName] = useState(''); const [ownerName, setOwnerName] = useState(''); 
  const [hostel, setHostel] = useState(HOSTEL_BLOCKS[0]); const [room, setRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'vendor') {
      if (isLogin) {
        const v = vendors.find(v => v.phone === phone && v.password === password);
        v ? onLogin(v, 'vendor') : showModal('Login Failed', 'Invalid credentials.', false);
      } else {
        if (vendors.find(v => v.phone === phone)) return showModal('Failed', 'Phone registered.', false);
        onSignup({ id: `v_${Date.now()}`, name: centerName, owner: ownerName, phone, password }, 'vendor');
      }
    } else {
      if (isLogin) {
        const s = students.find(s => s.phone === phone && s.password === password);
        s ? onLogin(s, 'student') : showModal('Login Failed', 'Invalid credentials.', false);
      } else {
        if (students.find(s => s.phone === phone)) return showModal('Failed', 'Phone registered.', false);
        onSignup({ id: `s_${Date.now()}`, name, phone, password, hostelBlock: hostel, roomNo: room }, 'student');
      }
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!(type === 'vendor' ? vendors.find(v => v.phone === phone) : students.find(s => s.phone === phone))) return showModal('Not Found', 'Number not registered.', false);
      setForgotStep(2); showModal('OTP Sent', 'Mock OTP: 1234', true);
    } else if (forgotStep === 2) {
      otp === '1234' ? setForgotStep(3) : showModal('Error', 'Invalid OTP', false);
    } else {
      const user = type === 'vendor' ? vendors.find(v => v.phone === phone) : students.find(s => s.phone === phone);
      onUpdatePassword(user.id, newPassword, type); setIsForgotPass(false); setForgotStep(1); setPhone(''); setPassword(''); setOtp(''); setNewPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative BG */}
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 ${type === 'vendor' ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
        
        <button onClick={() => { isForgotPass ? setIsForgotPass(false) : onBack(); setForgotStep(1); }} className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 bg-slate-50 p-2 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        
        <div className="text-center mb-8 mt-6 relative z-10">
          <h2 className="text-2xl font-black text-slate-800">
             {isForgotPass ? 'Reset Password' : isLogin ? (type === 'vendor' ? 'Vendor Portal' : 'Student Login') : (type === 'vendor' ? 'Register Center' : 'Join TiffinConnect')}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Exclusive for IIITDM Jabalpur</p>
        </div>

        <form onSubmit={isForgotPass ? handleForgot : handleSubmit} className="space-y-4 relative z-10">
          {(!isLogin && type === 'student' && !isForgotPass) && <div><input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name" /></div>}
          {(!isLogin && type === 'vendor' && !isForgotPass) && <><input required type="text" value={centerName} onChange={e=>setCenterName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm mb-4 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Tiffin Center Name" /><input required type="text" value={ownerName} onChange={e=>setOwnerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Owner Name" /></>}
          
          {(isForgotPass ? forgotStep === 1 : true) && <input required type="tel" pattern="[0-9]{10}" value={phone} onChange={e=>setPhone(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 outline-none ${type === 'vendor' ? 'focus:ring-orange-500' : 'focus:ring-indigo-500'}`} placeholder="10-digit mobile number" />}
          
          {(!isForgotPass) && <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 outline-none ${type === 'vendor' ? 'focus:ring-orange-500' : 'focus:ring-indigo-500'}`} placeholder="Password" />}
          
          {(isForgotPass && forgotStep === 2) && <input required type="text" maxLength="4" value={otp} onChange={e=>setOtp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-center tracking-widest text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="OTP (1234)" />}
          {(isForgotPass && forgotStep === 3) && <input required type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="New Password" />}

          {(!isLogin && type === 'student' && !isForgotPass) && (
             <div className="flex space-x-3 pt-2">
                <select value={hostel} onChange={e=>setHostel(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">{HOSTEL_BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}</select>
                <input required type="text" value={room} onChange={e=>setRoom(e.target.value)} className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Room" />
              </div>
          )}
          
          {(!isForgotPass && isLogin) && <div className="text-right"><button type="button" onClick={() => setIsForgotPass(true)} className="text-xs font-bold text-slate-500 hover:text-indigo-600">Forgot Password?</button></div>}
          
          <button type="submit" className={`w-full text-white font-black py-4 rounded-2xl mt-6 transition-transform active:scale-95 shadow-lg ${type === 'vendor' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'}`}>
            {isForgotPass ? (forgotStep === 1 ? 'Send OTP' : forgotStep === 2 ? 'Verify' : 'Reset') : (isLogin ? 'Login Securely' : 'Create Account')}
          </button>
        </form>
        
        {!isForgotPass && (
          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-slate-400">{isLogin ? "Don't have an account? " : "Already registered? "}</span>
            <button onClick={() => setIsLogin(!isLogin)} className={`font-black hover:underline ${type === 'vendor' ? 'text-orange-600' : 'text-indigo-600'}`}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        )}
      </div>
      
      {/* Demo Hints */}
      {isLogin && !isForgotPass && (
         <div className="mt-8 text-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
           <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Demo Credentials</p>
           <p className="text-white text-sm font-medium">Phone: <span className="font-black text-indigo-300">{type==='vendor'?'9999999999':'8888888888'}</span> • Pass: <span className="font-black text-indigo-300">123</span></p>
         </div>
      )}
    </div>
  );
}