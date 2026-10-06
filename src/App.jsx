import { useState, useEffect } from 'react';
import { MockFirebase } from './services/database';
import CustomModal from './components/CustomModal';
import AuthScreen from './pages/AuthScreen';
import StudentDashboard from './pages/StudentDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [activeUser, setActiveUser] = useState(() => { const s = localStorage.getItem('tc_user'); return s ? JSON.parse(s) : null; });
  const [userRole, setUserRole] = useState(() => localStorage.getItem('tc_role') || null);
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('tc_user') ? 'dashboard' : 'landing');
  const [menus, setMenus] = useState([]); const [orders, setOrders] = useState([]); const [vendors, setVendors] = useState([]); const [students, setStudents] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', isSuccess: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uM = MockFirebase.subscribe('menus', setMenus); const uO = MockFirebase.subscribe('orders', setOrders);
    const uV = MockFirebase.subscribe('vendors', setVendors); const uS = MockFirebase.subscribe('students', setStudents);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false); return () => { uM(); uO(); uV(); uS(); };
  }, []);

  const showModal = (t, m, s) => setModal({ isOpen: true, title: t, message: m, isSuccess: s });

  const handleAuth = (user, role) => {
    localStorage.setItem('tc_user', JSON.stringify(user)); localStorage.setItem('tc_role', role);
    setActiveUser(user); setUserRole(role); setCurrentView('dashboard'); showModal(`Welcome!`, 'Logged in successfully.', true);
  };

  const handleSignup = async (user, role) => { await MockFirebase.setDoc(role === 'vendor' ? 'vendors' : 'students', user.id, user); handleAuth(user, role); };
  const handleUpdatePassword = async (id, pass, role) => { await MockFirebase.updateDoc(role === 'vendor' ? 'vendors' : 'students', id, { password: pass }); showModal('Success', 'Password updated.', true); };
  
  const handleLogout = () => { localStorage.removeItem('tc_user'); localStorage.removeItem('tc_role'); setActiveUser(null); setUserRole(null); setCurrentView('landing'); };
  
  const handleProfile = async (data, role) => { await MockFirebase.updateDoc(role === 'vendor' ? 'vendors' : 'students', activeUser.id, data); const n = { ...activeUser, ...data }; setActiveUser(n); localStorage.setItem('tc_user', JSON.stringify(n)); showModal('Updated', 'Profile saved.', true); };
  const handleDelete = async (id, role) => { await MockFirebase.deleteDoc(role === 'vendor' ? 'vendors' : 'students', id); handleLogout(); showModal('Deleted', 'Account removed.', true); };

  if (loading)
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-line-2 border-t-ink animate-spin" />
        <p className="eyebrow">Tiffin Connect</p>
      </div>
    );

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage setCurrentView={setCurrentView} menus={menus} vendors={vendors} />
      )}
      {currentView === 'admin-dashboard' && <AdminDashboard vendors={vendors} students={students} orders={orders} onBack={() => setCurrentView('landing')} />}
      {currentView === 'auth-student' && <AuthScreen type="student" vendors={vendors} students={students} onLogin={handleAuth} onSignup={handleSignup} onUpdatePassword={handleUpdatePassword} onBack={() => setCurrentView('landing')} showModal={showModal} />}
      {currentView === 'auth-vendor' && <AuthScreen type="vendor" vendors={vendors} students={students} onLogin={handleAuth} onSignup={handleSignup} onUpdatePassword={handleUpdatePassword} onBack={() => setCurrentView('landing')} showModal={showModal} />}
      {currentView === 'dashboard' && userRole === 'student' && <StudentDashboard menus={menus} orders={orders} onPlaceOrder={(d) => MockFirebase.setDoc('orders', d.id, d)} onLogout={handleLogout} student={activeUser} onUpdateProfile={handleProfile} onDeleteAccount={handleDelete} />}
      {currentView === 'dashboard' && userRole === 'vendor' && <VendorDashboard vendor={activeUser} menus={menus} orders={orders} onAddMenu={(d) => MockFirebase.setDoc('menus', d.id, d)} onUpdateMenu={(d) => MockFirebase.updateDoc('menus', d.id, d)} onDeleteMenu={(id) => MockFirebase.deleteDoc('menus', id)} onUpdateOrderStatus={(id, s) => MockFirebase.updateDoc('orders', id, { status: s })} onLogout={handleLogout} onUpdateProfile={handleProfile} onDeleteAccount={handleDelete} />}
      <CustomModal isOpen={modal.isOpen} title={modal.title} message={modal.message} isSuccess={modal.isSuccess} onClose={() => setModal({ ...modal, isOpen: false })} />
    </>
  );
}