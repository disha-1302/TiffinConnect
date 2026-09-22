export const DB_KEY = 'iiitdmj_tiffin_v1';
export const HOSTEL_BLOCKS = ['Hall 1 (Single)', 'Hall 3', 'Hall 4', 'PG Hostel', 'Maa Saraswati (Girls)'];

const getInitialDB = () => {
  const savedDB = localStorage.getItem(DB_KEY);
  if (savedDB) return JSON.parse(savedDB);

  const seedData = {
    vendors: { 'v_demo1': { id: 'v_demo1', name: 'Sharma Tiffin (Khamaria)', owner: 'Raju Sharma', phone: '9999999999', password: '123' } },
    students: { 's_demo1': { id: 's_demo1', name: 'Mayank (IIITDMJ)', phone: '8888888888', password: '123', hostelBlock: 'Hall 4', roomNo: '402' } },
    menus: {},
    orders: {}
  };
  localStorage.setItem(DB_KEY, JSON.stringify(seedData));
  return seedData;
};

const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('db_updated'));
};

export const MockFirebase = {
  setDoc: async (collection, id, data) => { const db = getInitialDB(); db[collection][id] = data; saveDB(db); return true; },
  updateDoc: async (collection, id, data) => { const db = getInitialDB(); if (db[collection][id]) { db[collection][id] = { ...db[collection][id], ...data }; saveDB(db); } return true; },
  deleteDoc: async (collection, id) => { const db = getInitialDB(); delete db[collection][id]; saveDB(db); return true; },
  subscribe: (collection, callback) => {
    const triggerCallback = () => { const db = getInitialDB(); callback(Object.values(db[collection] || {})); };
    triggerCallback();
    window.addEventListener('db_updated', triggerCallback);
    return () => window.removeEventListener('db_updated', triggerCallback);
  }
};
