import { useState } from 'react';
import { HOSTEL_BLOCKS } from '../services/database';

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ProfileModal({ role, user, onSave, onDelete, onClose }) {
  const isVendor = role === 'vendor';
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [values, setValues] = useState(() =>
    isVendor
      ? { name: user.name, owner: user.owner, phone: user.phone, password: user.password }
      : {
          name: user.name,
          phone: user.phone,
          password: user.password,
          hostelBlock: user.hostelBlock,
          roomNo: user.roomNo,
        }
  );

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave(values);
    setConfirmDelete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade"
      />
      <div className="relative w-full sm:max-w-[440px] bg-card border border-line rounded-t-[10px] sm:rounded-[8px] shadow-[0_24px_60px_-24px_rgba(25,21,18,0.45)] max-h-[92vh] overflow-y-auto animate-sheet sm:animate-rise">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-line">
          <div>
            <p className="eyebrow mb-2">{isVendor ? 'Center settings' : 'Account'}</p>
            <h2 className="display-3">{isVendor ? user.name : 'My profile'}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-[4px] text-ink-3 hover:text-ink hover:bg-paper-2 transition-colors"
          >
            <IconClose />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="field-label">{isVendor ? 'Center name' : 'Full name'}</label>
            <input required type="text" className="field" value={values.name} onChange={set('name')} />
          </div>

          {isVendor && (
            <div>
              <label className="field-label">Owner name</label>
              <input required type="text" className="field" value={values.owner} onChange={set('owner')} />
            </div>
          )}

          <div>
            <label className="field-label">Phone</label>
            <input required type="tel" className="field" value={values.phone} onChange={set('phone')} />
          </div>

          {!isVendor && (
            <div className="grid grid-cols-[1fr_100px] gap-3">
              <div>
                <label className="field-label">Hostel block</label>
                <select className="field" value={values.hostelBlock} onChange={set('hostelBlock')}>
                  {HOSTEL_BLOCKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Room</label>
                <input required type="text" className="field" value={values.roomNo} onChange={set('roomNo')} />
              </div>
            </div>
          )}

          <div>
            <label className="field-label">Password</label>
            <input required type="text" className="field" value={values.password} onChange={set('password')} />
          </div>

          <button type="submit" className="btn btn-dark btn-block">
            Save changes
          </button>
        </form>

        <div className="px-6 pb-6 pt-1">
          <div className="rule pt-5">
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)} className="btn btn-danger btn-block btn-sm">
                {isVendor ? 'Close this center' : 'Delete account'}
              </button>
            ) : (
              <div className="border border-line-2 rounded-[6px] bg-paper-2 p-4 animate-rise">
                <p className="text-[14px] text-ink-2 mb-4">
                  {isVendor
                    ? 'This permanently removes your center and its menus.'
                    : 'This permanently removes your account and order history.'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onDelete(user.id, role)}
                    className="btn btn-primary btn-sm flex-1"
                    style={{ background: '#b4341a' }}
                  >
                    Yes, delete
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-outline btn-sm flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
