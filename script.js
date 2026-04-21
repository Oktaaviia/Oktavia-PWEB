// ============================================================
//  PixelStudio — script.js
//  P1 JS: const/let, arrow function, array methods,
//         DOM manipulation, event delegation, localStorage
//  Fitur: Auth (admin/customer), CRUD pesanan, CRUD paket,
//         search real-time, filter, statistik, validasi
// ============================================================

// ── 1. KONSTANTA & STORAGE KEYS ──────────────────────────────

const STORAGE_ORDERS   = 'ps-orders';
const STORAGE_USER     = 'ps-user';
const STORAGE_PACKAGES = 'ps-packages';

// ── 2. USERS — admin hardcoded, customer dari localStorage ──

const STORAGE_USERS = 'ps-users';

// Admin hardcoded — tidak bisa didaftarkan lewat register
const ADMIN_ACCOUNTS = [
  { email: 'admin@pixel.com', password: 'admin123', role: 'admin', nama: 'Admin PixelStudio', hp: '' }
];

const loadUsers    = () => { try { const s = localStorage.getItem(STORAGE_USERS); return s ? JSON.parse(s) : []; } catch { return []; } };
const saveUsers    = (u) => localStorage.setItem(STORAGE_USERS, JSON.stringify(u));

// Gabungkan admin + customer yang sudah daftar
const getAllUsers = () => [...ADMIN_ACCOUNTS, ...loadUsers()];

// ── 3. DATA DEFAULT PESANAN ───────────────────────────────────

const DEFAULT_ORDERS = [
  { id: 'PS-001', nama: 'Budi Santoso', email: 'budi@email.com', hp: '081234567890', layanan: 'Logo',     paket: 'Logo Standard',    deskripsi: 'Logo untuk brand kopi lokal, warna earth tone', deadline: '2026-05-10', tgl_order: '2026-04-10', warna: 'coklat, krem', harga: 1500000, status: 'Dikerjakan' },
  { id: 'PS-002', nama: 'Sari Dewi',    email: 'sari@email.com', hp: '082345678901', layanan: 'Poster',   paket: 'Poster Basic',     deskripsi: 'Poster event musik kampus bergaya colorful',     deadline: '2026-04-30', tgl_order: '2026-04-05', warna: 'cerah, vibrant', harga: 300000, status: 'Selesai' },
  { id: 'PS-003', nama: 'Rina Kusuma',  email: 'rina@email.com', hp: '083456789012', layanan: 'Branding', paket: 'Branding Premium', deskripsi: 'Branding lengkap untuk klinik kecantikan',       deadline: '2026-05-20', tgl_order: '2026-04-12', warna: 'pink, gold',  harga: 6000000, status: 'Pending' }
];

// ── 4. DATA DEFAULT PAKET ─────────────────────────────────────
//  Setiap paket punya: id, layanan, tier, nama, harga,
//  konsep, revisi, waktu, fitur[], populer

const DEFAULT_PACKAGES = [
  // LOGO
  { id: 'PKG-001', layanan: 'Logo', tier: 'Basic',    nama: 'Logo Basic',    harga: 700000,  konsep: '1',         revisi: '2x',         waktu: '3-5 Hari',   fitur: ['File PNG & JPG'],                                   populer: false },
  { id: 'PKG-002', layanan: 'Logo', tier: 'Standard', nama: 'Logo Standard', harga: 1500000, konsep: '3',         revisi: '5x',         waktu: '5-7 Hari',   fitur: ['File PNG, JPG & PDF', 'File Source (AI/EPS)'],       populer: true  },
  { id: 'PKG-003', layanan: 'Logo', tier: 'Premium',  nama: 'Logo Premium',  harga: 3000000, konsep: 'Unlimited', revisi: 'Unlimited',  waktu: '7-14 Hari',  fitur: ['Semua Format', 'File Source (AI/EPS)', 'Panduan Brand'], populer: false },
  // POSTER
  { id: 'PKG-004', layanan: 'Poster', tier: 'Basic',    nama: 'Poster Basic',    harga: 300000,  konsep: '1',         revisi: '2x',        waktu: '1-2 Hari', fitur: ['File JPG & PNG'],                                   populer: false },
  { id: 'PKG-005', layanan: 'Poster', tier: 'Standard', nama: 'Poster Standard', harga: 600000,  konsep: '2',         revisi: '4x',        waktu: '2-3 Hari', fitur: ['File JPG, PNG & PDF', 'File Source'],               populer: true  },
  { id: 'PKG-006', layanan: 'Poster', tier: 'Premium',  nama: 'Poster Premium',  harga: 1200000, konsep: 'Unlimited', revisi: 'Unlimited', waktu: '3-5 Hari', fitur: ['Semua Format', 'File Source', '5 Variasi Desain'],  populer: false },
  // SOCIAL MEDIA
  { id: 'PKG-007', layanan: 'Social Media', tier: 'Basic',    nama: 'Sosmed Basic',    harga: 500000,  konsep: '1',         revisi: '2x',        waktu: '2-3 Hari', fitur: ['3 Template Feed', 'File JPG & PNG'],                   populer: false },
  { id: 'PKG-008', layanan: 'Social Media', tier: 'Standard', nama: 'Sosmed Standard', harga: 1000000, konsep: '2',         revisi: '5x',        waktu: '3-5 Hari', fitur: ['9 Template Feed', 'Story & Highlight', 'File Source'],  populer: true  },
  { id: 'PKG-009', layanan: 'Social Media', tier: 'Premium',  nama: 'Sosmed Premium',  harga: 2000000, konsep: 'Unlimited', revisi: 'Unlimited', waktu: '5-7 Hari', fitur: ['Template Unlimited', 'Semua Format', 'Panduan Konten'], populer: false },
  // BRANDING
  { id: 'PKG-010', layanan: 'Branding', tier: 'Basic',    nama: 'Branding Basic',    harga: 1500000, konsep: '1',         revisi: '3x',        waktu: '7-10 Hari',  fitur: ['Logo + Warna', 'File PNG & JPG'],                           populer: false },
  { id: 'PKG-011', layanan: 'Branding', tier: 'Standard', nama: 'Branding Standard', harga: 3000000, konsep: '2',         revisi: '5x',        waktu: '10-14 Hari', fitur: ['Logo + Warna + Tipografi', 'Stationery', 'File Source'],     populer: true  },
  { id: 'PKG-012', layanan: 'Branding', tier: 'Premium',  nama: 'Branding Premium',  harga: 6000000, konsep: 'Unlimited', revisi: 'Unlimited', waktu: '14-21 Hari', fitur: ['Identitas Visual Lengkap', 'Brand Guideline', 'Semua Format'], populer: false },
];

// ── 5. LOAD / SAVE ────────────────────────────────────────────

const loadOrders   = () => { try { const s = localStorage.getItem(STORAGE_ORDERS);   return s ? JSON.parse(s) : [...DEFAULT_ORDERS];   } catch { return [...DEFAULT_ORDERS]; } };
const loadPackages = () => { try { const s = localStorage.getItem(STORAGE_PACKAGES); return s ? JSON.parse(s) : [...DEFAULT_PACKAGES]; } catch { return [...DEFAULT_PACKAGES]; } };
const loadUser     = () => { try { const s = localStorage.getItem(STORAGE_USER);     return s ? JSON.parse(s) : null; }                 catch { return null; } };

const saveOrders   = () => localStorage.setItem(STORAGE_ORDERS,   JSON.stringify(orders));
const savePackages = () => localStorage.setItem(STORAGE_PACKAGES, JSON.stringify(packages));
const saveUser     = (u) => localStorage.setItem(STORAGE_USER,    JSON.stringify(u));
const logoutUser   = () => { localStorage.removeItem(STORAGE_USER); window.location.href = 'index.html'; };

// ── 6. STATE ──────────────────────────────────────────────────

let orders      = loadOrders();
let packages    = loadPackages();
let currentUser = loadUser();
let editIndex   = null;     // index pesanan yg sedang diedit
let editPkgId   = null;     // id paket yg sedang diedit
let activeLayanan = 'semua'; // tab aktif di packages.html

// ── 7. GENERATE ID ────────────────────────────────────────────

const generateOrderId = () => {
  const max = orders.reduce((m, o) => Math.max(m, parseInt(o.id.replace('PS-', '')) || 0), 0);
  return `PS-${String(max + 1).padStart(3, '0')}`;
};

const generatePkgId = () => {
  const max = packages.reduce((m, p) => Math.max(m, parseInt(p.id.replace('PKG-', '')) || 0), 0);
  return `PKG-${String(max + 1).padStart(3, '0')}`;
};

// ── 8. TOAST NOTIFIKASI ───────────────────────────────────────

const showNotif = (msg, type = 'success') => {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.style.borderLeftColor = type === 'error' ? '#dc2626' : '#6d28d9';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
};

// ── 9. NAVBAR ─────────────────────────────────────────────────

const updateNavbar = () => {
  const navLogin  = document.getElementById('nav-login');
  const navOrder  = document.getElementById('nav-order');
  const navLogout = document.getElementById('nav-logout');
  const navUser   = document.getElementById('nav-user');

  if (currentUser) {
    if (navLogin)  navLogin.style.display = 'none';
    if (navUser)   navUser.textContent    = `👤 ${currentUser.nama}`;
    if (navLogout) {
      navLogout.style.display = 'inline-block';
      navLogout.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
    }
    if (currentUser.role === 'admin' && navOrder) {
      navOrder.textContent = 'Dashboard';
      navOrder.href = 'dashboard.html';
    }
  } else {
    if (navLogout) navLogout.style.display = 'none';
  }
};

// ── 10. VALIDASI ORDER ────────────────────────────────────────

const setErr  = (id, msg) => { const el = document.getElementById(`error-${id}`); if (el) el.textContent = msg; };
const clrErr  = (id)      => { const el = document.getElementById(`error-${id}`); if (el) el.textContent = ''; };

const validateOrder = () => {
  let ok = true;
  const today = new Date().toISOString().split('T')[0];

  const nama = document.getElementById('nama')?.value.trim();
  if (!nama || nama.length < 3) { setErr('nama', 'Nama minimal 3 karakter'); ok = false; } else clrErr('nama');

  const email = document.getElementById('email-order')?.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('email-order', 'Format email tidak valid'); ok = false; } else clrErr('email-order');

  const hp = document.getElementById('hp')?.value.trim();
  if (!hp || hp.length < 9) { setErr('hp', 'Nomor HP minimal 9 digit'); ok = false; } else clrErr('hp');

  const layanan = document.getElementById('layanan')?.value;
  if (!layanan) { setErr('layanan', 'Pilih jenis layanan'); ok = false; } else clrErr('layanan');

  const paket = document.getElementById('paket')?.value;
  if (!paket) { setErr('paket', 'Pilih paket desain'); ok = false; } else clrErr('paket');

  const deskripsi = document.getElementById('deskripsi')?.value.trim();
  if (!deskripsi || deskripsi.length < 10) { setErr('deskripsi', 'Deskripsi minimal 10 karakter'); ok = false; } else clrErr('deskripsi');

  const deadline = document.getElementById('deadline')?.value;
  if (!deadline) { setErr('deadline', 'Deadline wajib diisi'); ok = false; }
  else if (editIndex === null && deadline < today) { setErr('deadline', 'Deadline tidak boleh masa lalu'); ok = false; }
  else clrErr('deadline');

  return ok;
};

// ── 11. STATISTIK ─────────────────────────────────────────────

const renderStats = () => {
  // Customer hanya hitung pesanannya sendiri; admin hitung semua
  const isAdmin = currentUser?.role === 'admin';
  const src     = isAdmin ? orders : orders.filter(o => o.email === currentUser?.email);

  const total   = src.length;
  const nilai   = src.reduce((s, o) => s + o.harga, 0);
  const proses  = src.filter(o => o.status === 'Pending' || o.status === 'Dikerjakan').length;
  const selesai = src.filter(o => o.status === 'Selesai').length;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('stat-total',   total);
  s('stat-nilai',   'Rp ' + nilai.toLocaleString('id-ID'));
  s('stat-pending', proses);
  s('dash-total',   orders.length);
  s('dash-nilai',   'Rp ' + orders.reduce((x,o)=>x+o.harga,0).toLocaleString('id-ID'));
  s('dash-pending', orders.filter(o=>o.status==='Pending'||o.status==='Dikerjakan').length);
  s('dash-selesai', orders.filter(o=>o.status==='Selesai').length);
};

// ── 12. RENDER TABEL ORDER ────────────────────────────────────

const renderTable = (data) => {
  const tbody = document.getElementById('order-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Customer hanya lihat pesanan miliknya sendiri
  const isAdmin = currentUser?.role === 'admin';
  const filtered = isAdmin
    ? data
    : data.filter(o => o.email === currentUser?.email);

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#9ca3af;padding:32px">Belum ada pesanan${isAdmin ? '' : ' dari akun Anda'}</td></tr>`;
    return;
  }

  filtered.forEach(order => {
    const realIdx   = orders.findIndex(o => o.id === order.id);
    const statusCls = order.status === 'Selesai' ? 'status-selesai' : order.status === 'Dikerjakan' ? 'status-dikerjakan' : 'status-pending';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.nama}</td>
      <td>${order.layanan}</td>
      <td>${order.paket}</td>
      <td>${order.deadline}</td>
      <td>Rp ${order.harga.toLocaleString('id-ID')}</td>
      <td><span class="status-badge ${statusCls}">${order.status}</span></td>
      <td>
        <button class="btn-edit"  data-index="${realIdx}">Edit</button>
        <button class="btn-hapus" data-index="${realIdx}">Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
};

// ── 13. RENDER TABEL ADMIN (ubah status) ──────────────────────

const renderAdminTable = (data) => {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#9ca3af;padding:32px">Tidak ada pesanan</td></tr>`;
    return;
  }

  data.forEach(order => {
    const realIdx = orders.findIndex(o => o.id === order.id);
    const statusCls = order.status === 'Selesai' ? 'status-selesai' : order.status === 'Dikerjakan' ? 'status-dikerjakan' : 'status-pending';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.nama}</td>
      <td>${order.layanan}</td>
      <td>${order.paket}</td>
      <td>${order.deadline}</td>
      <td>Rp ${order.harga.toLocaleString('id-ID')}</td>
      <td><span class="status-badge ${statusCls}">${order.status}</span></td>
      <td>
        <select class="select-status" data-index="${realIdx}">
          <option ${order.status==='Pending'    ?'selected':''}>Pending</option>
          <option ${order.status==='Dikerjakan' ?'selected':''}>Dikerjakan</option>
          <option ${order.status==='Selesai'    ?'selected':''}>Selesai</option>
        </select>
        <button class="btn-hapus" data-index="${realIdx}">Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
};

// ── 14. FILTER ORDER ──────────────────────────────────────────

const getFiltered = () => {
  const kw     = document.getElementById('search-input')?.value.toLowerCase()  || '';
  const fPaket = document.getElementById('filter-paket')?.value  || '';
  const fSts   = document.getElementById('filter-status')?.value || '';
  return orders.filter(o =>
    (o.nama.toLowerCase().includes(kw) || o.id.toLowerCase().includes(kw) || o.layanan.toLowerCase().includes(kw)) &&
    (!fPaket || o.paket.includes(fPaket)) &&
    (!fSts   || o.status === fSts)
  );
};

const getFilteredAdmin = () => {
  const kw  = document.getElementById('search-admin')?.value.toLowerCase() || '';
  const sts = document.getElementById('filter-status-admin')?.value || '';
  return orders.filter(o =>
    (o.nama.toLowerCase().includes(kw) || o.id.toLowerCase().includes(kw)) &&
    (!sts || o.status === sts)
  );
};

const refreshView  = () => { renderTable(getFiltered());       renderStats(); };
const refreshAdmin = () => { renderAdminTable(getFilteredAdmin()); renderStats(); };

// ── 15. SUBMIT FORM ORDER ─────────────────────────────────────

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateOrder()) return;

  const nama      = document.getElementById('nama').value.trim();
  const email     = document.getElementById('email-order').value.trim();
  const hp        = document.getElementById('hp').value.trim();
  const layanan   = document.getElementById('layanan').value;
  const paketNama = document.getElementById('paket-options').value;
  const deskripsi = document.getElementById('deskripsi').value.trim();
  const deadline  = document.getElementById('deadline').value;
  const warna     = document.getElementById('warna').value.trim();
  const tgl_order = new Date().toISOString().split('T')[0];

  // Cari harga dari data paket
  const pkgData = packages.find(p => p.nama === paketNama);
  const harga   = pkgData ? pkgData.harga : 0;

  if (editIndex !== null) {
    orders[editIndex] = { ...orders[editIndex], nama, email, hp, layanan, paket: paketNama, deskripsi, deadline, warna, harga };
    editIndex = null;
    document.getElementById('form-title').textContent  = 'Detail Pesanan';
    document.getElementById('btn-submit').textContent  = 'Kirim Pesanan';
    const bc = document.getElementById('btn-cancel');
    if (bc) bc.style.display = 'none';
    showNotif('Pesanan berhasil diperbarui!');
  } else {
    orders.push({ id: generateOrderId(), nama, email, hp, layanan, paket: paketNama, deskripsi, deadline, warna, tgl_order, harga, status: 'Pending' });
    showNotif('Pesanan berhasil dikirim!');
  }

  saveOrders();
  refreshView();
  e.target.reset();
  document.getElementById('harga-preview').textContent = '';
  document.getElementById('paket-options').innerHTML   = '<option value="">-- Pilih Paket --</option>';
  document.getElementById('stats-bar').style.display   = 'block';
};

// ── 16. EVENT DELEGATION: tabel order ────────────────────────

const handleTableClick = (e) => {
  const t = e.target;

  if (t.classList.contains('btn-edit')) {
    const idx = parseInt(t.dataset.index);
    const o   = orders[idx];
    document.getElementById('nama').value          = o.nama;
    document.getElementById('email-order').value  = o.email;
    document.getElementById('hp').value            = o.hp;
    document.getElementById('layanan').value       = o.layanan;
    document.getElementById('warna').value         = o.warna || '';
    document.getElementById('deskripsi').value     = o.deskripsi;
    document.getElementById('deadline').value      = o.deadline;

    // Isi dropdown paket sesuai layanan
    populatePaketOptions(o.layanan, o.paket);

    document.getElementById('harga-preview').textContent = pkgHargaStr(o.paket);
    editIndex = idx;
    document.getElementById('form-title').textContent = 'Edit Pesanan';
    document.getElementById('btn-submit').textContent  = 'Simpan Perubahan';
    const bc = document.getElementById('btn-cancel');
    if (bc) bc.style.display = 'inline-block';
    document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
  }

  if (t.classList.contains('btn-hapus')) {
    const idx = parseInt(t.dataset.index);
    if (confirm(`Yakin hapus pesanan dari "${orders[idx].nama}"?`)) {
      orders.splice(idx, 1);
      saveOrders();
      refreshView();
      showNotif('Pesanan dihapus!');
    }
  }
};

// ── 17. EVENT DELEGATION: tabel admin ────────────────────────

const handleAdminChange = (e) => {
  const t = e.target;
  if (t.classList.contains('select-status')) {
    const idx = parseInt(t.dataset.index);
    orders[idx].status = t.value;
    saveOrders();
    refreshAdmin();
    showNotif(`Status diubah ke "${t.value}"`);
  }
  if (t.classList.contains('btn-hapus')) {
    const idx = parseInt(t.dataset.index);
    if (confirm(`Yakin hapus pesanan dari "${orders[idx].nama}"?`)) {
      orders.splice(idx, 1);
      saveOrders();
      refreshAdmin();
      showNotif('Pesanan dihapus!');
    }
  }
};

// ── 18. POPULATE PAKET DROPDOWN (dinamis by layanan) ──────────

const populatePaketOptions = (layananVal, selectedVal = '') => {
  const sel = document.getElementById('paket-options');
  if (!sel) return;

  // Filter paket sesuai layanan yang dipilih
  const filtered = layananVal ? packages.filter(p => p.layanan === layananVal) : [];

  sel.innerHTML = '<option value="">-- Pilih Paket --</option>';
  filtered.forEach(p => {
    const opt = document.createElement('option');
    opt.value       = p.nama;
    opt.textContent = `${p.nama} — Rp ${p.harga.toLocaleString('id-ID')}`;
    if (selectedVal && p.nama === selectedVal) opt.selected = true;
    sel.appendChild(opt);
  });
};

const pkgHargaStr = (namaPaket) => {
  const p = packages.find(pkg => pkg.nama === namaPaket);
  return p ? 'Harga: Rp ' + p.harga.toLocaleString('id-ID') : '';
};

const handleLayananChange = () => {
  const layanan = document.getElementById('layanan')?.value;
  populatePaketOptions(layanan);
  const el = document.getElementById('harga-preview');
  if (el) el.textContent = '';
};

const handlePaketChange = () => {
  const namaPaket = document.getElementById('paket-options')?.value;
  const el        = document.getElementById('harga-preview');
  if (el) el.textContent = namaPaket ? pkgHargaStr(namaPaket) : '';
};

// ── 19. LOGIN ─────────────────────────────────────────────────

const handleLogin = (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const errEmail = document.getElementById('error-email');
  const errPw    = document.getElementById('error-password');
  const errLogin = document.getElementById('error-login');
  if (errEmail) errEmail.textContent = '';
  if (errPw)    errPw.textContent    = '';
  if (errLogin) errLogin.textContent = '';

  if (!email)    { if (errEmail) errEmail.textContent = 'Email wajib diisi'; return; }
  if (!password) { if (errPw)    errPw.textContent    = 'Password wajib diisi'; return; }

  const user = getAllUsers().find(u => u.email === email && u.password === password);
  if (!user) {
    if (errLogin) errLogin.textContent = 'Email atau password salah. Belum punya akun? Daftar dulu!';
    return;
  }

  saveUser(user);
  currentUser = user;
  showNotif(`Selamat datang, ${user.nama}!`);

  // Ambil redirect target kalau ada (misal dari order.html)
  const redirectTo = sessionStorage.getItem('redirect_after_login');
  sessionStorage.removeItem('redirect_after_login');
  setTimeout(() => {
    window.location.href = redirectTo || (user.role === 'admin' ? 'dashboard.html' : 'order.html');
  }, 700);
};

// ── 19b. REGISTER ─────────────────────────────────────────────

const handleRegister = (e) => {
  e.preventDefault();
  let ok = true;

  const setE = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
  const clrE = (id)      => { const el = document.getElementById(id); if (el) el.textContent = ''; };

  const nama = document.getElementById('reg-nama')?.value.trim();
  if (!nama || nama.length < 3) { setE('error-reg-nama', 'Nama minimal 3 karakter'); ok = false; } else clrE('error-reg-nama');

  const email = document.getElementById('reg-email')?.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setE('error-reg-email', 'Format email tidak valid'); ok = false; } else clrE('error-reg-email');

  const hp = document.getElementById('reg-hp')?.value.trim();
  if (!hp || hp.length < 9) { setE('error-reg-hp', 'Nomor HP minimal 9 digit'); ok = false; } else clrE('error-reg-hp');

  const password = document.getElementById('reg-password')?.value;
  if (!password || password.length < 6) { setE('error-reg-password', 'Password minimal 6 karakter'); ok = false; } else clrE('error-reg-password');

  const confirm = document.getElementById('reg-confirm')?.value;
  if (confirm !== password) { setE('error-reg-confirm', 'Password tidak cocok'); ok = false; } else clrE('error-reg-confirm');

  if (!ok) return;

  // Cek email sudah terdaftar
  const existing = getAllUsers().find(u => u.email === email);
  if (existing) {
    setE('error-register', 'Email sudah terdaftar. Silakan login.');
    return;
  }

  // Simpan customer baru
  const customers = loadUsers();
  const newUser   = { email, password, role: 'customer', nama, hp };
  customers.push(newUser);
  saveUsers(customers);

  // Auto login
  saveUser(newUser);
  currentUser = newUser;
  showNotif(`Akun berhasil dibuat! Selamat datang, ${nama}!`);
  setTimeout(() => { window.location.href = 'order.html'; }, 900);
};

// ── 20. KONTAK ────────────────────────────────────────────────

const handleContact = (e) => {
  e.preventDefault();
  let ok = true;

  const nama = document.getElementById('nama-kontak')?.value.trim();
  const ec   = document.getElementById('error-nama-kontak');
  if (!nama || nama.length < 3) { if (ec) ec.textContent = 'Nama minimal 3 karakter'; ok = false; } else { if (ec) ec.textContent = ''; }

  const email = document.getElementById('email-kontak')?.value.trim();
  const ee    = document.getElementById('error-email-kontak');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (ee) ee.textContent = 'Format email tidak valid'; ok = false; } else { if (ee) ee.textContent = ''; }

  const pesan = document.getElementById('pesan')?.value.trim();
  const ep    = document.getElementById('error-pesan');
  if (!pesan || pesan.length < 10) { if (ep) ep.textContent = 'Pesan minimal 10 karakter'; ok = false; } else { if (ep) ep.textContent = ''; }

  if (!ok) return;
  showNotif('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
  e.target.reset();
};

// ── 21. FILTER PORTFOLIO ──────────────────────────────────────

const filterPortfolio = () => {
  const checked = [...document.querySelectorAll('.filter-check:checked')].map(c => c.value);
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.style.display = (!checked.length || checked.includes(card.dataset.kategori)) ? 'block' : 'none';
  });
};

// ── 22. GUARD PAGE ────────────────────────────────────────────

const guardPage = (role) => {
  if (!currentUser) { window.location.href = 'login.html'; return false; }
  if (role && currentUser.role !== role) {
    window.location.href = currentUser.role === 'admin' ? 'dashboard.html' : 'order.html';
    return false;
  }
  return true;
};

// ═══════════════════════════════════════════════════════════
//  PAKET — CRUD (admin)
// ═══════════════════════════════════════════════════════════

// ── 23. RENDER KARTU PAKET ────────────────────────────────────

const renderPackages = () => {
  const grid     = document.getElementById('pkg-grid');
  const emptyMsg = document.getElementById('pkg-empty');
  const countEl  = document.getElementById('pkg-count');
  if (!grid) return;

  // Kumpulkan filter yang aktif
  const tierChecked  = [...document.querySelectorAll('.tier-filter:checked')].map(c => c.value);
  const priceChecked = [...document.querySelectorAll('.price-filter:checked')].map(c => c.value);

  let filtered = packages.filter(p => {
    const matchLayanan = activeLayanan === 'semua' || p.layanan === activeLayanan;
    const matchTier    = !tierChecked.length || tierChecked.includes(p.tier);
    const matchPrice   = !priceChecked.length || priceChecked.some(range => {
      const [min, max] = range.split('-').map(Number);
      return p.harga >= min && p.harga <= max;
    });
    return matchLayanan && matchTier && matchPrice;
  });

  const isAdmin = currentUser?.role === 'admin';
  grid.innerHTML = '';

  if (countEl) countEl.textContent = `${filtered.length} paket ditemukan`;

  if (!filtered.length) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    renderCompareTable([]);
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';

  filtered.forEach(pkg => {
    const fiturHtml = pkg.fitur.map(f => `<li><span class="feat-icon">✅</span><span>${f}</span></li>`).join('');
    const adminHtml = isAdmin
      ? `<div class="pkg-admin-actions">
           <button class="btn-edit-pkg btn-edit" data-id="${pkg.id}">✏️ Edit Paket</button>
           <button class="btn-hapus-pkg btn-hapus" data-id="${pkg.id}">🗑️ Hapus</button>
         </div>`
      : '';

    const art = document.createElement('article');
    art.className = `card pkg-card${pkg.populer ? ' featured' : ''}`;
    art.dataset.pkgId = pkg.id;
    art.innerHTML = `
      ${pkg.populer ? '<span class="pkg-badge">Populer</span>' : ''}
      <span class="pkg-layanan-tag">${pkg.layanan}</span>
      <header class="pkg-header">
        <h3>${pkg.nama}</h3>
        <p class="pkg-price">Rp ${pkg.harga.toLocaleString('id-ID')}</p>
      </header>
      <ul class="pkg-features">
        <li><span class="feat-icon">📐</span><span>Konsep: <strong>${pkg.konsep}</strong></span></li>
        <li><span class="feat-icon">🔄</span><span>Revisi: <strong>${pkg.revisi}</strong></span></li>
        <li><span class="feat-icon">⏱️</span><span>Waktu: <strong>${pkg.waktu}</strong></span></li>
        ${fiturHtml}
      </ul>
      <a href="order.html" class="btn-card">Pesan Sekarang</a>
      ${adminHtml}
    `;
    grid.appendChild(art);
  });

  // Tabel perbandingan muncul kalau filter satu layanan spesifik
  renderCompareTable(filtered);
};

// ── 24. RENDER TABEL PERBANDINGAN ────────────────────────────

const renderCompareTable = (filtered) => {
  const section = document.getElementById('compare-section');
  const thead   = document.getElementById('compare-thead');
  const tbody   = document.getElementById('compare-tbody');
  const tfoot   = document.getElementById('compare-tfoot');
  if (!section || !thead || !tbody) return;

  if (activeLayanan === 'semua' || filtered.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const tiers      = ['Basic', 'Standard', 'Premium'];
  const pkgsInView = tiers.map(t => filtered.find(p => p.tier === t)).filter(Boolean);
  const cols       = pkgsInView.length + 1;

  // Thead dengan tier label + highlight populer
  thead.innerHTML = `<tr class="compare-head-row">
    <th class="compare-feat-col">Fitur</th>
    ${pkgsInView.map(p => `<th class="${p.populer ? 'compare-popular' : ''}">${p.tier}${p.populer ? '<br><span class="compare-pop-badge">⭐ Populer</span>' : ''}</th>`).join('')}
  </tr>`;

  // Kumpulkan semua fitur unik dari semua paket
  const allFitur = [...new Set(pkgsInView.flatMap(p => p.fitur))];

  const staticRows = [
    { label: 'Harga',             fn: p => `<strong>Rp ${p.harga.toLocaleString('id-ID')}</strong>`, isPrice: true },
    { label: 'Konsep Desain',     fn: p => p.konsep },
    { label: 'Jumlah Revisi',     fn: p => p.revisi },
    { label: 'Waktu Pengerjaan',  fn: p => p.waktu },
  ];

  const staticHtml = staticRows.map(row => `
    <tr class="${row.isPrice ? 'compare-price-row' : ''}">
      <td class="compare-feat-col"><strong>${row.label}</strong></td>
      ${pkgsInView.map(p => `<td>${row.fn(p)}</td>`).join('')}
    </tr>`).join('');

  const fiturHtml = allFitur.map(f => `
    <tr>
      <td class="compare-feat-col">${f}</td>
      ${pkgsInView.map(p => `<td>${p.fitur.includes(f) ? '<span class="cmp-yes">✓</span>' : '<span class="cmp-no">–</span>'}</td>`).join('')}
    </tr>`).join('');

  tbody.innerHTML = staticHtml + fiturHtml;

  // CTA row
  const ctaHtml = pkgsInView.map(p =>
    `<td><a href="order.html" class="btn-card" style="display:inline-block;padding:8px 16px;font-size:.8rem">Pilih ${p.tier}</a></td>`
  ).join('');
  tbody.innerHTML += `<tr class="compare-cta-row"><td class="compare-feat-col"></td>${ctaHtml}</tr>`;

  if (tfoot) tfoot.innerHTML = `<tr><td colspan="${cols}" style="font-size:.75rem;color:#9ca3af;padding:10px 12px">* Harga belum termasuk PPN 11%</td></tr>`;
};

// ── 25. EVENT DELEGATION: kartu paket (admin edit/hapus) ──────

const handlePkgGridClick = (e) => {
  const t = e.target;

  if (t.classList.contains('btn-edit-pkg')) {
    const id  = t.dataset.id;
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;

    editPkgId = id;
    document.getElementById('pkg-layanan').value   = pkg.layanan;
    document.getElementById('pkg-tier').value      = pkg.tier;
    document.getElementById('pkg-nama').value      = pkg.nama;
    document.getElementById('pkg-harga').value     = pkg.harga;
    document.getElementById('pkg-konsep').value    = pkg.konsep;
    document.getElementById('pkg-revisi').value    = pkg.revisi;
    document.getElementById('pkg-waktu').value     = pkg.waktu;
    document.getElementById('pkg-fitur').value     = pkg.fitur.join('\n');
    document.getElementById('pkg-populer').checked = pkg.populer;

    document.getElementById('modal-title').textContent = 'Edit Paket';
    document.getElementById('pkg-modal')?.showModal();
  }

  if (t.classList.contains('btn-hapus-pkg')) {
    const id  = t.dataset.id;
    const pkg = packages.find(p => p.id === id);
    if (pkg && confirm(`Yakin hapus paket "${pkg.nama}"?`)) {
      packages = packages.filter(p => p.id !== id);
      savePackages();
      renderPackages();
      showNotif('Paket berhasil dihapus!');
    }
  }
};

// ── 26. VALIDASI FORM PAKET ───────────────────────────────────

const validatePkg = () => {
  let ok = true;
  const setE = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
  const clrE = (id)      => { const el = document.getElementById(id); if (el) el.textContent = ''; };

  if (!document.getElementById('pkg-layanan')?.value) { setE('err-pkg-layanan', 'Pilih layanan'); ok = false; } else clrE('err-pkg-layanan');
  if (!document.getElementById('pkg-tier')?.value)    { setE('err-pkg-tier',    'Pilih tier');    ok = false; } else clrE('err-pkg-tier');

  const nama = document.getElementById('pkg-nama')?.value.trim();
  if (!nama || nama.length < 3) { setE('err-pkg-nama', 'Nama minimal 3 karakter'); ok = false; } else clrE('err-pkg-nama');

  const harga = parseInt(document.getElementById('pkg-harga')?.value);
  if (!harga || harga < 1) { setE('err-pkg-harga', 'Harga harus diisi dan > 0'); ok = false; } else clrE('err-pkg-harga');

  return ok;
};

// ── 27. SUBMIT FORM PAKET (admin) ─────────────────────────────

const handlePkgSubmit = (e) => {
  e.preventDefault();
  if (!validatePkg()) return;

  const layanan = document.getElementById('pkg-layanan').value;
  const tier    = document.getElementById('pkg-tier').value;
  const nama    = document.getElementById('pkg-nama').value.trim();
  const harga   = parseInt(document.getElementById('pkg-harga').value);
  const konsep  = document.getElementById('pkg-konsep').value.trim() || '-';
  const revisi  = document.getElementById('pkg-revisi').value.trim() || '-';
  const waktu   = document.getElementById('pkg-waktu').value.trim()  || '-';
  const fitur   = document.getElementById('pkg-fitur').value.trim().split('\n').map(f => f.trim()).filter(Boolean);
  const populer = document.getElementById('pkg-populer').checked;

  if (editPkgId) {
    const idx = packages.findIndex(p => p.id === editPkgId);
    if (idx !== -1) packages[idx] = { ...packages[idx], layanan, tier, nama, harga, konsep, revisi, waktu, fitur, populer };
    editPkgId = null;
    document.getElementById('admin-form-title').textContent = 'Tambah Paket';
    document.getElementById('btn-pkg-cancel').style.display = 'none';
    showNotif('Paket berhasil diperbarui!');
  } else {
    // Cek duplikat layanan + tier
    const duplikat = packages.find(p => p.layanan === layanan && p.tier === tier);
    if (duplikat) {
      showNotif(`Paket ${tier} untuk ${layanan} sudah ada!`, 'error');
      return;
    }
    packages.push({ id: generatePkgId(), layanan, tier, nama, harga, konsep, revisi, waktu, fitur, populer });
    showNotif('Paket baru berhasil ditambahkan!');
  }

  savePackages();
  renderPackages();
  e.target.reset();
};

// ══════════════════════════════════════════════════════════════
//  INIT — DOMContentLoaded
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  updateNavbar();

  // ─── ORDER.HTML ────────────────────────────────────────────
  if (page === 'order.html') {
    const loginWall    = document.getElementById('login-wall');
    const orderContent = document.getElementById('order-content');

    if (!currentUser) {
      // Belum login — tampilkan login wall, sembunyikan form
      if (loginWall)    loginWall.style.display    = 'block';
      if (orderContent) orderContent.style.display = 'none';
      // Simpan redirect target agar setelah login langsung ke order.html
      sessionStorage.setItem('redirect_after_login', 'order.html');
      return; // stop, tidak perlu init lebih lanjut
    }

    // Sudah login — tampilkan form & sembunyikan wall
    if (loginWall)    loginWall.style.display    = 'none';
    if (orderContent) orderContent.style.display = 'block';

    const tglEl = document.getElementById('tgl-order');
    if (tglEl) tglEl.value = new Date().toISOString().split('T')[0];

    document.getElementById('stats-bar').style.display = 'block';
    if (currentUser.role === 'admin') {
      document.getElementById('table-title').textContent     = 'Semua Pesanan';
      document.getElementById('btn-reset-all').style.display = 'inline-block';
    }

    refreshView();

    // Form pesanan
    document.getElementById('order-form')?.addEventListener('submit', handleSubmit);

    // Batal edit
    document.getElementById('btn-cancel')?.addEventListener('click', () => {
      editIndex = null;
      document.getElementById('order-form').reset();
      document.getElementById('form-title').textContent = 'Detail Pesanan';
      document.getElementById('btn-submit').textContent = 'Kirim Pesanan';
      document.getElementById('btn-cancel').style.display = 'none';
      document.getElementById('harga-preview').textContent = '';
      document.getElementById('paket-options').innerHTML = '<option value="">-- Pilih Paket --</option>';
    });

    // Event delegation tabel order
    document.getElementById('order-tbody')?.addEventListener('click', handleTableClick);

    // Search & filter
    document.getElementById('search-input')?.addEventListener('input',  refreshView);
    document.getElementById('filter-paket')?.addEventListener('change', refreshView);
    document.getElementById('filter-status')?.addEventListener('change', refreshView);

    // Dropdown: layanan → isi pilihan paket
    document.getElementById('layanan')?.addEventListener('change', handleLayananChange);

    // Dropdown: paket → preview harga
    document.getElementById('paket-options')?.addEventListener('change', handlePaketChange);

    // Hapus semua (admin)
    document.getElementById('btn-reset-all')?.addEventListener('click', () => {
      if (confirm('Yakin hapus SEMUA pesanan?')) {
        orders = []; saveOrders(); refreshView(); showNotif('Semua data dihapus!');
      }
    });

    // Validasi real-time blur
    ['nama','email-order','hp','layanan','paket-options','deskripsi','deadline'].forEach(id =>
      document.getElementById(id)?.addEventListener('blur', validateOrder)
    );
  }

  // ─── PACKAGES.HTML ─────────────────────────────────────────
  if (page === 'packages.html') {
    const isAdmin = currentUser?.role === 'admin';
    const modal   = document.getElementById('pkg-modal');

    // Tampilkan tombol Tambah Paket hanya untuk admin
    if (isAdmin) {
      const btnTambah = document.getElementById('btn-tambah-paket');
      if (btnTambah) btnTambah.style.display = 'block';
    }

    renderPackages();

    // Tab layanan
    document.getElementById('layanan-tabs')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLayanan = btn.dataset.layanan;
      const title = document.getElementById('pkg-content-title');
      if (title) title.textContent = activeLayanan === 'semua' ? 'Semua Paket' : `Paket ${activeLayanan}`;
      renderPackages();
    });

    // Checkbox filter sidebar
    document.querySelectorAll('.tier-filter, .price-filter').forEach(cb =>
      cb.addEventListener('change', renderPackages)
    );

    // Event delegation grid (admin edit/hapus)
    document.getElementById('pkg-grid')?.addEventListener('click', handlePkgGridClick);

    // Tombol Tambah Paket → buka modal kosong
    document.getElementById('btn-tambah-paket')?.addEventListener('click', () => {
      editPkgId = null;
      document.getElementById('admin-pkg-form')?.reset();
      document.getElementById('modal-title').textContent = 'Tambah Paket Baru';
      modal?.showModal();
    });

    // Submit form paket (admin)
    document.getElementById('admin-pkg-form')?.addEventListener('submit', (e) => {
      handlePkgSubmit(e);
      // Tutup modal setelah sukses (validatePkg lolos)
      if (document.getElementById('err-pkg-nama')?.textContent === '' &&
          document.getElementById('err-pkg-harga')?.textContent === '') {
        modal?.close();
      }
    });

    // Tombol Batal / tutup modal
    const closeModal = () => {
      editPkgId = null;
      document.getElementById('admin-pkg-form')?.reset();
      modal?.close();
    };
    document.getElementById('btn-pkg-cancel')?.addEventListener('click', closeModal);
    document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);

    // Klik backdrop modal untuk tutup
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  // ─── DASHBOARD.HTML ────────────────────────────────────────
  if (page === 'dashboard.html') {
    if (!guardPage('admin')) return;
    refreshAdmin();
    const adminTbody = document.getElementById('admin-tbody');
    adminTbody?.addEventListener('change', handleAdminChange);
    adminTbody?.addEventListener('click',  handleAdminChange);
    document.getElementById('search-admin')?.addEventListener('input',  refreshAdmin);
    document.getElementById('filter-status-admin')?.addEventListener('change', refreshAdmin);
  }

  // ─── LOGIN.HTML ─────────────────────────────────────────────
  if (page === 'login.html') {
    if (currentUser) {
      window.location.href = currentUser.role === 'admin' ? 'dashboard.html' : 'order.html';
      return;
    }
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);

    // Toggle show/hide password
    document.getElementById('toggle-pw')?.addEventListener('click', () => {
      const pw = document.getElementById('password');
      pw.type = pw.type === 'password' ? 'text' : 'password';
    });
  }

  // ─── REGISTER.HTML ──────────────────────────────────────────
  if (page === 'register.html') {
    if (currentUser) {
      window.location.href = 'order.html';
      return;
    }
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);

    // Toggle show/hide password
    document.getElementById('toggle-pw-reg')?.addEventListener('click', () => {
      const pw = document.getElementById('reg-password');
      pw.type = pw.type === 'password' ? 'text' : 'password';
    });
  }

  // ─── CONTACT.HTML ───────────────────────────────────────────
  if (page === 'contact.html') {
    document.getElementById('contact-form')?.addEventListener('submit', handleContact);
  }

  // ─── PORTFOLIO.HTML ─────────────────────────────────────────
  if (page === 'portfolio.html') {
    document.querySelectorAll('.filter-check').forEach(cb =>
      cb.addEventListener('change', filterPortfolio)
    );
  }
});