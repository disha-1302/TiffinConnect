import { useState } from 'react';
import { HOSTEL_BLOCKS } from '../services/database';
import { Brand } from '../components/Brand';
import { TiffinCarrier } from '../components/FoodArt';

const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function AuthScreen({ type, vendors, students, onLogin, onSignup, onUpdatePassword, onBack, showModal }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [centerName, setCenterName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [hostel, setHostel] = useState(HOSTEL_BLOCKS[0]);
  const [room, setRoom] = useState('');

  const isVendor = type === 'vendor';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'vendor') {
      if (isLogin) {
        const v = vendors.find((v) => v.phone === phone && v.password === password);
        v ? onLogin(v, 'vendor') : showModal('Login Failed', 'Invalid credentials.', false);
      } else {
        if (vendors.find((v) => v.phone === phone)) return showModal('Failed', 'Phone registered.', false);
        onSignup({ id: `v_${Date.now()}`, name: centerName, owner: ownerName, phone, password }, 'vendor');
      }
    } else {
      if (isLogin) {
        const s = students.find((s) => s.phone === phone && s.password === password);
        s ? onLogin(s, 'student') : showModal('Login Failed', 'Invalid credentials.', false);
      } else {
        if (students.find((s) => s.phone === phone)) return showModal('Failed', 'Phone registered.', false);
        onSignup({ id: `s_${Date.now()}`, name, phone, password, hostelBlock: hostel, roomNo: room }, 'student');
      }
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!(type === 'vendor' ? vendors.find((v) => v.phone === phone) : students.find((s) => s.phone === phone)))
        return showModal('Not Found', 'Number not registered.', false);
      setForgotStep(2);
      showModal('OTP Sent', 'Mock OTP: 1234', true);
    } else if (forgotStep === 2) {
      otp === '1234' ? setForgotStep(3) : showModal('Error', 'Invalid OTP', false);
    } else {
      const user = type === 'vendor' ? vendors.find((v) => v.phone === phone) : students.find((s) => s.phone === phone);
      onUpdatePassword(user.id, newPassword, type);
      setIsForgotPass(false);
      setForgotStep(1);
      setPhone('');
      setPassword('');
      setOtp('');
      setNewPassword('');
    }
  };

  const heading = isForgotPass
    ? 'Reset password'
    : isLogin
    ? isVendor
      ? 'Kitchen sign in'
      : 'Student sign in'
    : isVendor
    ? 'Register your kitchen'
    : 'Create your account';

  const subline = isForgotPass
    ? `Step ${forgotStep} of 3`
    : isLogin
    ? 'Use the number registered with Tiffin Connect.'
    : isVendor
    ? 'Start publishing daily menus in minutes.'
    : 'Order from campus kitchens in under a minute.';

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* ---------- brand pane ---------- */}
      <aside className="hidden lg:flex flex-col justify-between bg-ink text-paper p-10 xl:p-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,247,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,247,241,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative">
          <Brand size={26} tone="paper" />
        </div>

        <div className="relative">
          <p className="eyebrow" style={{ color: 'rgba(251,247,241,0.45)' }}>
            {isVendor ? 'For kitchens' : 'For hostel residents'}
          </p>
          <h1 className="display-2 mt-5 max-w-[15ch]">
            {isVendor ? (
              <>
                Cook once.
                <br />
                <span className="text-tomato">Feed the whole block.</span>
              </>
            ) : (
              <>
                A real meal,
                <br />
                <span className="text-tomato">without the mess queue.</span>
              </>
            )}
          </h1>
          <ul className="mt-8 space-y-3 text-[15px]" style={{ color: 'rgba(251,247,241,0.68)' }}>
            {(isVendor
              ? ['Daily menu with price and cut-off', 'Orders grouped by hostel block', 'Status updates in one place']
              : ['Read the real menu before you order', 'Delivered to your hall and room', 'AI nutrition estimate on every meal']
            ).map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-tomato shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-end justify-between gap-6">
          <div className="w-[190px] shrink-0" style={{ opacity: 0.92 }}>
            <TiffinCarrier className="w-full h-auto" />
          </div>
          <p className="text-[12.5px] leading-relaxed pb-2" style={{ color: 'rgba(251,247,241,0.45)' }}>
            IIITDM Jabalpur
            <br />
            Campus meal network
          </p>
        </div>
      </aside>

      {/* ---------- form pane ---------- */}
      <main className="flex flex-col min-h-screen">
        <div className="shell w-full">
          <div className="flex items-center justify-between h-[68px]">
            <button
              onClick={() => {
                isForgotPass ? setIsForgotPass(false) : onBack();
                setForgotStep(1);
              }}
              className="btn btn-ghost btn-sm -ml-3"
            >
              <IconBack />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="lg:hidden">
              <Brand size={24} />
            </div>
            <span className="hidden lg:block eyebrow">Tiffin Connect</span>
          </div>
        </div>

        <div className="shell w-full flex-1 flex items-start lg:items-center py-8 lg:py-10">
          <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto lg:mr-[clamp(1rem,6vw,5rem)]">
            <p className="eyebrow">{isVendor ? 'Vendor portal' : 'Student portal'}</p>
            <h2 className="display-2 mt-4 text-[clamp(1.8rem,3vw,2.4rem)]">{heading}</h2>
            <p className="prose-sm mt-3">{subline}</p>

            <form onSubmit={isForgotPass ? handleForgot : handleSubmit} className="mt-8 space-y-4">
              {!isLogin && !isForgotPass && type === 'student' && (
                <div>
                  <label className="field-label">Full name</label>
                  <input required type="text" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mayank Sharma" />
                </div>
              )}

              {!isLogin && !isForgotPass && isVendor && (
                <>
                  <div>
                    <label className="field-label">Tiffin center name</label>
                    <input required type="text" className="field" value={centerName} onChange={(e) => setCenterName(e.target.value)} placeholder="Sharma Tiffin (Khamaria)" />
                  </div>
                  <div>
                    <label className="field-label">Owner name</label>
                    <input required type="text" className="field" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Raju Sharma" />
                  </div>
                </>
              )}

              {(isForgotPass ? forgotStep === 1 : true) && (
                <div>
                  <label className="field-label">Mobile number</label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    className="field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                  />
                </div>
              )}

              {!isForgotPass && (
                <div>
                  <label className="field-label">Password</label>
                  <input
                    required
                    type="password"
                    className="field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
              )}

              {isForgotPass && forgotStep === 2 && (
                <div>
                  <label className="field-label">One-time password</label>
                  <input
                    required
                    type="text"
                    maxLength="4"
                    className="field text-center tracking-[0.6em] text-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                  />
                </div>
              )}

              {isForgotPass && forgotStep === 3 && (
                <div>
                  <label className="field-label">New password</label>
                  <input
                    required
                    type="password"
                    className="field"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                  />
                </div>
              )}

              {!isLogin && !isForgotPass && type === 'student' && (
                <div className="grid grid-cols-[1fr_96px] gap-3">
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
                    <label className="field-label">Room</label>
                    <input required type="text" className="field" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="402" />
                  </div>
                </div>
              )}

              {!isForgotPass && isLogin && (
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ink-3">Forgot your password?</span>
                  <button type="button" onClick={() => setIsForgotPass(true)} className="text-[13.5px] font-semibold text-tomato hover:text-tomato-2 transition-colors">
                    Reset it
                  </button>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg btn-block mt-2">
                {isForgotPass
                  ? forgotStep === 1
                    ? 'Send OTP'
                    : forgotStep === 2
                    ? 'Verify code'
                    : 'Reset password'
                  : isLogin
                  ? 'Sign in'
                  : 'Create account'}
              </button>
            </form>

            {!isForgotPass && (
              <p className="mt-6 text-[14.5px] text-ink-3">
                {isLogin ? 'New to Tiffin Connect?' : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-ink underline underline-offset-4 decoration-line-2 hover:decoration-ink transition-colors"
                >
                  {isLogin ? 'Create an account' : 'Sign in'}
                </button>
              </p>
            )}

            {isLogin && !isForgotPass && (
              <div className="mt-8 border border-line rounded-[6px] bg-paper-2/70 px-4 py-3.5">
                <p className="eyebrow mb-1.5">Demo credentials</p>
                <p className="text-[14px] text-ink-2">
                  Phone <span className="font-semibold text-ink">{isVendor ? '9999999999' : '8888888888'}</span>
                  <span className="mx-2 text-line-2">|</span>
                  Password <span className="font-semibold text-ink">123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
